import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  ArrowLeft, Target, Loader2, Zap, Trophy, Clock, TrendingUp
} from "lucide-react";

function QuizResultsContent() {
  const [, setLocation] = useLocation();
  const results = trpc.quizzes.myResults.useQuery(undefined, { retry: false });

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#001F3F' }}>Quiz Results</h1>
              <p className="text-sm text-gray-500">Your quiz performance history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl mx-auto">
        {results.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
          </div>
        ) : !results.data || results.data.length === 0 ? (
          <div className="text-center py-20">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400 mb-2">No quiz results yet</p>
            <p className="text-sm text-gray-400">Take a quiz to see your results here</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
                <Target className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B5CF6' }} />
                <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>{results.data.length}</p>
                <p className="text-xs text-gray-400">Quizzes Taken</p>
              </div>
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#10B981' }} />
                <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>
                  {results.data.length > 0
                    ? Math.round(results.data.reduce((sum: number, r: any) => sum + (r.totalQuestions > 0 ? (r.score / r.totalQuestions) * 100 : 0), 0) / results.data.length)
                    : 0}%
                </p>
                <p className="text-xs text-gray-400">Avg Score</p>
              </div>
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
                <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD700' }} />
                <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>
                  {results.data.reduce((sum: number, r: any) => sum + (r.xpEarned ?? 0), 0)}
                </p>
                <p className="text-xs text-gray-400">Total XP Earned</p>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {results.data.map((result: any) => {
                const percentage = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;
                return (
                  <div key={result.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${percentage >= 70 ? 'bg-green-50' : 'bg-red-50'}`}>
                      {percentage >= 70 ? (
                        <Trophy className="w-6 h-6 text-green-600" />
                      ) : (
                        <Target className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium" style={{ color: '#001F3F' }}>Quiz #{result.moduleId}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(result.completedAt).toLocaleDateString()}
                        </span>
                        <span>{result.score}/{result.totalQuestions} correct</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${percentage >= 70 ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</p>
                      <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#FFD700' }}>
                        <Zap className="w-3 h-3" /> +{result.xpEarned} XP
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <AuthGuard>
      <QuizResultsContent />
    </AuthGuard>
  );
}
