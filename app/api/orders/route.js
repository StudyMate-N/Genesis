import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import api from '@/lib/api';

function genOrderNumber() {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Normalize legacy /academic/* payment links to correct routes.
 * Prevents stale links from being stored or sent in emails.
 */
function normalizePaymentLink(link, orderId) {
  if (!link) return null;
  // Rewrite any /academic/quote/:id or /academic/pay/:id → /pay/:id
  const academicQuoteRe = /\/academic\/(?:quote|pay)\/[^/\s]+/;
  if (academicQuoteRe.test(link)) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${siteUrl}/pay/${orderId}`;
  }
  // Reject any other /academic/ links
  if (/\/academic\//.test(link)) {
    return null;
  }
  return link;
}

// GET /api/orders — fetch orders
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  if (id) {
    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  }

  const isAdmin = await verifyAdmin();
  if (isAdmin) {
    const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  }

  if (email) {
    const orders = await db.order.findMany({ where: { studentEmail: email }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// POST /api/orders — create new order
export async function POST(req) {
  try {
    const body = await req.json();
    const { studentName, studentEmail, school, courseCode, courseName, examType, examDate, commitment, topics, notes, files } = body;

    const duration = Math.max(1, Math.ceil((new Date(examDate) - new Date()) / 86400000));

    const order = await db.order.create({
      data: {
        orderNumber: genOrderNumber(),
        studentName,
        studentEmail,
        school: school || '',
        courseCode: courseCode || '',
        courseName: courseName || courseCode || '',
        examType,
        examDate: new Date(examDate),
        duration,
        commitment: commitment || '2-3hr',
        topics: topics || '',
        notes: notes || '',
        files: JSON.stringify(files || []),
        status: 'pending',
      },
    });

    // Notify admin of new order via unified API
    await api.sendNotification({
      type: 'new_order',
      title: 'New Order Received',
      message: `${studentName} — ${courseName || courseCode}`,
      data: { orderId: order.id, studentEmail, examDate },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}

// PATCH /api/orders — admin actions (quote, pay, activate, reject)
export async function PATCH(req) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, action, ...data } = body;

    if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });

    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    switch (action) {
      case 'quote': {
        const { amount, modules, note, paymentLink } = data;
        const updated = await db.order.update({
          where: { id },
          data: {
            status: 'quoted',
            quoteAmount: parseFloat(amount),
            quoteModules: JSON.stringify(modules || []),
            quoteNote: note || null,
            paymentLink: normalizePaymentLink(paymentLink, id),
            quoteSentAt: new Date(),
          },
        });
        // Send quote email via unified API
        await api.sendQuoteEmail(updated);
        return NextResponse.json(updated);
      }

      case 'setPaymentLink': {
        const updated = await db.order.update({
          where: { id },
          data: { paymentLink: normalizePaymentLink(data.paymentLink, id) },
        });
        return NextResponse.json(updated);
      }

      case 'markPaid': {
        const updated = await db.order.update({
          where: { id },
          data: { status: 'paid', paidAt: new Date() },
        });
        await api.sendPaymentEmail(updated);
        return NextResponse.json(updated);
      }

      case 'activate': {
        const updated = await db.order.update({
          where: { id },
          data: { status: 'active', activatedAt: new Date() },
        });
        await api.sendActivationEmail(updated);
        return NextResponse.json(updated);
      }

      case 'reject': {
        const updated = await db.order.update({
          where: { id },
          data: { status: 'rejected' },
        });
        return NextResponse.json(updated);
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Order update error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
