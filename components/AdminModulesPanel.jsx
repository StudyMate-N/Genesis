import React, { useState, useEffect } from 'react';

export default function AdminModulesPanel({ T }) {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleCourseId, setNewModuleCourseId] = useState('');
  const [newModuleContent, setNewModuleContent] = useState('');
  const [newModuleType, setNewModuleType] = useState('text'); // Default type
  const [editingModule, setEditingModule] = useState(null);
  const [editedModuleName, setEditedModuleName] = useState('');
  const [editedModuleCourseId, setEditedModuleCourseId] = useState('');
  const [editedModuleContent, setEditedModuleContent] = useState('');
  const [editedModuleType, setEditedModuleType] = useState('');
  const [toast, setToast] = useState(null);

  const msg = (m, e) => { setToast({ m, e }); setTimeout(() => setToast(null), 3500) };

  useEffect(() => {
    fetchCourses();
    fetchModules();
  }, []);

  const fetchCourses = async () => {
    try {
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
    }
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setModules(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setError(e.message);
      msg(`Error fetching modules: ${e.message}`, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleName.trim() || !newModuleCourseId || !newModuleContent.trim() || !newModuleType.trim()) {
      msg("All module fields are required.", 1);
      return;
    }
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newModuleName, courseId: newModuleCourseId, content: newModuleContent, type: newModuleType }),
      });
      const result = await response.json();
      if (result.success) {
        setNewModuleName('');
        setNewModuleCourseId('');
        setNewModuleContent('');
        setNewModuleType('text');
        fetchModules();
        msg("Module added successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error adding module: ${e.message}`, 1);
    }
  };

  const handleEditModule = async (moduleId) => {
    if (!editedModuleName.trim() || !editedModuleCourseId || !editedModuleContent.trim() || !editedModuleType.trim()) {
      msg("All module fields are required.", 1);
      return;
    }
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedModuleName, courseId: editedModuleCourseId, content: editedModuleContent, type: editedModuleType }),
      });
      const result = await response.json();
      if (result.success) {
        setEditingModule(null);
        setEditedModuleName('');
        setEditedModuleCourseId('');
        setEditedModuleContent('');
        setEditedModuleType('');
        fetchModules();
        msg("Module updated successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error updating module: ${e.message}`, 1);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchModules();
        msg("Module deleted successfully.", 0);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      msg(`Error deleting module: ${e.message}`, 1);
    }
  };

  if (loading) return <div style={{ color: T.text }}>Loading modules...</div>;
  if (error) return <div style={{ color: T.danger }}>Error: {error}</div>;

  return (
    <div style={{ color: T.text }}>
      <h2 style={{ color: T.text, marginBottom: 20 }}>Manage Modules</h2>

      <div style={{ marginBottom: 30, padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ color: T.text, marginBottom: 15 }}>Add New Module</h3>
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="Module Title"
          style={{
            width: '100%',
            padding: '10px 15px',
            marginBottom: 15,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.white,
            color: T.navyBlue,
            fontSize: 16,
          }}
        />
        <select
          value={newModuleCourseId}
          onChange={(e) => setNewModuleCourseId(e.target.value)}
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
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <textarea
          value={newModuleContent}
          onChange={(e) => setNewModuleContent(e.target.value)}
          placeholder="Module Content"
          rows="5"
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
        <select
          value={newModuleType}
          onChange={(e) => setNewModuleType(e.target.value)}
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
        >
          <option value="text">Text</option>
          <option value="quiz">Quiz</option>
          <option value="flashcard">Flashcard</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="mindmap">Mind Map</option>
        </select>
        <button
          onClick={handleAddModule}
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
          Add Module
        </button>
      </div>

      <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ color: T.text, marginBottom: 15 }}>Existing Modules</h3>
        {modules.length === 0 ? (
          <p style={{ color: T.muted }}>No modules found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {modules.map((module) => (
              <li key={module.id} style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 0',
                borderBottom: `1px solid ${T.lightGray}`,
                '&:last-child': { borderBottom: 'none' },
              }}>
                {editingModule?.id === module.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <input
                      type="text"
                      value={editedModuleName}
                      onChange={(e) => setEditedModuleName(e.target.value)}
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
                    <select
                      value={editedModuleCourseId}
                      onChange={(e) => setEditedModuleCourseId(e.target.value)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                    <textarea
                      value={editedModuleContent}
                      onChange={(e) => setEditedModuleContent(e.target.value)}
                      rows="5"
                      style={{
                        flexGrow: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 5,
                        resize: 'vertical',
                      }}
                    />
                    <select
                      value={editedModuleType}
                      onChange={(e) => setEditedModuleType(e.target.value)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                        marginBottom: 10,
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="flashcard">Flashcard</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="mindmap">Mind Map</option>
                    </select>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEditModule(module.id)}
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
                        onClick={() => setEditingModule(null)}
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
                      <span style={{ fontSize: 15, color: T.navyBlue, fontWeight: 600 }}>{module.title} (Course: {courses.find(c => c.id === module.courseId)?.name || 'N/A'})</span>
                      <p style={{ fontSize: 13, color: T.muted, marginTop: 5 }}>Type: {module.type}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => { setEditingModule(module); setEditedModuleName(module.title); setEditedModuleCourseId(module.courseId); setEditedModuleContent(module.content); setEditedModuleType(module.type); }}
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
                        onClick={() => handleDeleteModule(module.id)}
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
