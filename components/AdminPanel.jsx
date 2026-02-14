"use client";
import { useState } from "react";

const THEMES={
  midnight:{name:"Midnight",icon:"🌙",bg:"#0f1117",surface:"#161922",surface2:"#1a1d28",raised:"#12141c",border:"#1e2330",border2:"#2d3548",borderActive:"#2d3f6b",text:"#f1f5f9",text2:"#e2e8f0",muted:"#94a3b8",dim:"#4a5568",faint:"#374151",accent:"#ecc94b",accentHover:"#d69e2e",accentBg:"#ecc94b12",accentBorder:"#ecc94b30",success:"#22c55e",successBg:"#0f1a10",successBorder:"#1a3b1a",danger:"#f87171",dangerBg:"#1a1010",dangerBorder:"#3b1a1a",info:"#3b82f6",noteBg:"#1a1610",noteBorder:"#3d2e10",noteText:"#ecc94b",scrollbar:"#1e2330",shadow:"rgba(0,0,0,.5)",dk:true},
  oak:{name:"Warm Oak",icon:"🪵",bg:"#faf8f5",surface:"#ffffff",surface2:"#f5f0ea",raised:"#fdf8f3",border:"#e6ddd0",border2:"#d4c8b8",borderActive:"#c8956a",text:"#2d2015",text2:"#3d3025",muted:"#7a6b5a",dim:"#a0917f",faint:"#c4b8a8",accent:"#c8956a",accentHover:"#b07d52",accentBg:"#c8956a12",accentBorder:"#c8956a35",success:"#5a8a3c",successBg:"#f0f7ec",successBorder:"#c8e0b8",danger:"#c45040",dangerBg:"#fef2f0",dangerBorder:"#f0c8c4",info:"#4a7ab5",noteBg:"#fdf5ea",noteBorder:"#e8d4a8",noteText:"#8a6530",scrollbar:"#d4c8b8",shadow:"rgba(0,0,0,.12)",dk:false},
  arctic:{name:"Arctic",icon:"❄️",bg:"#f0f4f8",surface:"#ffffff",surface2:"#e8eef5",raised:"#f5f8fb",border:"#d0dae8",border2:"#b8c8d8",borderActive:"#4a8ad0",text:"#1a2a3a",text2:"#2a3a4a",muted:"#5a7088",dim:"#8098b0",faint:"#b0c0d0",accent:"#2d7ad4",accentHover:"#1a62b8",accentBg:"#2d7ad412",accentBorder:"#2d7ad430",success:"#2a9d5c",successBg:"#ecf8f0",successBorder:"#b0e0c0",danger:"#d43a3a",dangerBg:"#fef0f0",dangerBorder:"#f0c0c0",info:"#2d7ad4",noteBg:"#eff6ff",noteBorder:"#a8c8e8",noteText:"#2d5a8a",scrollbar:"#c0d0e0",shadow:"rgba(0,0,0,.1)",dk:false},
  emerald:{name:"Emerald",icon:"🌲",bg:"#0a120e",surface:"#111c16",surface2:"#152018",raised:"#0e1812",border:"#1a2e22",border2:"#254035",borderActive:"#2a5a40",text:"#e0f0e8",text2:"#c8e0d0",muted:"#78a890",dim:"#4a7060",faint:"#2a4a38",accent:"#4ade80",accentHover:"#22c55e",accentBg:"#4ade8012",accentBorder:"#4ade8030",success:"#4ade80",successBg:"#0a1a10",successBorder:"#1a3a22",danger:"#f87171",dangerBg:"#1a1010",dangerBorder:"#3a1a1a",info:"#60b0f0",noteBg:"#0a1a10",noteBorder:"#2a4a30",noteText:"#4ade80",scrollbar:"#1a2e22",shadow:"rgba(0,0,0,.5)",dk:true},
};

