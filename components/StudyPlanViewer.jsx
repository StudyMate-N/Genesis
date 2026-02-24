'use client';

import { useState, useEffect } from 'react';

const StudyPlanViewer = ({ studyPlanId = '' }) => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/study-plans');
        if (!response.ok) throw new Error('Failed to fetch study plans');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          const plan = studyPlanId 
            ? data.data.find(p => p.id === studyPlanId)
            : data.data[0];
          setStudyPlan(plan);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPlan();
  }, [studyPlanId]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateProgress = () => {
    if (!studyPlan || !studyPlan.modules) return 0;
    const completed = studyPlan.modules.filter(m => m.completed).length;
    return Math.round((completed / studyPlan.modules.length) * 100);
  };

  const daysRemaining = () => {
    if (!studyPlan) return 0;
    const today = new Date();
    const endDate = new Date(studyPlan.endDate);
    const diff = endDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading study plan...</p>
      </div>
    );
  }

  if (error || !studyPlan) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">{error || 'No study plan available'}</p>
      </div>
    );
  }

  const progress = calculateProgress();
  const daysLeft = daysRemaining();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#001F3F' }}>
          {studyPlan.title}
        </h1>
        <p className="text-gray-600">
          Course: <span className="font-semibold" style={{ color: '#001F3F' }}>
            {studyPlan.course?.name}
          </span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-sm text-gray-600 mb-2">Progress</p>
          <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
            {progress}%
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-sm text-gray-600 mb-2">Days Remaining</p>
          <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>
            {daysLeft}
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-sm text-gray-600 mb-2">Modules</p>
          <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>
            {studyPlan.modules?.length || 0}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: '#001F3F' }}>
            Overall Progress
          </span>
          <span className="text-sm font-semibold" style={{ color: '#FFD700' }}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-light-gray rounded-full h-3" style={{ backgroundColor: '#F0F0F0' }}>
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: '#FFD700'
            }}
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#001F3F' }}>
          Study Modules
        </h2>
        
        {studyPlan.modules && studyPlan.modules.length > 0 ? (
          studyPlan.modules.map((module, idx) => (
            <div
              key={module.id}
              className="border-2 rounded-lg overflow-hidden transition-all"
              style={{
                borderColor: expandedModules[module.id] ? '#FFD700' : '#E0E0E0'
              }}
            >
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: '#001F3F' }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#001F3F' }}>
                      {module.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: <span className="font-semibold">{module.type}</span>
                    </p>
                  </div>
                </div>
                <span
                  className="text-2xl transition-transform"
                  style={{
                    transform: expandedModules[module.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: '#FFD700'
                  }}
                >
                  ▼
                </span>
              </button>

              {expandedModules[module.id] && (
                <div className="p-4 border-t-2" style={{ borderColor: '#F0F0F0', backgroundColor: '#FFFFFF' }}>
                  <p className="text-gray-700 mb-4">{module.content}</p>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: '#FFD700',
                      color: '#001F3F'
                    }}
                  >
                    Start Module
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No modules in this study plan</p>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-8 p-4 rounded-lg text-center" style={{ backgroundColor: '#F0F0F0' }}>
        <p className="text-sm text-gray-600 mb-2">Plan Status</p>
        <p
          className="text-lg font-bold"
          style={{
            color: studyPlan.status === 'active' ? '#FFD700' : '#001F3F'
          }}
        >
          {studyPlan.status.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default StudyPlanViewer;
