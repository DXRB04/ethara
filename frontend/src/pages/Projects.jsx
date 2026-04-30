import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Folder } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/');
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects/', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px' }}>Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Link key={project.id} to={`/projects/${project.id}`} className="glass-panel project-card">
            <div className="project-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  <Folder size={24} color="var(--accent-cyan)" />
                </div>
                <div className="project-title">{project.name}</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description || "No description provided."}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            No projects found. Create one to get started!
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '20px' }}>Create New Project</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Project Name</label>
                <input required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="E.g., Website Redesign" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Description</label>
                <textarea rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="Project details..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
