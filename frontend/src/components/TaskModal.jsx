import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ task, projectId, onClose, members = [] }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    assignee_id: task?.assignee_id || '',
    due_date: task?.due_date || ''
  });
  const [error, setError] = useState('');

  const isEdit = !!task;

  // Determine if user can edit this task (simplified admin/owner check)
  const isMember = members.find(m => m.user_id === user.id);
  const isAdmin = isMember?.role === 'admin';
  const canEdit = isAdmin || task?.assignee_id === user.id || task?.created_by === user.id || !isEdit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null,
      };

      if (isEdit) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post(`/tasks/`, { ...payload, project_id: projectId });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${task.id}`);
        onClose();
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete task');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '20px' }}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>✕</button>
        </div>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Title</label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              disabled={!canEdit}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Description</label>
            <textarea 
              rows="4" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              disabled={!canEdit}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} disabled={!canEdit}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} disabled={!canEdit}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Assign To</label>
              <select value={formData.assignee_id} onChange={e => setFormData({...formData, assignee_id: e.target.value})} disabled={!canEdit}>
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.user_id} value={m.user_id}>User #{m.user_id}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Due Date</label>
              <input 
                type="date" 
                value={formData.due_date} 
                onChange={e => setFormData({...formData, due_date: e.target.value})} 
                disabled={!canEdit}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            {isEdit && isAdmin ? (
              <button type="button" onClick={handleDelete} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>Delete Task</button>
            ) : <div/>}
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              {canEdit && <button type="submit" className="btn-primary">Save Changes</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
