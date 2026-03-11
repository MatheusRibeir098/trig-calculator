import { useEffect, useState } from 'react';
import { getCalculations, deleteCalculation, clearAllCalculations, CalculationRecord } from '../lib/api';
import { formatNumber } from '../lib/trig';

interface HistoryPanelProps {
  refreshTrigger?: number;
}

export function HistoryPanel({ refreshTrigger = 0 }: HistoryPanelProps) {
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getCalculations(limit, offset);
      setRecords(response.items);
      setTotal(response.total);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [offset, refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await deleteCalculation(id);
      setRecords(records.filter(r => r.id !== id));
      setTotal(total - 1);
    } catch (err) {
      setError('Erro ao excluir item');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Tem certeza que deseja limpar TODO o histórico?')) return;
    try {
      await clearAllCalculations();
      setRecords([]);
      setTotal(0);
      setOffset(0);
    } catch (err) {
      setError('Erro ao limpar histórico');
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      maxWidth: '64rem',
      margin: '1rem auto'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
          fontWeight: 'bold',
          color: '#001f3f',
          textAlign: 'center'
        }}>
          Histórico de Cálculos
        </h2>
        {total > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'background 0.2s',
              alignSelf: 'center'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#dc2626'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#ef4444'}
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          borderLeft: '4px solid #ef4444',
          color: '#b91c1c',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '0.25rem'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Carregando...</p>
      ) : !records || records.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Nenhum cálculo salvo ainda</p>
      ) : (
        <>
          {/* Mobile: Card view */}
          <div style={{ display: 'block' }}>
            {records.map((record) => (
              <div
                key={record.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  background: '#fafafa'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  fontSize: '0.75rem'
                }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Data:</span>
                    <div style={{ fontWeight: '600', color: '#001f3f' }}>
                      {new Date(record.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                      {new Date(record.created_at).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>θ:</span>
                    <div style={{ fontWeight: '600', color: '#a855f7' }}>
                      {formatNumber(record.angle, 2)}°
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Oposto:</span>
                    <div style={{ fontWeight: '600', color: '#001f3f' }}>
                      {formatNumber(record.opposite, 2)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Adjacente:</span>
                    <div style={{ fontWeight: '600', color: '#001f3f' }}>
                      {formatNumber(record.adjacent, 2)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Hipotenusa:</span>
                    <div style={{ fontWeight: '600', color: '#001f3f' }}>
                      {formatNumber(record.hypotenuse, 2)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>sen/cos:</span>
                    <div style={{ fontWeight: '600', color: '#a855f7', fontSize: '0.7rem' }}>
                      {formatNumber(record.sin, 3)} / {formatNumber(record.cos, 3)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    marginTop: '0.75rem',
                    width: '100%',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#dc2626'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#ef4444'}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1rem',
            alignItems: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {records.length} de {total} registros
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                style={{
                  background: offset === 0 ? '#d1d5db' : '#a855f7',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: offset === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  transition: 'background 0.2s',
                  opacity: offset === 0 ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (offset !== 0) (e.target as HTMLButtonElement).style.background = '#9333ea';
                }}
                onMouseOut={(e) => {
                  if (offset !== 0) (e.target as HTMLButtonElement).style.background = '#a855f7';
                }}
              >
                ← Anterior
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                style={{
                  background: offset + limit >= total ? '#d1d5db' : '#a855f7',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: offset + limit >= total ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  transition: 'background 0.2s',
                  opacity: offset + limit >= total ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (offset + limit < total) (e.target as HTMLButtonElement).style.background = '#9333ea';
                }}
                onMouseOut={(e) => {
                  if (offset + limit < total) (e.target as HTMLButtonElement).style.background = '#a855f7';
                }}
              >
                Próximo →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
