import { useState } from 'react';
import AdminOrdersPanel from './AdminOrdersPanel';
import AdminCoursesPanel from './AdminCoursesPanel';
import AdminModulesPanel from './AdminModulesPanel';
import AdminUsersPanel from './AdminUsersPanel';

// Veritas Academy Brand Colors
const VA_COLORS = {
  navyBlue: '#001F3F',
  gold: '#FFD700',
  lightGray: '#F0F0F0',
  white: '#FFFFFF',
  // Derived colors for UI elements
  bg: '#F0F0F0', // Light Gray
  surface: '#FFFFFF', // White
  surface2: '#F0F0F0', // Light Gray for secondary surfaces
  border: '#D0D0D0', // Slightly darker gray for borders
  border2: '#E0E0E0', // Even lighter gray for subtle borders
  text: '#001F3F', // Navy Blue for primary text
  text2: '#333333', // Darker gray for secondary text
  muted: '#666666', // Gray for muted text
  accent: '#FFD700', // Gold for accents
  accentHover: '#e6c200', // Slightly darker gold for hover
  accentBg: 'rgba(255, 215, 0, 0.1)', // Light gold background
  danger: '#EF4444', // Red for danger actions
  info: '#3B82F6', // Blue for info
  success: '#22C55E', // Green for success
  shadow: 'rgba(0,0,0,0.15)', // Shadow color
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const T = VA_COLORS; // Use Veritas Academy colors directly
  const tr = "all .35s";

  return (
    <div style={{ fontFamily: "'DM Sans',-apple-system,sans-serif", background: T.bg, color: T.text2, minHeight: "100vh", display: "flex", flexDirection: "column", transition: tr }}>
      {/* HEADER */}
      <header style={{ background: T.surface, borderBottom: "1px solid " + T.border, padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, transition: tr }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.navyBlue} strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "1.5px", color: T.text }}>VERITAS ACADEMY</span>
          <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Removed theme picker for consistent branding */}
          <div style={{ width: 34, height: 34, borderRadius: 10, background: T.surface2, border: "1px solid " + T.border2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.muted }}>AD</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Navigation */}
        <nav style={{ width: 200, flexShrink: 0, borderRight: "1px solid " + T.border, background: T.surface, transition: tr, padding: "20px 0" }}>
          <NavItem label="Orders" icon="📦" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} T={T} />
          <NavItem label="Courses" icon="📚" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} T={T} />
          <NavItem label="Modules" icon="📖" active={activeTab === 'modules'} onClick={() => setActiveTab('modules')} T={T} />
          <NavItem label="Users" icon="🧑‍💻" active={activeTab === 'users'} onClick={() => setActiveTab('users')} T={T} />
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {activeTab === 'orders' && <AdminOrdersPanel T={T} />} 
          {activeTab === 'courses' && <AdminCoursesPanel T={T} />} 
          {activeTab === 'modules' && <AdminModulesPanel T={T} />} 
          {activeTab === 'users' && <AdminUsersPanel T={T} />} 
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ label, icon, active, onClick, T }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "10px 20px",
      background: active ? T.accentBg : "transparent",
      border: "none",
      color: active ? T.accent : T.text2,
      fontWeight: active ? 700 : 500,
      fontSize: 14,
      cursor: "pointer",
      textAlign: "left",
      transition: "all .15s",
      borderRadius: "0 8px 8px 0",
      borderLeft: active ? `4px solid ${T.accent}` : "4px solid transparent",
      marginBottom: 4,
      '&:hover': {
        background: active ? T.accentBg : T.surface2,
      },
    }}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    {label}
  </button>
);
