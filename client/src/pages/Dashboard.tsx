import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import {
  BookOpen, Brain, Flame, GraduationCap, Layers, Trophy, Zap,
  BarChart3, Calendar, ChevronRight, Home, LogOut, Medal,
  Target, Clock, Star, TrendingUp, Menu, X
} from "lucide-react";
import { useState } from "react";

function DashboardContent() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const xpInfo = trpc.gamification.xpInfo.useQuery(undefined, { retry: false });
  const streak = trpc.gamification.streak.useQuery(undefined, { retry: false });
  const stats = trpc.gamification.dashboardStats.useQuery(undefined, { retry: false });
  const achievements = trpc.gamification.achievements.useQuery(undefined, { retry: false });
  const enrolledCourses = trpc.enrollments.myEnrollments.useQuery(undefined, { retry: false });
  const recentXp = trpc.gamification.recentXp.useQuery(undefined, { retry: false });

  const xp = xpInfo.data ?? { totalXp: 0, level: 1, xpToNextLevel: 500, xpProgress: 0 };
  const streakData = streak.data ?? { currentStreak: 0, longestStreak: 0 };
  const statsData = stats.data ?? { enrolledCourses: 0, completedModules: 0, quizzesTaken: 0, flashcardsReviewed: 0 };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Study Plans', path: '/study-plans' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: Target, label: 'Quiz Results', path: '/quiz-results' },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex" style={{ background: '#F0F0F0' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#001F3F' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ color: '#001F3F' }}>Veritas Academy</span>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* XP Card */}
        <div className="p-4">
          <div className="rounded-xl p-4" style={{ background: '#001F3F' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: '#FFD700' }} />
                <span className="text-white font-semibold text-sm">Level {xp.level}</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700' }}>
                {xp.totalXp} XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 mb-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ background: '#FFD700', width: `${Math.min(100, ((xp.xpProgress ?? 0) / (xp.xpToNextLevel ?? 500)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-300 mt-1">{xp.xpProgress ?? 0} / {xp.xpToNextLevel ?? 500} XP to next level</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { setLocation(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={isActive ? { background: '#001F3F' } : {}}
              >
                <item.icon className="w-5 h-5" style={isActive ? { color: '#FFD700' } : {}} />
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => { setLocation('/admin'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              Admin Panel
            </button>
          )}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#001F3F' }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#001F3F' }}>{user?.name ?? 'Student'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
            </div>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <LogOut className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" style={{ color: '#001F3F' }} />
          </button>
          <span className="font-bold" style={{ color: '#001F3F' }}>Dashboard</span>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" style={{ color: streakData.currentStreak > 0 ? '#FF6B35' : '#ccc' }} />
            <span className="text-sm font-bold" style={{ color: '#001F3F' }}>{streakData.currentStreak}</span>
          </div>
        </div>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: '#001F3F' }}>
                  Welcome back, {user?.name?.split(' ')[0] ?? 'Student'}!
                </h1>
                <p className="text-gray-500 mt-1">Keep up the great work. Here's your learning overview.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
                  <Flame className="w-5 h-5" style={{ color: streakData.currentStreak > 0 ? '#FF6B35' : '#ccc' }} />
                  <div>
                    <p className="text-lg font-bold" style={{ color: '#001F3F' }}>{streakData.currentStreak}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
                  <Star className="w-5 h-5" style={{ color: '#FFD700' }} />
                  <div>
                    <p className="text-lg font-bold" style={{ color: '#001F3F' }}>{streakData.longestStreak}</p>
                    <p className="text-xs text-gray-400">Best Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: BookOpen, label: 'Enrolled Courses', value: statsData.enrolledCourses, color: '#001F3F' },
              { icon: Brain, label: 'Modules Done', value: statsData.completedModules, color: '#10B981' },
              { icon: Target, label: 'Quizzes Taken', value: statsData.quizzesTaken, color: '#8B5CF6' },
              { icon: Layers, label: 'Cards Reviewed', value: statsData.flashcardsReviewed, color: '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setLocation('/courses')}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,31,63,0.08)' }}>
                  <BookOpen className="w-6 h-6" style={{ color: '#001F3F' }} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#001F3F' }}>Browse Courses</h3>
              <p className="text-sm text-gray-500">Explore and enroll in new courses</p>
            </button>

            <button
              onClick={() => setLocation('/study-plans')}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.15)' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#FFD700' }} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#001F3F' }}>Study Plans</h3>
              <p className="text-sm text-gray-500">View your personalized study schedule</p>
            </button>

            <button
              onClick={() => setLocation('/achievements')}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <Trophy className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#001F3F' }}>Achievements</h3>
              <p className="text-sm text-gray-500">View your badges and milestones</p>
            </button>
          </div>

          {/* My Courses + Recent XP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Courses */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg" style={{ color: '#001F3F' }}>My Courses</h2>
                <Button variant="ghost" size="sm" onClick={() => setLocation('/courses')} className="text-sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {!enrolledCourses.data || enrolledCourses.data.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-400 text-sm">No courses enrolled yet</p>
                  <Button size="sm" className="mt-3 text-white" style={{ background: '#001F3F' }} onClick={() => setLocation('/courses')}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.data.slice(0, 4).map((course: any) => (
                    <button
                      key={course.id}
                      onClick={() => setLocation(`/courses/${course.id}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0,31,63,0.08)' }}>
                        <BookOpen className="w-5 h-5" style={{ color: '#001F3F' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: '#001F3F' }}>{course.name}</p>
                        <p className="text-xs text-gray-400">{course.code}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent XP */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg" style={{ color: '#001F3F' }}>Recent Activity</h2>
                <Zap className="w-5 h-5" style={{ color: '#FFD700' }} />
              </div>
              {!recentXp.data || recentXp.data.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-400 text-sm">No activity yet. Start learning!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentXp.data.slice(0, 6).map((tx: any) => (
                    <div key={tx.id} className="flex items-center gap-3 py-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.15)' }}>
                        <Zap className="w-4 h-4" style={{ color: '#FFD700' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: '#001F3F' }}>{tx.description ?? tx.source}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#10B981' }}>+{tx.amount} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
