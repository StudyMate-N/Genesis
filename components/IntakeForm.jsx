"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════
//  SMART ACADEMIC DATABASE — Single source of truth for form + toasts
// ══════════════════════════════════════════════════════════════════
const UNIVERSITY_DB = [
  { name:"Rasmussen University", codes:["MDC1","MDC2","MDC3","NUR2115","NUR2474","BIO205","PSY1012","HIM2722"], region:"FL/MN" },
  { name:"University of Maryland", codes:["BIO-201","CHEM-131","PHYS-161","PSYC-100","MATH-140","BSCI-222","KNES-300"], region:"MD" },
  { name:"New York University", codes:["BIO101","CHEM202","PHYS101","PSYCH-UA1","ECON-UA2","MATH-UA121","NEURO-UA30"], region:"NY" },
  { name:"Johns Hopkins University", codes:["AS.020.151","AS.030.101","AS.171.101","AS.050.100","EN.553.111","AS.020.306"], region:"MD" },
  { name:"University of Florida", codes:["BSC2010","CHM2045","PHY2048","PSY2012","STA2023","MCB3020","PCB3063"], region:"FL" },
  { name:"University of Central Florida", codes:["BSC1010C","CHM2045C","PHY2048C","PSY2012","STA2014","MCB3020","PCB3063"], region:"FL" },
  { name:"Ohio State University", codes:["BIOLOGY 1113","CHEM 1210","PHYSICS 1250","PSYCH 1100","STAT 1350","MICRBIO 4000"], region:"OH" },
  { name:"Penn State University", codes:["BIOL 110","CHEM 110","PHYS 211","PSYCH 100","STAT 200","MICRB 201","BIOCH 501"], region:"PA" },
  { name:"University of Michigan", codes:["BIOLOGY 171","CHEM 210","PHYSICS 140","PSYCH 111","STATS 250","MCDB 310"], region:"MI" },
  { name:"UCLA", codes:["LS7A","CHEM14A","PHYSICS5A","PSYCH10","STATS10","MIMG101","PHYSCI5"], region:"CA" },
  { name:"University of Texas at Austin", codes:["BIO311C","CH301","PHY302K","PSY301","SDS302","MIC320","BCH369"], region:"TX" },
  { name:"Boston University", codes:["BI107","CH101","PY105","PS101","MA113","MI300","BI315"], region:"MA" },
  { name:"Columbia University", codes:["BIOL1500","CHEM1403","PHYS1401","PSYC1001","STAT1001","BIOL3500"], region:"NY" },
  { name:"Duke University", codes:["BIOLOGY 201L","CHEM 101DL","PHYSICS 141L","PSY 101","STA 101","BIOLOGY 212"], region:"NC" },
  { name:"Emory University", codes:["BIOL141","CHEM150","PHYS141","PSYC110","QTM100","BIOL250","NBB201"], region:"GA" },
  { name:"Georgetown University", codes:["BIOL-103","CHEM-115","PHYS-101","PSYC-001","MATH-035","MICB-203"], region:"DC" },
  { name:"University of Washington", codes:["BIOL 180","CHEM 142","PHYS 121","PSYCH 101","STAT 311","MICROM 301"], region:"WA" },
  { name:"Arizona State University", codes:["BIO181","CHM113","PHY111","PSY101","STP226","MIC205","BCH361"], region:"AZ" },
  { name:"University of Southern California", codes:["BISC120","CHEM105A","PHYS151","PSYC100","MATH118","MICB301"], region:"CA" },
  { name:"Indiana University", codes:["BIOL-L111","CHEM-C105","PHYS-P201","PSY-P101","STAT-S301","MICR-M310"], region:"IN" },
  { name:"University of North Carolina", codes:["BIOL101","CHEM101","PHYS114","PSYC101","STOR155","BIOL202","MCRO251"], region:"NC" },
  { name:"University of Virginia", codes:["BIOL2100","CHEM1410","PHYS1425","PSYC1010","STAT2120","MICR3054"], region:"VA" },
  { name:"University of Wisconsin-Madison", codes:["BIOLOGY 151","CHEM 103","PHYSICS 201","PSYCH 202","STAT 301","MICRO 303"], region:"WI" },
  { name:"Purdue University", codes:["BIOL 110","CHM 115","PHYS 172","PSY 120","STAT 301","BIOL 221","BCHM 307"], region:"IN" },
  { name:"University of Illinois", codes:["MCB 150","CHEM 102","PHYS 211","PSYC 100","STAT 200","MCB 300","BIOC 354"], region:"IL" },
  { name:"University of Pittsburgh", codes:["BIOSC0150","CHEM0110","PHYS0174","PSY0010","STAT0200","BIOSC0350"], region:"PA" },
  { name:"Rutgers University", codes:["01:119:115","01:160:159","01:750:203","01:830:101","01:960:211","01:694:301"], region:"NJ" },
  { name:"University of Minnesota", codes:["BIOL 1009","CHEM 1061","PHYS 1301","PSY 1001","STAT 1001","MICB 3301"], region:"MN" },
  { name:"Georgia Institute of Technology", codes:["BIOL1510","CHEM1310","PHYS2211","PSYC1101","MATH1553","BIOL2344"], region:"GA" },
  { name:"University of Miami", codes:["BIL150","CHM111","PHY101","PSY110","STA210","BIL250","MIC301"], region:"FL" },
  { name:"Vanderbilt University", codes:["BSCI1510","CHEM1601","PHYS1501","PSY1200","MATH1300","BSCI2520"], region:"TN" },
  { name:"Northwestern University", codes:["BIOL_SCI 215","CHEM 131","PHYSICS 135","PSYCH 110","STAT 202","BIOL_SCI 315"], region:"IL" },
  { name:"Stanford University", codes:["BIO41","CHEM31A","PHYSICS41","PSYCH1","STATS60","BIO82","MICRO130"], region:"CA" },
  { name:"Yale University", codes:["BIOL101","CHEM161","PHYS170","PSYC110","S&DS100","MCDB120"], region:"CT" },
  { name:"Harvard University", codes:["LIFESCI1A","CHEM17","PHYSICS15A","PSY1","STAT110","MCB52"], region:"MA" },
  { name:"Cornell University", codes:["BIOMG1350","CHEM2070","PHYS1112","PSYCH1101","STSCI2100","MICRO2900"], region:"NY" },
  { name:"University of Colorado Boulder", codes:["EBIO1210","CHEM1113","PHYS1110","PSYC1001","APPM1350","MCDB3135"], region:"CO" },
  { name:"Michigan State University", codes:["BS161","CEM141","PHY183","PSY101","STT200","MMG301","BMB401"], region:"MI" },
  { name:"University of Iowa", codes:["BIOL:1411","CHEM:1110","PHYS:1611","PSY:1001","STAT:1020","MICR:3145"], region:"IA" },
  { name:"Texas A&M University", codes:["BIOL111","CHEM101","PHYS218","PSYC107","STAT302","BICH411","VTMI301"], region:"TX" },
  { name:"University of Georgia", codes:["BIOL1107","CHEM1211","PHYS1111","PSYC1101","STAT2000","MIBO3000"], region:"GA" },
  { name:"Florida State University", codes:["BSC1005","CHM1045","PHY2048","PSY2012","STA2122","MCB4503"], region:"FL" },
  { name:"University of Arizona", codes:["ECOL182R","CHEM141","PHYS141","PSYC101","MATH163","MCB181R"], region:"AZ" },
  { name:"Oregon State University", codes:["BI211","CH231","PH201","PSY201","ST351","MB302","BB450"], region:"OR" },
  { name:"Virginia Tech", codes:["BIOL1105","CHEM1035","PHYS2305","PSYC1004","STAT3005","BIOL2604"], region:"VA" },
  { name:"Wake Forest University", codes:["BIO111","CHM111","PHY113","PSY151","STA112","BIO214","MIC311"], region:"NC" },
  { name:"Tufts University", codes:["BIO13","CHEM1","PHY1","PSY1","MATH34","BIO51","BIO105"], region:"MA" },
  { name:"University of Connecticut", codes:["BIOL1107","CHEM1127Q","PHYS1501Q","PSYC1100","STAT1000Q","MCB2000"], region:"CT" },
  { name:"Temple University", codes:["BIOL1111","CHEM1031","PHYS1061","PSYC1001","STAT1001","BIOL2112"], region:"PA" },
  { name:"Drexel University", codes:["BIO123","CHEM101","PHYS101","PSY101","MATH121","BIO230","MICRO220"], region:"PA" }
];

