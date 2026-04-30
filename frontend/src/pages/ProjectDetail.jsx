import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Users, Settings, Trash2 } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import MemberModal from '../components/MemberModal';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [showMemberModal, setShowMemberModal] = useState(false);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/?project_id=${id}`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Failed to fetch project data", error);
      if (error.response?.status === 403 || error.response?.status === 404) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (window.confirm(`Are you sure you want to delete ${project.name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/projects/${project.id}`);
        navigate('/projects');
      } catch (error) {
        console.error("Failed to delete project", error);
      }
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === parseInt(taskId));
    
    if (task && task.status !== status) {
      // Optimistic update
      setTasks(tasks.map(t => t.id === parseInt(taskId) ? { ...t, status } : t));
      
      try {
        await api.put(`/tasks/${taskId}`, { status });
      } catch (error) {
        console.error("Failed to update status", error);
        fetchProjectData(); // Revert on failure
      }
    }
  };

  const openTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setShowTaskModal(false);
    fetchProjectData();
  };

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  const currentUserMember = project.members?.find(m => m.user_id === user.id);
  const isAdmin = currentUserMember?.role === 'admin';

  const columns = [
    { id: 'todo', title: 'To Do', color: 'var(--status-todo)' },
    { id: 'in-progress', title: 'In Progress', color: 'var(--status-progress)' },
    { id: 'review', title: 'Review', color: 'var(--status-review)' },
    { id: 'done', title: 'Done', color: 'var(--status-done)' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdmin && (
            <button onClick={handleDeleteProject} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <Trash2 size={18} /> Delete Project
            </button>
          )}
          <button onClick={() => setShowMemberModal(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Members ({project.members?.length || 1})
          </button>
          <button onClick={() => openTask(null)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: col.color }} />
                  {col.title}
                </div>
                <span className="column-count">{colTasks.length}</span>
              </div>
              
              <div className="task-list">
                {colTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => openTask(task)}
                  >
                    <div className={`priority-badge priority-${task.priority}`} style={{ width: 'fit-content', marginBottom: '8px' }}>
                      {task.priority}
                    </div>
                    <div className="task-title">{task.title}</div>
                    {task.due_date && (
                      <div className="task-meta">
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showTaskModal && (
        <TaskModal 
          task={selectedTask} 
          projectId={project.id} 
          onClose={closeTaskModal} 
          members={project.members}
        />
      )}

      {showMemberModal && (
        <MemberModal 
          project={project} 
          onClose={() => { setShowMemberModal(false); fetchProjectData(); }} 
        />
      )}
    </div>
  );
};

export default ProjectDetail;