const ORDERS=[
  {id:"ORD-2401",student:"Sarah Kim",email:"sarah.k@ufl.edu",school:"University of Florida",course:"MDC1 — Medical Terminology",code:"MDC1",examType:"Midterm",examDate:"2026-02-18",submitted:"2026-02-10T09:14:00",duration:8,commitment:"2-3hr",topics:"Chapters 1-8, prefixes, suffixes, body systems terminology, medical abbreviations",notes:"I struggle most with cardiovascular and neurological terminology. Would love extra flashcards on those.",files:[{name:"MDC1_Lecture_Slides_Wk1-4.pptx",size:"14.2 MB",type:"pptx"},{name:"My_Handwritten_Notes.pdf",size:"3.8 MB",type:"pdf"},{name:"Practice_Quiz_Ch5.docx",size:"1.1 MB",type:"docx"}],status:"pending",quote:null},
  {id:"ORD-2402",student:"Marcus Thompson",email:"mthompson@osu.edu",school:"Ohio State University",course:"BIOLOGY 1113 — Energy Transfer",code:"BIO1113",examType:"Final",examDate:"2026-02-25",submitted:"2026-02-10T10:32:00",duration:14,commitment:"4-5hr",topics:"Photosynthesis, cellular respiration, ATP synthesis, electron transport chain, fermentation, metabolic pathways",notes:"",files:[{name:"Bio1113_Syllabus.pdf",size:"0.4 MB",type:"pdf"}],status:"pending",quote:null},
  {id:"ORD-2403",student:"Priya Ramanathan",email:"priya.r@nyu.edu",school:"New York University",course:"BIO 101 — Intro Biology",code:"BIO101",examType:"Midterm",examDate:"2026-02-20",submitted:"2026-02-09T22:05:00",duration:10,commitment:"2-3hr",topics:"Cell biology, genetics basics, evolution, ecology fundamentals",notes:"Focus on genetics — I keep confusing Mendelian vs non-Mendelian inheritance patterns.",files:[{name:"Bio101_Midterm_Review_Sheet.pdf",size:"2.1 MB",type:"pdf"},{name:"Lecture_Recording_Notes.docx",size:"5.3 MB",type:"docx"},{name:"Old_Exam_2024.pdf",size:"1.7 MB",type:"pdf"},{name:"Genetics_Diagrams.zip",size:"8.9 MB",type:"zip"}],status:"quoted",quote:{amount:89,sentAt:"2026-02-10T08:00:00",modules:["guide","flash","video","audio","mind","quiz","exam"]}},
  {id:"ORD-2404",student:"Jason Lee",email:"jlee284@psu.edu",school:"Penn State",course:"BIOL 110 — Biology",code:"BIOL110",examType:"Final",examDate:"2026-03-05",submitted:"2026-02-08T16:42:00",duration:21,commitment:"1hr",topics:"Full semester review — molecular biology, genetics, evolution, ecology, anatomy",notes:"Willing to pay more for comprehensive coverage. This is my hardest class.",files:[],status:"paid",quote:{amount:149,sentAt:"2026-02-09T10:15:00",paidAt:"2026-02-09T14:22:00",modules:["guide","flash","video","audio","mind","quiz","exam"]}},
  {id:"ORD-2405",student:"Emily Chen",email:"echen@umich.edu",school:"University of Michigan",course:"CHEM 210 — Organic Chemistry I",code:"CHEM210",examType:"Midterm",examDate:"2026-02-14",submitted:"2026-02-10T11:55:00",duration:4,commitment:"4-5hr",topics:"Functional groups, nomenclature, stereochemistry, reaction mechanisms SN1/SN2/E1/E2",notes:"URGENT — exam is Friday! Need this ASAP. Study Package is fine.",files:[{name:"Chem210_Ch1-6_Notes.pdf",size:"6.2 MB",type:"pdf"},{name:"Reaction_Summary_Sheet.jpg",size:"2.4 MB",type:"jpg"}],status:"pending",quote:null},
];

const STAT={pending:{label:"Pending",color:"#f59e0b",icon:"⏳"},quoted:{label:"Quoted",color:"#3b82f6",icon:"📨"},paid:{label:"Paid",color:"#22c55e",icon:"✅"},active:{label:"Active",color:"#8b5cf6",icon:"📚"},completed:{label:"Done",color:"#64748b",icon:"🎓"},rejected:{label:"Rejected",color:"#ef4444",icon:"✕"}};
const MODS=[{k:"guide",l:"Study Guide",i:"📖"},{k:"flash",l:"Flashcards",i:"🃏"},{k:"video",l:"Video",i:"🎬"},{k:"audio",l:"Audio",i:"🎧"},{k:"mind",l:"Mind Map",i:"🗺️"},{k:"quiz",l:"Quizzes",i:"✅"},{k:"exam",l:"Mock Exam",i:"🎯"}];
const FI={pdf:"📄",pptx:"📊",docx:"📝",zip:"📦",jpg:"🖼️",png:"🖼️"};
const du=d=>Math.max(0,Math.ceil((new Date(d)-new Date())/864e5));
const ta=d=>{const m=Math.floor((Date.now()-new Date(d))/6e4);return m<60?m+"m":m<1440?Math.floor(m/60)+"h":Math.floor(m/1440)+"d"};
const fd=d=>new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const ft=d=>new Date(d).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});

