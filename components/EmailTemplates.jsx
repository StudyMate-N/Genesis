"use client";
import { useState } from "react";

/* ═══════════════════════════════════════════
   VERITAS ACADEMY ACADEMIC — EMAIL TEMPLATE PREVIEWER
   5 templates · 4 themes · live preview
   ═══════════════════════════════════════════ */

const THEMES={
  midnight:{name:"Midnight",icon:"🌙",bg:"#0f1117",surface:"#161922",surface2:"#1a1d28",raised:"#12141c",border:"#1e2330",border2:"#2d3548",borderActive:"#2d3f6b",text:"#f1f5f9",text2:"#e2e8f0",muted:"#94a3b8",dim:"#4a5568",faint:"#374151",accent:"#ecc94b",accentHover:"#d69e2e",accentBg:"#ecc94b12",accentBorder:"#ecc94b30",success:"#22c55e",successBg:"#0f1a10",danger:"#f87171",scrollbar:"#1e2330",shadow:"rgba(0,0,0,.5)",dk:true},
  oak:{name:"Warm Oak",icon:"🪵",bg:"#faf8f5",surface:"#ffffff",surface2:"#f5f0ea",raised:"#fdf8f3",border:"#e6ddd0",border2:"#d4c8b8",borderActive:"#c8956a",text:"#2d2015",text2:"#3d3025",muted:"#7a6b5a",dim:"#a0917f",faint:"#c4b8a8",accent:"#c8956a",accentHover:"#b07d52",accentBg:"#c8956a12",accentBorder:"#c8956a35",success:"#5a8a3c",successBg:"#f0f7ec",danger:"#c45040",scrollbar:"#d4c8b8",shadow:"rgba(0,0,0,.12)",dk:false},
  arctic:{name:"Arctic",icon:"❄️",bg:"#f0f4f8",surface:"#ffffff",surface2:"#e8eef5",raised:"#f5f8fb",border:"#d0dae8",border2:"#b8c8d8",borderActive:"#4a8ad0",text:"#1a2a3a",text2:"#2a3a4a",muted:"#5a7088",dim:"#8098b0",faint:"#b0c0d0",accent:"#2d7ad4",accentHover:"#1a62b8",accentBg:"#2d7ad412",accentBorder:"#2d7ad430",success:"#2a9d5c",successBg:"#ecf8f0",danger:"#d43a3a",scrollbar:"#c0d0e0",shadow:"rgba(0,0,0,.1)",dk:false},
  emerald:{name:"Emerald",icon:"🌲",bg:"#0a120e",surface:"#111c16",surface2:"#152018",raised:"#0e1812",border:"#1a2e22",border2:"#254035",borderActive:"#2a5a40",text:"#e0f0e8",text2:"#c8e0d0",muted:"#78a890",dim:"#4a7060",faint:"#2a4a38",accent:"#4ade80",accentHover:"#22c55e",accentBg:"#4ade8012",accentBorder:"#4ade8030",success:"#4ade80",successBg:"#0a1a10",danger:"#f87171",scrollbar:"#1a2e22",shadow:"rgba(0,0,0,.5)",dk:true},
};

const DATA = {
  student:"Sarah",studentFull:"Sarah Kim",email:"sarah.k@ufl.edu",
  course:"MDC1 — Medical Terminology",examType:"Midterm",examDate:"February 18, 2026",
  duration:8,quoteAmount:79,orderId:"ORD-2401",
  dayNum:3,dayTopic:"Viruses & Viral Replication",daysLeft:5,
  modules:["Study Guide","Flashcards","Video Overview","Audio Summary","Mind Map","Daily Quiz","Mock Exam"],
  paymentDate:"February 10, 2026",paymentMethod:"Visa ending 4242",
};

