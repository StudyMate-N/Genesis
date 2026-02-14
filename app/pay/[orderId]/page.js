'use client';
import { useState, useEffect } from 'react';

export default function PaymentPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?id=${params.orderId}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.orderId]);

  if (loading) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#0f1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8"}}>
      Loading...
    </div>
  );

  if (!order) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#0f1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#f87171"}}>
      Order not found
    </div>
  );

  // If there's a Payoneer payment link, show summary then redirect button
  const payLink = order.paymentLink;

  return (
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",background:"#0f1117",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:480,maxWidth:"90%",textAlign:"center"}}>
        {/* Logo */}
        <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#ecc94b,#d69e2e)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>

        <h1 style={{fontSize:28,fontWeight:800,color:"#f1f5f9",marginBottom:8}}>Complete Your Payment</h1>
        <p style={{fontSize:14,color:"#94a3b8",marginBottom:32}}>Review your order details below</p>

        {/* Order Summary Card */}
        <div style={{background:"#161922",border:"1px solid #1e2330",borderRadius:16,padding:"28px 32px",marginBottom:24,textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:"#4a5568"}}>Order</span>
            <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{order.orderNumber}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:"#4a5568"}}>Course</span>
            <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{order.courseName}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:"#4a5568"}}>Exam</span>
            <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{order.examType} — {new Date(order.examDate).toLocaleDateString()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:"#4a5568"}}>Duration</span>
            <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{order.duration} days</span>
          </div>
          <div style={{borderTop:"2px solid #1e2330",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#94a3b8"}}>Total</span>
            <span style={{fontSize:28,fontWeight:800,color:"#ecc94b"}}>${order.quoteAmount}</span>
          </div>
        </div>

        {/* Pay Button */}
        {payLink ? (
          <a href={payLink} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-block",width:"100%",padding:"18px 32px",borderRadius:14,background:"linear-gradient(135deg,#ecc94b,#d69e2e)",color:"#1a202c",fontSize:18,fontWeight:800,textDecoration:"none",textAlign:"center",boxShadow:"0 4px 24px rgba(236,201,75,.25)",cursor:"pointer"}}>
            Pay ${order.quoteAmount} via Payoneer →
          </a>
        ) : (
          <div style={{padding:"18px 32px",borderRadius:14,background:"#1a1d28",border:"1px solid #2d3548",color:"#4a5568",fontSize:14}}>
            Payment link not yet available. Check back shortly.
          </div>
        )}

        <p style={{fontSize:12,color:"#374151",marginTop:16}}>
          Secure payment processed by Payoneer. After payment, your study plan will be prepared within 4-6 hours.
        </p>

        {order.status === 'paid' && (
          <div style={{marginTop:24,padding:"16px 24px",borderRadius:12,background:"#0f1a10",border:"1px solid #1a3b1a",color:"#22c55e",fontSize:14,fontWeight:600}}>
            ✅ Payment received! Your prep plan is being prepared.
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');*{box-sizing:border-box;margin:0}`}</style>
    </div>
  );
}
