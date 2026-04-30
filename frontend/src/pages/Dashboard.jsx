import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Tasks', value: stats?.total_tasks || 0, icon: <ListTodo size={24} color="var(--accent-cyan)" /> },
    { label: 'My Tasks', value: stats?.my_tasks || 0, icon: <CheckCircle size={24} color="var(--accent-violet)" /> },
    { label: 'Overdue', value: stats?.overdue_tasks || 0, icon: <AlertTriangle size={24} color="#ef4444" /> },
    { label: 'In Progress', value: stats?.by_status?.['in-progress'] || 0, icon: <Clock size={24} color="#f59e0b" /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px' }}>Dashboard</h1>
        <Link to="/projects" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Projects</Link>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-panel stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="stat-label">{stat.label}</div>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Task Distribution</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['todo', 'in-progress', 'review', 'done'].map(status => (
            <div key={status} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {status.replace('-', ' ')}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats?.by_status?.[status] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
