import AuthGuard from "@/components/AuthGuard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Loader2, RotateCcw,
  Layers, Check, BookOpen, Zap, Brain
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'rgba(0,31,63,0.08)', text: '#001F3F', label: 'New' },
  learning: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: 'Learning' },
  mastered: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: 'Mastered' },
};

function FlashcardsContent() {
  const params = useParams<{ moduleId: string }>();
  const moduleId = Number(params.moduleId);
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const module = trpc.modules.getById.useQuery({ id: moduleId });
  const flashcardsProgress = trpc.flashcards.getProgress.useQuery({ moduleId }, { retry: false });
  const updateProgress = trpc.flashcards.updateProgress.useMutation({
    onSuccess: () => flashcardsProgress.refetch(),
  });

  const cards = flashcardsProgress.data ?? [];
  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const newCount = cards.filter((c: any) => (c.status ?? 'new') === 'new').length;
  const learningCount = cards.filter((c: any) => c.status === 'learning').length;
  const masteredCount = cards.filter((c: any) => c.status === 'mastered').length;

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => Math.min(prev + 1, totalCards - 1)), 150);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => Math.max(prev - 1, 0)), 150);
  }, []);

  const handleStatus = useCallback((status: 'new' | 'learning' | 'mastered') => {
    if (!currentCard) return;
    updateProgress.mutate({ flashcardId: currentCard.id, status });
    if (status === 'mastered') {
      toast.success('+10 XP — Card mastered!');
    } else if (status === 'learning') {
      toast.info('+5 XP — Keep reviewing!');
    }
    if (currentIndex < totalCards - 1) {
      handleNext();
    }
  }, [currentCard, currentIndex, totalCards, updateProgress, handleNext]);

  if (flashcardsProgress.isLoading || module.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001F3F' }} />
      </div>
    );
  }

  if (totalCards === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="text-center">
          <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No flashcards available for this module</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const cardStatus = statusColors[(currentCard as any)?.status ?? 'new'];

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => window.history.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
              </button>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#001F3F' }}>{module.data?.title ?? 'Flashcards'}</h1>
                <p className="text-xs text-gray-400">Card {currentIndex + 1} of {totalCards}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: statusColors.new.bg, color: statusColors.new.text }}>{newCount} New</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: statusColors.learning.bg, color: statusColors.learning.text }}>{learningCount} Learning</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: statusColors.mastered.bg, color: statusColors.mastered.text }}>{masteredCount} Mastered</span>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-gray-100 mt-3">
            <div className="h-full rounded-full transition-all duration-300" style={{ background: '#FFD700', width: `${((currentIndex + 1) / totalCards) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="container py-8 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: cardStatus.bg, color: cardStatus.text }}>
            {cardStatus.label}
          </span>
        </div>

        {/* Card with flip */}
        <div
          className="relative cursor-pointer mb-8"
          style={{ perspective: '1000px', minHeight: '320px' }}
          onClick={handleFlip}
        >
          <div
            className="w-full absolute inset-0 transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Brain className="w-8 h-8 mb-4" style={{ color: '#001F3F' }} />
              <p className="text-xl font-semibold text-center leading-relaxed" style={{ color: '#001F3F' }}>
                {currentCard?.front}
              </p>
              <p className="text-sm text-gray-400 mt-6">Tap to reveal answer</p>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <Check className="w-8 h-8 mb-4" style={{ color: '#10B981' }} />
              <p className="text-lg text-center leading-relaxed text-gray-700">
                {currentCard?.back}
              </p>
              <p className="text-sm text-gray-400 mt-6">Rate your knowledge below</p>
            </div>
          </div>
        </div>

        {/* Rating Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Button
            variant="outline"
            className="py-4 rounded-xl border-2 font-semibold"
            style={{ borderColor: '#EF4444', color: '#EF4444' }}
            onClick={() => handleStatus('new')}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Again
          </Button>
          <Button
            variant="outline"
            className="py-4 rounded-xl border-2 font-semibold"
            style={{ borderColor: '#F59E0B', color: '#F59E0B' }}
            onClick={() => handleStatus('learning')}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Learning
          </Button>
          <Button
            className="py-4 rounded-xl font-semibold text-white"
            style={{ background: '#10B981' }}
            onClick={() => handleStatus('mastered')}
          >
            <Check className="w-4 h-4 mr-2" /> Mastered
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>
          <span className="text-sm text-gray-400">{currentIndex + 1} / {totalCards}</span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
            className="rounded-xl"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <AuthGuard>
      <FlashcardsContent />
    </AuthGuard>
  );
}
