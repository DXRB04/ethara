import { useState } from 'react';
import api from '../api/axios';
import { UserPlus, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MemberModal = ({ project, onClose }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUserMember = project.members?.find(m => m.user_id === user.id);
  const isAdmin = currentUserMember?.role === 'admin';

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post(`/projects/${project.id}/members`, { email, role });
      setSuccess('Member added successfully!');
      setEmail('');
      setTimeout(onClose, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add member');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '20px' }}>Manage Members</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Current Members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {project.members?.map(m => (
              <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <span>User #{m.user_id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: m.role === 'admin' ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                  {m.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                  <span style={{ textTransform: 'capitalize' }}>{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '24px 0' }} />

            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Add New Member</h3>
            
            {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', marginBottom: '16px', fontSize: '14px' }}>{success}</div>}

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="colleague@company.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Admins can manage members and delete the project.
                </p>
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <UserPlus size={18} /> Add Member
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberModal;
