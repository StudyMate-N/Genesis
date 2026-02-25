import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  BookOpen, GraduationCap, Clock, BarChart3, ChevronRight,
  ArrowLeft, Loader2, Search
} from "lucide-react";
import { useState, useMemo } from "react";

const difficultyColors: Record<string, string> = {
  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#EF4444',
};

const categoryIcons: Record<string, string> = {
  Science: '🔬',
  'Computer Science': '💻',
  Mathematics: '📐',
  'Social Science': '🧠',
};

function CoursesContent() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const courses = trpc.courses.list.useQuery();
  const enrollments = trpc.enrollments.myEnrollments.useQuery(undefined, { retry: false });

  const enrolledIds = useMemo(() => new Set((enrollments.data ?? []).map((e: any) => e.id)), [enrollments.data]);

  const categories = useMemo(() => {
    if (!courses.data) return [];
    const cats = Array.from(new Set(courses.data.map((c: any) => c.category).filter(Boolean)));
    return cats;
  }, [courses.data]);

  const filtered = useMemo(() => {
    if (!courses.data) return [];
    return courses.data.filter((c: any) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [courses.data, search, categoryFilter]);

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setLocation('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#001F3F' }}>Course Catalog</h1>
              <p className="text-sm text-gray-500">Browse and enroll in courses to start learning</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${categoryFilter === 'all' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                style={categoryFilter === 'all' ? { background: '#001F3F' } : {}}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${categoryFilter === cat ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  style={categoryFilter === cat ? { background: '#001F3F' } : {}}
                >
                  {categoryIcons[cat] ?? '📚'} {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container py-8">
        {courses.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course: any) => {
              const isEnrolled = enrolledIds.has(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => setLocation(`/courses/${course.id}`)}
                >
                  <div className="h-3" style={{ background: difficultyColors[course.difficulty] ?? '#001F3F' }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{categoryIcons[course.category] ?? '📚'}</span>
                      {isEnrolled && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">Enrolled</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#F0F0F0', color: '#001F3F' }}>{course.code}</span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded capitalize"
                        style={{ background: `${difficultyColors[course.difficulty] ?? '#001F3F'}15`, color: difficultyColors[course.difficulty] ?? '#001F3F' }}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: '#001F3F' }}>{course.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.estimatedHours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" /> {course.category}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <AuthGuard>
      <CoursesContent />
    </AuthGuard>
  );
}
