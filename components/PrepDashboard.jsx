"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════
//  GAMIFICATION ENGINE
// ══════════════════════════════════════════════════
const useGamification = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [toast, setToast] = useState(null);

  const addXp = (amount, reason) => {
    setXp(prev => {
      const next = prev + amount;
      const newLevel = Math.floor(next / 200) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        showToast(`\ud83c\udf1f Level ${newLevel}!`, `You reached Level ${newLevel}`, "#7c3aed");
      }
      return next;
    });
    if (reason) showToast(`+${amount} XP`, reason, "#ecc94b");
  };

  const addBadge = (badge) => {
    setBadges(prev => {
      if (prev.find(b => b.id === badge.id)) return prev;
      showToast(`\ud83c\udfc6 Badge Unlocked!`, badge.name, "#f59e0b");
      return [...prev, badge];
    });
  };

  const showToast = (title, msg, color) => {
    setToast({ title, msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  return { xp, level, streak, setStreak, badges, addXp, addBadge, toast };
};

// ══════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════
const PREP_DATA = {
  title: "Introduction to Microbiology",
  courseCode: "BIO-201", examType: "Midterm", examDate: "2026-02-18",
  student: { initials: "SW" },
  days: [
    { id:1, number:1, title:"Cell Structure & Organization",
      description:"Chapters 1\u20132 \u00b7 Prokaryotic vs Eukaryotic cells, organelles, membrane structure",
      type:"study",
      modules: [
        { id:"m1", type:"guide", title:"Study Guide", desc:"Structured notes covering cell structure fundamentals \u2014 definitions, key diagrams, and clinical applications.", time:"~20 min read", detail:"PDF available", status:"new",
          content: {
            sections: [
              { heading:"Introduction to Cell Structure", body:"All living organisms are composed of cells \u2014 the fundamental units of life. Understanding cell structure is essential for microbiology as it forms the basis for understanding how microorganisms function, replicate, and cause disease.\n\nCells are broadly classified into two categories based on their structural organization: prokaryotic cells and eukaryotic cells.", keyPoint:"Cells are the fundamental unit of all life and are classified as prokaryotic or eukaryotic." },
              { heading:"Prokaryotic vs Eukaryotic Cells", body:"Prokaryotic cells (bacteria, archaea) lack a membrane-bound nucleus. Their DNA exists in a nucleoid region. They are typically 0.1\u201310 \u03bcm in diameter.\n\nEukaryotic cells (fungi, protists, plants, animals) contain a membrane-bound nucleus and complex organelles. They are typically 10\u2013100 \u03bcm in diameter.\n\nKey differences: nucleus presence, organelle complexity, ribosome size (70S vs 80S), cell wall composition, and division method.", keyPoint:"Prokaryotes lack a nucleus; Eukaryotes have membrane-bound organelles." },
              { heading:"Cell Membrane Structure", body:"The cell membrane (plasma membrane) is a phospholipid bilayer with embedded proteins. The fluid mosaic model describes its structure:\n\n\u2022 Phospholipids form the basic bilayer\n\u2022 Integral proteins span the membrane (transport, signaling)\n\u2022 Peripheral proteins attach to the surface\n\u2022 Cholesterol modulates fluidity (eukaryotes)\n\u2022 Glycoproteins and glycolipids face outward for recognition", keyPoint:"The fluid mosaic model: phospholipid bilayer + embedded proteins." },
              { heading:"Key Organelles", body:"Nucleus: Contains DNA, site of transcription. Double membrane with nuclear pores.\n\nMitochondria: ATP production via oxidative phosphorylation. Has its own circular DNA.\n\nEndoplasmic Reticulum: Rough ER (ribosomes, protein synthesis) and Smooth ER (lipid synthesis, detox).\n\nGolgi Apparatus: Protein modification, sorting, and packaging.\n\nRibosomes: 80S in eukaryotes (60S+40S), 70S in prokaryotes (50S+30S).", keyPoint:"Know each organelle's primary function and structural features." },
              { heading:"Clinical Significance", body:"Many antibiotics target specific prokaryotic structures:\n\n\u2022 \u03b2-lactams target cell wall synthesis (peptidoglycan)\n\u2022 Aminoglycosides target 30S ribosomal subunit\n\u2022 Macrolides target 50S ribosomal subunit\n\u2022 Fluoroquinolones target DNA gyrase\n\nThese drugs exploit structural differences between prokaryotic and eukaryotic cells to selectively kill bacteria.", keyPoint:"Antibiotics exploit structural differences between prokaryotes and eukaryotes." }
            ],
            keyTerms: ["Prokaryote","Eukaryote","Phospholipid bilayer","Nucleoid","Organelle","Ribosome (70S/80S)","Peptidoglycan","Fluid mosaic model","Mitochondria","Golgi apparatus"]
          }
        },
        { id:"m2", type:"flashcards", title:"Flashcards", desc:"40 cards on organelle functions, membrane components, and comparisons.", time:"40 cards", detail:"Spaced repetition", status:"new",
          content: {
            cards: [
              { id:"c1", front:"What is the primary function of mitochondria?", back:"ATP production through oxidative phosphorylation. Often called the 'powerhouse of the cell'. Contains its own circular DNA.", difficulty:0, lastSeen:null },
              { id:"c2", front:"What size are prokaryotic ribosomes?", back:"70S ribosomes (50S + 30S subunits). Key difference from eukaryotic 80S ribosomes. This is why certain antibiotics can target bacteria without harming human cells.", difficulty:0, lastSeen:null },
              { id:"c3", front:"What is peptidoglycan?", back:"A polymer of sugars and amino acids forming the bacterial cell wall. Target of \u03b2-lactam antibiotics like penicillin. Absent in eukaryotic cells.", difficulty:0, lastSeen:null },
              { id:"c4", front:"Describe the fluid mosaic model.", back:"Cell membrane = phospholipid bilayer with embedded proteins that move laterally. Components: integral proteins, peripheral proteins, cholesterol, glycoproteins.", difficulty:0, lastSeen:null },
              { id:"c5", front:"Gram-positive vs Gram-negative bacteria?", back:"Gram+: thick peptidoglycan, no outer membrane, stains purple.\nGram\u2013: thin peptidoglycan, outer membrane with LPS, stains pink.\nClinically important for antibiotic selection.", difficulty:0, lastSeen:null },
              { id:"c6", front:"Function of the Golgi apparatus?", back:"Modifies, sorts, and packages proteins/lipids for secretion or delivery. Think of it as the cell's 'post office'. Produces lysosomes.", difficulty:0, lastSeen:null },
              { id:"c7", front:"What is the nucleoid?", back:"Region in prokaryotic cells where circular DNA is concentrated. NOT membrane-bound (unlike eukaryotic nucleus). Contains a single chromosome.", difficulty:0, lastSeen:null },
              { id:"c8", front:"Name 3 antibiotics that target prokaryotic ribosomes.", back:"1. Aminoglycosides \u2192 30S subunit\n2. Macrolides (erythromycin) \u2192 50S subunit\n3. Tetracyclines \u2192 30S subunit\n\nAll exploit the 70S vs 80S difference.", difficulty:0, lastSeen:null },
              { id:"c9", front:"What is the function of Rough ER?", back:"Studded with ribosomes. Synthesizes proteins destined for secretion, membrane insertion, or organelle delivery. Continuous with nuclear envelope.", difficulty:0, lastSeen:null },
              { id:"c10", front:"What are the components of the bacterial cell envelope?", back:"Inner membrane (plasma membrane) + cell wall (peptidoglycan) + outer membrane (Gram-negative only, contains LPS). Capsule may surround everything.", difficulty:0, lastSeen:null }
            ]
          }
        },
        { id:"m3", type:"video", title:"Video Overview", desc:"Concise walkthrough of cell structure with annotated diagrams.", time:"12 min", detail:"Video", status:"new",
          content: { videoUrl:"https://www.youtube.com/embed/URUJD5NEXC8", title:"Cell Structure Overview", chapters:[{t:"0:00",l:"Introduction"},{t:"2:15",l:"Prokaryotes"},{t:"5:30",l:"Eukaryotes"},{t:"8:00",l:"Membrane"},{t:"10:30",l:"Clinical"}] }
        },
        { id:"m4", type:"audio", title:"Audio Summary", desc:"Narrated key concepts for on-the-go review.", time:"8 min", detail:"MP3 download", status:"new",
          content: { duration:"8:24" }
        },
        { id:"m5", type:"mindmap", title:"Mind Map", desc:"Visual roadmap connecting all concepts.", time:"Interactive", detail:"PDF export", status:"new",
          content: { center:"Cell Structure", branches:[
            {label:"Prokaryotic",children:["No nucleus","Nucleoid region","70S ribosomes","Peptidoglycan wall","Binary fission"]},
            {label:"Eukaryotic",children:["Membrane-bound nucleus","80S ribosomes","Complex organelles","Mitosis/Meiosis"]},
            {label:"Membrane",children:["Phospholipid bilayer","Integral proteins","Fluid mosaic model","Cholesterol"]},
            {label:"Organelles",children:["Mitochondria","ER (Rough/Smooth)","Golgi apparatus","Ribosomes","Lysosomes"]},
            {label:"Clinical",children:["\u03b2-lactams","Aminoglycosides","Macrolides","Fluoroquinolones"]}
          ]}
        },
        { id:"m6", type:"quiz", title:"Daily Quiz", desc:"15-question assessment with instant feedback and explanations.", time:"15 questions", detail:"~10 min", status:"locked", lockMsg:"Complete study guide first",
          content: {
            questions: [
              { q:"Which cell type lacks a membrane-bound nucleus?", opts:["Eukaryotic","Prokaryotic","Both","Neither"], correct:1, exp:"Prokaryotic cells (bacteria, archaea) lack a membrane-bound nucleus. DNA is in the nucleoid.", topic:"Cell Types", difficulty:"easy" },
              { q:"Eukaryotic ribosomes are what size?", opts:["50S","70S","80S","100S"], correct:2, exp:"Eukaryotic = 80S (60S+40S). Prokaryotic = 70S (50S+30S).", topic:"Ribosomes", difficulty:"easy" },
              { q:"Which antibiotic class targets cell wall synthesis?", opts:["\u03b2-lactams","Aminoglycosides","Macrolides","Fluoroquinolones"], correct:0, exp:"\u03b2-lactams (penicillin) inhibit peptidoglycan synthesis.", topic:"Clinical", difficulty:"medium" },
              { q:"The fluid mosaic model describes:", opts:["Cell wall","Nucleus","Cell membrane","Ribosome"], correct:2, exp:"Describes the cell membrane as a phospholipid bilayer with mobile embedded proteins.", topic:"Membrane", difficulty:"easy" },
              { q:"Which organelle modifies and packages proteins?", opts:["Rough ER","Smooth ER","Golgi apparatus","Lysosome"], correct:2, exp:"Golgi = cell's 'post office' for protein processing and delivery.", topic:"Organelles", difficulty:"easy" },
              { q:"Gram-negative bacteria have:", opts:["Thick peptidoglycan only","Thin peptidoglycan + outer membrane","No cell wall","Cellulose wall"], correct:1, exp:"Gram\u2013 = thin peptidoglycan + outer membrane with LPS. Stains pink.", topic:"Cell Types", difficulty:"medium" },
              { q:"Mitochondria produce ATP primarily through:", opts:["Glycolysis","Fermentation","Oxidative phosphorylation","Photosynthesis"], correct:2, exp:"Mitochondria are the site of oxidative phosphorylation (electron transport chain).", topic:"Organelles", difficulty:"medium" },
              { q:"Which targets the 30S ribosomal subunit?", opts:["Penicillin","Aminoglycosides","Vancomycin","Metronidazole"], correct:1, exp:"Aminoglycosides (and tetracyclines) target the 30S subunit of prokaryotic ribosomes.", topic:"Clinical", difficulty:"hard" },
              { q:"Smooth ER is primarily involved in:", opts:["Protein synthesis","Lipid synthesis and detox","DNA replication","Cell division"], correct:1, exp:"Smooth ER lacks ribosomes and functions in lipid synthesis and detoxification.", topic:"Organelles", difficulty:"medium" },
              { q:"Prokaryotic cells typically divide by:", opts:["Mitosis","Meiosis","Binary fission","Budding"], correct:2, exp:"Binary fission: DNA replicates, cell elongates, divides into two identical cells.", topic:"Cell Types", difficulty:"easy" }
            ]
          }
        }
      ]
    },
    { id:2, number:2, title:"Bacteria Classification", description:"Chapter 3 \u00b7 Gram staining, morphology, growth", type:"study", modules:[] },
    { id:3, number:3, title:"Viruses & Viral Replication", description:"Chapter 4 \u00b7 Viral structure, replication cycles", type:"study", modules:[] },
    { id:4, number:4, title:"Fungi, Parasites & Prions", description:"Chapter 5 \u00b7 Fungal infections, parasitic lifecycles", type:"study", modules:[] },
    { id:5, number:5, title:"Immunology Fundamentals", description:"Chapters 6\u20137 \u00b7 Innate vs adaptive immunity", type:"study", modules:[] },
    { id:6, number:6, title:"Microbial Genetics", description:"Chapter 8 \u00b7 DNA replication, mutations", type:"study", modules:[] },
    { id:7, number:7, title:"Comprehensive Review", description:"All chapters \u00b7 Cumulative flashcards, weak areas", type:"review", modules:[] },
    { id:8, number:8, title:"Mock Exam \u2014 Full Simulation", description:"50 questions \u00b7 Timed \u00b7 Mirrors midterm", type:"exam", modules:[] }
  ]
};

const TH = {
  guide:{icon:"\ud83d\udcd6",bg:"linear-gradient(135deg,#eff6ff,#dbeafe)",accent:"#2563eb",accentBg:"#dbeafe",accentLight:"#eff6ff"},
  flashcards:{icon:"\ud83c\udccf",bg:"linear-gradient(135deg,#f5f3ff,#ede9fe)",accent:"#7c3aed",accentBg:"#ede9fe",accentLight:"#f5f3ff"},
  video:{icon:"\ud83c\udfac",bg:"linear-gradient(135deg,#fef2f2,#fee2e2)",accent:"#dc2626",accentBg:"#fee2e2",accentLight:"#fef2f2"},
  audio:{icon:"\ud83c\udfa7",bg:"linear-gradient(135deg,#fffbeb,#fef3c7)",accent:"#d97706",accentBg:"#fef3c7",accentLight:"#fffbeb"},
  mindmap:{icon:"\ud83d\uddfa\ufe0f",bg:"linear-gradient(135deg,#eef2ff,#e0e7ff)",accent:"#4f46e5",accentBg:"#e0e7ff",accentLight:"#eef2ff"},
  quiz:{icon:"\u2705",bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)",accent:"#16a34a",accentBg:"#dcfce7",accentLight:"#f0fdf4"}
};
const B={headerBg:"#4a5568",headerDark:"#2d3748",gold:"#ecc94b",goldHover:"#d69e2e",goldBg:"#fefcbf",goldBgSoft:"#fffff0",dark:"#1a202c",text:"#2d3748",muted:"#718096",light:"#a0aec0",border:"#e2e8f0",borderL:"#edf2f7",bg:"#f7fafc",card:"#ffffff"};
function daysUntil(d){return Math.max(0,Math.ceil((new Date(d)-new Date())/864e5))}

// ══════════════════════════════════════════════════
//  STUDY GUIDE — Enhanced
// ══════════════════════════════════════════════════
function StudyGuidePanel({mod,onComplete,gam}){
  const[readPct,setReadPct]=useState(0);
  const[bookmarks,setBookmarks]=useState({});
  const[highlights,setHighlights]=useState({});
  const[search,setSearch]=useState("");
  const[activeSection,setActiveSection]=useState(0);
  const ref=useRef(null);
  const c=mod.content;

  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const h=()=>{const p=Math.min(100,Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight))*100));setReadPct(p||0)};
    el.addEventListener("scroll",h);return()=>el.removeEventListener("scroll",h);
  },[]);

  const toggleBookmark=(i)=>setBookmarks(p=>({...p,[i]:!p[i]}));
  const toggleHighlight=(i)=>setHighlights(p=>({...p,[i]:!p[i]}));

  const filtered = search ? c.sections.filter(s=>s.heading.toLowerCase().includes(search.toLowerCase())||s.body.toLowerCase().includes(search.toLowerCase())) : c.sections;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Reading progress */}
      <div style={{height:3,background:B.borderL,flexShrink:0}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#2563eb,#60a5fa)",width:`${readPct}%`,transition:"width .15s",borderRadius:99}}/>
      </div>

      {/* Toolbar */}
      <div style={{padding:"12px 20px",borderBottom:`1px solid ${B.borderL}`,display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"#fafbfc"}}>
        <div style={{flex:1,position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search this guide..." style={{width:"100%",padding:"8px 12px 8px 32px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:13,fontFamily:"inherit",background:B.card,outline:"none"}}/>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:B.light}}>\ud83d\udd0d</span>
        </div>
        <div style={{display:"flex",gap:4}}>
          {c.sections.map((_,i)=>(
            <button key={i} onClick={()=>setActiveSection(i)} style={{width:24,height:24,borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",background:i===activeSection?"#2563eb":B.borderL,color:i===activeSection?"#fff":B.muted,transition:"all .15s"}}>{i+1}</button>
          ))}
        </div>
      </div>

      <div ref={ref} style={{flex:1,overflowY:"auto",padding:"24px 28px 48px"}}>
        {/* Key terms */}
        {c.keyTerms&&(
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:14,padding:"14px 18px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,color:"#2563eb",textTransform:"uppercase",letterSpacing:".8px",marginBottom:8}}>Key Terms for This Section</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {c.keyTerms.map((t,i)=><span key={i} style={{fontSize:11.5,fontWeight:600,color:"#1e40af",background:"#dbeafe",padding:"3px 11px",borderRadius:20,cursor:"default"}}>{t}</span>)}
            </div>
          </div>
        )}

        {/* Sections */}
        {filtered.map((s,i)=>{
          const isBookmarked=bookmarks[i];
          const isHighlighted=highlights[i];
          return(
            <div key={i} style={{marginBottom:28,padding:20,borderRadius:14,border:`1px solid ${isHighlighted?"#fbbf24":B.borderL}`,background:isHighlighted?"#fffdf7":B.card,transition:"all .2s"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <span style={{width:28,height:28,borderRadius:8,background:"#dbeafe",color:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <h2 style={{fontSize:19,fontWeight:700,color:B.dark,margin:0,flex:1,lineHeight:1.3}}>{s.heading}</h2>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>toggleHighlight(i)} title="Highlight" style={{width:28,height:28,borderRadius:6,border:"none",cursor:"pointer",background:isHighlighted?"#fef3c7":"transparent",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {isHighlighted?"\ud83d\udfe1":"\u2b50"}
                  </button>
                  <button onClick={()=>toggleBookmark(i)} title="Bookmark" style={{width:28,height:28,borderRadius:6,border:"none",cursor:"pointer",background:isBookmarked?"#fee2e2":"transparent",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {isBookmarked?"\u2764\ufe0f":"\ud83d\uddd8"}
                  </button>
                </div>
              </div>
              {s.body.split("\n\n").map((p,j)=>(
                <p key={j} style={{fontSize:14.5,color:B.text,lineHeight:1.85,margin:0,marginBottom:10,...(p.startsWith("\u2022")?{paddingLeft:8}:{})}}>{p}</p>
              ))}
              {/* Key Point callout */}
              {s.keyPoint&&(
                <div style={{marginTop:12,padding:"12px 16px",borderRadius:10,background:"linear-gradient(135deg,#eff6ff,#dbeafe)",border:"1px solid #bfdbfe",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,flexShrink:0}}>💡</span>
                  <div><div style={{fontSize:11,fontWeight:700,color:"#2563eb",marginBottom:2}}>REMEMBER THIS</div><div style={{fontSize:13,color:"#1e40af",lineHeight:1.5,fontWeight:500}}>{s.keyPoint}</div></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Summary box */}
        <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #bbf7d0",borderRadius:14,padding:"20px",marginTop:8}}>
          <div style={{fontSize:12,fontWeight:700,color:"#166534",textTransform:"uppercase",letterSpacing:".8px",marginBottom:8}}>\ud83c\udfaf Section Summary</div>
          <ul style={{margin:0,paddingLeft:20}}>
            {c.sections.map((s,i)=>s.keyPoint&&<li key={i} style={{fontSize:13,color:"#166534",lineHeight:1.7,marginBottom:4}}>{s.keyPoint}</li>)}
          </ul>
        </div>

        <button onClick={()=>{onComplete();gam.addXp(50,"Study guide completed");}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:15,fontWeight:700,boxShadow:`0 4px 14px ${B.gold}40`,marginTop:20}}>Mark as Complete (+50 XP) \u2713</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  FLASHCARDS — Enhanced (Learn, Review, Match modes)
// ══════════════════════════════════════════════════
function FlashcardsPanel({mod,onComplete,gam}){
  const cards=mod.content.cards;
  const[mode,setMode]=useState(null); // null=menu, "learn","review","match"
  const[idx,setIdx]=useState(0);
  const[flipped,setFlipped]=useState(false);
  const[ratings,setRatings]=useState({});
  const[matchCards,setMatchCards]=useState([]);
  const[matchSelected,setMatchSelected]=useState([]);
  const[matchMatched,setMatchMatched]=useState([]);
  const[matchTime,setMatchTime]=useState(0);
  const[matchRunning,setMatchRunning]=useState(false);
  const[learnInput,setLearnInput]=useState("");
  const[learnRevealed,setLearnRevealed]=useState(false);
  const[learnScore,setLearnScore]=useState({correct:0,wrong:0});

  // Match game timer
  useEffect(()=>{
    if(!matchRunning)return;
    const iv=setInterval(()=>setMatchTime(t=>t+1),1000);
    return()=>clearInterval(iv);
  },[matchRunning]);

  const initMatch=()=>{
    const subset=cards.slice(0,5);
    const pairs=[...subset.map((c,i)=>({id:`q${i}`,text:c.front.slice(0,40)+(c.front.length>40?"...":""),pairId:i,type:"q"})),...subset.map((c,i)=>({id:`a${i}`,text:c.back.split(".")[0].slice(0,40),pairId:i,type:"a"}))];
    setMatchCards(pairs.sort(()=>Math.random()-.5));
    setMatchSelected([]);setMatchMatched([]);setMatchTime(0);setMatchRunning(true);setMode("match");
  };

  const handleMatch=(card)=>{
    if(matchMatched.includes(card.pairId))return;
    const newSel=[...matchSelected,card];
    setMatchSelected(newSel);
    if(newSel.length===2){
      if(newSel[0].pairId===newSel[1].pairId&&newSel[0].type!==newSel[1].type){
        setMatchMatched(p=>[...p,newSel[0].pairId]);
        if(matchMatched.length+1===5){setMatchRunning(false);gam.addXp(30,"Match game completed");}
      }
      setTimeout(()=>setMatchSelected([]),400);
    }
  };

  const rate=(r)=>{
    setRatings(p=>({...p,[idx]:r}));setFlipped(false);
    const xpMap={easy:5,medium:3,hard:1};
    gam.addXp(xpMap[r],null);
    setTimeout(()=>{if(idx<cards.length-1)setIdx(idx+1)},200);
  };

  const checkLearn=()=>{
    setLearnRevealed(true);
    const correct=cards[idx].back.toLowerCase().includes(learnInput.toLowerCase().trim())&&learnInput.trim().length>3;
    if(correct){setLearnScore(p=>({...p,correct:p.correct+1}));gam.addXp(8,null);}
    else setLearnScore(p=>({...p,wrong:p.wrong+1}));
  };

  const nextLearn=()=>{
    setLearnRevealed(false);setLearnInput("");
    if(idx<cards.length-1)setIdx(idx+1);
    else setMode("learn-done");
  };

  // Mode menu
  if(!mode)return(
    <div style={{padding:"32px 28px",display:"flex",flexDirection:"column",height:"100%"}}>
      <h3 style={{fontSize:20,fontWeight:700,color:B.dark,marginBottom:6}}>Choose Study Mode</h3>
      <p style={{fontSize:14,color:B.muted,marginBottom:24}}>{cards.length} cards in this deck</p>
      {[
        {id:"review",icon:"\ud83c\udccf",title:"Classic Review",desc:"Flip cards and rate difficulty. Spaced repetition adapts to your ratings.",badge:"+5 XP/card",color:"#7c3aed"},
        {id:"learn",icon:"\ud83c\udf93",title:"Learn Mode",desc:"Type your answer before revealing. Tests active recall \u2014 the most effective study method.",badge:"+8 XP/card",color:"#2563eb"},
        {id:"match-init",icon:"\u26a1",title:"Match Game",desc:"Race the clock to match terms with definitions. Timed challenge for fast recall.",badge:"+30 XP",color:"#d97706"}
      ].map(m=>(
        <button key={m.id} onClick={()=>m.id==="match-init"?initMatch():setMode(m.id)} style={{
          display:"flex",gap:16,alignItems:"center",padding:"18px 20px",borderRadius:14,
          border:`1.5px solid ${B.border}`,background:B.card,cursor:"pointer",fontFamily:"inherit",
          textAlign:"left",marginBottom:12,transition:"all .2s"
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"60";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${m.color}12`}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}
        >
          <div style={{width:48,height:48,borderRadius:12,background:`${m.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{m.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:B.dark}}>{m.title}</div>
            <div style={{fontSize:12.5,color:B.muted,marginTop:3,lineHeight:1.5}}>{m.desc}</div>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:m.color,background:`${m.color}12`,padding:"4px 10px",borderRadius:6,flexShrink:0}}>{m.badge}</span>
        </button>
      ))}
    </div>
  );

  // Match game
  if(mode==="match")return(
    <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={()=>{setMode(null);setMatchRunning(false)}} style={{background:"none",border:"none",cursor:"pointer",color:B.muted,fontSize:13,fontFamily:"inherit"}}>\u2190 Back</button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:matchRunning?B.dark:"#38a169"}}>{Math.floor(matchTime/60)}:{String(matchTime%60).padStart(2,"0")}</span>
        <span style={{fontSize:13,fontWeight:600,color:"#7c3aed"}}>{matchMatched.length}/5 matched</span>
      </div>
      {!matchRunning&&matchMatched.length===5?(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>\ud83c\udf89</div>
          <h3 style={{fontSize:22,fontWeight:700,color:B.dark,marginBottom:6}}>All Matched!</h3>
          <p style={{fontSize:16,color:B.muted}}>Time: {Math.floor(matchTime/60)}:{String(matchTime%60).padStart(2,"0")}</p>
          <button onClick={()=>setMode(null)} style={{marginTop:20,padding:"12px 28px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Back to Modes</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,flex:1,alignContent:"start"}}>
          {matchCards.map(card=>{
            const matched=matchMatched.includes(card.pairId);
            const selected=matchSelected.find(s=>s.id===card.id);
            return(
              <button key={card.id} onClick={()=>!matched&&handleMatch(card)} style={{
                padding:"14px",borderRadius:12,border:`2px solid ${matched?"#c6f6d5":selected?"#7c3aed":B.border}`,
                background:matched?"#f0fff4":selected?"#f5f3ff":B.card,
                color:matched?"#38a169":B.text,fontSize:12.5,fontWeight:500,cursor:matched?"default":"pointer",
                fontFamily:"inherit",textAlign:"left",lineHeight:1.5,transition:"all .2s",
                opacity:matched?.6:1,minHeight:60
              }}>{card.text}</button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Learn mode
  if(mode==="learn")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"28px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <button onClick={()=>setMode(null)} style={{background:"none",border:"none",cursor:"pointer",color:B.muted,fontSize:13,fontFamily:"inherit"}}>\u2190 Back</button>
        <span style={{fontSize:13,fontWeight:600,color:B.muted}}>Card {idx+1}/{cards.length}</span>
        <span style={{fontSize:13,fontWeight:700,color:"#2563eb"}}>{learnScore.correct}\u2713 {learnScore.wrong}\u2717</span>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:24}}>
        {cards.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:i<idx?"#48bb78":i===idx?"#2563eb":B.borderL,transition:"all .3s"}}/>)}
      </div>
      <div style={{background:B.card,borderRadius:16,border:`1.5px solid ${B.border}`,padding:"28px 24px",marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:B.light,textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Question</div>
        <div style={{fontSize:17,fontWeight:600,color:B.dark,lineHeight:1.6}}>{cards[idx].front}</div>
      </div>
      {!learnRevealed?(
        <>
          <textarea value={learnInput} onChange={e=>setLearnInput(e.target.value)} placeholder="Type your answer..." style={{width:"100%",minHeight:100,padding:"14px 16px",borderRadius:12,border:`1.5px solid ${B.border}`,fontSize:14,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.6}}/>
          <div style={{display:"flex",gap:10,marginTop:12}}>
            <button onClick={checkLearn} disabled={!learnInput.trim()} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:learnInput.trim()?`linear-gradient(135deg,${B.gold},${B.goldHover})`:B.borderL,color:learnInput.trim()?B.dark:B.light,fontSize:14,fontWeight:700,cursor:learnInput.trim()?"pointer":"default",fontFamily:"inherit"}}>Check Answer</button>
            <button onClick={()=>setLearnRevealed(true)} style={{padding:"14px 20px",borderRadius:12,border:`1px solid ${B.border}`,background:B.card,color:B.muted,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Reveal</button>
          </div>
        </>
      ):(
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{background:"#f0fdf4",border:"1px solid #c6f6d5",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:6}}>Correct Answer</div>
            <div style={{fontSize:14,color:"#166534",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{cards[idx].back}</div>
          </div>
          <button onClick={nextLearn} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{idx<cards.length-1?"Next Card \u2192":"See Results"}</button>
        </div>
      )}
    </div>
  );

  if(mode==="learn-done")return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center",padding:32}}>
      <div style={{fontSize:48,marginBottom:12}}>\ud83c\udf93</div>
      <h3 style={{fontSize:22,fontWeight:700,color:B.dark,marginBottom:8}}>Learn Mode Complete!</h3>
      <p style={{fontSize:15,color:B.muted,marginBottom:20}}>{learnScore.correct} correct, {learnScore.wrong} to review</p>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>{setMode(null);setIdx(0);setLearnScore({correct:0,wrong:0})}} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${B.border}`,background:B.card,color:B.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Try Another Mode</button>
        <button onClick={()=>{onComplete();gam.addXp(40,"Flashcards completed")}} style={{padding:"12px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Complete (+40 XP)</button>
      </div>
    </div>
  );

  // Classic review
  const rated=Object.keys(ratings).length;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"28px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <button onClick={()=>setMode(null)} style={{background:"none",border:"none",cursor:"pointer",color:B.muted,fontSize:13,fontFamily:"inherit"}}>\u2190 Back</button>
        <span style={{fontSize:13,fontWeight:600,color:B.muted}}>Card {idx+1}/{cards.length}</span>
        <span style={{fontSize:13,fontWeight:700,color:"#7c3aed"}}>{rated} rated</span>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:24}}>
        {cards.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:ratings[i]==="easy"?"#48bb78":ratings[i]==="medium"?"#ecc94b":ratings[i]==="hard"?"#e53e3e":i===idx?"#7c3aed":B.borderL,transition:"all .3s"}}/>)}
      </div>
      <div onClick={()=>setFlipped(!flipped)} style={{flex:1,background:B.card,borderRadius:20,border:`2px solid ${flipped?"#7c3aed":B.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 32px",cursor:"pointer",textAlign:"center",position:"relative",boxShadow:flipped?"0 8px 32px rgba(124,58,237,.1)":"0 2px 12px rgba(0,0,0,.04)",transition:"all .3s"}}>
        <div style={{position:"absolute",top:16,left:20,fontSize:10,fontWeight:700,color:flipped?"#7c3aed":B.light,textTransform:"uppercase",letterSpacing:"1px"}}>{flipped?"Answer":"Question"}</div>
        <div style={{fontSize:flipped?15:17,fontWeight:flipped?500:600,color:flipped?B.text:B.dark,lineHeight:1.7,maxWidth:440,whiteSpace:"pre-wrap"}}>{flipped?cards[idx].back:cards[idx].front}</div>
        {!flipped&&<div style={{marginTop:16,fontSize:13,color:B.light}}>Tap to reveal</div>}
      </div>
      {flipped&&(
        <div style={{display:"flex",gap:10,marginTop:16,animation:"fadeUp .3s ease"}}>
          {[{l:"Hard",c:"#e53e3e",bg:"#fff5f5"},{l:"Medium",c:"#d69e2e",bg:"#fffff0"},{l:"Easy",c:"#38a169",bg:"#f0fff4"}].map(r=>(
            <button key={r.l} onClick={()=>rate(r.l.toLowerCase())} style={{flex:1,padding:"14px",borderRadius:12,border:`2px solid ${r.c}22`,background:r.bg,color:r.c,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=r.c} onMouseLeave={e=>e.currentTarget.style.borderColor=r.c+"22"}
            >{r.l}</button>
          ))}
        </div>
      )}
      {!flipped&&idx>0&&<button onClick={()=>{setIdx(idx-1);setFlipped(false)}} style={{marginTop:12,padding:"10px",borderRadius:10,border:`1px solid ${B.border}`,background:B.card,color:B.muted,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>\u2190 Previous</button>}
      {rated===cards.length&&<button onClick={()=>{onComplete();gam.addXp(40,"Flashcards completed")}} style={{marginTop:12,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 14px ${B.gold}40`}}>Complete (+40 XP) \u2713</button>}
    </div>
  );
}

// ══════════════════════════════════════════════════
//  QUIZ — Enhanced
// ══════════════════════════════════════════════════
function QuizPanel({mod,onComplete,gam}){
  const qs=mod.content.questions;
  const[mode,setMode]=useState(null); // null=menu, "standard","timed"
  const[idx,setIdx]=useState(0);
  const[sel,setSel]=useState(null);
  const[revealed,setRevealed]=useState(false);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const[answers,setAnswers]=useState([]);
  const[timer,setTimer]=useState(0);
  const[reviewing,setReviewing]=useState(false);

  useEffect(()=>{
    if(mode!=="timed"||done)return;
    const iv=setInterval(()=>setTimer(t=>t+1),1000);
    return()=>clearInterval(iv);
  },[mode,done]);

  const submit=()=>{
    setRevealed(true);
    const correct=sel===qs[idx].correct;
    if(correct){setScore(s=>s+1);gam.addXp(10,null);}
    setAnswers(a=>[...a,{selected:sel,correct}]);
  };
  const next=()=>{
    if(idx<qs.length-1){setIdx(idx+1);setSel(null);setRevealed(false);}
    else{setDone(true);gam.addXp(30,"Quiz completed");}
  };

  if(!mode)return(
    <div style={{padding:"32px 28px"}}>
      <h3 style={{fontSize:20,fontWeight:700,color:B.dark,marginBottom:6}}>Daily Quiz</h3>
      <p style={{fontSize:14,color:B.muted,marginBottom:24}}>{qs.length} questions covering today's material</p>
      {[
        {id:"standard",icon:"\ud83d\udcdd",title:"Standard Mode",desc:"Take your time. Immediate feedback after each question.",color:"#16a34a"},
        {id:"timed",icon:"\u23f1\ufe0f",title:"Timed Challenge",desc:"Race the clock. See how quickly you can answer correctly.",color:"#dc2626"}
      ].map(m=>(
        <button key={m.id} onClick={()=>setMode(m.id)} style={{display:"flex",gap:16,alignItems:"center",padding:"18px 20px",borderRadius:14,border:`1.5px solid ${B.border}`,background:B.card,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:12,width:"100%",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"60";e.currentTarget.style.transform="translateY(-2px)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.transform="none"}}
        >
          <div style={{fontSize:28}}>{m.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:B.dark}}>{m.title}</div>
            <div style={{fontSize:12.5,color:B.muted,marginTop:2}}>{m.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );

  if(done&&!reviewing){
    const pct=Math.round((score/qs.length)*100);
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"32px",textAlign:"center"}}>
        <div style={{width:120,height:120,borderRadius:"50%",border:`6px solid ${pct>=80?"#48bb78":pct>=60?B.gold:"#e53e3e"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:B.card,marginBottom:20}}>
          <div style={{fontSize:32,fontWeight:700,color:B.dark}}>{pct}%</div>
          <div style={{fontSize:11,fontWeight:600,color:pct>=80?"#38a169":pct>=60?B.goldHover:"#e53e3e"}}>{pct>=80?"Excellent!":pct>=60?"Good":pct>=40?"Needs work":"Review material"}</div>
        </div>
        <h3 style={{fontSize:20,fontWeight:700,color:B.dark,marginBottom:4}}>Quiz Complete</h3>
        <p style={{fontSize:14,color:B.muted,marginBottom:4}}>{score}/{qs.length} correct</p>
        {mode==="timed"&&<p style={{fontSize:13,color:B.light,marginBottom:20}}>Time: {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</p>}

        {/* Topic breakdown */}
        <div style={{width:"100%",background:B.card,borderRadius:12,border:`1px solid ${B.border}`,padding:"16px",marginBottom:20,textAlign:"left"}}>
          <div style={{fontSize:12,fontWeight:700,color:B.muted,marginBottom:10}}>By Topic</div>
          {[...new Set(qs.map(q=>q.topic))].map(topic=>{
            const topicQs=qs.map((q,i)=>({...q,ans:answers[i]})).filter(q=>q.topic===topic);
            const topicCorrect=topicQs.filter(q=>q.ans?.correct).length;
            const topicPct=Math.round((topicCorrect/topicQs.length)*100);
            return(
              <div key={topic} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:B.text,fontWeight:500}}>{topic}</span><span style={{fontWeight:700,color:topicPct>=80?"#38a169":topicPct>=50?B.goldHover:"#e53e3e"}}>{topicPct}%</span></div>
                <div style={{height:5,background:B.borderL,borderRadius:99}}><div style={{height:"100%",borderRadius:99,background:topicPct>=80?"#48bb78":topicPct>=50?B.gold:"#e53e3e",width:`${topicPct}%`,transition:"width .5s"}}/></div>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,width:"100%"}}>
          <button onClick={()=>setReviewing(true)} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${B.border}`,background:B.card,color:B.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Review Answers</button>
          <button onClick={()=>{onComplete()}} style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Done \u2713</button>
        </div>
      </div>
    );
  }

  if(reviewing){
    return(
      <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
        <button onClick={()=>setReviewing(false)} style={{background:"none",border:"none",cursor:"pointer",color:B.muted,fontSize:13,fontFamily:"inherit",marginBottom:16}}>\u2190 Back to Results</button>
        {qs.map((q,i)=>{
          const ans=answers[i];
          return(
            <div key={i} style={{marginBottom:16,padding:"16px",borderRadius:12,border:`1.5px solid ${ans?.correct?"#c6f6d5":"#fed7d7"}`,background:ans?.correct?"#f0fff4":"#fff5f5"}}>
              <div style={{fontSize:11,fontWeight:700,color:B.light,marginBottom:6}}>Q{i+1} \u00b7 {q.topic} \u00b7 {q.difficulty}</div>
              <div style={{fontSize:14,fontWeight:600,color:B.dark,marginBottom:10}}>{q.q}</div>
              {q.opts.map((o,j)=>(
                <div key={j} style={{fontSize:13,padding:"6px 10px",borderRadius:6,marginBottom:4,background:j===q.correct?"#dcfce7":j===ans?.selected&&!ans?.correct?"#fee2e2":"transparent",color:j===q.correct?"#166534":j===ans?.selected&&!ans?.correct?"#991b1b":B.text,fontWeight:j===q.correct||j===ans?.selected?600:400}}>
                  {String.fromCharCode(65+j)}. {o} {j===q.correct&&"\u2713"}{j===ans?.selected&&!ans?.correct&&"\u2717"}
                </div>
              ))}
              <div style={{fontSize:12,color:"#2f855a",marginTop:8,lineHeight:1.5,fontStyle:"italic"}}>{q.exp}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const q=qs[idx];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",padding:"28px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:13,fontWeight:600,color:B.muted}}>Q{idx+1}/{qs.length}</span>
        {mode==="timed"&&<span style={{fontFamily:"monospace",fontSize:15,fontWeight:700,color:"#dc2626",background:"#fff5f5",padding:"4px 12px",borderRadius:6}}>{Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</span>}
        <div style={{display:"flex",gap:6}}><span style={{fontSize:10,fontWeight:600,color:B.light,background:B.borderL,padding:"2px 8px",borderRadius:4}}>{q.topic}</span><span style={{fontSize:10,fontWeight:600,color:q.difficulty==="easy"?"#38a169":q.difficulty==="medium"?B.goldHover:"#e53e3e",background:q.difficulty==="easy"?"#f0fff4":q.difficulty==="medium"?"#fffff0":"#fff5f5",padding:"2px 8px",borderRadius:4}}>{q.difficulty}</span></div>
      </div>
      <div style={{display:"flex",gap:3,marginBottom:20}}>
        {qs.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:i<idx?(answers[i]?.correct?"#48bb78":"#e53e3e"):i===idx?"#16a34a":B.borderL}}/>)}
      </div>
      <div style={{fontSize:17,fontWeight:600,color:B.dark,lineHeight:1.6,marginBottom:20}}>{q.q}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
        {q.opts.map((o,i)=>{
          const isC=i===q.correct,isS=i===sel;
          let bg=B.card,bdr=B.border,col=B.text;
          if(revealed){if(isC){bg="#f0fff4";bdr="#48bb78";col="#22543d"}else if(isS&&!isC){bg="#fff5f5";bdr="#e53e3e";col="#9b2c2c"}}
          else if(isS){bg="#fffff0";bdr=B.gold;col=B.dark}
          return(
            <button key={i} onClick={()=>!revealed&&setSel(i)} style={{padding:"14px 16px",borderRadius:12,border:`2px solid ${bdr}`,background:bg,color:col,fontSize:14,fontWeight:isS||(revealed&&isC)?600:500,cursor:revealed?"default":"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
              <div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${bdr}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,background:revealed&&isC?"#48bb78":revealed&&isS?"#e53e3e":isS?B.gold:"transparent",color:(revealed&&(isC||isS))||isS?"#fff":B.muted,borderColor:revealed&&isC?"#48bb78":revealed&&isS?"#e53e3e":isS?B.gold:B.border}}>
                {revealed&&isC?"\u2713":revealed&&isS&&!isC?"\u2717":String.fromCharCode(65+i)}
              </div>{o}
            </button>
          );
        })}
      </div>
      {revealed&&<div style={{background:"#f0fff4",border:"1px solid #c6f6d5",borderRadius:12,padding:"12px 16px",marginTop:12,animation:"fadeUp .3s ease"}}><div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:3}}>Explanation</div><div style={{fontSize:13,color:"#2f855a",lineHeight:1.6}}>{q.exp}</div></div>}
      <div style={{marginTop:12}}>
        {!revealed&&<button onClick={submit} disabled={sel===null} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:sel===null?B.borderL:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:sel===null?B.light:B.dark,fontSize:14,fontWeight:700,cursor:sel===null?"default":"pointer",fontFamily:"inherit"}}>Check Answer</button>}
        {revealed&&<button onClick={next} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 14px ${B.gold}40`}}>{idx<qs.length-1?"Next Question \u2192":"See Results"}</button>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  VIDEO, AUDIO, MINDMAP panels
// ══════════════════════════════════════════════════
function VideoPanel({mod,onComplete,gam}){
  const c=mod.content;
  return(
    <div style={{padding:"28px 28px"}}>
      <div style={{borderRadius:16,overflow:"hidden",background:"#000",marginBottom:20,aspectRatio:"16/9"}}><iframe src={c.videoUrl} style={{width:"100%",height:"100%",border:"none"}} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/></div>
      <h3 style={{fontSize:18,fontWeight:700,color:B.dark,marginBottom:6}}>{c.title}</h3>
      {c.chapters&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>{c.chapters.map((ch,i)=><span key={i} style={{fontSize:12,fontWeight:500,color:"#dc2626",background:"#fef2f2",padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>{ch.t} {ch.l}</span>)}</div>}
      <button onClick={()=>{onComplete();gam.addXp(25,"Video watched")}} style={{width:"100%",marginTop:24,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Mark as Watched (+25 XP) \u2713</button>
    </div>
  );
}

function AudioPanel({mod,onComplete,gam}){
  const[playing,setPlaying]=useState(false);const[prog,setProg]=useState(0);
  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setProg(p=>Math.min(100,p+.5)),200);return()=>clearInterval(iv)},[playing]);
  return(
    <div style={{padding:"32px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center"}}>
      <div style={{width:130,height:130,borderRadius:"50%",background:"linear-gradient(135deg,#fffbeb,#fef3c7)",border:"3px solid #fcd34d",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,cursor:"pointer",transition:"transform .2s",boxShadow:"0 8px 32px rgba(217,119,6,.12)"}}
        onClick={()=>setPlaying(!playing)} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{playing?"\u23f8\ufe0f":"\u25b6\ufe0f"}</div>
      <h3 style={{fontSize:18,fontWeight:700,color:B.dark,marginTop:20,marginBottom:4}}>Audio Summary</h3>
      <p style={{fontSize:14,color:B.muted,marginBottom:20}}>{mod.content.duration}</p>
      <div style={{width:"100%",maxWidth:320,height:6,background:B.borderL,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#d97706,#f59e0b)",borderRadius:99,width:`${prog}%`,transition:"width .2s"}}/></div>
      <div style={{display:"flex",gap:10,marginTop:24}}>
        <button style={{padding:"10px 20px",borderRadius:10,border:`1.5px solid ${B.border}`,background:B.card,color:B.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>\u2b07 Download</button>
        <button onClick={()=>{onComplete();gam.addXp(20,"Audio completed")}} style={{padding:"10px 20px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Done (+20 XP)</button>
      </div>
    </div>
  );
}

function MindMapPanel({mod,onComplete,gam}){
  const c=mod.content;const[expanded,setExpanded]=useState({});
  const toggle=(i)=>setExpanded(p=>({...p,[i]:!p[i]}));
  const colors=["#2563eb","#7c3aed","#dc2626","#d97706","#16a34a"];
  return(
    <div style={{padding:"28px",overflowY:"auto",height:"100%"}}>
      <h3 style={{fontSize:18,fontWeight:700,color:B.dark,marginBottom:20,textAlign:"center"}}>{c.center}</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {c.branches.map((br,i)=>{
          const col=colors[i%colors.length];const open=expanded[i];
          return(
            <div key={i} style={{borderRadius:14,border:`1.5px solid ${col}25`,overflow:"hidden",transition:"all .2s"}}>
              <button onClick={()=>toggle(i)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:`${col}08`,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:col,flexShrink:0}}/>
                <span style={{fontSize:15,fontWeight:700,color:col,flex:1,textAlign:"left"}}>{br.label}</span>
                <span style={{color:col,fontSize:18,transition:"transform .2s",transform:open?"rotate(90deg)":"none"}}>\u203a</span>
              </button>
              {open&&(
                <div style={{padding:"8px 18px 14px 40px",animation:"fadeUp .25s ease"}}>
                  {br.children.map((ch,j)=>(
                    <div key={j} style={{fontSize:13,color:B.text,padding:"6px 0",borderBottom:j<br.children.length-1?`1px solid ${B.borderL}`:"none",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:col,opacity:.5,flexShrink:0}}/>{ch}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={()=>{onComplete();gam.addXp(15,"Mind map reviewed")}} style={{width:"100%",marginTop:24,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:B.dark,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Done (+15 XP) \u2713</button>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  MAIN DASHBOARD
// ══════════════════════════════════════════════════
export default function PrepDashboard(){
  const[activeDay,setActiveDay]=useState(1);
  const[completed,setCompleted]=useState({});
  const[openModule,setOpenModule]=useState(null);
  const[ready,setReady]=useState(false);
  const mainRef=useRef(null);
  const gam=useGamification();

  useEffect(()=>{setTimeout(()=>setReady(true),50)},[]);
  useEffect(()=>{mainRef.current?.scrollTo({top:0,behavior:"smooth"})},[activeDay]);

  const d=PREP_DATA,left=daysUntil(d.examDate),day=d.days.find(x=>x.number===activeDay);
  const doneN=day.modules.filter(m=>completed[m.id]).length,total=day.modules.length;
  const pct=total?Math.round((doneN/total)*100):0;

  const completeModule=(id)=>{setCompleted(p=>({...p,[id]:true}));setOpenModule(null)};
  const openMod=(mod)=>{if(mod.status!=="locked"||completed["m1"])setOpenModule(mod)};

  const renderPanel=()=>{
    if(!openModule)return null;
    const props={mod:openModule,onComplete:()=>completeModule(openModule.id),gam};
    switch(openModule.type){
      case"guide":return <StudyGuidePanel {...props}/>;
      case"flashcards":return <FlashcardsPanel {...props}/>;
      case"quiz":return <QuizPanel {...props}/>;
      case"video":return <VideoPanel {...props}/>;
      case"audio":return <AudioPanel {...props}/>;
      case"mindmap":return <MindMapPanel {...props}/>;
      default:return null;
    }
  };

  return(
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",background:B.bg,minHeight:"100vh",display:"flex",flexDirection:"column",opacity:ready?1:0,transition:"opacity .6s"}}>

      {/* XP Toast */}
      {gam.toast&&(
        <div style={{position:"fixed",top:80,right:24,zIndex:200,background:B.card,border:`2px solid ${gam.toast.color}`,borderRadius:14,padding:"14px 20px",boxShadow:"0 8px 32px rgba(0,0,0,.12)",display:"flex",alignItems:"center",gap:12,animation:"slideIn .35s ease",minWidth:200}}>
          <div style={{fontSize:13,fontWeight:700,color:gam.toast.color}}>{gam.toast.title}</div>
          {gam.toast.msg&&<div style={{fontSize:12,color:B.muted}}>{gam.toast.msg}</div>}
        </div>
      )}

      {/* HEADER */}
      <header style={{background:`linear-gradient(180deg,${B.headerBg},${B.headerDark})`,height:64,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`3px solid ${B.gold}`,position:"relative",zIndex:50,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:36,height:36,borderRadius:"50%",border:`2.5px solid ${B.gold}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.gold} strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div><div style={{color:"#fff",fontWeight:700,fontSize:18,letterSpacing:"1.5px",lineHeight:1}}>CERTIPREP</div><div style={{color:B.light,fontSize:11,marginTop:1}}>Academic Exam Prep</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          {/* XP bar in header */}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",borderRadius:20,padding:"4px 14px 4px 8px"}}>
            <span style={{fontSize:14}}>\u2b50</span>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:B.gold,lineHeight:1}}>LVL {gam.level}</div>
              <div style={{width:60,height:4,background:"rgba(255,255,255,.15)",borderRadius:99,marginTop:2}}><div style={{height:"100%",borderRadius:99,background:B.gold,width:`${(gam.xp%200)/2}%`,transition:"width .5s"}}/></div>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:B.gold}}>{gam.xp} XP</span>
          </div>
          {["My Preps","Support"].map(t=><a key={t} href="#" style={{color:"#e2e8f0",textDecoration:"none",fontSize:14,fontWeight:500,transition:"color .15s"}} onMouseEnter={e=>e.target.style.color=B.gold} onMouseLeave={e=>e.target.style.color="#e2e8f0"}>{t}</a>)}
          <div style={{width:36,height:36,borderRadius:"50%",background:B.headerDark,border:`2px solid ${B.light}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#e2e8f0",fontSize:13,fontWeight:600}}>{d.student.initials}</div>
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        {/* SIDEBAR */}
        <aside style={{width:300,background:B.card,borderRight:`1px solid ${B.border}`,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
          <div style={{padding:"28px 24px 24px",borderBottom:`1px solid ${B.borderL}`,background:"linear-gradient(180deg,#fefcf3,#fff)"}}>
            <h2 style={{fontSize:17,fontWeight:700,color:B.dark,lineHeight:1.35,margin:0}}>{d.title}</h2>
            <div style={{fontSize:13,color:B.muted,marginTop:6}}>{d.courseCode} &middot; {d.examType}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:14,padding:"6px 14px",borderRadius:24,fontSize:13,fontWeight:600,background:left<=3?"#fff5f5":left<=7?"#fffff0":"#f0fff4",color:left<=3?"#e53e3e":left<=7?"#d69e2e":"#38a169",border:`1px solid ${left<=3?"#fed7d7":left<=7?"#fefcbf":"#c6f6d5"}`}}>\u23f0 {left} day{left!==1&&"s"} left</div>
            <div style={{marginTop:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:B.muted,marginBottom:6,fontWeight:500}}><span>Progress</span><span>Day {activeDay}/{d.days.length}</span></div>
              <div style={{height:6,background:B.borderL,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${B.gold},${B.goldHover})`,width:`${Math.max(2,(activeDay/d.days.length)*100)}%`,transition:"width .6s"}}/></div>
            </div>
          </div>
          <div style={{padding:"16px 14px",flex:1}}>
            <div style={{fontSize:11,fontWeight:700,color:B.light,textTransform:"uppercase",letterSpacing:"1px",padding:"0 10px 10px"}}>Schedule</div>
            {d.days.map(dy=>{
              const act=dy.number===activeDay,past=dy.number<activeDay;
              const dots={study:B.gold,review:"#4299e1",exam:"#e53e3e"},labels={review:"Review",exam:"Exam"};
              return(<button key={dy.id} onClick={()=>{setActiveDay(dy.number);setOpenModule(null)}} style={{width:"100%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,textAlign:"left",fontFamily:"inherit",marginBottom:2,transition:"all .2s",background:act?`linear-gradient(135deg,${B.goldBgSoft},${B.goldBg})`:"transparent",borderLeft:act?`3px solid ${B.gold}`:"3px solid transparent"}} onMouseEnter={e=>{if(!act)e.currentTarget.style.background="#f7fafc"}} onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:past?"#48bb78":dots[dy.type],opacity:act||past?1:.4,boxShadow:act?`0 0 0 4px ${dots[dy.type]}25`:"none"}}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:act?700:500,color:act?B.dark:B.text}}>Day {dy.number}</div><div style={{fontSize:12,color:act?B.muted:B.light,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{dy.title}</div></div>
                {labels[dy.type]&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,textTransform:"uppercase",background:dy.type==="review"?"#ebf8ff":"#fff5f5",color:dy.type==="review"?"#3182ce":"#e53e3e"}}>{labels[dy.type]}</span>}
              </button>);
            })}
          </div>
        </aside>

        {/* MAIN */}
        <main ref={mainRef} style={{flex:1,overflowY:"auto",padding:"36px 40px 48px",background:`linear-gradient(180deg,${B.bg},#edf2f7)`,transition:"filter .3s",filter:openModule?"blur(2px)":"none"}}>
          <div style={{marginBottom:28,animation:"fadeUp .45s ease"}}>
            <span style={{fontSize:12,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:{study:B.goldHover,review:"#3182ce",exam:"#e53e3e"}[day.type]}}>Day {day.number} of {d.days.length}</span>
            <h1 style={{fontSize:30,fontWeight:700,color:B.dark,margin:"6px 0 0",lineHeight:1.2}}>{day.title}</h1>
            <p style={{fontSize:15,color:B.muted,marginTop:8,lineHeight:1.6}}>{day.description}</p>
          </div>

          {total>0&&<div style={{background:B.card,borderRadius:16,padding:"20px 24px",border:`1px solid ${B.border}`,marginBottom:28,boxShadow:"0 1px 4px rgba(0,0,0,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:14,fontWeight:600,color:B.text}}>Today's Progress</span><span style={{fontSize:14,fontWeight:700,color:pct===100?"#38a169":B.goldHover}}>{doneN}/{total}{pct===100&&" \ud83c\udf89"}</span></div>
            <div style={{height:10,background:B.borderL,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:pct===100?"linear-gradient(90deg,#48bb78,#38a169)":`linear-gradient(90deg,${B.gold},${B.goldHover})`,width:`${pct}%`,transition:"width .6s"}}/></div>
          </div>}

          {day.modules.length>0?(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:20}}>
              {day.modules.map((mod,i)=>{
                const th=TH[mod.type],done=completed[mod.id],locked=mod.status==="locked"&&!completed["m1"];
                return(<div key={mod.id} onClick={()=>openMod(mod)} style={{background:B.card,border:`1.5px solid ${done?"#c6f6d5":locked?B.borderL:B.border}`,borderRadius:18,cursor:locked?"not-allowed":"pointer",opacity:locked?.5:1,position:"relative",overflow:"hidden",transition:"all .25s cubic-bezier(.4,0,.2,1)",animation:`fadeUp .45s ease ${i*.07}s both`,boxShadow:done?"0 0 0 1.5px #c6f6d5":"0 1px 4px rgba(0,0,0,.03)"}}
                  onMouseEnter={e=>{if(!locked&&!done){e.currentTarget.style.borderColor=th.accent+"50";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 32px ${th.accent}12`}}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=done?"#c6f6d5":B.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=done?"0 0 0 1.5px #c6f6d5":"0 1px 4px rgba(0,0,0,.03)"}}
                >
                  <div style={{height:4,background:done?"#48bb78":th.bg}}/>
                  {done&&<div style={{position:"absolute",top:14,right:16,background:"#f0fff4",border:"1.5px solid #c6f6d5",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:"#38a169"}}>\u2713 Done</div>}
                  <div style={{padding:"22px 24px 24px",display:"flex",gap:18}}>
                    <div style={{width:56,height:56,borderRadius:14,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{locked?"\ud83d\udd12":th.icon}</div>
                    <div style={{flex:1}}>
                      <h3 style={{fontSize:16,fontWeight:700,color:B.dark,margin:0}}>{mod.title}</h3>
                      <p style={{fontSize:13.5,color:B.muted,marginTop:6,lineHeight:1.6}}>{mod.desc}</p>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,fontWeight:600,color:B.muted,background:B.borderL,padding:"4px 10px",borderRadius:6}}>{mod.time}</span>
                        <span style={{fontSize:12,color:B.light}}>{mod.detail}</span>
                        {locked&&<span style={{fontSize:11,fontWeight:600,color:B.light,background:B.borderL,padding:"3px 10px",borderRadius:6,marginLeft:"auto"}}>\ud83d\udd12 {mod.lockMsg}</span>}
                        {!done&&!locked&&<span style={{fontSize:11,fontWeight:700,color:th.accent,background:th.accentBg,padding:"4px 12px",borderRadius:6,marginLeft:"auto"}}>Open \u2192</span>}
                      </div>
                    </div>
                  </div>
                </div>);
              })}
            </div>
          ):(
            <div style={{background:B.card,borderRadius:20,border:`2px dashed ${B.border}`,padding:"72px 40px",textAlign:"center"}}>
              <div style={{fontSize:56,marginBottom:16}}>{day.type==="exam"?"\ud83c\udfaf":day.type==="review"?"\ud83d\udd04":"\ud83d\udcda"}</div>
              <h3 style={{fontSize:20,fontWeight:700,color:B.text,marginBottom:10}}>{day.type==="exam"?"Mock Exam":day.type==="review"?"Review Day":"Day "+day.number}</h3>
              <p style={{fontSize:15,color:B.muted,maxWidth:420,margin:"0 auto"}}>Content is being prepared.</p>
            </div>
          )}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:36,paddingTop:24,borderTop:`1px solid ${B.border}`}}>
            <button onClick={()=>{activeDay>1&&setActiveDay(activeDay-1);setOpenModule(null)}} disabled={activeDay===1} style={{padding:"12px 24px",borderRadius:12,border:`1.5px solid ${B.border}`,background:B.card,color:activeDay===1?B.borderL:B.text,fontSize:14,fontWeight:600,cursor:activeDay===1?"default":"pointer",fontFamily:"inherit"}}>\u2190 Previous Day</button>
            <div style={{display:"flex",gap:6}}>{d.days.map((_,i)=><div key={i} onClick={()=>{setActiveDay(i+1);setOpenModule(null)}} style={{width:i+1===activeDay?24:8,height:8,borderRadius:99,cursor:"pointer",transition:"all .3s",background:i+1===activeDay?B.gold:i+1<activeDay?"#48bb78":B.border}}/>)}</div>
            <button onClick={()=>{activeDay<d.days.length&&setActiveDay(activeDay+1);setOpenModule(null)}} disabled={activeDay===d.days.length} style={{padding:"12px 24px",borderRadius:12,border:"none",background:activeDay===d.days.length?B.borderL:`linear-gradient(135deg,${B.gold},${B.goldHover})`,color:activeDay===d.days.length?B.light:B.dark,fontSize:14,fontWeight:700,cursor:activeDay===d.days.length?"default":"pointer",fontFamily:"inherit",boxShadow:activeDay===d.days.length?"none":`0 4px 14px ${B.gold}40`}}>Next Day \u2192</button>
          </div>
        </main>

        {/* SLIDE-IN PANEL */}
        {openModule&&<div style={{position:"absolute",top:0,right:0,bottom:0,width:"min(580px,72%)",background:B.card,borderLeft:`1px solid ${B.border}`,boxShadow:"-8px 0 40px rgba(0,0,0,.1)",zIndex:30,display:"flex",flexDirection:"column",animation:"slideIn .35s cubic-bezier(.4,0,.2,1)"}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${B.borderL}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"linear-gradient(180deg,#fafafa,#fff)"}}>
            <button onClick={()=>setOpenModule(null)} style={{width:34,height:34,borderRadius:9,border:`1.5px solid ${B.border}`,background:B.card,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:B.muted,fontSize:16,fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.borderColor=B.muted} onMouseLeave={e=>e.currentTarget.style.borderColor=B.border}>\u2715</button>
            <div style={{width:36,height:36,borderRadius:9,background:TH[openModule.type].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{TH[openModule.type].icon}</div>
            <div><div style={{fontSize:14,fontWeight:700,color:B.dark}}>{openModule.title}</div><div style={{fontSize:11,color:B.muted}}>{openModule.time} &middot; {openModule.detail}</div></div>
            {completed[openModule.id]&&<span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"#38a169",background:"#f0fff4",border:"1.5px solid #c6f6d5",padding:"4px 10px",borderRadius:8}}>\u2713 Complete</span>}
          </div>
          <div style={{flex:1,overflow:"hidden"}}>{renderPanel()}</div>
        </div>}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        *{scrollbar-width:thin;scrollbar-color:#cbd5e0 transparent}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e0;border-radius:99px}
      `}</style>
    </div>
  );
}
