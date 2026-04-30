import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckSquare, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/me');
        // Sort by due date (closest first), placing those without dates at the end
        const sortedTasks = res.data.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        });
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (task, newStatus) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert on error
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const handleDueDateChange = async (task, newDate) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, due_date: newDate } : t));
    
    try {
      await api.put(`/tasks/${task.id}`, { due_date: newDate });
    } catch (error) {
      console.error("Failed to update due date", error);
      // Revert on error
      setTasks(tasks.map(t => t.id === task.id ? { ...t, due_date: task.due_date } : t));
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckSquare size={28} color="var(--accent-cyan)" /> My Tasks
        </h1>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
            No tasks assigned to you yet!
          </div>
        ) : (
          tasks.map(task => {
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
            
            return (
              <div 
                key={task.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px',
                  border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)'}`,
                  opacity: task.status === 'done' ? 0.6 : 1,
                  transition: 'opacity 0.2s, background 0.2s',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    marginBottom: '4px'
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className={`priority-badge priority-${task.priority}`} style={{ padding: '2px 6px', fontSize: '10px' }}>
                        {task.priority}
                      </span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> 
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-primary)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </span>
                    <Link to={`/projects/${task.project_id}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      Go to Project
                    </Link>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '13px',
                  color: isOverdue ? '#ef4444' : 'var(--text-secondary)',
                  background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                  padding: '6px 12px',
                  borderRadius: '20px'
                }}>
                  {isOverdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
                  <input 
                    type="date"
                    value={task.due_date || ''}
                    onChange={(e) => handleDueDateChange(task, e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      outline: 'none',
                      cursor: 'pointer',
                      // Hides default calendar icon in some browsers to just use ours
                      '::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tasks;
