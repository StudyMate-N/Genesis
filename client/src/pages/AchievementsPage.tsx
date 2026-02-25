import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  ArrowLeft, Trophy, Loader2, Zap, Star, Flame, BookOpen,
  Brain, Layers, CheckCircle, Rocket, Crown, Lock
} from "lucide-react";

const iconMap: Record<string, any> = {
  Rocket, Brain, Star, BookOpen, Trophy, Flame, Zap, Crown, Layers, CheckCircle,
};

const categoryColors: Record<string, string> = {
  milestone: '#001F3F',
  quiz: '#8B5CF6',
  course: '#10B981',
  streak: '#FF6B35',
  xp: '#FFD700',
  flashcard: '#3B82F6',
  study_plan: '#EC4899',
};

function AchievementsContent() {
  const [, setLocation] = useLocation();
  const achievements = trpc.gamification.achievements.useQuery(undefined, { retry: false });
  const xpInfo = trpc.gamification.xpInfo.useQuery(undefined, { retry: false });

  const allAch = achievements.data?.all ?? [];
  const earnedAch = achievements.data?.earned ?? [];
  const earnedCodes = new Set(earnedAch.map((a: any) => a.code));

  const xp = xpInfo.data ?? { totalXp: 0, level: 1 };

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#001F3F' }}>Achievements</h1>
              <p className="text-sm text-gray-500">{earnedAch.length} of {allAch.length} unlocked</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
            <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>{earnedAch.length}</p>
            <p className="text-xs text-gray-400">Badges Earned</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
            <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>{xp.totalXp}</p>
            <p className="text-xs text-gray-400">Total XP</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <Star className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
            <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>{xp.level}</p>
            <p className="text-xs text-gray-400">Level</p>
          </div>
        </div>

        {achievements.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAch.map((ach: any) => {
              const earned = earnedCodes.has(ach.code);
              const Icon = iconMap[ach.icon] ?? Trophy;
              const color = categoryColors[ach.category] ?? '#001F3F';

              return (
                <div
                  key={ach.id}
                  className={`bg-white rounded-2xl border p-6 transition-all ${earned ? 'border-gray-100 shadow-sm' : 'border-gray-100 opacity-60'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: earned ? `${color}15` : '#F0F0F0' }}
                    >
                      {earned ? (
                        <Icon className="w-7 h-7" style={{ color }} />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    {earned && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">Earned</span>
                    )}
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: earned ? '#001F3F' : '#999' }}>{ach.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{ach.description}</p>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#FFD700' }}>
                    <Zap className="w-3.5 h-3.5" /> +{ach.xpReward} XP
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

export default function AchievementsPage() {
  return (
    <AuthGuard>
      <AchievementsContent />
    </AuthGuard>
  );
}
