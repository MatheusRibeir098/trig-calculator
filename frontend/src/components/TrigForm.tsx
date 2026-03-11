import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  calculateTriangle,
  validateAngle,
  validateSide,
  CalculationResult,
  formatNumber,
} from '../lib/trig';
import { saveCalculation } from '../lib/api';
import { TriangleCanvas } from './TriangleCanvas';

const formSchema = z.object({
  angle: z.string().optional(),
  opposite: z.string().optional(),
  adjacent: z.string().optional(),
  hypotenuse: z.string().optional(),
  angleUnit: z.enum(['degrees', 'radians']),
  decimals: z.number().min(1).max(10),
});

type FormData = z.infer<typeof formSchema>;

interface TrigFormProps {
  onCalculate: (result: CalculationResult) => void;
  onError: (error: string) => void;
}

export function TrigForm({ onCalculate, onError }: TrigFormProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      angleUnit: 'degrees',
      decimals: 4,
    },
  });

  const decimals = watch('decimals');

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      onError('');

      const angle = data.angle ? parseFloat(data.angle) : undefined;
      const opposite = data.opposite ? parseFloat(data.opposite) : undefined;
      const adjacent = data.adjacent ? parseFloat(data.adjacent) : undefined;
      const hypotenuse = data.hypotenuse ? parseFloat(data.hypotenuse) : undefined;

      // Validate inputs
      if (angle !== undefined) {
        const validation = validateAngle(angle);
        if (!validation.valid) throw new Error(validation.error);
      }
      if (opposite !== undefined) {
        const validation = validateSide(opposite, 'Cateto oposto');
        if (!validation.valid) throw new Error(validation.error);
      }
      if (adjacent !== undefined) {
        const validation = validateSide(adjacent, 'Cateto adjacente');
        if (!validation.valid) throw new Error(validation.error);
      }
      if (hypotenuse !== undefined) {
        const validation = validateSide(hypotenuse, 'Hipotenusa');
        if (!validation.valid) throw new Error(validation.error);
      }

      // Calculate
      const calcResult = calculateTriangle({ angle, opposite, adjacent, hypotenuse });
      setResult(calcResult);
      onCalculate(calcResult);

      // Save to backend
      if (
        calcResult.angle !== undefined &&
        calcResult.opposite !== undefined &&
        calcResult.adjacent !== undefined &&
        calcResult.hypotenuse !== undefined
      ) {
        await saveCalculation({
          angle: calcResult.angle,
          opposite: calcResult.opposite,
          adjacent: calcResult.adjacent,
          hypotenuse: calcResult.hypotenuse,
          sin: calcResult.sin || 0,
          cos: calcResult.cos || 0,
          tan: calcResult.tan || 0,
          cot: calcResult.cot || 0,
          sec: calcResult.sec || 0,
          csc: calcResult.csc || 0,
          angle_unit: data.angleUnit as 'degrees' | 'radians',
        });
        setSaveSuccess(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao calcular';
      onError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      maxWidth: '42rem',
      margin: '0 auto'
    }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Inputs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Ângulo (θ)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 45"
              {...register('angle')}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#001f3f'}
              onBlur={(e) => e.target.style.borderColor = '#a855f7'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Cateto Oposto
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 100"
              {...register('opposite')}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#001f3f'}
              onBlur={(e) => e.target.style.borderColor = '#a855f7'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Cateto Adjacente
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 100"
              {...register('adjacent')}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#001f3f'}
              onBlur={(e) => e.target.style.borderColor = '#a855f7'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Hipotenusa
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 141.4"
              {...register('hypotenuse')}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#001f3f'}
              onBlur={(e) => e.target.style.borderColor = '#a855f7'}
            />
          </div>
        </div>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Unidade do Ângulo
            </label>
            <select
              {...register('angleUnit')}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            >
              <option value="degrees">Graus (°)</option>
              <option value="radians">Radianos (rad)</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#001f3f',
              marginBottom: '0.5rem'
            }}>
              Casas Decimais
            </label>
            <input
              type="number"
              min="1"
              max="10"
              {...register('decimals', { valueAsNumber: true })}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '2px solid #a855f7',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#9ca3af' : '#a855f7',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.background = '#9333ea';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.background = '#a855f7';
            }
          }}
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={() => {
            reset();
            setResult(null);
            setSaveSuccess(false);
          }}
          style={{
            width: '100%',
            background: '#001f3f',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.background = '#000d1a';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.background = '#001f3f';
          }}
        >
          Limpar
        </button>
      </form>

      {/* Results */}
      {result && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f3e8ff',
          borderRadius: '0.5rem',
          border: '2px solid #a855f7'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#001f3f',
            marginBottom: '1rem',
            margin: 0
          }}>
            Resultados
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem'
          }}>
            {result.angle !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Ângulo
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.angle, decimals)}°
                </p>
              </div>
            )}
            {result.opposite !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Cateto Oposto
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.opposite, decimals)}
                </p>
              </div>
            )}
            {result.adjacent !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Cateto Adjacente
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.adjacent, decimals)}
                </p>
              </div>
            )}
            {result.hypotenuse !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Hipotenusa
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.hypotenuse, decimals)}
                </p>
              </div>
            )}
            {result.sin !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  sen(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.sin, decimals)}
                </p>
              </div>
            )}
            {result.cos !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  cos(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.cos, decimals)}
                </p>
              </div>
            )}
            {result.tan !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  tan(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.tan, decimals)}
                </p>
              </div>
            )}
            {result.cot !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  cot(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.cot, decimals)}
                </p>
              </div>
            )}
            {result.sec !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  sec(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.sec, decimals)}
                </p>
              </div>
            )}
            {result.csc !== undefined && (
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  csc(θ)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  margin: 0
                }}>
                  {formatNumber(result.csc, decimals)}
                </p>
              </div>
            )}
          </div>

          {/* Triangle Visualization */}
          <TriangleCanvas
            angle={result.angle}
            opposite={result.opposite}
            adjacent={result.adjacent}
            hypotenuse={result.hypotenuse}
          />

          {saveSuccess && (
            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#16a34a',
              fontWeight: '600',
              margin: 0
            }}>
              ✓ Cálculo salvo no histórico
            </p>
          )}
        </div>
      )}
    </div>
  );
}
