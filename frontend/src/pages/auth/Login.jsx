import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth.api.js';
import { useAuth } from '../../store/AuthProvider.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { setLoginSuccess, setAuthFailure, setLoading, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      // Expect { success: true, data: { id, name, email } }
      const user = res.data ?? res; // fallback if API returns plain user
      setLoginSuccess(user);
      navigate('/gigs');
    } catch (err) {
      setAuthFailure(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[#222222] mb-6 text-center">Log in</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#717171] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#717171] mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full bg-[#FF385C] text-white py-3 rounded-lg font-medium hover:bg-[#e03150] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
