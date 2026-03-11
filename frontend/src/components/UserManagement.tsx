import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Common_User');
  const [formLoading, setFormLoading] = useState(false);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !newPassword) {
      setError('Usuário e senha são obrigatórios');
      return;
    }

    if (newPassword.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    try {
      setFormLoading(true);
      setError('');
      setSuccess('');

      const response = await api.post('/auth/register', {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });

      setUsers([...users, response.data.user]);
      setNewUsername('');
      setNewPassword('');
      setNewRole('Common_User');
      setShowForm(false);
      setSuccess(`Usuário '${newUsername}' criado com sucesso!`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar usuário');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário '${username}'?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      setSuccess(`Usuário '${username}' deletado com sucesso!`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao deletar usuário');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#001f3f',
          margin: 0
        }}>
          Gerenciamento de Usuários
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: '#a855f7',
            color: 'white',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
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
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          {success}
        </div>
      )}

      {/* Create User Form */}
      {showForm && (
        <div style={{
          background: '#f3e8ff',
          border: '2px solid #a855f7',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#001f3f',
            marginBottom: '1rem',
            margin: 0
          }}>
            Criar Novo Usuário
          </h3>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#001f3f',
                marginBottom: '0.25rem'
              }}>
                Usuário
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Digite o nome de usuário"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #a855f7',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                disabled={formLoading}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#001f3f',
                marginBottom: '0.25rem'
              }}>
                Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #a855f7',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                disabled={formLoading}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#001f3f',
                marginBottom: '0.25rem'
              }}>
                Função
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #a855f7',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                disabled={formLoading}
              >
                <option value="Common_User">Usuário Comum</option>
                <option value="Admin_User">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              style={{
                width: '100%',
                background: formLoading ? '#9ca3af' : '#a855f7',
                color: 'white',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: formLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                if (!formLoading) {
                  (e.target as HTMLButtonElement).style.background = '#9333ea';
                }
              }}
              onMouseOut={(e) => {
                if (!formLoading) {
                  (e.target as HTMLButtonElement).style.background = '#a855f7';
                }
              }}
            >
              {formLoading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      <div style={{
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Carregando usuários...
          </div>
        ) : users.length === 0 ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Nenhum usuário encontrado
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: '#f3e8ff',
                  borderBottom: '2px solid #a855f7'
                }}>
                  <th style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#001f3f'
                  }}>
                    Usuário
                  </th>
                  <th style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#001f3f'
                  }}>
                    Função
                  </th>
                  <th style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#001f3f'
                  }}>
                    Criado em
                  </th>
                  <th style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#001f3f'
                  }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid #e5e7eb',
                    background: 'white'
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = 'white';
                  }}
                  >
                    <td style={{
                      padding: '1rem 1.5rem',
                      color: '#001f3f',
                      fontWeight: '500'
                    }}>
                      {user.username}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        background: user.role === 'Admin_User' ? '#f3e8ff' : '#dbeafe',
                        color: user.role === 'Admin_User' ? '#a855f7' : '#1e40af'
                      }}>
                        {user.role === 'Admin_User' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}>
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => {
                          (e.target as HTMLButtonElement).style.background = '#dc2626';
                        }}
                        onMouseOut={(e) => {
                          (e.target as HTMLButtonElement).style.background = '#ef4444';
                        }}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
