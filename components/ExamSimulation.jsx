"use client";
import { useState, useEffect, useRef } from "react";

const THEMES={
  midnight:{name:"Midnight",icon:"🌙",bg:"#0f1117",surface:"#161922",surface2:"#1a1d28",raised:"#12141c",border:"#1e2330",border2:"#2d3548",text:"#f1f5f9",text2:"#e2e8f0",muted:"#94a3b8",dim:"#4a5568",faint:"#374151",accent:"#ecc94b",accentHover:"#d69e2e",accentBg:"#ecc94b12",accentBorder:"#ecc94b30",success:"#22c55e",successBg:"#0f1a10",successBorder:"#1a3b1a",danger:"#f87171",dangerBg:"#1a1010",dangerBorder:"#3b1a1a",info:"#3b82f6",infoBg:"#101828",infoBorder:"#1a2a4a",scrollbar:"#1e2330",shadow:"rgba(0,0,0,.5)",dk:true},
  oak:{name:"Warm Oak",icon:"🪵",bg:"#faf8f5",surface:"#ffffff",surface2:"#f5f0ea",raised:"#fdf8f3",border:"#e6ddd0",border2:"#d4c8b8",text:"#2d2015",text2:"#3d3025",muted:"#7a6b5a",dim:"#a0917f",faint:"#c4b8a8",accent:"#c8956a",accentHover:"#b07d52",accentBg:"#c8956a12",accentBorder:"#c8956a35",success:"#5a8a3c",successBg:"#f0f7ec",successBorder:"#c8e0b8",danger:"#c45040",dangerBg:"#fef2f0",dangerBorder:"#f0c8c4",info:"#4a7ab5",infoBg:"#eef4fb",infoBorder:"#b8d0e8",scrollbar:"#d4c8b8",shadow:"rgba(0,0,0,.12)",dk:false},
  arctic:{name:"Arctic",icon:"❄️",bg:"#f0f4f8",surface:"#ffffff",surface2:"#e8eef5",raised:"#f5f8fb",border:"#d0dae8",border2:"#b8c8d8",text:"#1a2a3a",text2:"#2a3a4a",muted:"#5a7088",dim:"#8098b0",faint:"#b0c0d0",accent:"#2d7ad4",accentHover:"#1a62b8",accentBg:"#2d7ad412",accentBorder:"#2d7ad430",success:"#2a9d5c",successBg:"#ecf8f0",successBorder:"#b0e0c0",danger:"#d43a3a",dangerBg:"#fef0f0",dangerBorder:"#f0c0c0",info:"#2d7ad4",infoBg:"#eff6ff",infoBorder:"#a8c8e8",scrollbar:"#c0d0e0",shadow:"rgba(0,0,0,.1)",dk:false},
  emerald:{name:"Emerald",icon:"🌲",bg:"#0a120e",surface:"#111c16",surface2:"#152018",raised:"#0e1812",border:"#1a2e22",border2:"#254035",text:"#e0f0e8",text2:"#c8e0d0",muted:"#78a890",dim:"#4a7060",faint:"#2a4a38",accent:"#4ade80",accentHover:"#22c55e",accentBg:"#4ade8012",accentBorder:"#4ade8030",success:"#4ade80",successBg:"#0a1a10",successBorder:"#1a3a22",danger:"#f87171",dangerBg:"#1a1010",dangerBorder:"#3a1a1a",info:"#60b0f0",infoBg:"#0a1420",infoBorder:"#1a3050",scrollbar:"#1a2e22",shadow:"rgba(0,0,0,.5)",dk:true},
};

const META={course:"BIO 201 \u2014 Intro to Microbiology",type:"Midterm",time:3600,pass:70};

