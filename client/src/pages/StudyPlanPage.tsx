import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  ArrowLeft, Calendar, Check, ChevronRight, Loader2,
  Plus, BookOpen, Target, Layers, Clock
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const moduleTypeIcons: Record<string, { icon: any; color: string; label: string }> = {
  study_guide: { icon: BookOpen, color: '#001F3F', label: 'Study Guide' },
  flashcard_set: { icon: Layers, color: '#10B981', label: 'Flashcards' },
  quiz: { icon: Target, color: '#8B5CF6', label: 'Quiz' },
};

function StudyPlanContent() {
  const [, setLocation] = useLocation();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [planTitle, setPlanTitle] = useState('');

  const plans = trpc.studyPlans.myPlans.useQuery(undefined, { retry: false });
  const enrolledCourses = trpc.enrollments.myEnrollments.useQuery(undefined, { retry: false });

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#001F3F' }}>Study Plans</h1>
                <p className="text-sm text-gray-500">Organize your learning schedule</p>
              </div>
            </div>
            <Button
              className="text-white font-semibold rounded-xl"
              style={{ background: '#001F3F' }}
              onClick={() => setShowCreate(!showCreate)}
            >
              <Plus className="w-4 h-4 mr-2" /> New Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl mx-auto">
        {/* Create Plan Form */}
        {showCreate && (
          <CreatePlanForm
            courses={enrolledCourses.data ?? []}
            onClose={() => setShowCreate(false)}
            onCreated={() => { setShowCreate(false); plans.refetch(); }}
          />
        )}

        {/* Plans List */}
        {plans.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
          </div>
        ) : !plans.data || plans.data.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400 mb-2">No study plans yet</p>
            <p className="text-sm text-gray-400 mb-4">Create a plan to organize your learning schedule</p>
            <Button className="text-white" style={{ background: '#001F3F' }} onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Your First Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.data.map((plan: any) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePlanForm({ courses, onClose, onCreated }: { courses: any[]; onClose: () => void; onCreated: () => void }) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  const courseModules = trpc.courses.getModules.useQuery(
    { courseId: selectedCourse ?? 0 },
    { enabled: !!selectedCourse }
  );

  const createPlan = trpc.studyPlans.create.useMutation({
    onSuccess: () => {
      toast.success('Study plan created!');
      onCreated();
    },
    onError: () => toast.error('Failed to create plan'),
  });

  const handleCreate = () => {
    if (!selectedCourse || !title) {
      toast.error('Please fill in all fields');
      return;
    }
    const mods = courseModules.data ?? [];
    const now = Date.now();
    createPlan.mutate({
      courseId: selectedCourse,
      title,
      startDate: now,
      endDate: now + 30 * 24 * 60 * 60 * 1000,
      moduleIds: mods.map((m: any) => m.id),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h3 className="font-bold text-lg mb-4" style={{ color: '#001F3F' }}>Create Study Plan</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Plan Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Biology Final Prep"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Select Course</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {courses.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${selectedCourse === c.id ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className="font-medium text-sm" style={{ color: '#001F3F' }}>{c.name}</p>
                <p className="text-xs text-gray-400">{c.code}</p>
              </button>
            ))}
          </div>
          {courses.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">Enroll in a course first to create a study plan.</p>
          )}
        </div>
        {selectedCourse && courseModules.data && (
          <div>
            <p className="text-sm text-gray-500">{courseModules.data.length} modules will be added to your plan</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button
            className="text-white rounded-xl"
            style={{ background: '#001F3F' }}
            onClick={handleCreate}
            disabled={createPlan.isPending || !selectedCourse || !title}
          >
            {createPlan.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: any }) {
  const [expanded, setExpanded] = useState(false);
  const planDetail = trpc.studyPlans.getById.useQuery({ id: plan.id }, { enabled: expanded });
  const toggleItem = trpc.studyPlans.toggleItem.useMutation({
    onSuccess: () => planDetail.refetch(),
  });

  const items = planDetail.data?.items ?? [];
  const completedItems = items.filter((i: any) => i.completed).length;
  const totalItems = items.length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,31,63,0.08)' }}>
            <Calendar className="w-6 h-6" style={{ color: '#001F3F' }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: '#001F3F' }}>{plan.title}</h3>
            <p className="text-xs text-gray-400">
              {new Date(plan.startDate).toLocaleDateString()} — {new Date(plan.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {expanded && totalItems > 0 && (
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: '#001F3F' }}>{progressPercent}%</p>
              <p className="text-xs text-gray-400">{completedItems}/{totalItems}</p>
            </div>
          )}
          <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-6">
          {/* Progress bar */}
          {totalItems > 0 && (
            <div className="mb-4">
              <div className="w-full h-2 rounded-full bg-gray-100">
                <div className="h-full rounded-full transition-all" style={{ background: '#FFD700', width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {planDetail.isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#001F3F' }} />
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => toggleItem.mutate({ itemId: item.id, completed: !item.completed })}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <span className={`text-sm flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    Module {item.orderIndex + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StudyPlanPage() {
  return (
    <AuthGuard>
      <StudyPlanContent />
    </AuthGuard>
  );
}