export default function AdminPanel(){
  const[theme,setTheme]=useState("midnight");
  const[pick,setPick]=useState(false);
  const[orders,setOrders]=useState(ORDERS);
  const[filt,setFilt]=useState("all");
  const[sel,setSel]=useState(null);
  const[amt,setAmt]=useState("");
  const[mods,setMods]=useState(MODS.map(m=>m.k));
  const[note,setNote]=useState("");
  const[busy,setBusy]=useState(false);
  const[toast,setToast]=useState(null);
  const[srch,setSrch]=useState("");
  const T=THEMES[theme];

  const msg=(m,e)=>{setToast({m,e});setTimeout(()=>setToast(null),3500)};
  const list=orders.filter(o=>(filt==="all"||o.status===filt)&&(!srch||[o.student,o.course,o.id].some(s=>s.toLowerCase().includes(srch.toLowerCase()))));
  const st={p:orders.filter(o=>o.status==="pending").length,q:orders.filter(o=>o.status==="quoted").length,d:orders.filter(o=>o.status==="paid").length,r:orders.filter(o=>o.quote?.paidAt).reduce((s,o)=>s+o.quote.amount,0),u:orders.filter(o=>o.status==="pending"&&du(o.examDate)<=5).length};

  const pick_=o=>{setSel(o);setAmt(o.quote?.amount||"");setMods(o.quote?.modules||MODS.map(m=>m.k));setNote("")};
  const send=()=>{if(!amt||isNaN(amt))return msg("Enter a valid price",1);setBusy(true);setTimeout(()=>{const q={amount:+amt,sentAt:new Date().toISOString(),modules:mods};setOrders(p=>p.map(o=>o.id===sel.id?{...o,status:"quoted",quote:q}:o));setSel(p=>({...p,status:"quoted",quote:q}));setBusy(false);msg("Quote of $"+amt+" sent to "+sel.email)},1200)};
  const rej=()=>{setOrders(p=>p.map(o=>o.id===sel.id?{...o,status:"rejected"}:o));setSel(p=>({...p,status:"rejected"}));msg(sel.id+" rejected",1)};
  const sug=sel?Math.round((sel.duration<=7?49:sel.duration<=14?79:129)+sel.files.length*5+mods.length*3+((sel.commitment==="4-5hr"||sel.commitment==="6hr+")?15:0)):0;

  const LS={fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginBottom:8};
  const CS={background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:"18px 20px",marginBottom:16,transition:"background .35s"};
  const tr="all .35s";

  return(
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",background:T.bg,color:T.text2,minHeight:"100vh",display:"flex",flexDirection:"column",transition:tr}}>

      {/* HEADER */}
      <header style={{background:T.surface,borderBottom:"1px solid "+T.border,padding:"0 28px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,transition:tr}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,"+T.accent+","+T.accentHover+")",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.dk?"#1a202c":"#fff"} strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span style={{fontWeight:700,fontSize:15,letterSpacing:"1.5px",color:T.text}}>CERTIPREP</span>
          <span style={{fontSize:11,color:T.dim,fontWeight:500}}>ADMIN</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {st.u>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:T.dangerBg,border:"1px solid "+T.dangerBorder,padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:600,color:T.danger,animation:"pulse 2s ease-in-out infinite"}}>🔥 {st.u} urgent</div>}
          {/* THEME PICKER */}
          <div style={{position:"relative"}}>
            <button onClick={()=>setPick(!pick)} aria-label="Change theme" style={{width:36,height:36,borderRadius:10,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,transition:"all .15s"}}
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
          <div style={{width:34,height:34,borderRadius:10,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:T.muted}}>AD</div>
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* LEFT */}
        <div style={{width:420,flexShrink:0,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",background:T.raised,transition:tr}}>
          <div style={{display:"flex",borderBottom:"1px solid "+T.border}}>
            {[{l:"Pending",v:st.p,c:"#f59e0b"},{l:"Quoted",v:st.q,c:T.info},{l:"Paid",v:st.d,c:T.success},{l:"Revenue",v:"$"+st.r,c:T.accent}].map((s,i)=>(
              <div key={i} style={{flex:1,padding:"14px 16px",borderRight:i<3?"1px solid "+T.border:"none",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:800,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
                <div style={{fontSize:10,fontWeight:600,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid "+T.border}}>
            <div style={{position:"relative",marginBottom:10}}>
              <svg style={{position:"absolute",left:10,top:9,opacity:.4}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search orders..." style={{width:"100%",padding:"8px 12px 8px 32px",background:T.surface2,border:"1px solid "+T.border2,borderRadius:8,color:T.text,fontSize:13,fontFamily:"inherit",outline:"none",transition:tr}}/>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {["all","pending","quoted","paid","active"].map(f=>(
                <button key={f} onClick={()=>setFilt(f)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+(filt===f?T.accentBorder:T.border2),background:filt===f?T.accentBg:"transparent",color:filt===f?T.accent:T.dim,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textTransform:"capitalize"}}>
                  {f}{f!=="all"&&<span style={{marginLeft:4,opacity:.6}}>({orders.filter(o=>o.status===f).length})</span>}
                </button>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 8px"}}>
            {list.length===0&&<div style={{padding:40,textAlign:"center",color:T.dim,fontSize:13}}>No orders found.</div>}
            {list.map(o=>{const s=STAT[o.status],d=du(o.examDate),iS=sel?.id===o.id,iU=o.status==="pending"&&d<=5;
              return(<div key={o.id} onClick={()=>pick_(o)} style={{padding:"14px 16px",borderRadius:10,marginBottom:4,cursor:"pointer",transition:"all .15s",background:iS?T.surface:"transparent",border:"1px solid "+(iS?T.borderActive:"transparent"),position:"relative",overflow:"hidden"}}
                onMouseEnter={e=>{if(!iS)e.currentTarget.style.background=T.surface}} onMouseLeave={e=>{if(!iS)e.currentTarget.style.background="transparent"}}>
                {iU&&<div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:T.danger,borderRadius:"0 2px 2px 0"}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div><span style={{fontSize:14,fontWeight:700,color:T.text}}>{o.student}</span><span style={{fontSize:11,color:T.dim,marginLeft:8}}>{o.id}</span></div>
                  <span style={{fontSize:10,fontWeight:700,color:s.color,background:s.color+"15",padding:"3px 8px",borderRadius:5}}>{s.icon} {s.label}</span>
                </div>
                <div style={{fontSize:12,color:T.muted,marginBottom:4,fontWeight:500}}>{o.course}</div>
                <div style={{display:"flex",gap:12,fontSize:11,color:T.dim}}>
                  <span>📅 {fd(o.examDate)}</span>
                  <span style={{color:d<=5?T.danger:T.dim,fontWeight:d<=5?700:400}}>⏰ {d}d</span>
                  <span>📎 {o.files.length}</span>
                  <span style={{marginLeft:"auto"}}>{ta(o.submitted)} ago</span>
                </div>
                {o.quote?.amount&&<div style={{marginTop:6,fontSize:12,fontWeight:700,color:T.accent}}>💰 ${o.quote.amount}</div>}
              </div>)})}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,overflowY:"auto",background:T.bg,transition:tr}}>
          {!sel?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:T.border2,gap:12}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <span style={{fontSize:14,fontWeight:500}}>Select an order to review</span>
            </div>
          ):(
            <div style={{maxWidth:780,margin:"0 auto",padding:"32px 36px 60px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <h1 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>{sel.student}</h1>
                    <span style={{fontSize:11,fontWeight:700,color:STAT[sel.status].color,background:STAT[sel.status].color+"15",padding:"4px 10px",borderRadius:6}}>{STAT[sel.status].icon} {STAT[sel.status].label}</span>
                  </div>
                  <div style={{fontSize:13,color:T.muted}}>{sel.email} · {sel.school}</div>
                </div>
                <button onClick={()=>setSel(null)} style={{background:T.surface2,border:"1px solid "+T.border2,borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:18,fontFamily:"inherit"}}>×</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
                {[{l:"Course",v:sel.code,s:sel.course.split("—")[1]?.trim()||sel.course},{l:"Exam",v:sel.examType,s:fd(sel.examDate)},{l:"Days Left",v:du(sel.examDate),s:du(sel.examDate)<=5?"⚠️ URGENT":"On track",u:du(sel.examDate)<=5},{l:"Duration",v:sel.duration+"d",s:sel.commitment+"/day"}].map((x,i)=>(
                  <div key={i} style={{...CS,marginBottom:0}}>
                    <div style={{...LS,marginBottom:6}}>{x.l}</div>
                    <div style={{fontSize:18,fontWeight:800,color:x.u?T.danger:T.text}}>{x.v}</div>
                    <div style={{fontSize:11,color:x.u?T.danger+"80":T.dim,marginTop:2,fontWeight:x.u?600:400}}>{x.s}</div>
                  </div>
                ))}
              </div>

              {sel.topics&&<div style={CS}><div style={LS}>📋 Topics</div><div style={{fontSize:13,color:T.muted,lineHeight:1.7}}>{sel.topics}</div></div>}
              {sel.notes&&<div style={{background:T.noteBg,border:"1px solid "+T.noteBorder,borderRadius:12,padding:"18px 20px",marginBottom:16,transition:tr}}><div style={{...LS,color:T.noteText}}>💬 Student Notes</div><div style={{fontSize:13,color:T.noteText,lineHeight:1.7,fontStyle:"italic"}}>"{sel.notes}"</div></div>}

              <div style={CS}>
                <div style={LS}>📎 Materials ({sel.files.length})</div>
                {sel.files.length===0?<div style={{fontSize:13,color:T.faint,fontStyle:"italic"}}>No files uploaded.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:6}}>{sel.files.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:T.surface2,borderRadius:8,border:"1px solid "+T.border2,transition:tr}}>
                    <span style={{fontSize:20}}>{FI[f.type]||"📄"}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{f.name}</div><div style={{fontSize:11,color:T.dim}}>{f.size}</div></div>
                    <button style={{background:T.border2,border:"none",borderRadius:6,padding:"5px 10px",color:T.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>View</button>
                    <button style={{background:T.border2,border:"none",borderRadius:6,padding:"5px 10px",color:T.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⬇</button>
                  </div>
                ))}</div>}
              </div>

              {/* QUOTE BUILDER */}
              {(sel.status==="pending"||sel.status==="quoted")&&(
                <div style={{background:T.surface,border:"2px solid "+T.borderActive,borderRadius:16,padding:"24px 28px",marginBottom:24,transition:tr}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,"+T.accent+","+T.accentHover+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💰</div>
                    <div><div style={{fontSize:16,fontWeight:800,color:T.text}}>Quote Builder</div><div style={{fontSize:11,color:T.dim}}>Set price & modules</div></div>
                  </div>
                  <div style={{marginBottom:20}}>
                    <div style={LS}>Modules</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {MODS.map(m=>{const on=mods.includes(m.k);return(
                        <button key={m.k} onClick={()=>setMods(p=>on?p.filter(x=>x!==m.k):[...p,m.k])} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:"1.5px solid "+(on?T.accentBorder:T.border2),background:on?T.accentBg:"transparent",color:on?T.accent:T.dim,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                          <span style={{fontSize:14}}>{m.i}</span>{m.l}{on&&<span style={{fontWeight:800}}>✓</span>}
                        </button>)})}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:16,alignItems:"flex-end",marginBottom:20}}>
                    <div style={{flex:1}}>
                      <div style={LS}>Amount</div>
                      <div style={{position:"relative"}}>
                        <span style={{position:"absolute",left:14,top:12,fontSize:18,fontWeight:800,color:T.dim}}>$</span>
                        <input value={amt} onChange={e=>setAmt(e.target.value.replace(/[^0-9.]/g,""))} placeholder={String(sug)} style={{width:"100%",padding:"12px 14px 12px 32px",background:T.surface2,border:"2px solid "+T.border2,borderRadius:10,color:T.text,fontSize:22,fontWeight:800,fontFamily:"inherit",outline:"none",transition:"border-color .15s"}}/>
                      </div>
                    </div>
                    <div style={{background:T.surface2,border:"1px solid "+T.border2,borderRadius:10,padding:"12px 18px",textAlign:"center"}}>
                      <div style={{fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",marginBottom:4}}>Suggested</div>
                      <div style={{fontSize:20,fontWeight:800,color:T.success}}>${sug}</div>
                    </div>
                  </div>
                  <div style={{marginBottom:20}}>
                    <div style={LS}>Note <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></div>
                    <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Extra flashcards added as requested..." rows={3} style={{width:"100%",padding:"12px 14px",background:T.surface2,border:"1px solid "+T.border2,borderRadius:10,color:T.text2,fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",lineHeight:1.6,transition:tr}}/>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={send} disabled={busy} style={{flex:1,padding:"14px 24px",borderRadius:12,border:"none",background:busy?T.dim:"linear-gradient(135deg,"+T.accent+","+T.accentHover+")",color:T.dk?"#1a202c":"#fff",fontSize:14,fontWeight:800,cursor:busy?"wait":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s",boxShadow:busy?"none":"0 4px 20px "+T.accent+"30"}}>
                      {busy?<><span className="spin" style={{width:16,height:16,border:"2px solid "+(T.dk?"#1a202c40":"#fff4"),borderTopColor:T.dk?"#1a202c":"#fff",borderRadius:"50%",display:"inline-block"}}/> Sending...</>:<>📨 {sel.status==="quoted"?"Resend":"Send"} Quote</>}
                    </button>
                    {sel.status==="pending"&&<button onClick={rej} style={{padding:"14px 20px",borderRadius:12,border:"1px solid "+T.dangerBorder,background:T.dangerBg,color:T.danger,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✕ Reject</button>}
                  </div>
                </div>
              )}

              {sel.status==="paid"&&sel.quote&&(
                <div style={{background:T.successBg,border:"2px solid "+T.successBorder,borderRadius:16,padding:"24px 28px",marginBottom:24}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><span style={{fontSize:28}}>✅</span><div><div style={{fontSize:16,fontWeight:800,color:T.success}}>Paid — ${sel.quote.amount}</div><div style={{fontSize:12,color:T.dim}}>{fd(sel.quote.paidAt)} at {ft(sel.quote.paidAt)}</div></div></div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{padding:"10px 20px",borderRadius:10,border:"none",background:"linear-gradient(135deg,"+T.success+","+T.success+"cc)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚀 Activate Plan</button>
                    <button style={{padding:"10px 20px",borderRadius:10,border:"1px solid "+T.border2,background:"transparent",color:T.muted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📧 Resend</button>
                  </div>
                </div>
              )}

              {sel.status==="rejected"&&<div style={{background:T.dangerBg,border:"2px solid "+T.dangerBorder,borderRadius:16,padding:"24px 28px",marginBottom:24,textAlign:"center"}}><span style={{fontSize:32}}>✕</span><div style={{fontSize:16,fontWeight:800,color:T.danger,marginTop:8}}>Order Rejected</div></div>}

              <div style={CS}>
                <div style={{...LS,marginBottom:14}}>📋 Timeline</div>
                {[{time:sel.submitted,label:"Submitted",icon:"📋",c:T.muted},...(sel.quote?.sentAt?[{time:sel.quote.sentAt,label:"$"+sel.quote.amount+" quoted",icon:"📨",c:T.info}]:[]),...(sel.quote?.paidAt?[{time:sel.quote.paidAt,label:"$"+sel.quote.amount+" paid",icon:"✅",c:T.success}]:[]),...(sel.status==="rejected"?[{time:new Date().toISOString(),label:"Rejected",icon:"✕",c:T.danger}]:[])].map((ev,i,a)=>(
                  <div key={i} style={{display:"flex",gap:14,paddingBottom:i<a.length-1?16:0,position:"relative"}}>
                    {i<a.length-1&&<div style={{position:"absolute",left:12,top:28,width:1,height:"calc(100% - 12px)",background:T.border}}/>}
                    <div style={{width:26,height:26,borderRadius:8,background:ev.c+"18",border:"1px solid "+ev.c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{ev.icon}</div>
                    <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{ev.label}</div><div style={{fontSize:11,color:T.faint}}>{fd(ev.time)} · {ft(ev.time)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast&&<div style={{position:"fixed",bottom:24,right:24,padding:"14px 22px",borderRadius:12,background:toast.e?T.dangerBg:T.successBg,border:"1px solid "+(toast.e?T.dangerBorder:T.successBorder),color:toast.e?T.danger:T.success,fontSize:13,fontWeight:600,fontFamily:"inherit",boxShadow:"0 8px 32px "+T.shadow,animation:"slideUp .3s ease",zIndex:200,display:"flex",alignItems:"center",gap:8}}><span>{toast.e?"❌":"✅"}</span>{toast.m}</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .spin{animation:spin .6s linear infinite}
        *{box-sizing:border-box;margin:0;scrollbar-width:thin;scrollbar-color:${T.scrollbar} transparent}
        input::placeholder,textarea::placeholder{color:${T.faint}}
        input:focus,textarea:focus{border-color:${T.accent}40!important;outline:none}
      `}</style>
    </div>
  );
}