// Course name lookup from codes
const CODE_TO_COURSE = {
  "MDC1":"Medical Dosage Calculations I","MDC2":"Medical Dosage Calculations II","MDC3":"Medical Dosage Calculations III",
  "NUR2115":"Fundamentals of Nursing","NUR2474":"Pharmacology for Nursing","BIO205":"Microbiology",
  "BIO-201":"Introduction to Microbiology","CHEM-131":"General Chemistry I","PHYS-161":"Physics I",
  "BIO101":"General Biology I","CHEM202":"Organic Chemistry II","PHYS101":"Introductory Physics",
  "BSC2010":"Biology I","CHM2045":"General Chemistry I","MCB3020":"Microbiology",
  "LS7A":"Genetics, Evolution & Ecology","CHEM14A":"General Chemistry","PHYSICS5A":"Mechanics",
  "BIOL1510":"Biological Principles","CHEM1310":"General Chemistry","PHYS2211":"Introductory Physics",
  "PSY1012":"Introduction to Psychology","HIM2722":"Health Information Management",
};

const ALL_COURSES_FLAT = UNIVERSITY_DB.flatMap(u => u.codes.map(c => ({ code: c, uni: u.name, courseName: CODE_TO_COURSE[c] || null })));
const ALL_UNI_NAMES = UNIVERSITY_DB.map(u => u.name);

// ══════════════════════════════════════════════════
//  A/B TEST CONFIG
// ══════════════════════════════════════════════════
const AB = {
  headline: { A:{ title:"Ace Your Next Exam", sub:"Tell us what you're studying and we'll build your personalized prep plan in under 24 hours." }, B:{ title:"Your Personalized Study Plan Starts Here", sub:"Students who prep with CertiPrep score 23% higher on average. Let's build yours." }, C:{ title:"Stop Stressing, Start Preparing", sub:"Custom study plans built around your exam, your timeline, and your materials." }},
  cta: { A:"Get My Study Plan →", B:"Build My Prep Plan — Free Quote", C:"Start Preparing Now →" }
};
const ACTIVE = { headline:"A", cta:"A" };

const TOPIC_PRESETS = {
  "BIO-201":["Cell Structure","Bacteria Classification","Viruses","Fungi & Parasites","Immunology","Microbial Genetics","Antimicrobials"],
  "BIO205":["Cell Structure","Bacteria Classification","Viruses","Fungi & Parasites","Immunology","Microbial Genetics"],
  "MDC1":["Dosage Calculations","Unit Conversions","IV Drip Rates","Oral Medications","Pediatric Dosing"],
  "NUR2115":["Nursing Process","Vital Signs","Patient Assessment","Documentation","Safety","Infection Control"],
  "CHEM-131":["Atomic Structure","Chemical Bonding","Stoichiometry","Solutions","Acids & Bases","Thermodynamics"],
};

