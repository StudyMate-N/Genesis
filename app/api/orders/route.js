import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import api from '@/lib/api';

function genOrderNumber() {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
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

    if (!studentName || !studentEmail || !courseName || !examType || !examDate) {
      return NextResponse.json({ error: 'Missing required fields (studentName, studentEmail, courseName, examType, examDate)' }, { status: 400 });
    }

    const parsedExamDate = new Date(examDate);
    if (isNaN(parsedExamDate.getTime()) || parsedExamDate < new Date()) {
      return NextResponse.json({ error: 'Invalid or past examDate provided' }, { status: 400 });
    }

    const duration = Math.max(1, Math.ceil((parsedExamDate - new Date()) / 86400000));

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

    if (!['quote', 'setPaymentLink', 'markPaid', 'activate', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action provided' }, { status: 400 });
    }

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
            paymentLink: paymentLink || null,
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
          data: { paymentLink: data.paymentLink },
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
