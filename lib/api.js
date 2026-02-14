/**
 * ═══════════════════════════════════════════════════
 * CERTIPREP ACADEMIC — Unified API Service Layer
 * 
 * Single integration point for ALL external services.
 * In development: uses free sandbox services (Ethereal SMTP, console logging)
 * In production: uses real services (Resend, etc.)
 * 
 * To switch to production: update .env.local keys only. No code changes.
 * ═══════════════════════════════════════════════════
 */

import nodemailer from 'nodemailer';

// ──── ENVIRONMENT DETECTION ────
const isProd = process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('MOCK');

// ──── EMAIL SERVICE ────

let _transporter = null;
let _etherealAccount = null;

/**
 * Get or create the email transporter.
 * Dev: Ethereal (free fake SMTP — emails are captured, viewable at ethereal.email)
 * Prod: Resend SMTP (swap by setting real RESEND_API_KEY)
 */
async function getTransporter() {
  if (_transporter) return _transporter;

  if (isProd) {
    // PRODUCTION: Use Resend's SMTP
    _transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
    console.log('[API] Email: Using Resend SMTP (production)');
  } else {
    // DEVELOPMENT: Use Ethereal (free fake SMTP)
    if (!_etherealAccount) {
      _etherealAccount = await nodemailer.createTestAccount();
      console.log('[API] Email: Ethereal account created');
      console.log('[API]   User:', _etherealAccount.user);
      console.log('[API]   Pass:', _etherealAccount.pass);
      console.log('[API]   View emails at: https://ethereal.email/login');
    }
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: _etherealAccount.user,
        pass: _etherealAccount.pass,
      },
    });
    console.log('[API] Email: Using Ethereal SMTP (development/sandbox)');
  }

  return _transporter;
}

/**
 * Send an email. Works in both dev (Ethereal) and prod (Resend).
 * Returns { success, messageId, previewUrl }
 * In dev, previewUrl lets you view the email in Ethereal's web UI.
 */