const B = { headerBg:"#4a5568",headerDark:"#2d3748",gold:"#ecc94b",goldHover:"#d69e2e",goldBg:"#fefcbf",goldBgSoft:"#fffff0",dark:"#1a202c",text:"#2d3748",muted:"#718096",light:"#a0aec0",border:"#e2e8f0",borderL:"#edf2f7",bg:"#f7fafc",card:"#ffffff" };

// ══════════════════════════════════════════════════
//  URGENCY TOAST — Pulls from same DB
// ══════════════════════════════════════════════════
function ActivityToast() {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState(null);
  const [cycle, setCycle] = useState(0);

  const generateMsg = useCallback(() => {
    const uni = UNIVERSITY_DB[Math.floor(Math.random() * UNIVERSITY_DB.length)];
    const code = uni.codes[Math.floor(Math.random() * uni.codes.length)];
    const mins = Math.floor(Math.random() * 12) + 2;
    const actions = [
      `A student from ${uni.name} just received their study package for ${code}`,
      `Someone at ${uni.name} just started their ${code} prep plan`,
      `A ${uni.name} student just submitted their ${code} exam prep request`,
    ];
    return { text: actions[Math.floor(Math.random() * actions.length)], time: `${mins} min ago`, uni: uni.name };
  }, []);

  useEffect(() => {
    // First toast at 8s
    const t1 = setTimeout(() => {
      setMsg(generateMsg());
      setVisible(true);
    }, 8000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Hide after 5s
    const hide = setTimeout(() => setVisible(false), 5000);
    // Next toast after 25-40s
    const next = setTimeout(() => {
      setMsg(generateMsg());
      setVisible(true);
      setCycle(c => c + 1);
    }, 25000 + Math.random() * 15000);
    return () => { clearTimeout(hide); clearTimeout(next); };
  }, [visible, cycle, generateMsg]);

  if (!msg) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999, maxWidth: 360,
      background: B.card, border: `1.5px solid ${B.gold}40`, borderRadius: 14,
      padding: "14px 18px", boxShadow: "0 8px 32px rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.04)",
      display: "flex", gap: 12, alignItems: "flex-start",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
      transition: "all .4s cubic-bezier(.4,0,.2,1)",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fff4", border: "1px solid #c6f6d5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📚</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: B.text, lineHeight: 1.5 }}>{msg.text}</div>
        <div style={{ fontSize: 11, color: B.light, marginTop: 3, fontWeight: 500 }}>{msg.time}</div>
      </div>
      <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: B.light, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>✕</button>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  SEARCHABLE DROPDOWN
// ══════════════════════════════════════════════════
function SearchableSelect({ label, required, placeholder, value, onChange, suggestions = [], icon, error, badge, helpText, onSelect }) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const minChars = 2;
  const q = value || "";
  const filtered = q.length >= minChars ? suggestions.filter(s => {
    const str = typeof s === "string" ? s : s.label;
    return str.toLowerCase().includes(q.toLowerCase()) && str.toLowerCase() !== q.toLowerCase();
  }).slice(0, 8) : [];

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setFocused(false); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelect = (item) => {
    const val = typeof item === "string" ? item : item.value;
    onChange(val);
    setOpen(false);
    setFocused(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div ref={ref} style={{ marginBottom: 20, position: "relative" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: B.dark, marginBottom: 6 }}>
        {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "#e53e3e", fontSize: 11, fontWeight: 700 }}>*</span>}
        {!required && <span style={{ color: B.light, fontSize: 11, fontWeight: 400, marginLeft: 4 }}>optional</span>}
      </label>
      <input
        value={value || ""}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => { setFocused(true); setOpen(true); }}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          border: `1.5px solid ${error ? "#e53e3e" : focused ? B.gold : B.border}`,
          fontSize: 14, fontFamily: "inherit", color: B.dark, background: B.card,
          outline: "none", transition: "all .2s", boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${error ? "#fed7d740" : B.gold + "25"}` : "none",
        }}
      />
      {error && <div style={{ fontSize: 12, color: "#e53e3e", marginTop: 4, fontWeight: 500 }}>{error}</div>}
      {helpText && !error && !badge && <div style={{ fontSize: 11, color: B.light, marginTop: 4 }}>{helpText}</div>}
      {badge && !error && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, animation: "fadeUp .3s ease" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#16a34a" }}>✓</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{badge}</span>
        </div>
      )}
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 30,
          background: B.card, border: `1px solid ${B.border}`, borderRadius: 10,
          boxShadow: "0 8px 28px rgba(0,0,0,.12)", marginTop: 4, overflow: "hidden", maxHeight: 240, overflowY: "auto"
        }}>
          {filtered.map((item, i) => {
            const label = typeof item === "string" ? item : item.label;
            const sub = typeof item === "object" ? item.sub : null;
            return (
              <button key={i} onMouseDown={() => handleSelect(item)} style={{
                width: "100%", padding: "10px 14px", border: "none", background: "transparent",
                textAlign: "left", fontSize: 13, color: B.text, cursor: "pointer", fontFamily: "inherit",
                borderBottom: i < filtered.length - 1 ? `1px solid ${B.borderL}` : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                transition: "background .1s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = B.borderL}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{label}</div>
                  {sub && <div style={{ fontSize: 11, color: B.light, marginTop: 1 }}>{sub}</div>}
                </div>
                {typeof item === "object" && item.badge && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a", background: "#f0fff4", padding: "2px 8px", borderRadius: 10, flexShrink: 0 }}>✓ Ready</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
//  FILE ROW — with processing animation
// ══════════════════════════════════════════════════
function FileRow({ file, onRemove, index }) {
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1200 + Math.random() * 800;
    const interval = 30;
    let elapsed = 0;
    const iv = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) { clearInterval(iv); setTimeout(() => setProcessing(false), 300); }
    }, interval);
    return () => clearInterval(iv);
  }, []);

  const ext = file.name.split(".").pop().toLowerCase();
  const icons = { pdf: "📕", docx: "📘", doc: "📘", pptx: "📙", ppt: "📙", png: "🖼️", jpg: "🖼️", jpeg: "🖼️", zip: "📦" };
  const icon = icons[ext] || "📄";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
      background: processing ? "#fffdf7" : "#f0fff4",
      border: `1px solid ${processing ? `${B.gold}30` : "#c6f6d5"}`,
      borderRadius: 10, marginBottom: 4, fontSize: 12.5,
      animation: `fadeUp .3s ease ${index * 0.1}s both`,
      transition: "all .4s ease"
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{processing ? "⚙️" : icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: B.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
        {processing ? (
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 3, background: B.borderL, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg, ${B.gold}, ${B.goldHover})`, borderRadius: 99, width: `${progress}%`, transition: "width .05s linear" }} />
            </div>
            <div style={{ fontSize: 10, color: B.light, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, border: `1.5px solid ${B.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
              Analyzing file...
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 10.5, color: "#38a169", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <span>✓</span> Processed — {(file.size / 1048576).toFixed(1)}MB
          </div>
        )}
      </div>
      <button onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: B.light, fontSize: 14, padding: "4px", borderRadius: 4, transition: "color .15s" }}
        onMouseEnter={e => e.currentTarget.style.color = "#e53e3e"}
        onMouseLeave={e => e.currentTarget.style.color = B.light}
      >✕</button>
    </div>
  );
}

function SelectInput({ label, required, options, value, onChange, icon, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: B.dark, marginBottom: 6 }}>
        {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
        {label}
        {required && <span style={{ color: "#e53e3e", fontSize: 11, fontWeight: 700 }}>*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#e53e3e" : focused ? B.gold : B.border}`, fontSize: 14, fontFamily: "inherit", color: value ? B.dark : B.light, background: B.card, outline: "none", cursor: "pointer", appearance: "none", boxSizing: "border-box", boxShadow: focused ? `0 0 0 3px ${B.gold}25` : "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", transition: "all .2s" }}>
        <option value="" disabled>{placeholder || "Select..."}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <div style={{ fontSize: 12, color: "#e53e3e", marginTop: 4, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function TopicChips({ topics, selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {topics.map(t => {
        const active = selected.includes(t);
        return (
          <button key={t} onClick={() => onToggle(t)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", border: `1.5px solid ${active ? B.gold : B.border}`, background: active ? B.goldBg : B.card, color: active ? B.dark : B.muted }}>
            {active && "✓ "}{t}
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════
//  MAIN FORM
// ══════════════════════════════════════════════════
export default function IntakeForm() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showExtra, setShowExtra] = useState(false);

  // Field focus tracking for progressive unwrap
  const [fieldProgress, setFieldProgress] = useState(0); // 0=institution, 1=course code, 2=course name, 3=exam type, 4=exam date

  const [form, setForm] = useState({
    institution: "", courseCode: "", course: "", examType: "",
    examDate: "", topics: [], dailyHours: "",
    files: [], notes: "", email: "", name: ""
  });

  useEffect(() => { setTimeout(() => setReady(true), 50); }, []);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  // Dynamic course code suggestions based on institution
  const selectedUni = UNIVERSITY_DB.find(u => u.name === form.institution);
  const codeOptions = selectedUni
    ? selectedUni.codes.map(c => ({
        value: c, label: c,
        sub: CODE_TO_COURSE[c] || null,
        badge: true
      }))
    : ALL_COURSES_FLAT.slice(0, 30).map(c => ({
        value: c.code, label: c.code,
        sub: `${c.uni}${c.courseName ? " · " + c.courseName : ""}`,
        badge: true
      }));

  // Trust badge for course code
  const codeInDB = ALL_COURSES_FLAT.find(c => c.code === form.courseCode);
  const codeBadge = codeInDB ? `We have verified materials ready for ${form.courseCode}` : null;

  // Smart duration
  const daysUntilExam = form.examDate ? Math.max(0, Math.ceil((new Date(form.examDate) - new Date()) / 864e5)) : null;
  const isUrgent = daysUntilExam !== null && daysUntilExam < 7;

  // Topic presets from course code
  const topicPresets = TOPIC_PRESETS[form.courseCode] || [];
  const toggleTopic = t => set("topics", form.topics.includes(t) ? form.topics.filter(x => x !== t) : [...form.topics, t]);

  // Progressive unwrap logic
  useEffect(() => {
    let p = 0;
    if (form.institution) p = 1;
    if (form.courseCode) p = 2;
    if (form.course) p = 3;
    if (form.examType) p = 4;
    if (form.examDate) p = 5;
    setFieldProgress(p);
  }, [form.institution, form.courseCode, form.course, form.examType, form.examDate]);

  // Auto-fill course name from code
  const handleCodeSelect = (item) => {
    if (typeof item === "object") {
      set("courseCode", item.value);
      if (CODE_TO_COURSE[item.value] && !form.course) {
        set("course", CODE_TO_COURSE[item.value]);
      }
    }
  };

  const handleInstitutionSelect = (item) => {
    const name = typeof item === "string" ? item : item.value || item;
    set("institution", name);
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.institution.trim()) e.institution = "Select your institution";
      if (!form.courseCode.trim()) e.courseCode = "Enter or select a course code";
      if (!form.course.trim()) e.course = "Course name is required";
      if (!form.examType) e.examType = "Select your exam type";
      if (!form.examDate) e.examDate = "When is your exam?";
      else if (new Date(form.examDate) < new Date()) e.examDate = "Date must be in the future";
    }
    if (s === 2) {
      if (!form.email.trim()) e.email = "We need your email to send the quote";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.name.trim()) e.name = "What should we call you?";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep(step)) { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const handleSubmit = () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); console.log("CONVERSION:", { variant: ACTIVE, form }); }, 1800);
  };

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.size <= 50 * 1024 * 1024);
    set("files", [...form.files, ...valid.map(f => ({ name: f.name, size: f.size }))]);
  };

  const headline = AB.headline[ACTIVE.headline];
  const ctaText = AB.cta[ACTIVE.cta];

  // ══════════════ SUCCESS STATE ══════════════
  if (submitted) return (
    <div style={{ fontFamily: "'DM Sans',-apple-system,sans-serif", minHeight: "100vh", background: B.bg, display: "flex", flexDirection: "column", opacity: ready ? 1 : 0, transition: "opacity .6s" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 480, animation: "fadeUp .5s ease" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fff4", border: "3px solid #c6f6d5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: B.dark, marginBottom: 8 }}>You're All Set!</h1>
          <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.6, marginBottom: 8 }}>We received your prep request for <strong style={{ color: B.dark }}>{form.courseCode} — {form.course}</strong> at {form.institution}.</p>
          <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, marginBottom: 28 }}>Your custom quote will arrive at <strong style={{ color: B.dark }}>{form.email}</strong> within 2–4 hours.</p>
          {isUrgent && <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#c53030", fontWeight: 500 }}>⚡ Since your exam is in {daysUntilExam} days, we'll prioritize a <strong>Study Package</strong> option for rapid prep.</div>}
          <div style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 14, padding: "20px 24px", textAlign: "left", marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.light, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 12 }}>What happens next</div>
            {["📋 Our prep team reviews your details and materials", "💰 Custom quote sent to your email (no obligation)", "✅ Accept and your study plan activates instantly", "📚 Start your day-by-day personalized preparation"].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${B.borderL}` : "none", fontSize: 14, color: B.text, lineHeight: 1.5 }}>{s}</div>
            ))}
          </div>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm({ institution: "", courseCode: "", course: "", examType: "", examDate: "", topics: [], dailyHours: "", files: [], notes: "", email: "", name: "" }); }}
            style={{ padding: "12px 28px", borderRadius: 10, border: `1.5px solid ${B.border}`, background: B.card, color: B.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Submit Another Request</button>
        </div>
      </div>
    </div>
  );

  // ══════════════ MAIN RENDER ══════════════
  return (
    <div style={{ fontFamily: "'DM Sans',-apple-system,sans-serif", minHeight: "100vh", background: B.bg, display: "flex", flexDirection: "column", opacity: ready ? 1 : 0, transition: "opacity .6s" }}>
      <Header />
      <ActivityToast />

      {/* ═══ HERO ═══ */}
      <div style={{ background: `linear-gradient(180deg, ${B.headerDark} 0%, ${B.headerBg} 50%, ${B.bg} 100%)`, padding: "48px 20px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: "6px 16px", marginBottom: 20, animation: "fadeUp .5s ease" }}>
          <div style={{ display: "flex" }}>{["😊", "📚", "🎯"].map((e, i) => <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginLeft: i ? -6 : 0, border: "1.5px solid rgba(255,255,255,.1)" }}>{e}</div>)}</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)" }}>500+ students prepared this semester</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 auto 12px", maxWidth: 560, animation: "fadeUp .5s ease .05s both" }}>{headline.title}</h1>
        <p style={{ fontSize: "clamp(15px,2.5vw,17px)", color: "rgba(255,255,255,.6)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6, animation: "fadeUp .5s ease .1s both" }}>{headline.sub}</p>
      </div>

      {/* ═══ FORM CARD ═══ */}
      <div style={{ maxWidth: 600, margin: "-20px auto 40px", padding: "0 16px", width: "100%", position: "relative", zIndex: 10 }}>
        <div style={{ background: B.card, borderRadius: 20, border: `1px solid ${B.border}`, boxShadow: "0 4px 24px rgba(0,0,0,.06), 0 12px 48px rgba(0,0,0,.04)", overflow: "hidden", animation: "fadeUp .5s ease .15s both" }}>

          {/* Steps */}
          <div style={{ display: "flex", borderBottom: `1px solid ${B.borderL}` }}>
            {[{ n: 1, l: "Exam Details" }, { n: 2, l: "Get Your Quote" }].map(s => (
              <button key={s.n} onClick={() => s.n < step && setStep(s.n)} style={{ flex: 1, padding: "14px 16px", border: "none", cursor: s.n <= step ? "pointer" : "default", fontFamily: "inherit", fontSize: 13, fontWeight: s.n === step ? 700 : 500, color: s.n === step ? B.dark : s.n < step ? "#38a169" : B.light, background: s.n === step ? B.card : "transparent", borderBottom: s.n === step ? `2.5px solid ${B.gold}` : "2.5px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: s.n < step ? "#48bb78" : s.n === step ? B.gold : B.borderL, color: s.n < step ? "#fff" : s.n === step ? B.dark : B.light }}>{s.n < step ? "✓" : s.n}</div>
                {s.l}
              </button>
            ))}
          </div>

          {/* ═══ STEP 1 ═══ */}
          {step === 1 && (
            <div style={{ padding: "28px 28px 24px" }}>

              {/* ROW 1: Institution + Course Code (mandatory, 2-col) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, animation: "fadeUp .35s ease" }}>
                <SearchableSelect
                  label="Institution" required icon="🏛️"
                  placeholder="e.g. University of Maryland"
                  value={form.institution}
                  onChange={v => set("institution", v)}
                  onSelect={handleInstitutionSelect}
                  suggestions={ALL_UNI_NAMES.map(n => ({ value: n, label: n, sub: UNIVERSITY_DB.find(u => u.name === n)?.codes.length + " courses available", badge: true }))}
                  error={errors.institution}
                  helpText=""
                />
                <SearchableSelect
                  label="Course Code" required icon="🏷️"
                  placeholder={selectedUni ? `e.g. ${selectedUni.codes[0]}` : "e.g. BIO-201"}
                  value={form.courseCode}
                  onChange={v => set("courseCode", v)}
                  onSelect={handleCodeSelect}
                  suggestions={codeOptions}
                  error={errors.courseCode}
                  badge={codeBadge}
                  helpText={selectedUni ? `Suggestions available for ${selectedUni.name}` : ""}
                />
              </div>

              {/* ROW 2: Course Name — auto-populated or manual */}
              <div style={{ opacity: fieldProgress >= 1 ? 1 : 0.4, transform: fieldProgress >= 1 ? "translateY(0)" : "translateY(8px)", transition: "all .4s ease", pointerEvents: fieldProgress >= 1 ? "auto" : "none" }}>
                <SearchableSelect
                  label="Course Name" required icon="📚"
                  placeholder="e.g. Introduction to Microbiology"
                  value={form.course}
                  onChange={v => set("course", v)}
                  suggestions={Object.values(CODE_TO_COURSE).filter((v, i, a) => a.indexOf(v) === i)}
                  error={errors.course}
                  helpText={form.courseCode && CODE_TO_COURSE[form.courseCode] ? "Auto-filled from course code — feel free to edit" : ""}
                />
              </div>

              {/* ROW 3: Exam Type + Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, opacity: fieldProgress >= 2 ? 1 : 0.4, transform: fieldProgress >= 2 ? "translateY(0)" : "translateY(8px)", transition: "all .4s ease .05s", pointerEvents: fieldProgress >= 2 ? "auto" : "none" }}>
                <SelectInput label="Exam Type" required icon="📝" placeholder="Select type" value={form.examType} onChange={v => set("examType", v)} error={errors.examType}
                  options={[{ value: "midterm", label: "Midterm" }, { value: "final", label: "Final Exam" }, { value: "quiz", label: "Quiz / Test" }, { value: "internal", label: "Internal / Practical" }, { value: "other", label: "Other" }]} />
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: B.dark, marginBottom: 6 }}>
                    <span style={{ fontSize: 15 }}>📅</span> Exam Date <span style={{ color: "#e53e3e", fontSize: 11, fontWeight: 700 }}>*</span>
                  </label>
                  <input type="date" value={form.examDate} onChange={e => set("examDate", e.target.value)} min={new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${errors.examDate ? "#e53e3e" : B.border}`, fontSize: 14, fontFamily: "inherit", color: form.examDate ? B.dark : B.light, background: B.card, outline: "none", boxSizing: "border-box" }} />
                  {errors.examDate && <div style={{ fontSize: 12, color: "#e53e3e", marginTop: 4 }}>{errors.examDate}</div>}
                  {daysUntilExam !== null && !errors.examDate && (
                    <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 12, background: isUrgent ? "#fff5f5" : "#f0fff4", color: isUrgent ? "#e53e3e" : "#38a169" }}>
                      {isUrgent ? "⚡" : "📅"} {daysUntilExam} day{daysUntilExam !== 1 && "s"} away
                      {isUrgent && " — Study Package option included"}
                    </div>
                  )}
                </div>
              </div>

              {/* Smart topic chips */}
              {topicPresets.length > 0 && (
                <div style={{ marginBottom: 20, animation: "fadeUp .3s ease", opacity: fieldProgress >= 3 ? 1 : 0.4, transition: "opacity .4s" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: B.dark, marginBottom: 4 }}>
                    <span style={{ fontSize: 15 }}>🎯</span> Focus Topics <span style={{ color: B.light, fontSize: 11, fontWeight: 400, marginLeft: 4 }}>optional — helps us prioritize</span>
                  </label>
                  <div style={{ fontSize: 12, color: B.light, marginBottom: 6 }}>We detected topics for {form.courseCode}. Select what applies:</div>
                  <TopicChips topics={topicPresets} selected={form.topics} onToggle={toggleTopic} />
                </div>
              )}

              {/* Expandable extras — upgraded trigger */}
              {!showExtra && (
                <button onClick={() => setShowExtra(true)} style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  border: `1.5px dashed ${B.gold}60`, background: `linear-gradient(135deg, ${B.goldBgSoft}, ${B.goldBg}40)`,
                  color: B.dark, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "all .25s", animation: "subtlePulse 3s ease-in-out infinite",
                  boxShadow: `0 2px 12px ${B.gold}15`
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = B.gold; e.currentTarget.style.background = B.goldBg; e.currentTarget.style.boxShadow = `0 4px 20px ${B.gold}30`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.gold}60`; e.currentTarget.style.background = `linear-gradient(135deg, ${B.goldBgSoft}, ${B.goldBg}40)`; e.currentTarget.style.boxShadow = `0 2px 12px ${B.gold}15`; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{ fontSize: 18, animation: "gentleBounce 2s ease infinite" }}>📎</span>
                  <span>Upload materials for <strong style={{ color: B.goldHover }}>precision prep</strong> — boost accuracy by 20%</span>
                  <span style={{ fontSize: 16 }}>→</span>
                </button>
              )}

              {showExtra && (
                <div style={{ animation: "fadeUp .3s ease", borderTop: `1px solid ${B.borderL}`, paddingTop: 20, marginTop: 4 }}>
                  <SelectInput label="Daily Study Time" icon="⏰" placeholder="How much time can you study?"
                    value={form.dailyHours} onChange={v => set("dailyHours", v)}
                    options={[{ value: "1", label: "~1 hour/day" }, { value: "2-3", label: "2–3 hours/day" }, { value: "4-5", label: "4–5 hours/day" }, { value: "6+", label: "6+ hours/day (intensive)" }]} />

                  {/* ═══ ENHANCED UPLOAD SECTION ═══ */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <label style={{ fontSize: 14, fontWeight: 700, color: B.dark, display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 16, animation: "gentleBounce 2.5s ease infinite" }}>🚀</span>
                        Upload Materials for Precision Prep
                      </label>
                      <span style={{ fontSize: 10, fontWeight: 700, color: B.goldHover, background: B.goldBg, padding: "3px 10px", borderRadius: 12, flexShrink: 0, whiteSpace: "nowrap" }}>+20% accuracy</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: B.muted, lineHeight: 1.6, marginBottom: 12, marginTop: 0 }}>
                      Help us tailor your plan. The more context you provide — lecture slides, notes, or past quizzes — the more accurate your personalized prep will be. By sharing your materials, you also help our system scale and improve, ensuring every student gets top-tier, data-driven results.
                    </p>

                    {/* Drop zone with micro-animations */}
                    <div
                      onDragOver={e => {
                        e.preventDefault();
                        const t = e.currentTarget;
                        t.style.borderColor = B.gold;
                        t.style.background = `linear-gradient(135deg, ${B.goldBgSoft}, ${B.goldBg})`;
                        t.style.transform = "scale(1.01)";
                        t.querySelector("[data-upload-icon]").style.transform = "translateY(-6px)";
                      }}
                      onDragLeave={e => {
                        const t = e.currentTarget;
                        t.style.borderColor = B.border;
                        t.style.background = `linear-gradient(135deg, #fafbfc, ${B.borderL})`;
                        t.style.transform = "scale(1)";
                        t.querySelector("[data-upload-icon]").style.transform = "translateY(0)";
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        const t = e.currentTarget;
                        t.style.borderColor = B.border;
                        t.style.background = `linear-gradient(135deg, #fafbfc, ${B.borderL})`;
                        t.style.transform = "scale(1)";
                        t.querySelector("[data-upload-icon]").style.transform = "translateY(0)";
                        handleFiles(e.dataTransfer.files);
                      }}
                      onClick={() => document.getElementById("fu").click()}
                      style={{
                        border: `2px dashed ${B.border}`, borderRadius: 14,
                        padding: "28px 20px", textAlign: "center", cursor: "pointer",
                        transition: "all .3s cubic-bezier(.4,0,.2,1)",
                        background: `linear-gradient(135deg, #fafbfc, ${B.borderL})`,
                        position: "relative", overflow: "hidden"
                      }}
                    >
                      <input id="fu" type="file" multiple accept=".pdf,.docx,.pptx,.png,.jpg,.zip" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />

                      {/* Animated upload icon */}
                      <div data-upload-icon="" style={{
                        width: 52, height: 52, borderRadius: 14, margin: "0 auto 12px",
                        background: `linear-gradient(135deg, ${B.goldBgSoft}, ${B.goldBg})`,
                        border: `1.5px solid ${B.gold}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24, transition: "transform .3s cubic-bezier(.4,0,.2,1)",
                        animation: "subtlePulse 3s ease-in-out infinite"
                      }}>
                        📄
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 600, color: B.dark, marginBottom: 4 }}>
                        Drop files here or <span style={{ color: B.goldHover, fontWeight: 700 }}>browse</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: B.light }}>
                        PDF, DOCX, PPTX, Images, ZIP — up to 50MB each
                      </div>

                      {/* Power-up incentive */}
                      <div style={{
                        marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 11, fontWeight: 600, color: B.goldHover,
                        background: `${B.gold}15`, padding: "5px 14px", borderRadius: 20,
                      }}>
                        <span style={{ fontSize: 13 }}>⚡</span>
                        Power our system with your data for more precise prep
                      </div>
                    </div>

                    {/* Uploaded files with processing animation */}
                    {form.files.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        {form.files.map((f, i) => (
                          <FileRow key={i} file={f} onRemove={() => set("files", form.files.filter((_, j) => j !== i))} index={i} />
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#38a169", fontWeight: 500 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 8 }}>✓</span>
                          </div>
                          {form.files.length} file{form.files.length !== 1 && "s"} ready — prep accuracy boosted
                        </div>
                      </div>
                    )}

                    {/* Security note */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11, color: B.light }}>
                      <span>🔒</span> Your data is secure and used only for your personalized study plan.
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: B.dark, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 15 }}>💬</span> Notes <span style={{ color: B.light, fontSize: 11, fontWeight: 400, marginLeft: 4 }}>optional</span></label>
                    <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. I'm weakest in immunology, professor emphasizes clinical applications..." rows={3}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${B.border}`, fontSize: 13, fontFamily: "inherit", color: B.dark, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
                  </div>
                </div>
              )}

              {/* CTA */}
              <button onClick={handleNext} style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, letterSpacing: ".2px", background: `linear-gradient(135deg, ${B.gold}, ${B.goldHover})`, color: B.dark, boxShadow: `0 4px 16px ${B.gold}50`, transition: "all .2s", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px ${B.gold}70`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${B.gold}50`; e.currentTarget.style.transform = "none"; }}>
                {ctaText}
              </button>

              {/* Inline trust */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                {["🔒 Secure & private", "💰 No payment now", "⚡ Quote in 2–4hrs"].map((t, i) => (
                  <span key={i} style={{ fontSize: 11, color: B.light, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 2 ═══ */}
          {step === 2 && (
            <div style={{ padding: "28px 28px 24px", animation: "fadeUp .35s ease" }}>
              {/* Summary */}
              <div style={{ background: B.borderL, borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.light, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 10 }}>Your Request</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", fontSize: 13 }}>
                  <div><span style={{ color: B.light }}>School:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.institution}</span></div>
                  <div><span style={{ color: B.light }}>Code:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.courseCode}</span></div>
                  <div><span style={{ color: B.light }}>Course:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.course}</span></div>
                  <div><span style={{ color: B.light }}>Type:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.examType}</span></div>
                  <div><span style={{ color: B.light }}>Date:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.examDate && new Date(form.examDate + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
                  {form.files.length > 0 && <div><span style={{ color: B.light }}>Files:</span> <span style={{ fontWeight: 600, color: B.dark }}>{form.files.length}</span></div>}
                </div>
                {codeBadge && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 12, fontWeight: 600, color: "#16a34a" }}><span>✓</span> Materials ready for {form.courseCode}</div>}
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: B.gold, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8, padding: 0 }}>✏️ Edit</button>
              </div>

              <div style={{ fontSize: 15, fontWeight: 600, color: B.dark, marginBottom: 16 }}>Almost done — where should we send your custom quote?</div>

              <SearchableSelect label="Your Name" required icon="👤" placeholder="e.g. Sarah Williams" value={form.name} onChange={v => set("name", v)} suggestions={[]} error={errors.name} />
              <SearchableSelect label="Email Address" required icon="📧" placeholder="you@university.edu" value={form.email} onChange={v => set("email", v)} suggestions={[]} error={errors.email} helpText="We'll send your custom quote here — usually within 2–4 hours" />

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ padding: "14px 20px", borderRadius: 12, border: `1.5px solid ${B.border}`, background: B.card, color: B.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
                <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: "15px", borderRadius: 12, border: "none", cursor: submitting ? "default" : "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, background: submitting ? B.border : `linear-gradient(135deg, ${B.gold}, ${B.goldHover})`, color: submitting ? B.light : B.dark, boxShadow: submitting ? "none" : `0 4px 16px ${B.gold}50`, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {submitting ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(0,0,0,.2)", borderTopColor: B.dark, borderRadius: "50%", animation: "spin .8s linear infinite" }} />Submitting...</> : "Submit — Get Free Quote"}
                </button>
              </div>

              <div style={{ marginTop: 20, padding: "14px 16px", background: B.borderL, borderRadius: 10 }}>
                {["🔒 Your information is encrypted and never shared", "💰 No payment required — review your custom quote first", "⚡ Most quotes delivered within 2–4 hours"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: B.muted, padding: "4px 0" }}>{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "20px 0", flexWrap: "wrap" }}>
          {[{ n: "500+", l: "Students" }, { n: "23%", l: "Score Boost" }, { n: "< 4hr", l: "Turnaround" }, { n: "4.9★", l: "Rating" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: B.dark }}>{s.n}</div><div style={{ fontSize: 11, color: B.light }}>{s.l}</div></div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 600, margin: "16px auto 40px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: B.dark, textAlign: "center", marginBottom: 16 }}>Common Questions</h3>
          {[
            { q: "How does it work?", a: "Tell us about your exam, we build a day-by-day study plan with guides, flashcards, videos, quizzes, and a mock exam." },
            { q: "How much does it cost?", a: "Pricing depends on duration, scope, and content. You'll get a custom quote with no obligation." },
            { q: "What if my exam is in less than a week?", a: "We offer a concentrated Study Package — condensed guides, priority flashcards, and a mock exam delivered immediately." },
            { q: "Can I upload my own materials?", a: "Absolutely. Upload slides, notes, or past exams and we'll incorporate them into your plan." }
          ].map((f, i) => (
            <details key={i} style={{ background: B.card, border: `1px solid ${B.border}`, borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
              <summary style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: B.dark, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{f.q}<span style={{ color: B.light, fontSize: 18 }}>›</span></summary>
              <div style={{ padding: "0 16px 14px", fontSize: 13, color: B.muted, lineHeight: 1.6 }}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes subtlePulse{0%,100%{box-shadow:0 2px 12px rgba(236,201,75,.1)}50%{box-shadow:0 4px 20px rgba(236,201,75,.25)}}
        @keyframes gentleBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        *{scrollbar-width:thin;scrollbar-color:#cbd5e0 transparent;box-sizing:border-box}
        details[open] summary span:last-child{transform:rotate(90deg)}
        details summary::-webkit-details-marker{display:none}
        @media(max-width:640px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}

function Header() {
  return (
    <header style={{ background: `linear-gradient(180deg,#4a5568,#2d3748)`, height: 64, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "3px solid #ecc94b", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2.5px solid #ecc94b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ecc94b" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "1.5px", lineHeight: 1 }}>CERTIPREP</div><div style={{ color: "#a0aec0", fontSize: 11, marginTop: 1 }}>Academic Exam Prep</div></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {["How It Works", "Pricing"].map(t => <a key={t} href="#" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .15s" }} onMouseEnter={e => e.target.style.color = "#ecc94b"} onMouseLeave={e => e.target.style.color = "#e2e8f0"}>{t}</a>)}
      </div>
    </header>
  );
}
