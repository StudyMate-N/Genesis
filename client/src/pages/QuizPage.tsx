import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useParams } from "wouter";
import {
  ArrowLeft, Loader2, Target, Clock, Check, X, Zap,
  Trophy, ChevronRight, RotateCcw, Brain
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

type QuizState = 'loading' | 'ready' | 'active' | 'review' | 'results';

interface Answer {
  questionId: number;
  selectedIndex: number;
}

function QuizContent() {
  const params = useParams<{ moduleId: string }>();
  const moduleId = Number(params.moduleId);

  const [state, setState] = useState<QuizState>('loading');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const module = trpc.modules.getById.useQuery({ id: moduleId });
  const questions = trpc.quizzes.getQuestions.useQuery({ moduleId });
  const submitMutation = trpc.quizzes.submit.useMutation();

  const allQuestions = questions.data ?? [];
  const totalQ = allQuestions.length;
  const currentQuestion = allQuestions[currentQ];

  useEffect(() => {
    if (questions.data && questions.data.length > 0 && state === 'loading') {
      setState('ready');
    }
  }, [questions.data, state]);

  // Timer
  useEffect(() => {
    if (state === 'active' && !showFeedback) {
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - auto submit with no answer
            clearInterval(timerRef.current!);
            handleSelectOption(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [state, currentQ, showFeedback]);

  const handleSelectOption = useCallback((index: number) => {
    if (showFeedback) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(index);
    setShowFeedback(true);
    setAnswers(prev => [...prev, { questionId: currentQuestion?.id ?? 0, selectedIndex: index }]);
  }, [showFeedback, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Submit quiz
      setState('results');
      submitMutation.mutate({
        moduleId,
        answers: [...answers],
      });
    }
  }, [currentQ, totalQ, answers, moduleId, submitMutation]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setState('ready');
  }, []);

  if (questions.isLoading || module.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
      </div>
    );
  }

  if (totalQ === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No quiz questions available</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Ready State
  if (state === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: '#001F3F' }}>
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#001F3F' }}>{module.data?.title ?? 'Quiz'}</h1>
          <p className="text-gray-500 mb-6">{totalQ} questions • 30 seconds each</p>
          <div className="flex items-center justify-center gap-4 mb-8 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Timed</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4" style={{ color: '#FFD700' }} /> Up to 75 XP</span>
          </div>
          <Button
            size="lg"
            className="w-full text-white font-semibold py-5 rounded-xl"
            style={{ background: '#001F3F' }}
            onClick={() => setState('active')}
          >
            Start Quiz <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Results State
  if (state === 'results') {
    const result = submitMutation.data;
    if (submitMutation.isPending) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
        </div>
      );
    }

    return (
      <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
        <div className="container py-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: '#FFD700' }} />
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#001F3F' }}>Quiz Complete!</h1>
            <p className="text-gray-500 mb-6">{module.data?.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl p-4" style={{ background: '#F0F0F0' }}>
                <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>{result?.score ?? 0}/{result?.totalQuestions ?? totalQ}</p>
                <p className="text-xs text-gray-400 mt-1">Correct</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#F0F0F0' }}>
                <p className="text-3xl font-bold" style={{ color: (result?.percentage ?? 0) >= 70 ? '#10B981' : '#EF4444' }}>
                  {result?.percentage ?? 0}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Score</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,215,0,0.1)' }}>
                <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>+{result?.xpEarned ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">XP Earned</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl py-4" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4 mr-2" /> Retry
              </Button>
              <Button className="flex-1 rounded-xl py-4 text-white" style={{ background: '#001F3F' }} onClick={() => window.history.back()}>
                Back to Course
              </Button>
            </div>
          </div>

          {/* Review answers */}
          {result?.results && (
            <div className="space-y-3">
              <h2 className="font-bold text-lg" style={{ color: '#001F3F' }}>Review Answers</h2>
              {result.results.map((r: any, i: number) => {
                const q = allQuestions.find((q: any) => q.id === r.questionId);
                const options = typeof q?.options === 'string' ? JSON.parse(q.options) : q?.options ?? [];
                return (
                  <div key={i} className={`bg-white rounded-xl border p-5 ${r.correct ? 'border-green-200' : 'border-red-200'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${r.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                        {r.correct ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="font-medium text-sm" style={{ color: '#001F3F' }}>{q?.question}</p>
                    </div>
                    {!r.correct && (
                      <div className="ml-9 text-sm">
                        <p className="text-red-500 mb-1">Your answer: {options[r.selectedIndex] ?? 'No answer'}</p>
                        <p className="text-green-600 mb-2">Correct: {options[r.correctIndex]}</p>
                      </div>
                    )}
                    <p className="ml-9 text-xs text-gray-500 italic">{r.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz State
  const options = typeof currentQuestion?.options === 'string' ? JSON.parse(currentQuestion.options) : currentQuestion?.options ?? [];

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => window.history.back()} className="p-2 rounded-lg hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
              </button>
              <span className="text-sm font-medium" style={{ color: '#001F3F' }}>Question {currentQ + 1} of {totalQ}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeLeft <= 10 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>{timeLeft}s</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100">
            <div className="h-full rounded-full transition-all duration-300" style={{ background: '#FFD700', width: `${((currentQ + 1) / totalQ) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5" style={{ color: '#001F3F' }} />
            <span className="text-xs text-gray-400">Question {currentQ + 1}</span>
          </div>
          <h2 className="text-xl font-bold leading-relaxed" style={{ color: '#001F3F' }}>
            {currentQuestion?.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options.map((option: string, i: number) => {
            let optionStyle = 'bg-white border-gray-200 hover:border-gray-300';
            if (showFeedback) {
              const result = submitMutation.data?.results?.find((r: any) => r.questionId === currentQuestion?.id);
              if (result) {
                if (i === result.correctIndex) optionStyle = 'bg-green-50 border-green-300';
                else if (i === selectedOption && !result.correct) optionStyle = 'bg-red-50 border-red-300';
              } else if (i === selectedOption) {
                optionStyle = 'bg-blue-50 border-blue-300';
              }
            } else if (i === selectedOption) {
              optionStyle = 'border-blue-400 bg-blue-50';
            }

            return (
              <button
                key={i}
                onClick={() => !showFeedback && handleSelectOption(i)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${optionStyle}`}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-bold" style={{ borderColor: '#001F3F', color: '#001F3F' }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="font-medium" style={{ color: '#001F3F' }}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next button (shown after feedback) */}
        {showFeedback && (
          <Button
            size="lg"
            className="w-full text-white font-semibold py-5 rounded-xl"
            style={{ background: '#001F3F' }}
            onClick={handleNext}
          >
            {currentQ < totalQ - 1 ? 'Next Question' : 'See Results'} <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizContent />
    </AuthGuard>
  );
}
