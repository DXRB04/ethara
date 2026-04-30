import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      marginBottom: '32px',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%', background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{user?.email}</div>
        </div>
      </div>
      <button 
        onClick={logout} 
        style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
      >
        <LogOut size={18} />
      </button>
    </header>
  );
};

export default Navbar;
