import { useState, useEffect } from "react";

export default function AdminOrdersPanel({ T }){
  const STAT={
    pending:{label:"Pending",color:T.accent,icon:"⏳"},
    quoted:{label:"Quoted",color:T.info,icon:"📨"},
    paid:{label:"Paid",color:T.success,icon:"✅"},
    active:{label:"Active",color:T.info,icon:"📚"},
    completed:{label:"Done",color:T.muted,icon:"🎓"},
    rejected:{label:"Rejected",color:T.danger,icon:"✕"}
  };
  const MODS=[
    {k:"guide",l:"Study Guide",i:"📖"},
    {k:"flash",l:"Flashcards",i:"🃏"},
    {k:"video",l:"Video",i:"🎬"},
    {k:"audio",l:"Audio",i:"🎧"},
    {k:"mind",l:"Mind Map",i:"🗺️"},
    {k:"quiz",l:"Quizzes",i:"✅"},
    {k:"exam",l:"Mock Exam",i:"🎯"}
  ];
  const FI={pdf:"📄",pptx:"📊",docx:"📝",zip:"📦",jpg:"🖼️",png:"🖼️"};
  const du=d=>Math.max(0,Math.ceil((new Date(d)-new Date())/864e5));
  const ta=d=>{const m=Math.floor((Date.now()-new Date(d))/6e4);return m<60?m+"m":m<1440?Math.floor(m/60)+"h":Math.floor(m/1440)+"d"};
  const fd=d=>new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  const ft=d=>new Date(d).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  const[orders,setOrders]=useState([]);
  const[filt,setFilt]=useState("all");
  const[sel,setSel]=useState(null);
  const[amt,setAmt]=useState("");
  const[mods,setMods]=useState(MODS.map(m=>m.k));
  const[note,setNote]=useState("");
  const[busy,setBusy]=useState(false);
  const[toast,setToast]=useState(null);
  const[srch,setSrch]=useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const msg=(m,e)=>{setToast({m,e});setTimeout(()=>setToast(null),3500)};
  const list=orders.filter(o=>(filt==="all"||o.status===filt)&&(!srch||[o.studentName,o.courseName,o.orderNumber].some(s=>s.toLowerCase().includes(srch.toLowerCase()))));
  const st={p:orders.filter(o=>o.status==="pending").length,q:orders.filter(o=>o.status==="quoted").length,d:orders.filter(o=>o.status==="paid").length,r:orders.filter(o=>o.paidAt).reduce((s,o)=>s+o.quoteAmount,0),u:orders.filter(o=>o.status==="pending"&&du(o.examDate)<=5).length};

  const pick_=o=>{setSel(o);setAmt(o.quoteAmount||"");setMods(o.quoteModules? JSON.parse(o.quoteModules) : MODS.map(m=>m.k));setNote(o.quoteNote||"")};
  
  const sendQuote = async () => {
    if(!amt || isNaN(amt)) return msg("Enter a valid price",1);
    setBusy(true);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sel.id,
          action: "quote",
          amount: +amt,
          modules: mods,
          note: note,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      msg("Quote of $"+amt+" sent to "+sel.studentEmail);
      fetchOrders(); // Re-fetch orders to update the list
      setSel(null);
    } catch (e) {
      msg("Failed to send quote: " + e.message, 1);
    } finally {
      setBusy(false);
    }
  };

  const rejectOrder = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sel.id,
          action: "reject",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      msg(sel.orderNumber + " rejected", 1);
      fetchOrders();
      setSel(null);
    } catch (e) {
      msg("Failed to reject order: " + e.message, 1);
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sel.id,
          action: "markPaid",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      msg(sel.orderNumber + " marked as paid", 0);
      fetchOrders();
      setSel(null);
    } catch (e) {
      msg("Failed to mark order as paid: " + e.message, 1);
    } finally {
      setBusy(false);
    }
  };

  const activateOrder = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sel.id,
          action: "activate",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      msg(sel.orderNumber + " activated", 0);
      fetchOrders();
      setSel(null);
    } catch (e) {
      msg("Failed to activate order: " + e.message, 1);
    } finally {
      setBusy(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      msg("Order deleted successfully");
      fetchOrders();
      setSel(null);
    } catch (e) {
      msg("Failed to delete order: " + e.message, 1);
    } finally {
      setBusy(false);
    }
  };

  const sug=sel?Math.round((sel.duration<=7?49:sel.duration<=14?79:129)+JSON.parse(sel.files).length*5+mods.length*3+((sel.commitment==="4-5hr"||sel.commitment==="6hr+")?15:0)):0;

  const LS={fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginBottom:8};
  const CS={background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:"18px 20px",marginBottom:16,transition:"background .35s"};

  if (loading) return <div style={{ color: T.text }}>Loading orders...</div>;
  if (error) return <div style={{ color: T.danger }}>Error: {error}</div>;

  return(
    <div style={{color:T.text2}}>
      <h2 style={{ color: T.text, marginBottom: 20 }}>Manage Orders</h2>
      <div style={{display:"flex",borderBottom:"1px solid "+T.border}}>
        {[{l:"Pending",v:st.p,c:T.accent},{l:"Quoted",v:st.q,c:T.info},{l:"Paid",v:st.d,c:T.success},{l:"Revenue",v:"$"+st.r,c:T.accent}].map((s,i)=>(
          <div key={i} style={{flex:1,padding:"14px 16px",borderRight:i<3?"1px solid "+T.border:"none",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:".5px",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"14px 16px 10px",borderBottom:"1px solid "+T.border}}>
        <input type="text" value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search orders..." style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+T.border2,background:T.surface2,color:T.text,fontSize:14}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"6px 8px"}}>
        {list.length===0&&<div style={{padding:"0 16px",color:T.muted}}>No orders found.</div>}
        {list.map(o=>{
          const s=STAT[o.status];
          const d=du(o.examDate);
          const iS=sel?.id===o.id;
          const iU=o.status==="pending"&&d<=5;
          return(
            <div key={o.id} onClick={()=>pick_(o)} style={{...CS,cursor:"pointer",background:iS?T.surface2:T.surface,borderColor:iS?T.accent:T.border,display:"flex",alignItems:"center",gap:16,
              // Removed hover effect for brevity, add if needed
            }}
            >
              <div style={{width:36,height:36,borderRadius:8,background:s.color+"15",color:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:600,color:T.text,marginBottom:2}}>{o.studentName} <span style={{color:T.muted,fontWeight:400}}>({o.school})</span></div>
                <div style={{fontSize:13,color:T.text2}}>{o.courseName}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{fd(o.examDate)}</div>
                <div style={{fontSize:12,color:T.muted}}>{d} days left</div>
              </div>
            </div>
          );
        })}
      </div>

      {sel&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:99,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setSel(null)}>
        <div style={{background:T.bg,borderRadius:14,width:600,maxHeight:"90vh",overflowY:"auto",padding:28,boxShadow:"0 12px 40px "+T.shadow,position:"relative",zIndex:100}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setSel(null)} style={{position:"absolute",top:16,right:16,background:T.surface2,border:"1px solid "+T.border2,borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:T.muted}}>
            &times;
          </button>
          <h2 style={{color:T.text,marginBottom:20}}>Order {sel.orderNumber}</h2>

          <div style={CS}>
            <div style={LS}>Student</div>
            <div style={{fontSize:15,color:T.text,marginBottom:4}}>{sel.studentName} ({sel.studentEmail})</div>
            <div style={{fontSize:13,color:T.muted}}>{sel.school}</div>
          </div>

          <div style={CS}>
            <div style={LS}>Course Details</div>
            <div style={{fontSize:15,color:T.text,marginBottom:4}}>{sel.courseName} ({sel.courseCode})</div>
            <div style={{fontSize:13,color:T.muted}}>{fd(sel.examDate)} ({du(sel.examDate)} days)</div>
            <div style={{fontSize:13,color:T.muted}}>Commitment: {sel.commitment} for {sel.duration} days</div>
          </div>

          <div style={CS}>
            <div style={LS}>Topics</div>
            <div style={{fontSize:14,color:T.text}}>{sel.topics||"N/A"}</div>
          </div>

          {sel.notes&&<div style={CS}>
            <div style={LS}>Notes</div>
            <div style={{fontSize:14,color:T.text}}>{sel.notes}</div>
          </div>}

          {JSON.parse(sel.files).length>0&&<div style={CS}>
            <div style={LS}>Files</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {JSON.parse(sel.files).map((f,i)=><div key={i} style={{background:T.surface2,border:"1px solid "+T.border2,padding:"8px 12px",borderRadius:8,fontSize:13,color:T.text,display:"flex",alignItems:"center",gap:6}}>{FI[f.type]||""} {f.name} <span style={{color:T.muted,fontSize:11}}>({f.size})</span></div>)}
            </div>
          </div>}

          <div style={CS}>
            <div style={LS}>Status</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:STAT[sel.status].color+"15",color:STAT[sel.status].color,padding:"6px 12px",borderRadius:8,fontWeight:600,fontSize:13}}>{STAT[sel.status].label}</div>
              {sel.quoteAmount&&<span style={{fontSize:13,color:T.muted}}>Quoted ${sel.quoteAmount} on {fd(sel.quoteSentAt)}</span>}
              {sel.paidAt&&<span style={{fontSize:13,color:T.muted}}>Paid on {fd(sel.paidAt)}</span>}
            </div>
          </div>

          {sel.status==="pending"&&<div style={CS}>
            <div style={LS}>Quote</div>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount" style={{flex:1,padding:"10px 12px",borderRadius:8,border:"1px solid "+T.border2,background:T.surface2,color:T.text,fontSize:14}}/>
              <button onClick={sendQuote} disabled={busy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.accent,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s",// Removed hover effect for brevity, add if needed
              }}>{busy?"Sending...":"Send Quote"}</button>
            </div>
            <div style={{fontSize:12,color:T.muted,marginBottom:10}}>Suggested: ${sug}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {MODS.map(m=><button key={m.k} onClick={()=>setMods(p=>p.includes(m.k)?p.filter(x=>x!==m.k):[...p,m.k])} style={{padding:"8px 12px",borderRadius:8,border:"1px solid "+(mods.includes(m.k)?T.accent:T.border2),background:mods.includes(m.k)?T.accentBg:T.surface2,color:mods.includes(m.k)?T.accent:T.text,fontWeight:500,cursor:"pointer",fontSize:13}}>{m.i} {m.l}</button>)}
            </div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add internal notes..." style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+T.border2,background:T.surface2,color:T.text,fontSize:14,minHeight:80,marginBottom:10}}/>
            <button onClick={rejectOrder} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.danger,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s",// Removed hover effect for brevity, add if needed
            }}>Reject Order</button>
          </div>}

          {sel.status==="quoted"&&<div style={CS}>
            <div style={LS}>Actions</div>
            <button onClick={markPaid} disabled={busy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.success,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s",marginRight:10}}>{busy?"Updating...":"Mark as Paid"}</button>
            <button onClick={rejectOrder} disabled={busy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.danger,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s"}}>{busy?"Updating...":"Reject Order"}</button>
          </div>}

          {sel.status==="paid"&&<div style={CS}>
            <div style={LS}>Actions</div>
            <button onClick={activateOrder} disabled={busy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.success,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s",marginRight:10}}>{busy?"Updating...":"Activate Order"}</button>
            <button onClick={rejectOrder} disabled={busy} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.danger,color:T.bg,fontWeight:600,cursor:"pointer",fontSize:14,transition:"background .2s"}}>{busy?"Updating...":"Reject Order"}</button>
          </div>}

          <button onClick={() => deleteOrder(sel.id)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, border: "none", background: T.danger, color: T.bg, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Delete Order</button>

          {toast&&<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:toast.e?T.danger:T.success,color:T.bg,padding:"12px 20px",borderRadius:8,fontSize:14,fontWeight:600,zIndex:101,boxShadow:"0 4px 15px rgba(0,0,0,.2)"}}>{toast.m}</div>}
        </div>
      </div>}
    </div>
  );
}
