import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import {
  BookOpen, Brain, Layers, Target, ArrowLeft, Loader2, Check,
  Clock, BarChart3, Zap, ChevronRight, Lock, Play
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

const moduleTypeIcons: Record<string, any> = {
  study_guide: { icon: BookOpen, color: '#001F3F', bg: 'rgba(0,31,63,0.08)', label: 'Study Guide' },
  flashcard_set: { icon: Layers, color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Flashcards' },
  quiz: { icon: Target, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'Quiz' },
};

const difficultyColors: Record<string, string> = {
  beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444',
};

function CourseDetailContent() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params.id);
  const [, setLocation] = useLocation();

  const course = trpc.courses.getById.useQuery({ id: courseId });
  const isEnrolled = trpc.enrollments.isEnrolled.useQuery({ courseId }, { retry: false });
  const progress = trpc.enrollments.getProgress.useQuery({ courseId }, { retry: false });
  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      isEnrolled.refetch();
    },
    onError: () => toast.error('Failed to enroll'),
  });

  const utils = trpc.useUtils();

  const completedModuleIds = useMemo(() => {
    return new Set((progress.data ?? []).filter((p: any) => p.completed).map((p: any) => p.moduleId));
  }, [progress.data]);

  const modules = course.data?.modules ?? [];
  const totalModules = modules.length;
  const completedCount = modules.filter((m: any) => completedModuleIds.has(m.id)).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  if (course.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
      </div>
    );
  }

  if (!course.data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Course not found</p>
          <Button className="mt-4" onClick={() => setLocation('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const c = course.data;
  const enrolled = isEnrolled.data === true;

  const handleModuleClick = (mod: any) => {
    if (!enrolled) {
      toast.error('Please enroll in this course first');
      return;
    }
    if (mod.type === 'flashcard_set') {
      setLocation(`/flashcards/${mod.id}`);
    } else if (mod.type === 'quiz') {
      setLocation(`/quiz/${mod.id}`);
    } else {
      // Study guide - mark as complete
      toast.info('Study guide content coming soon. Module marked as viewed.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <button onClick={() => setLocation('/courses')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#F0F0F0', color: '#001F3F' }}>{c.code}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded capitalize" style={{ background: `${difficultyColors[c.difficulty ?? ''] ?? '#001F3F'}15`, color: difficultyColors[c.difficulty ?? ''] ?? '#001F3F' }}>
                  {c.difficulty}
                </span>
                <span className="text-xs text-gray-400">{c.category}</span>
              </div>
              <h1 className="text-3xl font-bold mb-3" style={{ color: '#001F3F' }}>{c.name}</h1>
              <p className="text-gray-500 mb-4 max-w-2xl">{c.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {c.estimatedHours} hours</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {totalModules} modules</span>
                <span className="flex items-center gap-1"><Zap className="w-4 h-4" style={{ color: '#FFD700' }} /> {modules.reduce((sum: number, m: any) => sum + (m.xpReward ?? 0), 0)} XP total</span>
              </div>
            </div>
            <div className="shrink-0">
              {enrolled ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center min-w-[200px]">
                  <Check className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">Enrolled</p>
                  <p className="text-xs text-green-500 mt-1">{progressPercent}% complete</p>
                  <div className="w-full h-2 rounded-full bg-green-100 mt-2">
                    <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="text-white font-semibold px-8 py-5 rounded-xl"
                  style={{ background: '#001F3F' }}
                  onClick={() => enrollMutation.mutate({ courseId })}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Enroll Now — Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="container py-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#001F3F' }}>Course Modules</h2>
        <div className="space-y-3">
          {modules.map((mod: any, index: number) => {
            const typeInfo = moduleTypeIcons[mod.type] ?? moduleTypeIcons.study_guide;
            const Icon = typeInfo.icon;
            const isCompleted = completedModuleIds.has(mod.id);

            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`w-full bg-white rounded-xl border p-5 flex items-center gap-4 transition-all text-left group ${
                  enrolled ? 'hover:shadow-md border-gray-100 cursor-pointer' : 'border-gray-100 opacity-80'
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: isCompleted ? '#10B98115' : typeInfo.bg }}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">Module {index + 1}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="font-medium truncate" style={{ color: '#001F3F' }}>{mod.title}</p>
                  <p className="text-xs text-gray-400 truncate">{mod.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#FFD700' }}>
                    <Zap className="w-3.5 h-3.5" /> {mod.xpReward} XP
                  </span>
                  {enrolled ? (
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CourseDetail() {
  return (
    <AuthGuard>
      <CourseDetailContent />
    </AuthGuard>
  );
}