function quoteEmail(d){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 40px;text-align:center">
    <div style="display:inline-block;background:#ecc94b;border-radius:10px;padding:8px 12px;margin-bottom:16px"><span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:1px">🛡 VERITAS ACADEMY</span></div>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3">Your Custom Study Plan<br>is Ready!</h1>
    <p style="margin:12px 0 0;font-size:14px;color:#94a3b8">We've reviewed your submission and prepared a quote.</p>
  </td></tr>
  <tr><td style="padding:36px 40px">
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7">Hi <strong>${d.student}</strong>,</p>
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">Great news! We've reviewed your materials for <strong>${d.course}</strong> and built a personalized ${d.duration}-day preparation plan for your upcoming <strong>${d.examType}</strong> on <strong>${d.examDate}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border:2px solid #ecc94b;border-radius:12px;margin-bottom:24px">
      <tr><td style="padding:24px 28px;text-align:center">
        <div style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Your Quote</div>
        <div style="font-size:42px;font-weight:800;color:#0f172a;line-height:1">$${d.quoteAmount}</div>
        <div style="font-size:13px;color:#92400e;margin-top:8px">${d.duration}-day structured plan · ${d.modules.length} modules per day</div>
      </td></tr>
    </table>
    <div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">What's Included Daily</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${d.modules.map((m,i)=>`<tr><td style="padding:8px 12px;font-size:14px;color:#334155;border-bottom:1px solid #f1f5f9"><span style="margin-right:8px">${["📖","🃏","🎬","🎧","🗺️","✅","🎯"][i]}</span>${m}</td></tr>`).join("")}
      </table>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px">
      <a href="https://veritas.academy/academic/quote/${d.orderId}" style="display:inline-block;background:linear-gradient(135deg,#ecc94b,#d69e2e);color:#0f172a;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Accept & Pay →</a>
    </td></tr></table>
    <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center">This quote is valid for 48 hours. Questions? Just reply to this email.</p>
  </td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">Veritas Academy · <a href="https://veritas.academy" style="color:#64748b">veritas.academy</a></p>
    <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1">Order ${d.orderId} · You're receiving this because you submitted a prep request.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function paymentEmail(d){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 40px;text-align:center">
    <div style="display:inline-block;background:#ecc94b;border-radius:10px;padding:8px 12px;margin-bottom:16px"><span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:1px">🛡 VERITAS ACADEMY</span></div>
    <div style="font-size:48px;margin:12px 0">✅</div>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff">Payment Confirmed!</h1>
  </td></tr>
  <tr><td style="padding:36px 40px">
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7">Hi <strong>${d.student}</strong>,</p>
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">Your payment of <strong>$${d.quoteAmount}</strong> has been received. We're now building your personalized ${d.duration}-day study plan for <strong>${d.course}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px">
      <tr><td style="padding:20px 24px">
        <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px">Receipt</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#334155">
          <tr><td style="padding:6px 0;color:#64748b">Order</td><td style="padding:6px 0;text-align:right;font-weight:600">${d.orderId}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Course</td><td style="padding:6px 0;text-align:right;font-weight:600">${d.course}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Duration</td><td style="padding:6px 0;text-align:right;font-weight:600">${d.duration} days</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Date</td><td style="padding:6px 0;text-align:right;font-weight:600">${d.paymentDate}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Payment</td><td style="padding:6px 0;text-align:right;font-weight:600">${d.paymentMethod}</td></tr>
          <tr><td colspan="2" style="border-top:2px solid #e2e8f0;padding:12px 0 0"></td></tr>
          <tr><td style="padding:6px 0;font-weight:700;font-size:16px">Total</td><td style="padding:6px 0;text-align:right;font-weight:800;font-size:20px;color:#0f172a">$${d.quoteAmount}</td></tr>
        </table>
      </td></tr>
    </table>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:8px">⚡ What Happens Next</div>
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#334155;line-height:2">
        <li>Our team is preparing your study materials now</li>
        <li>You'll receive an activation email within 4-6 hours</li>
        <li>Your ${d.duration}-day countdown starts when you open Day 1</li>
      </ol>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="https://veritas.academy/academic/dashboard/${d.orderId}" style="display:inline-block;background:linear-gradient(135deg,#ecc94b,#d69e2e);color:#0f172a;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Go to Dashboard →</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">Veritas Academy · <a href="https://veritas.academy" style="color:#64748b">veritas.academy</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function activatedEmail(d){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:linear-gradient(135deg,#065f46,#047857);padding:32px 40px;text-align:center">
    <div style="display:inline-block;background:#ecc94b;border-radius:10px;padding:8px 12px;margin-bottom:16px"><span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:1px">🛡 VERITAS ACADEMY</span></div>
    <div style="font-size:48px;margin:8px 0">🚀</div>
    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff">Your Prep Plan is Live!</h1>
    <p style="margin:12px 0 0;font-size:14px;color:#a7f3d0">${d.duration} days of focused preparation starts now.</p>
  </td></tr>
  <tr><td style="padding:36px 40px">
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7">Hi <strong>${d.student}</strong>,</p>
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">Your personalized study plan for <strong>${d.course}</strong> is ready! We've built ${d.duration} days of structured content tailored to your ${d.examType.toLowerCase()} on <strong>${d.examDate}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
      <td width="31%" style="background:#fef3c7;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#92400e">${d.duration}</div><div style="font-size:11px;font-weight:600;color:#92400e;text-transform:uppercase">Study Days</div></td>
      <td width="4%"></td>
      <td width="31%" style="background:#dbeafe;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#1e40af">${d.modules.length}</div><div style="font-size:11px;font-weight:600;color:#1e40af;text-transform:uppercase">Daily Modules</div></td>
      <td width="4%"></td>
      <td width="31%" style="background:#dcfce7;border-radius:12px;padding:20px;text-align:center"><div style="font-size:28px;font-weight:800;color:#166534">1</div><div style="font-size:11px;font-weight:600;color:#166534;text-transform:uppercase">Mock Exam</div></td>
    </tr></table>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#166534;margin-bottom:4px">💡 Pro Tip</div>
      <div style="font-size:14px;color:#334155;line-height:1.6">Start with the Study Guide each day to build context, then reinforce with Flashcards and Quiz. Save the Mock Exam for Day ${d.duration}!</div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="https://veritas.academy/academic/prep/${d.orderId}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#ffffff;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Start Day 1 →</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">Veritas Academy · <a href="https://veritas.academy" style="color:#64748b">veritas.academy</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function dailyEmail(d){
  const pct=Math.round((d.dayNum-1)/d.duration*100);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px 40px">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="font-size:14px;font-weight:700;color:#ecc94b;letter-spacing:1px">🛡 VERITAS ACADEMY</span></td>
      <td style="text-align:right"><span style="font-size:12px;color:#94a3b8">Day ${d.dayNum} of ${d.duration}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:36px 40px">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:.5px">Today's Focus</p>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a">Day ${d.dayNum}: ${d.dayTopic}</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b">${d.daysLeft} days until your ${d.examType.toLowerCase()} · ${d.course}</p>
    <div style="margin-bottom:24px">
      <div style="margin-bottom:6px;font-size:12px"><span style="font-weight:600;color:#64748b">Overall Progress</span><span style="float:right;font-weight:700;color:#0f172a">${pct}%</span></div>
      <div style="background:#e2e8f0;border-radius:8px;height:10px;overflow:hidden"><div style="background:linear-gradient(90deg,#ecc94b,#f59e0b);height:100%;border-radius:8px;width:${pct}%"></div></div>
    </div>
    <div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Today's Modules</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[["📖","Study Guide","~20 min"],["🃏","Flashcards","35 cards"],["🎬","Video","12 min"],["🎧","Audio","8 min"],["🗺️","Mind Map","Interactive"],["✅","Daily Quiz","15 questions"]].map(([ic,nm,mt])=>`<tr><td style="padding:10px 14px;background:#f8fafc;border-radius:8px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="32" style="font-size:18px">${ic}</td><td style="font-weight:600;font-size:14px;color:#334155">${nm}</td><td style="text-align:right;font-size:12px;color:#94a3b8">${mt}</td></tr></table></td></tr><tr><td style="height:4px"></td></tr>`).join("")}
      </table>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="https://veritas.academy/academic/prep/${d.orderId}/day/${d.dayNum}" style="display:inline-block;background:linear-gradient(135deg,#ecc94b,#d69e2e);color:#0f172a;font-size:16px;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none">Start Day ${d.dayNum} →</a>
    </td></tr></table>
    <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;text-align:center">Consistency beats intensity. Even 30 minutes today makes a difference! 💪</p>
  </td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">Veritas Academy · <a href="#" style="color:#64748b">Unsubscribe</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function examDayEmail(d){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
  <tr><td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:40px;text-align:center">
    <div style="display:inline-block;background:#ecc94b;border-radius:10px;padding:8px 12px;margin-bottom:16px"><span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:1px">🛡 VERITAS ACADEMY</span></div>
    <div style="font-size:56px;margin:8px 0">⭐</div>
    <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.3">Today's the Day!</h1>
    <p style="margin:12px 0 0;font-size:16px;color:#c4b5fd">You've prepared. You're ready. Go show them what you know.</p>
  </td></tr>
  <tr><td style="padding:36px 40px">
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7">Hi <strong>${d.student}</strong>,</p>
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">Today is your <strong>${d.course} ${d.examType}</strong>. Over the past ${d.duration} days, you've worked through study guides, flashcards, videos, quizzes, and a full mock exam. That work is going to pay off.</p>
    <div style="background:linear-gradient(135deg,#fef3c7,#fef9c3);border:2px solid #ecc94b;border-radius:16px;padding:28px 32px;margin-bottom:24px;text-align:center">
      <div style="font-size:16px;font-weight:800;color:#92400e;margin-bottom:12px">🎯 Exam Day Checklist</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="text-align:left;font-size:14px;color:#334155;line-height:2.2">
        <tr><td>☑️ Get a good night's sleep</td></tr>
        <tr><td>☑️ Eat a solid breakfast — brain fuel</td></tr>
        <tr><td>☑️ Arrive 10 minutes early</td></tr>
        <tr><td>☑️ Read each question fully before answering</td></tr>
        <tr><td>☑️ Trust your preparation!</td></tr>
      </table>
    </div>
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#0369a1;margin-bottom:8px">📝 Last-Minute Review</div>
      <div style="font-size:14px;color:#334155;line-height:1.6">Your flashcard highlights are still available for a quick 15-minute refresh.</div>
      <a href="https://veritas.academy/academic/prep/${d.orderId}" style="display:inline-block;margin-top:12px;font-size:13px;font-weight:700;color:#0369a1;text-decoration:none">Open Quick Review →</a>
    </div>
    <div style="text-align:center;padding:16px 0">
      <p style="margin:0;font-size:20px;font-weight:800;color:#0f172a">You've got this, ${d.student}! 🌟</p>
      <p style="margin:8px 0 0;font-size:14px;color:#64748b">The Veritas Academy team is rooting for you.</p>
    </div>
  </td></tr>
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">Veritas Academy · <a href="https://veritas.academy" style="color:#64748b">veritas.academy</a></p>
    <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1">After your exam, we'd love to hear how it went!</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

const TMPLS=[
  {id:"quote",name:"Quote Ready",icon:"💰",desc:"Sent when admin sets a price",color:"#ecc94b",fn:quoteEmail},
  {id:"payment",name:"Payment Confirmed",icon:"✅",desc:"After successful payment",color:"#22c55e",fn:paymentEmail},
  {id:"activated",name:"Plan Activated",icon:"🚀",desc:"Study plan is ready to start",color:"#3b82f6",fn:activatedEmail},
  {id:"daily",name:"Daily Reminder",icon:"📅",desc:"Morning nudge for each study day",color:"#f59e0b",fn:dailyEmail},
  {id:"examday",name:"Exam Day",icon:"⭐",desc:"Encouragement on the big day",color:"#7c3aed",fn:examDayEmail},
];

export default function EmailTemplates(){
  const[theme,setTheme]=useState("midnight");
  const[pick,setPick]=useState(false);
  const[active,setActive]=useState("quote");
  const[copied,setCopied]=useState(false);
  const T=THEMES[theme];
  const tmpl=TMPLS.find(t=>t.id===active);
  const html=tmpl.fn(DATA);
  const tr="all .35s";

  const copy=()=>{navigator.clipboard?.writeText(html);setCopied(true);setTimeout(()=>setCopied(false),2000)};

  return(
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",color:T.text2,transition:tr}}>
      <header style={{background:T.surface,borderBottom:"1px solid "+T.border,padding:"0 28px",height:56,display:"flex",alignItems:"center",gap:14,flexShrink:0,transition:tr}}>
        <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,"+T.accent+","+T.accentHover+")",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.dk?"#1a202c":"#fff"} strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <span style={{fontWeight:700,fontSize:15,letterSpacing:"1.5px",color:T.text}}>VERITAS ACADEMY</span>
        <span style={{fontSize:11,color:T.dim,fontWeight:500}}>EMAIL TEMPLATES</span>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:12,color:T.dim}}>5 templates · production-ready HTML</span>
          {/* THEME PICKER */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setPick(!pick)} style={{width:36,height:36,borderRadius:10,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border2}>{T.icon}</button>
            {pick&&<>
              <div onClick={()=>setPick(false)} style={{position:"fixed",inset:0,zIndex:299}}/>
              <div style={{position:"absolute",top:44,right:0,background:T.surface,border:"1px solid "+T.border2,borderRadius:14,padding:8,boxShadow:"0 12px 40px "+T.shadow,zIndex:300,width:220,animation:"slideUp .2s ease"}}>
                <div style={{padding:"6px 12px 10px",fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px"}}>Choose Theme</div>
                {Object.entries(THEMES).map(([k,th])=>(
                  <button key={k} onClick={()=>{setTheme(k);setPick(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",background:theme===k?T.accentBg:"transparent",cursor:"pointer",fontFamily:"inherit",transition:"all .1s",textAlign:"left"}}
                    onMouseEnter={e=>{if(theme!==k)e.currentTarget.style.background=T.surface2}} onMouseLeave={e=>{if(theme!==k)e.currentTarget.style.background="transparent"}}>
                    <span style={{fontSize:18}}>{th.icon}</span>
                    <span style={{fontSize:13,fontWeight:theme===k?700:500,color:theme===k?T.accent:T.muted,flex:1}}>{th.name}</span>
                    <div style={{display:"flex",gap:3}}>{[th.bg,th.accent,th.surface].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,border:"1px solid "+th.border}}/>)}</div>
                    {theme===k&&<span style={{color:T.accent,fontWeight:800,fontSize:14,marginLeft:4}}>✓</span>}
                  </button>
                ))}
              </div>
            </>}
          </div>
        </div>
      </header>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar */}
        <div style={{width:300,flexShrink:0,borderRight:"1px solid "+T.border,background:T.raised,padding:"16px 12px",display:"flex",flexDirection:"column",transition:tr}}>
          <div style={{fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",padding:"8px 12px 12px"}}>Email Templates</div>
          {TMPLS.map(t=>(
            <button key={t.id} onClick={()=>setActive(t.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:10,border:"none",
                background:active===t.id?T.surface:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                transition:"all .15s",marginBottom:4,
                borderLeft:active===t.id?"3px solid "+t.color:"3px solid transparent"
              }}
              onMouseEnter={e=>{if(active!==t.id)e.currentTarget.style.background=T.surface}} onMouseLeave={e=>{if(active!==t.id)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:22}}>{t.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:active===t.id?700:500,color:active===t.id?T.text:T.muted}}>{t.name}</div>
                <div style={{fontSize:11,color:T.dim,marginTop:2}}>{t.desc}</div>
              </div>
            </button>
          ))}
          <div style={{borderTop:"1px solid "+T.border,margin:"16px 0",padding:"16px 16px 0"}}>
            <div style={{fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginBottom:12}}>Preview Data</div>
            {[["Student",DATA.studentFull],["Course",DATA.course.split("—")[0].trim()],["Exam",DATA.examType+" · "+DATA.examDate],["Duration",DATA.duration+" days"],["Quote","$"+DATA.quoteAmount]].map(([k,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
                <span style={{color:T.dim}}>{k}</span>
                <span style={{color:T.muted,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:"auto",padding:"12px 16px"}}>
            <div style={{fontSize:10,color:T.faint,lineHeight:1.5}}>💡 These are production-ready HTML emails. Copy the HTML source to use with SendGrid, Mailgun, or any transactional email service.</div>
          </div>
        </div>
        {/* Preview */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",transition:tr}}>
          <div style={{padding:"16px 28px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:12,background:T.surface,flexShrink:0,transition:tr}}>
            <span style={{fontSize:22}}>{tmpl.icon}</span>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:T.text}}>{tmpl.name}</div>
              <div style={{fontSize:12,color:T.dim}}>{tmpl.desc}</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:8}}>
              <button onClick={copy} style={{padding:"6px 14px",borderRadius:8,background:copied?T.success+"20":T.surface2,border:"1px solid "+(copied?T.success+"40":T.border2),fontSize:11,fontWeight:600,color:copied?T.success:T.muted,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                {copied?"✓ Copied!":"📋 Copy HTML"}
              </button>
            </div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:32,background:T.surface2,display:"flex",justifyContent:"center",transition:tr}}>
            <div style={{width:640,maxWidth:"100%"}}>
              <iframe srcDoc={html} style={{width:"100%",height:900,border:"none",borderRadius:12,background:"#f1f5f9"}} title={tmpl.name}/>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;scrollbar-width:thin;scrollbar-color:${T.scrollbar} transparent}
      `}</style>
    </div>
  );
}
