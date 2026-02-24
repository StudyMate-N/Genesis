import React, { useState, useEffect } from 'react';

export default function AdminCoursesPanel({ T }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editedCourseName, setEditedCourseName] = useState('');
  const [editedCourseCode, setEditedCourseCode] = useState('');
  const [editedCourseDescription, setEditedCourseDescription] = useState('');
  const [toast, setToast] = useState(null);

  const msg = (m, e) => { setToast({ m, e }); setTimeout(() => setToast(null), 3500) };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setError(e.message);
      msg(`Error fetching courses: ${e.message}`, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName.trim() || !newCourseCode.trim()) {
      msg("Course name and code are required.", 1);
      return;
    }
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCourseName, code: newCourseCode, description: newCourseDescription }),
      });
      const result = await response.json();
      if (result.success) {
        setNewCourseName('');
        setNewCourseCode('');
        setNewCourseDescription('');
        fetchCourses();
        msg("Course added successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error adding course: ${e.message}`, 1);
    }
  };

  const handleEditCourse = async (courseId) => {
    if (!editedCourseName.trim() || !editedCourseCode.trim()) {
      msg("Course name and code are required.", 1);
      return;
    }
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedCourseName, code: editedCourseCode, description: editedCourseDescription }),
      });
      const result = await response.json();
      if (result.success) {
        setEditingCourse(null);
        setEditedCourseName('');
        setEditedCourseCode('');
        setEditedCourseDescription('');
        fetchCourses();
        msg("Course updated successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error updating course: ${e.message}`, 1);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchCourses();
        msg("Course deleted successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error deleting course: ${e.message}`, 1);
    }
  };

  if (loading) return <div style={{ color: T.text }}>Loading courses...</div>;
  if (error) return <div style={{ color: T.danger }}>Error: {error}</div>;

  return (
    <div style={{ color: T.text }}>
      <h2 style={{ color: T.text, marginBottom: 20 }}>Manage Courses</h2>

      <div style={{ marginBottom: 30, padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ color: T.text, marginBottom: 15 }}>Add New Course</h3>
        <input
          type="text"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder="Course Name"
          style={{
            width: '100%',
            padding: '10px 15px',
            marginBottom: 10,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.white,
            color: T.navyBlue,
            fontSize: 16,
          }}
        />
        <input
          type="text"
          value={newCourseCode}
          onChange={(e) => setNewCourseCode(e.target.value)}
          placeholder="Course Code"
          style={{
            width: '100%',
            padding: '10px 15px',
            marginBottom: 10,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.white,
            color: T.navyBlue,
            fontSize: 16,
          }}
        />
        <textarea
          value={newCourseDescription}
          onChange={(e) => setNewCourseDescription(e.target.value)}
          placeholder="Course Description (Optional)"
          rows="3"
          style={{
            width: '100%',
            padding: '10px 15px',
            marginBottom: 15,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.white,
            color: T.navyBlue,
            fontSize: 16,
            resize: 'vertical',
          }}
        />
        <button
          onClick={handleAddCourse}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: T.gold,
            color: T.navyBlue,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16,
            transition: 'background 0.2s ease',
            '&:hover': { background: T.accentHover },
          }}
        >
          Add Course
        </button>
      </div>

      <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ color: T.text, marginBottom: 15 }}>Existing Courses</h3>
        {courses.length === 0 ? (
          <p style={{ color: T.muted }}>No courses found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {courses.map((course) => (
              <li key={course.id} style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 0',
                borderBottom: `1px solid ${T.lightGray}`,
                '&:last-child': { borderBottom: 'none' },
              }}>
                {editingCourse?.id === course.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <input
                      type="text"
                      value={editedCourseName}
                      onChange={(e) => setEditedCourseName(e.target.value)}
                      style={{
                        flexGrow: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                    />
                    <input
                      type="text"
                      value={editedCourseCode}
                      onChange={(e) => setEditedCourseCode(e.target.value)}
                      style={{
                        flexGrow: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                    />
                    <textarea
                      value={editedCourseDescription}
                      onChange={(e) => setEditedCourseDescription(e.target.value)}
                      rows="3"
                      style={{
                        flexGrow: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 10,
                        resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                        background: T.gold,
                        color: T.navyBlue,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: 14,
                        marginRight: 8,
                      }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCourse(null)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                        background: T.lightGray,
                        color: T.navyBlue,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: 14,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <span style={{ fontSize: 15, color: T.navyBlue, fontWeight: 600 }}>{course.name} ({course.code})</span>
                      {course.description && <p style={{ fontSize: 13, color: T.muted, marginTop: 5 }}>{course.description}</p>}
                    </div>
                    <div>
                      <button
                        onClick={() => { setEditingCourse(course); setEditedCourseName(course.name); setEditedCourseCode(course.code); setEditedCourseDescription(course.description || ''); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                          background: T.gold,
                          color: T.navyBlue,
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontSize: 14,
                          marginRight: 8,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                        background: T.danger,
                        color: T.white,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: 14,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {toast && <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: toast.e ? T.danger : T.success, color: T.white, padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 101, boxShadow: "0 4px 15px rgba(0,0,0,.2)" }}>{toast.m}</div>}
    </div>
  );
}
