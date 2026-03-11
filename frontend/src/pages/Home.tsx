import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TrigForm } from '../components/TrigForm';
import { HistoryPanel } from '../components/HistoryPanel';

export function Home() {
  const [error, setError] = useState('');
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleCalculate = () => {
    setError('');
    setHistoryRefresh(prev => prev + 1);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb'
    }}>
      {/* Navbar */}
      <Navbar />

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fee2e2',
            borderLeft: '4px solid #ef4444',
            color: '#b91c1c',
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '0.5rem',
            maxWidth: '42rem',
            margin: '0 auto 1.5rem'
          }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Erro</p>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <div style={{ marginBottom: '2rem' }}>
          <TrigForm onCalculate={handleCalculate} onError={handleError} />
        </div>

        {/* History */}
        <div style={{ marginTop: '2rem' }}>
          <HistoryPanel refreshTrigger={historyRefresh} />
        </div>
      </main>
    </div>
  );
}
