'use client';

import { useState, useEffect } from 'react';

const FlashcardComponent = ({ cards = [], onComplete = () => {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (cards.length > 0) {
      setProgress(Math.round(((currentIndex + 1) / cards.length) * 100));
    }
  }, [currentIndex, cards.length]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No flashcards available</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-navy-blue" style={{ color: '#001F3F' }}>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#FFD700' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-light-gray rounded-full h-2" style={{ backgroundColor: '#F0F0F0' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: '#FFD700' }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="h-80 cursor-pointer perspective"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500 transform-gpu"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center border-4"
            style={{
              borderColor: '#001F3F',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 mb-4">Question</p>
              <p className="text-2xl font-bold" style={{ color: '#001F3F' }}>
                {currentCard.front || currentCard.question}
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center border-4"
            style={{
              borderColor: '#FFD700',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 mb-4">Answer</p>
              <p className="text-xl font-semibold" style={{ color: '#001F3F' }}>
                {currentCard.back || currentCard.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <p className="text-center text-sm text-gray-500 mt-4">Click card to flip</p>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentIndex === 0 ? '#F0F0F0' : '#001F3F',
            color: currentIndex === 0 ? '#999' : '#FFFFFF',
          }}
        >
          ← Previous
        </button>

        <span className="text-sm font-semibold text-gray-600">
          {currentIndex + 1} / {cards.length}
        </span>

        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: '#FFD700',
            color: '#001F3F',
          }}
        >
          {currentIndex === cards.length - 1 ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default FlashcardComponent;
