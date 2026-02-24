import React, { useState, useEffect } from 'react';

export default function AdminUsersPanel({ T }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserName, setEditedUserName] = useState('');
  const [editedUserEmail, setEditedUserEmail] = useState('');
  const [toast, setToast] = useState(null);

  const msg = (m, e) => { setToast({ m, e }); setTimeout(() => setToast(null), 3500) };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (e) {
      setError(e.message);
      msg(`Error fetching users: ${e.message}`, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userId) => {
    if (!editedUserName.trim() || !editedUserEmail.trim()) {
      msg("User name and email are required.", 1);
      return;
    }
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedUserName, email: editedUserEmail }),
      });
      const result = await response.json();
      if (response.ok) {
        setEditingUser(null);
        setEditedUserName('');
        setEditedUserEmail('');
        fetchUsers();
        msg("User updated successfully.", 0);
      } else {
        throw new Error(result.message || result.error);
      }
    } catch (e) {
      msg(`Error updating user: ${e.message}`, 1);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        fetchUsers();
        msg("User deleted successfully.", 0);
      } else {
        throw new Error(result.message || result.error);
      }
    } catch (e) {
      msg(`Error deleting user: ${e.message}`, 1);
    }
  };

  if (loading) return <div style={{ color: T.text }}>Loading users...</div>;
  if (error) return <div style={{ color: T.danger }}>Error: {error}</div>;

  return (
    <div style={{ color: T.text }}>
      <h2 style={{ color: T.text, marginBottom: 20 }}>Manage Users</h2>

      <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ color: T.text, marginBottom: 15 }}>Existing Users</h3>
        {users.length === 0 ? (
          <p style={{ color: T.muted }}>No users found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: `1px solid ${T.lightGray}`,
                '&:last-child': { borderBottom: 'none' },
              }}>
                {editingUser?.id === user.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginRight: 10 }}>
                    <input
                      type="text"
                      value={editedUserName}
                      onChange={(e) => setEditedUserName(e.target.value)}
                      style={{
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
                      type="email"
                      value={editedUserEmail}
                      onChange={(e) => setEditedUserEmail(e.target.value)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${T.border}`,
                        background: T.white,
                        color: T.navyBlue,
                        fontSize: 15,
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: 15, color: T.navyBlue, fontWeight: 600 }}>{user.name}</span>
                    <br />
                    <span style={{ fontSize: 13, color: T.muted }}>{user.email}</span>
                  </div>
                )}
                <div>
                  {editingUser?.id === user.id ? (
                    <button
                      onClick={() => handleEditUser(user.id)}
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
                  ) : (
                    <button
                      onClick={() => { setEditingUser(user); setEditedUserName(user.name); setEditedUserEmail(user.email); }}
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
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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
              </li>
            ))}
          </ul>
        )}
      </div>
      {toast && <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: toast.e ? T.danger : T.success, color: T.white, padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 101, boxShadow: "0 4px 15px rgba(0,0,0,.2)" }}>{toast.m}</div>}
    </div>
  );
}
