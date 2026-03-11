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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">Histórico de Cálculos</h2>
        {total > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-navy/70">Carregando...</p>
      ) : !records || records.length === 0 ? (
        <p className="text-center text-navy/70">Nenhum cálculo salvo ainda</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-purple">
                  <th className="text-left py-3 px-4 font-bold text-navy">Data/Hora</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">θ (°)</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">Oposto</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">Adjacente</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">Hipotenusa</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">sen(θ)</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">cos(θ)</th>
                  <th className="text-center py-3 px-4 font-bold text-navy">Ação</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-purple/20 hover:bg-purple/5">
                    <td className="py-3 px-4">
                      {new Date(record.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.angle, 2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.opposite, 2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.adjacent, 2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.hypotenuse, 2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.sin, 4)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {formatNumber(record.cos, 4)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-xs"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-navy/70">
              Mostrando {records.length} de {total} registros
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="bg-purple hover:bg-purple/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                className="bg-purple hover:bg-purple/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
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
