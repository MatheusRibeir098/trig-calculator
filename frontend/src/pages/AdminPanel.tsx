import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { UserManagement } from '../components/UserManagement';

type AdminSection = 'overview' | 'users' | 'history';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6'
    }}>
      {/* Navbar */}
      <Navbar />

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {(['overview', 'users', 'history'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                padding: '0.5rem 1rem',
                fontWeight: '500',
                borderBottom: activeSection === section ? '2px solid #a855f7' : '2px solid transparent',
                color: activeSection === section ? '#a855f7' : '#6b7280',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (activeSection !== section) {
                  (e.target as HTMLButtonElement).style.color = '#001f3f';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== section) {
                  (e.target as HTMLButtonElement).style.color = '#6b7280';
                }
              }}
            >
              {section === 'overview' && 'Visão Geral'}
              {section === 'users' && 'Usuários'}
              {section === 'history' && 'Histórico'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#001f3f',
                margin: 0
              }}>
                Painel de Administração
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: '#f3e8ff',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  border: '1px solid #e9d5ff'
                }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>
                    Status
                  </h3>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#a855f7',
                    margin: 0
                  }}>
                    ✓ Online
                  </p>
                </div>
                
                <div style={{
                  background: '#f3e8ff',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  border: '1px solid #e9d5ff'
                }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>
                    Usuário
                  </h3>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#a855f7',
                    margin: 0
                  }}>
                    {user.username}
                  </p>
                </div>
                
                <div style={{
                  background: '#f3e8ff',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  border: '1px solid #e9d5ff'
                }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>
                    Permissão
                  </h3>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#a855f7',
                    margin: 0
                  }}>
                    {user.role === 'Admin_User' ? 'Admin' : 'Usuário'}
                  </p>
                </div>
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <p style={{
                  color: '#1e40af',
                  margin: 0
                }}>
                  <strong>Bem-vindo ao Painel Admin!</strong> Use as abas acima para gerenciar usuários e histórico de cálculos.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <UserManagement />
          )}

          {activeSection === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#001f3f',
                margin: 0
              }}>
                Gerenciamento de Histórico
              </h2>
              
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <p style={{
                  color: '#1e40af',
                  margin: 0
                }}>
                  <strong>Dica:</strong> Acesse a página da calculadora para visualizar e gerenciar o histórico de cálculos.
                </p>
              </div>

              <button
                onClick={() => navigate('/calculator')}
                style={{
                  background: '#a855f7',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.2s',
                  width: 'fit-content'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#9333ea';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#a855f7';
                }}
              >
                Ir para Calculadora
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
