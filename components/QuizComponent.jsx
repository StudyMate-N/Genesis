'use client';

import { useState, useEffect } from 'react';

const QuizComponent = ({ questions = [], timeLimit = 300, onSubmit = () => {}, moduleId = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  // Timer effect
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const correctCount = calculateScore();
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);

    // Submit to API
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          answers: JSON.stringify(answers),
          score: correctCount,
          total: questions.length
        })
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit(data.data);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  if (submitted) {
    const correctCount = calculateScore();
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div
          className="rounded-lg p-8 text-center"
          style={{ backgroundColor: '#F0F0F0' }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#001F3F' }}>
            Quiz Complete!
          </h2>

          <div
            className="text-6xl font-bold mb-4"
            style={{ color: passed ? '#FFD700' : '#001F3F' }}
          >
            {percentage}%
          </div>

          <p className="text-xl font-semibold mb-4" style={{ color: '#001F3F' }}>
            You got {correctCount} out of {questions.length} correct
          </p>

          <div
            className="p-4 rounded-lg mb-6"
            style={{
              backgroundColor: passed ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 31, 63, 0.1)'
            }}
          >
            <p className="text-lg font-semibold" style={{ color: passed ? '#FFD700' : '#001F3F' }}>
              {passed ? '✓ Passed!' : '✗ Try Again'}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: '#001F3F',
              color: '#FFFFFF'
            }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Timer */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold" style={{ color: '#001F3F' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div
          className="px-4 py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: timeLeft < 60 ? '#FFD700' : '#F0F0F0',
            color: timeLeft < 60 ? '#001F3F' : '#666'
          }}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-light-gray rounded-full h-2 mb-6" style={{ backgroundColor: '#F0F0F0' }}>
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: '#FFD700'
          }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6" style={{ color: '#001F3F' }}>
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor: answers[currentQuestion.id] === option ? '#FFD700' : '#E0E0E0',
                backgroundColor: answers[currentQuestion.id] === option ? 'rgba(255, 215, 0, 0.1)' : '#FFFFFF'
              }}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswer(currentQuestion.id, option)}
                className="mr-4"
              />
              <span className="font-semibold" style={{ color: '#001F3F' }}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentIndex === 0 ? '#F0F0F0' : '#001F3F',
            color: currentIndex === 0 ? '#999' : '#FFFFFF'
          }}
        >
          ← Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: '#FFD700',
              color: '#001F3F'
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            style={{
              backgroundColor: '#001F3F',
              color: '#FFFFFF'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
