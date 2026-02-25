"use client";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Search
} from "lucide-react";

import ProfilePage from "../app/dashboard/profile/page";
import MyCourses from './MyCourses';
import StudyPlanViewer from './StudyPlanViewer';
import QuizComponent from './QuizComponent';
import FlashcardComponent from './FlashcardComponent';

const COLORS = {
  navy: "#001F3F",
  gold: "#FFD700",
  lightGray: "#F0F0F0",
  white: "#FFFFFF",
  text: "#001F3F", // Changed to navy blue for consistency
  muted: "#666666",
  border: "#D0D0D0" // Changed for consistency
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ firstName: "Student", lastName: "User", email: "student@veritas.edu" });

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Courses", icon: <BookOpen size={20} /> },
    { name: "Study Plan", icon: <Calendar size={20} /> },
    { name: "Quizzes", icon: <FileText size={20} /> },
    { name: "Flashcards", icon: <BookOpen size={20} /> },
    { name: "Profile", icon: <User size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold" style={{ color: COLORS.navy }}>Welcome back, {user.firstName}!</h1>
              <div className="text-sm text-muted">Wednesday, February 19, 2026</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <div className="text-muted text-sm font-medium mb-1">Current Progress</div>
                <div className="text-3xl font-bold" style={{ color: COLORS.navy }}>68%</div>
                <div className="w-full bg-lightGray h-2 rounded-full mt-3">
                  <div style={{ backgroundColor: COLORS.gold, height: "2px", borderRadius: "9999px", width: "68%" }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <div className="text-muted text-sm font-medium mb-1">Next Exam</div>
                <div className="text-3xl font-bold" style={{ color: COLORS.navy }}>12 Days</div>
                <div className="text-xs text-muted mt-3 font-medium uppercase tracking-wider">Microbiology Midterm</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                <div className="text-muted text-sm font-medium mb-1">Study Streak</div>
                <div className="text-3xl font-bold text-navy">5 Days</div>
                <div className="text-xs mt-3 font-bold" style={{ color: COLORS.gold }}>Keep it up! 🔥</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-lg font-bold" style={{ color: COLORS.navy, marginBottom: "1rem" }}>Today's Study Plan</h2>
              <div className="space-y-4">
                {[
                  { title: "Cell Structure Review", time: "45 mins", type: "Reading" },
                  { title: "Metabolism Flashcards", time: "20 mins", type: "Practice" },
                  { title: "Quiz: Genetics Basics", time: "15 mins", type: "Assessment" }
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-lightGray/50 border border-border/50 hover:border-gold/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: COLORS.navy, color: COLORS.white }}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold group-hover:text-gold transition-colors" style={{ color: COLORS.navy }}>{task.title}</div>
                        <div className="text-xs text-muted">{task.type} • {task.time}</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-muted group-hover:text-gold" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Profile":
        return <ProfilePage />;
            case "My Courses":
        return <MyCourses />;
      case "Study Plan":
        return <StudyPlanViewer />;
      case "Quizzes":
        return <QuizComponent />;
      case "Flashcards":
        return <FlashcardComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-lightGray flex">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col fixed h-full z-50`} style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="min-w-[32px] h-8 rounded flex items-center justify-center font-black" style={{ backgroundColor: COLORS.gold, color: COLORS.navy }}>V</div>
          {isSidebarOpen && <span className="font-bold tracking-tighter text-lg whitespace-nowrap">VERITAS ACADEMY</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                activeTab === item.name 
                  ? `font-bold bg-[${COLORS.gold}] text-[${COLORS.navy}]` 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="min-w-[20px]">{item.icon}</div>
              {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-4 p-3 rounded-lg text-white/70 transition-colors" style={{ "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#EF4444" } }}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-40" style={{ backgroundColor: COLORS.white, borderBottom: `1px solid ${COLORS.border}` }}>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg transition-colors" style={{ "&:hover": { backgroundColor: COLORS.lightGray }, color: COLORS.navy }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-10 pr-4 py-2 border-none rounded-full text-sm w-64" style={{ backgroundColor: COLORS.lightGray, focusRingColor: COLORS.gold }}
              />
            </div>
            <button className="relative p-2 text-muted hover:text-navy transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold leading-none" style={{ color: COLORS.navy }}>{user.firstName} {user.lastName}</div>
                <div className="text-xs text-muted mt-1">Student Account</div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2" style={{ backgroundColor: COLORS.navy, color: COLORS.white, borderColor: COLORS.gold }}>
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap");
        body {
          font-family: "DM Sans", sans-serif;
          color: ${COLORS.text};
        }
      `}</style>
    </div>
  );
}
