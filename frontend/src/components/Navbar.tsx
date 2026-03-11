import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav style={{
      background: '#001f3f',
      color: 'white',
      padding: '1rem 1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: 0,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/calculator')}
        >
          Calculadora de Trigonometria
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {user && (
            <>
              <span style={{ fontSize: '0.875rem' }}>
                Bem-vindo, <strong>{user.username}</strong>
              </span>
              {user.role === 'Admin_User' && (
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    background: '#a855f7',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.background = '#9333ea';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.background = '#a855f7';
                  }}
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#dc2626';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#ef4444';
                }}
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
