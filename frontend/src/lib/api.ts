import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`;

export interface CalculationRecord {
  id: number;
  angle: number;
  opposite: number;
  adjacent: number;
  hypotenuse: number;
  sin: number;
  cos: number;
  tan: number;
  cot: number;
  sec: number;
  csc: number;
  angle_unit: 'degrees' | 'radians';
  created_at: string;
}

export interface PaginatedResponse {
  items: CalculationRecord[];
  total: number;
  limit: number;
  offset: number;
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses by redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function saveCalculation(data: {
  angle: number;
  opposite: number;
  adjacent: number;
  hypotenuse: number;
  sin: number;
  cos: number;
  tan: number;
  cot: number;
  sec: number;
  csc: number;
  angle_unit: 'degrees' | 'radians';
}): Promise<CalculationRecord> {
  const response = await api.post('/calculations', data);
  return response.data;
}

export async function getCalculations(
  limit: number = 20,
  offset: number = 0
): Promise<PaginatedResponse> {
  const response = await api.get('/calculations', {
    params: { limit, offset },
  });
  return response.data;
}

export async function deleteCalculation(id: number): Promise<void> {
  await api.delete(`/calculations/${id}`);
}

export async function clearAllCalculations(): Promise<void> {
  await api.delete('/calculations');
}
