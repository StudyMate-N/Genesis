'use client';

import { useState, useEffect } from 'react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        
        if (data.success) {
          setCourses(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      // Create a study plan for the course
      const response = await fetch('/api/study-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          title: `Study Plan for ${selectedCourse?.name}`
        })
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#001F3F' }}>
        Available Courses
      </h1>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No courses available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ backgroundColor: '#FFFFFF', borderTop: '4px solid #FFD700' }}
            >
              {/* Card Header */}
              <div className="p-6" style={{ backgroundColor: '#F0F0F0' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#001F3F' }}>
                  {course.name}
                </h3>
                <p className="text-sm font-semibold mb-3" style={{ color: '#FFD700' }}>
                  {course.code}
                </p>
                {course.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Modules
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: '#001F3F' }}
                    >
                      {course._count?.modules || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: '0%',
                        backgroundColor: '#FFD700'
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <p className="font-semibold text-sm" style={{ color: '#001F3F' }}>
                      Available
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0F0F0' }}>
                    <p className="text-xs text-gray-600 mb-1">Level</p>
                    <p className="font-semibold text-sm" style={{ color: '#001F3F' }}>
                      Intermediate
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    handleEnroll(course.id);
                  }}
                  className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#001F3F',
                    color: '#FFFFFF'
                  }}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enrollment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#001F3F' }}>
              Confirm Enrollment
            </h2>
            <p className="text-gray-600 mb-6">
              You are about to enroll in <span className="font-semibold">{selectedCourse.name}</span>. 
              A personalized study plan will be created for you.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex-1 py-2 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: '#F0F0F0',
                  color: '#001F3F'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleEnroll(selectedCourse.id)}
                className="flex-1 py-2 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: '#FFD700',
                  color: '#001F3F'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