const QS=[{"id":1,"t":"Microbial Structure","q":"Which cellular structure is responsible for bacterial motility?","o":["Pili","Flagella","Capsule","Fimbriae"],"a":1,"e":"Flagella are whip-like appendages that rotate to propel bacteria. Pili/fimbriae handle attachment; capsules provide protection."},{"id":2,"t":"Microbial Structure","q":"Gram-positive bacteria are characterized by:","o":["Thin peptidoglycan + outer membrane","Thick peptidoglycan without outer membrane","No cell wall","Thin peptidoglycan only"],"a":1,"e":"Gram-positive bacteria have a thick peptidoglycan layer (20-80nm) retaining crystal violet stain."},{"id":3,"t":"Microbial Structure","q":"Which is NOT a function of the bacterial cell membrane?","o":["Energy production (ETC)","Selective permeability","Protein synthesis","Nutrient transport"],"a":2,"e":"Protein synthesis occurs on ribosomes. The membrane handles ETC, permeability, and transport."},{"id":4,"t":"Microbial Structure","q":"Endospores are primarily formed by which genera?","o":["Staphylococcus & Streptococcus","Bacillus & Clostridium","E. coli & Salmonella","Mycobacterium & Corynebacterium"],"a":1,"e":"Bacillus and Clostridium are the primary endospore-forming genera."},{"id":5,"t":"Bacteria Classification","q":"Which staining technique identifies acid-fast bacteria?","o":["Gram stain","Ziehl-Neelsen stain","Endospore stain","Simple stain"],"a":1,"e":"Ziehl-Neelsen uses carbolfuchsin to identify Mycobacterium with waxy mycolic acid walls."},{"id":6,"t":"Bacteria Classification","q":"Obligate anaerobes are organisms that:","o":["Require oxygen","Grow with or without O2","Cannot grow with O2 present","Prefer low O2"],"a":2,"e":"They lack superoxide dismutase and catalase, making oxygen toxic."},{"id":7,"t":"Bacteria Classification","q":"Which bacterial shape is described as spiral?","o":["Coccus","Bacillus","Spirochete","Vibrio"],"a":2,"e":"Spirochetes are helical (e.g., Treponema). Cocci=sphere, bacilli=rod, vibrios=comma."},{"id":8,"t":"Bacteria Classification","q":"Binary fission results in:","o":["Four daughter cells","Two genetically identical cells","Two genetically different cells","A spore and a cell"],"a":1,"e":"Binary fission produces two identical daughter cells. Variation comes from mutation/HGT."},{"id":9,"t":"Viruses","q":"Viruses are obligate intracellular parasites because:","o":["Can only reproduce in host cells","Have own ribosomes","Synthesize ATP independently","Have a cell membrane"],"a":0,"e":"Viruses lack ribosomes and metabolic machinery, must hijack host cells."},{"id":10,"t":"Viruses","q":"The viral envelope is derived from:","o":["The viral capsid","Host cell membranes","Peptidoglycan","Viral RNA"],"a":1,"e":"Enveloped viruses get lipid envelopes from host membranes during budding."},{"id":11,"t":"Viruses","q":"The final step of the lytic cycle is:","o":["Attachment","Penetration","Biosynthesis","Lysis/Release"],"a":3,"e":"Lysis: host bursts, releasing virions. Steps: attach→penetrate→biosynthesize→assemble→lyse."},{"id":12,"t":"Viruses","q":"Retroviruses use which enzyme for RNA→DNA?","o":["DNA polymerase","RNA polymerase","Reverse transcriptase","Helicase"],"a":2,"e":"Reverse transcriptase makes DNA from RNA. Integrase inserts it into host chromosome."},{"id":13,"t":"Fungi & Parasites","q":"A characteristic of fungi is:","o":["Prokaryotic cells","Photosynthetic","Chitin in cell walls","No nucleus"],"a":2,"e":"Fungi are eukaryotes with chitin walls. Heterotrophic, absorb nutrients."},{"id":14,"t":"Fungi & Parasites","q":"Dimorphic fungi can exist as:","o":["Only mold","Only yeast","Both mold and yeast","Neither"],"a":2,"e":"Switch: mold at 25°C, yeast at 37°C. E.g., Histoplasma, Blastomyces."},{"id":15,"t":"Fungi & Parasites","q":"Which disease spreads via Anopheles mosquito?","o":["Trypanosomiasis","Leishmaniasis","Malaria","Chagas"],"a":2,"e":"Malaria (Plasmodium) via female Anopheles mosquitoes."},{"id":16,"t":"Fungi & Parasites","q":"Prions differ because they:","o":["Contain RNA only","Are solely misfolded protein","Have lipid envelope","Contain DNA"],"a":1,"e":"Prions = misfolded PrPSc converting normal PrPC. No nucleic acid."},{"id":17,"t":"Immunology","q":"Vaccination provides which immunity type?","o":["Natural active","Artificial active","Natural passive","Artificial passive"],"a":1,"e":"Vaccines = artificial active: antigens stimulate your own antibodies + memory."},{"id":18,"t":"Immunology","q":"T helper cells express:","o":["CD8","CD4","CD19","CD56"],"a":1,"e":"CD4=helpers, CD8=cytotoxic T, CD19=B cells, CD56=NK cells."},{"id":19,"t":"Immunology","q":"Complement system functions in:","o":["Antibody production","Antigen presentation","Opsonization/inflammation/cell lysis","T cell activation only"],"a":2,"e":"~30 proteins for opsonization, inflammation, and MAC formation."},{"id":20,"t":"Immunology","q":"First Ig in primary response?","o":["IgG","IgA","IgM","IgE"],"a":2,"e":"IgM first (pentamer, high avidity). Class switching to IgG later."},{"id":21,"t":"Immunology","q":"Innate vs adaptive immunity:","o":["Slower to respond","Creates memory","Non-specific and immediate","Only T cells"],"a":2,"e":"Innate=immediate, non-specific. Adaptive=specific, slower, creates memory."},{"id":22,"t":"Microbial Genetics","q":"HGT occurs through all EXCEPT:","o":["Transformation","Transduction","Conjugation","Binary fission"],"a":3,"e":"Binary fission=vertical. HGT: transformation, transduction (phage), conjugation (pili)."},{"id":23,"t":"Microbial Genetics","q":"Chromosome-integrating plasmid:","o":["Episome","Transposon","Bacteriophage","Restriction enzyme"],"a":0,"e":"Episome can exist free or integrate. F plasmid is the classic example."},{"id":24,"t":"Microbial Genetics","q":"Premature stop codon mutations are:","o":["Missense","Silent","Nonsense","Frameshift"],"a":2,"e":"Nonsense mutations create premature stops, truncating the protein."},{"id":25,"t":"Microbial Genetics","q":"CRISPR-Cas9 naturally functions as:","o":["Replication mechanism","Adaptive phage defense","Metabolic pathway","Transcription factor"],"a":1,"e":"CRISPR stores phage DNA fragments to recognize and cleave future infections."},{"id":26,"t":"Microbial Structure","q":"LPS is in outer membrane of:","o":["Gram-positive","Gram-negative","Fungi","Archaea"],"a":1,"e":"LPS (endotoxin) in Gram-negative: Lipid A + core + O-antigen."},{"id":27,"t":"Bacteria Classification","q":"Selective AND differential medium?","o":["Nutrient agar","Blood agar","MacConkey agar","Sabouraud agar"],"a":2,"e":"MacConkey: selective (inhibits G+) + differential (lactose fermenters=pink)."},{"id":28,"t":"Viruses","q":"Antigenic shift in influenza:","o":["Minor mutations","Major genome reassortment","Envelope loss","Reverse transcription"],"a":1,"e":"Shift=reassortment of genome segments between strains, potentially pandemic."},{"id":29,"t":"Fungi & Parasites","q":"Candida infections most common in:","o":["Healthy individuals","Immunocompromised patients","Only neonates","Only elderly"],"a":1,"e":"Candida is opportunistic, affecting immunocompromised (HIV, transplant, diabetes)."},{"id":30,"t":"Immunology","q":"Primary APCs are:","o":["Neutrophils","RBCs","Dendritic/macrophages/B cells","Platelets"],"a":2,"e":"Professional APCs: dendritic cells, macrophages, B cells. Present on MHC II."},{"id":31,"t":"Microbial Structure","q":"Mycoplasma is unique because it:","o":["Has two membranes","Lacks cell wall entirely","Is the largest bacterium","Forms endospores"],"a":1,"e":"No cell wall = naturally resistant to penicillin. Membrane sterols provide stability."},{"id":32,"t":"Bacteria Classification","q":"MIC represents:","o":["Highest lethal dose","Lowest conc. preventing visible growth","50% kill conc.","Therapeutic dose"],"a":1,"e":"MIC=lowest antimicrobial concentration inhibiting visible growth. Gold standard."},{"id":33,"t":"Viruses","q":"Fecal-oral hepatitis virus?","o":["Hep B","Hep C","Hep A","Hep D"],"a":2,"e":"Hep A=fecal-oral. B,C,D=bloodborne. HAV=no chronic infection."},{"id":34,"t":"Immunology","q":"Type I hypersensitivity mediated by:","o":["IgG","IgM","IgE + mast cells","Cytotoxic T cells"],"a":2,"e":"IgE on mast cells. Re-exposure crosslinks IgE→degranulation→histamine."},{"id":35,"t":"Microbial Genetics","q":"An operon consists of:","o":["Only structural genes","Promoter+operator+structural genes","Only regulatory genes","Gene+enhancer"],"a":1,"e":"Promoter + operator + structural genes, transcribed as polycistronic mRNA."},{"id":36,"t":"Microbial Structure","q":"Biofilms are significant because:","o":["Easy to treat","Increase susceptibility","Provide antibiotic resistance","Only on non-living surfaces"],"a":2,"e":"Biofilms=up to 1000x antibiotic resistance, shield from immune responses."},{"id":37,"t":"Bacteria Classification","q":"Koch postulates establish:","o":["Shape classification","Microbe-disease causal link","Antibiotic sensitivity","Viral ID"],"a":1,"e":"4 criteria: isolate, grow pure, reproduce disease, re-isolate same organism."},{"id":38,"t":"Viruses","q":"Phages integrating into bacterial DNA:","o":["Lytic cycle","Lysogenic cycle","Both","Neither"],"a":1,"e":"Lysogenic: temperate phages integrate as prophage, replicate with host."},{"id":39,"t":"Fungi & Parasites","q":"Antifungal targeting ergosterol synthesis:","o":["Penicillins","Azoles","Aminoglycosides","Fluoroquinolones"],"a":1,"e":"Azoles block lanosterol demethylase→no ergosterol→membrane disruption."},{"id":40,"t":"Immunology","q":"MHC I presents to:","o":["CD4+ T cells","CD8+ T cells","B cells only","NK cells only"],"a":1,"e":"MHC I (all nucleated cells)→CD8+ cytotoxic T. MHC II (APCs)→CD4+ helpers."},{"id":41,"t":"Microbial Genetics","q":"Transposons jump because they:","o":["Move between organisms","Move within/between DNA molecules","Only in plasmids","Cause deletions"],"a":1,"e":"Mobile elements via transposase. Can carry antibiotic resistance genes."},{"id":42,"t":"Microbial Structure","q":"Periplasmic space found in:","o":["Gram-positive only","Gram-negative","Viruses","Fungi"],"a":1,"e":"Between inner and outer membranes of Gram-negatives. Contains enzymes."},{"id":43,"t":"Bacteria Classification","q":"Bacteriostatic antibiotic:","o":["Kills bacteria","Inhibits growth without killing","Only targets G+","Only for biofilms"],"a":1,"e":"Inhibits growth (e.g., tetracyclines). Immune system clears the rest."},{"id":44,"t":"Viruses","q":"Segmented RNA virus genome:","o":["HIV","Ebola","Influenza","Measles"],"a":2,"e":"Influenza: 8 negative-sense ssRNA segments enabling reassortment."},{"id":45,"t":"Fungi & Parasites","q":"Toxoplasma gondii definitive host:","o":["Humans","Dogs","Cats","Rodents"],"a":2,"e":"Cats=definitive host (sexual reproduction). Humans=intermediate."},{"id":46,"t":"Immunology","q":"Passive immunity characterized by:","o":["Long-lasting","Memory cells","Pre-formed antibody transfer","T cell activation"],"a":2,"e":"Pre-formed antibodies transferred. Immediate but temporary."},{"id":47,"t":"Microbial Genetics","q":"Ames test detects:","o":["Antibiotics","Mutagens","Antifungals","Vitamins"],"a":1,"e":"Salmonella auxotrophs detect mutagens by reversion mutation."},{"id":48,"t":"Microbial Structure","q":"70S ribosomes found in:","o":["Human liver cells","Bacteria","Fungi","Protozoa"],"a":1,"e":"Bacteria: 70S (30S+50S). Eukaryotes: 80S (40S+60S)."},{"id":49,"t":"Bacteria Classification","q":"Quorum sensing is:","o":["Nutrient detection","Density-dependent communication","Antibiotic resistance","DNA repair"],"a":1,"e":"Bacteria produce/detect autoinducers. At threshold, coordinated behaviors activate."},{"id":50,"t":"Immunology","q":"Autoimmune diseases from:","o":["Response against self-antigens","Weakened immunity","Allergic reactions","Immunodeficiency"],"a":0,"e":"Loss of self-tolerance. Examples: T1 diabetes, lupus, RA."}];

