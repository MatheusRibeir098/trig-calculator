import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  username: string;
  role: string;
}

interface Calculation {
  id: string;
  angle: number;
  opposite: number;
  adjacent: number;
  hypotenuse: number;
  sin: number;
  cos: number;
  tan: number;
  created_at: string;
}

export const HistoryManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch calculations when user is selected
  useEffect(() => {
    if (selectedUserId) {
      fetchCalculations(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCalculations = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/users/${userId}/calculations`);
      setCalculations(response.data.calculations || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch calculations');
      setCalculations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCalculation = async (calcId: string) => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/calculations/${calcId}`);
      setSuccessMessage('Calculation deleted successfully');
      if (selectedUserId) {
        await fetchCalculations(selectedUserId);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete calculation');
    }
  };

  const handleDeleteUserHistory = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!window.confirm(`Are you sure you want to delete all calculations for ${user?.username}?`)) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/users/${userId}/calculations`);
      setSuccessMessage(`All calculations for ${user?.username} deleted successfully`);
      setSelectedUserId(null);
      setCalculations([]);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user history');
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* User Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Select User</h2>

        {isLoading && !selectedUserId ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedUserId === user.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{user.username}</div>
                <div className="text-sm text-gray-600">
                  {user.role === 'Admin_User' ? 'Admin' : 'User'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User History */}
      {selectedUserId && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Calculations for {users.find((u) => u.id === selectedUserId)?.username}
            </h2>
            <button
              onClick={() => handleDeleteUserHistory(selectedUserId)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete All History
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : calculations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No calculations found for this user
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Angle
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      sin(θ)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      cos(θ)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      tan(θ)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {calculations.map((calc) => (
                    <tr key={calc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(calc.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calc.angle.toFixed(2)}°
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calc.sin.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calc.cos.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calc.tan.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteCalculation(calc.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
