import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header gradient-text">
        Ethara
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>My Tasks</span>
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto', padding: '16px' }}>
        <button className="nav-item" style={{ width: '100%', background: 'transparent' }}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