const TOPICS=[...new Set(QS.map(q=>q.t))];

function ThemePicker({theme,setTheme,T,pos}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{width:36,height:36,borderRadius:10,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border2}>{T.icon}</button>
      {open&&<>
        <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:299}}/>
        <div style={{position:"absolute",...(pos||{top:44,right:0}),background:T.surface,border:"1px solid "+T.border2,borderRadius:14,padding:8,boxShadow:"0 12px 40px "+T.shadow,zIndex:300,width:220,animation:"slideUp .2s ease"}}>
          <div style={{padding:"6px 12px 10px",fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px"}}>Theme</div>
          {Object.entries(THEMES).map(([k,th])=>(
            <button key={k} onClick={()=>{setTheme(k);setOpen(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",background:theme===k?T.accentBg:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
              onMouseEnter={e=>{if(theme!==k)e.currentTarget.style.background=T.surface2}} onMouseLeave={e=>{if(theme!==k)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:18}}>{th.icon}</span>
              <span style={{fontSize:13,fontWeight:theme===k?700:500,color:theme===k?T.accent:T.muted,flex:1}}>{th.name}</span>
              <div style={{display:"flex",gap:3}}>{[th.bg,th.accent,th.surface].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,border:"1px solid "+th.border}}/>)}</div>
              {theme===k&&<span style={{color:T.accent,fontWeight:800,marginLeft:4}}>&#x2713;</span>}
            </button>))}
        </div>
      </>}
    </div>);
}

