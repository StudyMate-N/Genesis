'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Assuming next-auth for session management

// Veritas Academy Brand Colors (local definition for this component)
const VA_COLORS = {
  navyBlue: '#001F3F',
  gold: '#FFD700',
  lightGray: '#F0F0F0',
  white: '#FFFFFF',
  // Derived colors for UI elements
  bg: '#F0F0F0', // Light Gray
  surface: '#FFFFFF', // White
  surface2: '#F0F0F0', // Light Gray for secondary surfaces
  border: '#D0D0D0', // Slightly darker gray for borders
  border2: '#E0E0E0', // Even lighter gray for subtle borders
  text: '#001F3F', // Navy Blue for primary text
  text2: '#333333', // Darker gray for secondary text
  muted: '#666666', // Gray for muted text
  accent: '#FFD700', // Gold for accents
  accentHover: '#e6c200', // Slightly darker gold for hover
  accentBg: 'rgba(255, 215, 0, 0.1)', // Light gold background
  danger: '#EF4444', // Red for danger actions
  info: '#3B82F6', // Blue for info
  success: '#22C55E', // Green for success
  shadow: 'rgba(0,0,0,0.15)', // Shadow color
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const T = VA_COLORS; // Use Veritas Academy colors locally
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [toast, setToast] = useState(null);

  const msg = (m, e) => { setToast({ m, e }); setTimeout(() => setToast(null), 3500) };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserProfile();
    }
  }, [status, session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserProfile(data.profile);
      setEditedName(data.profile.name);
      setEditedEmail(data.profile.email);
      setEnrolledCourses(data.profile.enrolledCourses || []);
      setQuizHistory(data.profile.quizAttempts || []);
    } catch (e) {
      setError(e.message);
      msg(`Error fetching profile: ${e.message}`, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      msg("Name and email cannot be empty.", 1);
      return;
    }
    try {
      const response = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName, email: editedEmail }),
      });
      const result = await response.json();
      if (response.ok) {
        setUserProfile(result.profile);
        setIsEditing(false);
        msg("Profile updated successfully.", 0);
      } else {
        throw new Error(result.message || result.error);
      }
    } catch (e) {
      msg(`Error updating profile: ${e.message}`, 1);
    }
  };

  if (status === 'loading' || loading) return <div>Loading profile...</div>;
  if (status === 'unauthenticated') return <div>Please log in to view your profile.</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userProfile) return <div>No profile data found.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20, color: T.navyBlue }}>My Profile</h1>

      <div style={{ marginBottom: 30, padding: 20, background: T.white, borderRadius: 8, boxShadow: '0 2px 4px ' + T.shadow }}>
        <h2 style={{ fontSize: 22, marginBottom: 15, color: T.navyBlue }}>Personal Information</h2>
        {isEditing ? (
          <div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: T.navyBlue }}>Name:</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid ' + T.lightGray, color: T.navyBlue, background: T.white }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: T.navyBlue }}>Email:</label>
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid ' + T.lightGray, color: T.navyBlue, background: T.white }}
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              style={{ background: T.gold, color: T.navyBlue, padding: '10px 15px', borderRadius: 5, border: 'none', cursor: 'pointer', marginRight: 10 }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{ background: T.lightGray, color: T.navyBlue, padding: '10px 15px', borderRadius: 5, border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: 10 }}><strong style={{ color: T.navyBlue }}>Name:</strong> {userProfile.name}</p>
            <p style={{ marginBottom: 15 }}><strong style={{ color: T.navyBlue }}>Email:</strong> {userProfile.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              style={{ background: T.gold, color: T.navyBlue, padding: '10px 15px', borderRadius: 5, border: 'none', cursor: 'pointer' }}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 30, padding: 20, background: T.white, borderRadius: 8, boxShadow: '0 2px 4px ' + T.shadow }}>
        <h2 style={{ fontSize: 22, marginBottom: 15, color: T.navyBlue }}>Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p>No enrolled courses found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {enrolledCourses.map(course => (
              <li key={course.course.id} style={{ padding: '10px 0', borderBottom: '1px solid ' + T.lightGray }}>
                <strong style={{ color: T.navyBlue }}>{course.course.name}</strong> ({course.course.code})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ padding: 20, background: T.white, borderRadius: 8, boxShadow: '0 2px 4px ' + T.shadow }}>
        <h2 style={{ fontSize: 22, marginBottom: 15, color: T.navyBlue }}>Quiz History</h2>
        {quizHistory.length === 0 ? (
          <p>No quiz history found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {quizHistory.map(quiz => (
              <li key={quiz.id} style={{ padding: '10px 0', borderBottom: '1px solid ' + T.lightGray }}>
                <strong style={{ color: T.navyBlue }}>{quiz.quizName}</strong> - Score: {quiz.score} ({new Date(quiz.createdAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.e ? T.danger : T.success,
            color: T.white,
            padding: '12px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 101,
            boxShadow: '0 4px 15px rgba(0,0,0,.2)',
          }}
        >
          {toast.m}
        </div>
      )}
    </div>
  );
}