async function sendEmail({ to, subject, html, from }) {
  try {
    const transporter = await getTransporter();
    const fromAddr = from || process.env.EMAIL_FROM || 'CertiPrep <noreply@certiprep.academy>';

    const info = await transporter.sendMail({
      from: fromAddr,
      to,
      subject,
      html,
    });

    const previewUrl = isProd ? null : nodemailer.getTestMessageUrl(info);

    console.log(`[API] Email sent to ${to}: "${subject}"`);
    if (previewUrl) {
      console.log(`[API] Preview: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
    };
  } catch (err) {
    console.error('[API] Email error:', err.message);
    return { success: false, error: err.message };
  }
}

// ──── NOTIFICATION SERVICE ────

/**
 * Send a notification. 
 * Dev: Console logging with structured output
 * Prod: Can be swapped to Slack webhook, Discord, SMS, etc.
 */
async function sendNotification({ type, title, message, data }) {
  const timestamp = new Date().toISOString();

  if (isProd && process.env.NOTIFICATION_WEBHOOK_URL) {
    // PRODUCTION: POST to webhook (Slack, Discord, etc.)
    try {
      await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `[${type}] ${title}: ${message}`,
          data,
          timestamp,
        }),
      });
      console.log(`[API] Notification sent via webhook: ${title}`);
      return { success: true };
    } catch (err) {
      console.error('[API] Notification webhook error:', err.message);
      return { success: false, error: err.message };
    }
  }

  // DEV: Structured console logging
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║ NOTIFICATION: ${type.toUpperCase()}`);
  console.log(`╟──────────────────────────────────────╢`);
  console.log(`║ Title: ${title}`);
  console.log(`║ Message: ${message}`);
  if (data) console.log(`║ Data:`, JSON.stringify(data, null, 2).split('\n').map(l => `║   ${l}`).join('\n'));
  console.log(`║ Time: ${timestamp}`);
  console.log(`╚══════════════════════════════════════╝\n`);

  return { success: true, mode: 'console' };
}

// ──── EMAIL TEMPLATE BUILDERS ────

function layout(headerBg, headerContent, bodyContent) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:${headerBg};padding:32px 40px;text-align:center">
    <div style="display:inline-block;background:#ecc94b;border-radius:10px;padding:8px 12px;margin-bottom:16px">
      <span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:1px">CERTIPREP</span>
    </div>
    ${headerContent}
  </td></tr>
  <tr><td style="padding:36px 40px">${bodyContent}</td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">CertiPrep Academic &middot; <a href="${siteUrl}" style="color:#64748b">certiprep.academy</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

// ──── UNIFIED API OBJECT ────

const api = {
  /**
   * Send order quote email to student
   */
  sendQuoteEmail: async (order) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const payLink = order.paymentLink || `${siteUrl}/pay/${order.id}`;
    const modules = JSON.parse(order.quoteModules || '[]');
    const moduleNames = { guide:'Study Guide', flash:'Flashcards', video:'Video Overview', audio:'Audio Summary', mind:'Mind Map', quiz:'Daily Quiz', exam:'Mock Exam' };
    const moduleIcons = { guide:'📖', flash:'🃏', video:'🎬', audio:'🎧', mind:'🗺️', quiz:'✅', exam:'🎯' };

    const html = layout(
      'linear-gradient(135deg,#0f172a,#1e293b)',
      `<h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff">Your Study Plan is Ready!</h1>`,
      `<p style="margin:0 0 20px;font-size:15px;color:#334155">Hi <strong>${order.studentName.split(' ')[0]}</strong>,</p>
       <p style="margin:0 0 24px;font-size:15px;color:#334155">We've built a personalized ${order.duration}-day plan for <strong>${order.courseName}</strong>.</p>
       <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border:2px solid #ecc94b;border-radius:12px;margin-bottom:24px">
         <tr><td style="padding:24px;text-align:center">
           <div style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase">Your Quote</div>
           <div style="font-size:42px;font-weight:800;color:#0f172a">$${order.quoteAmount}</div>
           <div style="font-size:13px;color:#92400e">${order.duration}-day plan &middot; ${modules.length} modules/day</div>
         </td></tr>
       </table>
       <div style="margin-bottom:24px">
         <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:12px">Included Daily</div>
         ${modules.map(m => `<div style="padding:8px 12px;font-size:14px;color:#334155;border-bottom:1px solid #f1f5f9">${moduleIcons[m]||'📋'} ${moduleNames[m]||m}</div>`).join('')}
       </div>
       ${order.quoteNote ? `<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:16px;margin-bottom:24px;font-size:14px;color:#334155"><strong style="color:#0369a1">Note:</strong> ${order.quoteNote}</div>` : ''}
       <table width="100%"><tr><td align="center">
         <a href="${payLink}" style="display:inline-block;background:linear-gradient(135deg,#ecc94b,#d69e2e);color:#0f172a;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Accept &amp; Pay →</a>
       </td></tr></table>`
    );

    const result = await sendEmail({
      to: order.studentEmail,
      subject: `Your CertiPrep Study Plan — $${order.quoteAmount}`,
      html,
    });

    await sendNotification({
      type: 'quote_sent',
      title: 'Quote Sent',
      message: `$${order.quoteAmount} quote sent to ${order.studentEmail}`,
      data: { orderId: order.id, amount: order.quoteAmount },
    });

    return result;
  },

  /**
   * Send payment confirmation email
   */
  sendPaymentEmail: async (order) => {
    const html = layout(
      'linear-gradient(135deg,#0f172a,#1e293b)',
      `<div style="font-size:48px;margin:12px 0">✅</div>
       <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff">Payment Confirmed!</h1>`,
      `<p style="margin:0 0 20px;font-size:15px;color:#334155">Hi <strong>${order.studentName.split(' ')[0]}</strong>,</p>
       <p style="margin:0 0 24px;font-size:15px;color:#334155">Your payment of <strong>$${order.quoteAmount}</strong> for <strong>${order.courseName}</strong> has been received.</p>
       <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:24px">
         <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:8px">What Happens Next</div>
         <div style="font-size:14px;color:#334155;line-height:2">1. We're preparing your study materials now<br>2. You'll receive an activation email within 4-6 hours<br>3. Your ${order.duration}-day countdown starts when you open Day 1</div>
       </div>`
    );

    const result = await sendEmail({
      to: order.studentEmail,
      subject: `Payment Confirmed — ${order.courseName}`,
      html,
    });

    await sendNotification({
      type: 'payment_received',
      title: 'Payment Received',
      message: `$${order.quoteAmount} from ${order.studentName}`,
      data: { orderId: order.id },
    });

    return result;
  },

  /**
   * Send plan activation email
   */
  sendActivationEmail: async (order) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const modules = JSON.parse(order.quoteModules || '[]');

    const html = layout(
      'linear-gradient(135deg,#065f46,#047857)',
      `<div style="font-size:48px;margin:8px 0">🚀</div>
       <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff">Your Prep Plan is Live!</h1>`,
      `<p style="margin:0 0 20px;font-size:15px;color:#334155">Hi <strong>${order.studentName.split(' ')[0]}</strong>,</p>
       <p style="margin:0 0 24px;font-size:15px;color:#334155">Your ${order.duration}-day plan for <strong>${order.courseName}</strong> is ready!</p>
       <table width="100%" style="margin-bottom:24px"><tr>
         <td width="31%" style="background:#fef3c7;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#92400e">${order.duration}</div><div style="font-size:11px;font-weight:600;color:#92400e">DAYS</div></td>
         <td width="4%"></td>
         <td width="31%" style="background:#dbeafe;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#1e40af">${modules.length}</div><div style="font-size:11px;font-weight:600;color:#1e40af">MODULES/DAY</div></td>
         <td width="4%"></td>
         <td width="31%" style="background:#dcfce7;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#166534">1</div><div style="font-size:11px;font-weight:600;color:#166534">MOCK EXAM</div></td>
       </tr></table>
       <table width="100%"><tr><td align="center">
         <a href="${siteUrl}/dashboard/${order.id}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Start Day 1 →</a>
       </td></tr></table>`
    );

    return sendEmail({
      to: order.studentEmail,
      subject: `🚀 Your ${order.courseName} Prep Plan is Live!`,
      html,
    });
  },

  /**
   * Send daily study reminder
   */
  sendDailyReminder: async (order, dayNumber, dayTitle) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const pct = Math.round((dayNumber - 1) / order.duration * 100);

    const html = layout(
      'linear-gradient(135deg,#1e293b,#334155)',
      `<h2 style="margin:0;font-size:20px;color:#fff">Day ${dayNumber}: ${dayTitle}</h2>`,
      `<p style="margin:0 0 24px;font-size:14px;color:#64748b">${order.courseName} &middot; Day ${dayNumber} of ${order.duration}</p>
       <div style="margin-bottom:24px">
         <div style="margin-bottom:6px;font-size:12px"><span style="color:#64748b">Progress</span><span style="float:right;font-weight:700;color:#0f172a">${pct}%</span></div>
         <div style="background:#e2e8f0;border-radius:8px;height:10px;overflow:hidden"><div style="background:linear-gradient(90deg,#ecc94b,#f59e0b);height:100%;border-radius:8px;width:${pct}%"></div></div>
       </div>
       <table width="100%"><tr><td align="center">
         <a href="${siteUrl}/dashboard/${order.id}" style="display:inline-block;background:linear-gradient(135deg,#ecc94b,#d69e2e);color:#0f172a;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Start Day ${dayNumber} →</a>
       </td></tr></table>`
    );

    return sendEmail({
      to: order.studentEmail,
      subject: `Day ${dayNumber}: ${dayTitle} — ${order.courseName}`,
      html,
    });
  },

  /**
   * Send exam day encouragement
   */
  sendExamDayEmail: async (order) => {
    const html = layout(
      'linear-gradient(135deg,#7c3aed,#6d28d9)',
      `<div style="font-size:56px;margin:8px 0">⭐</div>
       <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff">Today's the Day!</h1>`,
      `<p style="margin:0 0 20px;font-size:15px;color:#334155">Hi <strong>${order.studentName.split(' ')[0]}</strong>,</p>
       <p style="margin:0 0 24px;font-size:15px;color:#334155">Today is your <strong>${order.courseName} ${order.examType}</strong>. You've spent ${order.duration} days preparing — that work pays off now.</p>
       <div style="background:#fef3c7;border:2px solid #ecc94b;border-radius:16px;padding:28px;margin-bottom:24px;text-align:center">
         <div style="font-size:16px;font-weight:800;color:#92400e;margin-bottom:12px">Exam Day Checklist</div>
         <div style="text-align:left;font-size:14px;color:#334155;line-height:2.2">
           ☑️ Good sleep<br>☑️ Solid breakfast<br>☑️ Arrive 10 min early<br>☑️ Read questions fully<br>☑️ Trust your prep!
         </div>
       </div>
       <p style="text-align:center;font-size:20px;font-weight:800;color:#0f172a">You've got this! 🌟</p>`
    );

    return sendEmail({
      to: order.studentEmail,
      subject: `⭐ Exam Day! You've Got This, ${order.studentName.split(' ')[0]}!`,
      html,
    });
  },

  /**
   * Send a generic notification
   */
  sendNotification,

  /**
   * Submit a new order (called from intake form)
   */
  submitOrder: async (orderData) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const res = await fetch(`${siteUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const order = await res.json();

    await sendNotification({
      type: 'new_order',
      title: 'New Order Received',
      message: `${orderData.studentName} — ${orderData.courseName}`,
      data: orderData,
    });

    return order;
  },

  /**
   * Get service status for debugging
   */
  getStatus: () => ({
    mode: isProd ? 'production' : 'development',
    email: isProd ? 'Resend SMTP' : 'Ethereal (sandbox)',
    notifications: isProd && process.env.NOTIFICATION_WEBHOOK_URL ? 'Webhook' : 'Console',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }),
};

export default api;