export default function ExamSimulation(){
  const[theme,setTheme]=useState("midnight");
  const[phase,setPhase]=useState("start");
  const[cur,setCur]=useState(0);
  const[ans,setAns]=useState({});
  const[flagged,setFlagged]=useState(new Set());
  const[timeLeft,setTimeLeft]=useState(META.time);
  const[showNav,setShowNav]=useState(false);
  const timerRef=useRef(null);
  const T=THEMES[theme];

  useEffect(()=>{
    if(phase==="exam"){timerRef.current=setInterval(()=>{setTimeLeft(p=>{if(p<=1){clearInterval(timerRef.current);setPhase("results");return 0}return p-1})},1000);return()=>clearInterval(timerRef.current)}
  },[phase]);

  const begin=()=>{setPhase("exam");setAns({});setFlagged(new Set());setCur(0);setTimeLeft(META.time)};
  const submit=()=>{clearInterval(timerRef.current);setPhase("results")};
  const q=QS[cur],answered=Object.keys(ans).length,correct=QS.filter(x=>ans[x.id]===x.a).length;
  const score=Math.round(correct/QS.length*100),passed=score>=META.pass;
  const mm=String(Math.floor(timeLeft/60)).padStart(2,"0"),ss=String(timeLeft%60).padStart(2,"0"),urgent=timeLeft<300;
  const topicStats=TOPICS.map(tp=>{const qs=QS.filter(x=>x.t===tp),c=qs.filter(x=>ans[x.id]===x.a).length;return{topic:tp,total:qs.length,correct:c,pct:Math.round(c/qs.length*100)}});

  const css=`@import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap");@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;scrollbar-width:thin;scrollbar-color:${T.scrollbar} transparent}`;
  const Btn=({children,primary,small,onClick,disabled,style:s})=>(<button onClick={onClick} disabled={disabled} style={{padding:small?"8px 16px":"14px 28px",borderRadius:small?8:12,border:primary?"none":"1px solid "+T.border2,background:primary?"linear-gradient(135deg,"+T.accent+","+T.accentHover+")":"transparent",color:primary?(T.dk?"#1a202c":"#fff"):T.muted,fontSize:small?12:14,fontWeight:primary?800:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?.5:1,...s}}>{children}</button>);

  /* START */
  if(phase==="start") return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .35s"}}>
      <div style={{width:560,maxWidth:"90%",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>&#x1F3AF;</div>
        <h1 style={{fontSize:32,fontWeight:800,color:T.text,marginBottom:8}}>Mock Exam Simulation</h1>
        <p style={{fontSize:15,color:T.muted,marginBottom:32,lineHeight:1.7}}>Day 8 &#xB7; <strong style={{color:T.accent}}>{META.course}</strong></p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:32}}>
          {[["50","Questions"],["60","Minutes"],[META.pass+"%","To Pass"]].map(([v,l],i)=>(
            <div key={i} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:"20px 16px"}}>
              <div style={{fontSize:24,fontWeight:800,color:T.text}}>{v}</div><div style={{fontSize:11,color:T.dim,marginTop:4}}>{l}</div>
            </div>))}
        </div>
        <div style={{background:T.infoBg,border:"1px solid "+T.infoBorder,borderRadius:12,padding:"16px 20px",marginBottom:28,textAlign:"left"}}>
          <div style={{fontSize:13,fontWeight:700,color:T.info,marginBottom:6}}>Exam Rules</div>
          <div style={{fontSize:13,color:T.muted,lineHeight:1.8}}>&#x2022; One correct answer per question &#x2022; Flag for review &#x2022; Auto-submits at 0:00 &#x2022; Full review after</div>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",alignItems:"center"}}>
          <Btn primary onClick={begin}>Begin Exam</Btn>
          <ThemePicker theme={theme} setTheme={setTheme} T={T} pos={{bottom:52,left:"50%",transform:"translateX(-50%)"}}/>
        </div>
      </div><style>{css}</style>
    </div>);

  /* RESULTS / REVIEW */
  if(phase==="results"||phase==="review") return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",color:T.text2,transition:"all .35s"}}>
      <header style={{background:T.surface,borderBottom:"1px solid "+T.border,padding:"0 28px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,"+T.accent+","+T.accentHover+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>&#x1F3AF;</div>
          <span style={{fontWeight:700,fontSize:15,color:T.text}}>Exam {phase==="results"?"Results":"Review"}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {phase==="results"&&<Btn small onClick={()=>setPhase("review")}>Review Answers</Btn>}
          {phase==="review"&&<Btn small onClick={()=>setPhase("results")}>Back to Results</Btn>}
          <Btn small primary onClick={begin}>Retake</Btn>
          <ThemePicker theme={theme} setTheme={setTheme} T={T}/>
        </div>
      </header>
      {phase==="results"?(
        <div style={{flex:1,overflowY:"auto",padding:"32px 24px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{background:passed?T.successBg:T.dangerBg,border:"2px solid "+(passed?T.successBorder:T.dangerBorder),borderRadius:20,padding:40,textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:64,marginBottom:12}}>{passed?"&#x1F389;":"&#x1F4DA;"}</div>
              <div style={{fontSize:56,fontWeight:800,color:passed?T.success:T.danger,lineHeight:1}}>{score}%</div>
              <div style={{fontSize:16,fontWeight:600,color:passed?T.success:T.danger,marginTop:8}}>{passed?"You Passed!":"Keep Studying"}</div>
              <div style={{fontSize:13,color:T.muted,marginTop:8}}>{correct}/{QS.length} correct &#xB7; {META.pass}% needed</div>
            </div>
            <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:16,padding:"24px 28px",marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginBottom:16}}>Topic Breakdown</div>
              {topicStats.map((tp,i)=>(
                <div key={i} style={{marginBottom:i<topicStats.length-1?16:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:600,color:T.text}}>{tp.topic}</span>
                    <span style={{fontSize:13,fontWeight:700,color:tp.pct>=80?T.success:tp.pct>=60?T.accent:T.danger}}>{tp.correct}/{tp.total} ({tp.pct}%)</span>
                  </div>
                  <div style={{height:8,background:T.surface2,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,width:tp.pct+"%",background:tp.pct>=80?T.success:tp.pct>=60?T.accent:tp.danger,transition:"width .6s"}}/>
                  </div>
                </div>))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[["Answered",answered+"/"+QS.length],["Correct",correct],["Wrong",answered-correct],["Flagged",flagged.size]].map(([l,v],i)=>(
                <div key={i} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:T.text}}>{v}</div><div style={{fontSize:11,color:T.dim,marginTop:4}}>{l}</div>
                </div>))}
            </div>
          </div>
        </div>
      ):(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:740,margin:"0 auto"}}>
            {QS.map((rq,i)=>{
              const picked=ans[rq.id],isC=picked===rq.a,wasA=picked!==undefined;
              return(
                <div key={rq.id} style={{background:T.surface,border:"1px solid "+(wasA?(isC?T.successBorder:T.dangerBorder):T.border),borderRadius:14,padding:"20px 24px",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <span style={{width:28,height:28,borderRadius:8,background:wasA?(isC?T.successBg:T.dangerBg):T.surface2,border:"1px solid "+(wasA?(isC?T.successBorder:T.dangerBorder):T.border2),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:wasA?(isC?T.success:T.danger):T.dim,flexShrink:0}}>{wasA?(isC?"&#x2713;":"&#x2717;"):"-"}</span>
                    <span style={{fontSize:11,fontWeight:600,color:T.accent,background:T.accentBg,padding:"3px 8px",borderRadius:5}}>{rq.t}</span>
                    <span style={{fontSize:11,color:T.dim,marginLeft:"auto"}}>Q{i+1}</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:12,lineHeight:1.6}}>{rq.q}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                    {rq.o.map((opt,oi)=>{
                      const isAns=oi===rq.a,isPick=oi===picked;
                      return(<div key={oi} style={{padding:"10px 14px",borderRadius:8,fontSize:13,border:"1.5px solid "+(isAns?T.successBorder:isPick?T.dangerBorder:T.border),background:isAns?T.successBg:isPick?T.dangerBg:"transparent",color:isAns?T.success:isPick?T.danger:T.muted,fontWeight:isAns||isPick?600:400,display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontWeight:700}}>{String.fromCharCode(65+oi)}.</span>{opt}{isAns&&<span style={{marginLeft:"auto",fontSize:11}}>Correct</span>}{isPick&&!isAns&&<span style={{marginLeft:"auto",fontSize:11}}>Your pick</span>}
                      </div>)})}
                  </div>
                  <div style={{background:T.infoBg,border:"1px solid "+T.infoBorder,borderRadius:8,padding:"12px 16px",fontSize:13,color:T.muted,lineHeight:1.6}}>
                    <strong style={{color:T.info}}>Explanation:</strong> {rq.e}
                  </div>
                </div>)})}
          </div>
        </div>
      )}
      <style>{css}</style>
    </div>);

  /* EXAM */
  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",color:T.text2,transition:"all .35s"}}>
      <header style={{background:T.surface,borderBottom:"1px solid "+T.border,padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:13,fontWeight:700,color:T.text}}>Mock Exam</span>
          <span style={{fontSize:12,color:T.dim}}>Q{cur+1}/{QS.length}</span>
          <div style={{width:120,height:6,background:T.surface2,borderRadius:3,overflow:"hidden"}}><div style={{width:(answered/QS.length*100)+"%",height:"100%",background:T.accent,borderRadius:3,transition:"width .3s"}}/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:22,fontWeight:800,fontVariantNumeric:"tabular-nums",color:urgent?T.danger:T.text,animation:urgent?"pulse 1s ease-in-out infinite":"none"}}>{mm}:{ss}</div>
          <button onClick={()=>setShowNav(!showNav)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+T.border2,background:showNav?T.accentBg:"transparent",color:showNav?T.accent:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Nav</button>
          <ThemePicker theme={theme} setTheme={setTheme} T={T}/>
        </div>
      </header>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {showNav&&(
          <div style={{width:260,flexShrink:0,borderRight:"1px solid "+T.border,background:T.raised,padding:16,overflowY:"auto"}}>
            <div style={{fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".5px",marginBottom:12}}>Navigator</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
              {QS.map((x,i)=>{
                const isCur=i===cur,isAns=ans[x.id]!==undefined,isF=flagged.has(x.id);
                return(<button key={i} onClick={()=>setCur(i)} style={{width:"100%",aspectRatio:"1",borderRadius:8,border:"1.5px solid "+(isCur?T.accent:isAns?T.successBorder:T.border),background:isCur?T.accentBg:isAns?T.successBg:"transparent",color:isCur?T.accent:isAns?T.success:T.dim,fontSize:12,fontWeight:isCur||isAns?700:500,cursor:"pointer",fontFamily:"inherit",position:"relative"}}>
                  {i+1}{isF&&<span style={{position:"absolute",top:-2,right:-2,fontSize:8}}>&#x1F6A9;</span>}
                </button>)})}
            </div>
            <div style={{marginTop:16,fontSize:11,color:T.muted}}>
              <div>Answered: {answered} &#xB7; Left: {QS.length-answered} &#xB7; Flagged: {flagged.size}</div>
            </div>
          </div>
        )}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto",padding:"32px 40px"}}>
            <div style={{maxWidth:680,margin:"0 auto"}}>
              <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:11,fontWeight:600,color:T.accent,background:T.accentBg,border:"1px solid "+T.accentBorder,padding:"4px 10px",borderRadius:6}}>{q.t}</span>
                <span style={{fontSize:12,color:T.dim}}>Q{cur+1}/{QS.length}</span>
                <button onClick={()=>setFlagged(p=>{const n=new Set(p);n.has(q.id)?n.delete(q.id):n.add(q.id);return n})} style={{marginLeft:"auto",padding:"4px 10px",borderRadius:6,border:"1px solid "+(flagged.has(q.id)?T.dangerBorder:T.border2),background:flagged.has(q.id)?T.dangerBg:"transparent",color:flagged.has(q.id)?T.danger:T.dim,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {flagged.has(q.id)?"Flagged":"Flag"}
                </button>
              </div>
              <h2 style={{fontSize:20,fontWeight:700,color:T.text,lineHeight:1.6,marginBottom:28}}>{q.q}</h2>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {q.o.map((opt,oi)=>{
                  const sel=ans[q.id]===oi;
                  return(
                    <button key={oi} onClick={()=>setAns(p=>({...p,[q.id]:oi}))} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderRadius:12,border:"2px solid "+(sel?T.accentBorder:T.border),background:sel?T.accentBg:T.surface,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}
                      onMouseEnter={e=>{if(!sel){e.currentTarget.style.borderColor=T.border2;e.currentTarget.style.background=T.surface2}}}
                      onMouseLeave={e=>{if(!sel){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface}}}>
                      <span style={{width:32,height:32,borderRadius:8,background:sel?T.accent+"20":T.surface2,border:"1.5px solid "+(sel?T.accent:T.border2),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:sel?T.accent:T.dim,flexShrink:0}}>
                        {String.fromCharCode(65+oi)}
                      </span>
                      <span style={{fontSize:14,color:sel?T.text:T.muted,fontWeight:sel?600:400}}>{opt}</span>
                      {sel&&<span style={{marginLeft:"auto",color:T.accent,fontWeight:800}}>&#x25CF;</span>}
                    </button>)})}
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid "+T.border,padding:"14px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface,flexShrink:0}}>
            <Btn small onClick={()=>setCur(p=>Math.max(0,p-1))} disabled={cur===0}>&#x2190; Prev</Btn>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12,color:T.dim}}>{answered}/{QS.length}</span>
              <button onClick={submit} style={{padding:"8px 16px",borderRadius:8,border:"1px solid "+(answered===QS.length?T.accent+"60":T.dangerBorder),background:answered===QS.length?T.accentBg:T.dangerBg,color:answered===QS.length?T.accent:T.danger,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                Submit{answered<QS.length?` (${QS.length-answered} left)`:""}
              </button>
            </div>
            {cur<QS.length-1?<Btn small primary onClick={()=>setCur(p=>p+1)}>Next &#x2192;</Btn>:<div style={{width:90}}/>}
          </div>
        </div>
      </div>
      <style>{css}</style>
    </div>);
}
