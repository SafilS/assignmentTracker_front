import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

function Login() {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      const role = JSON.parse(atob(res.data.token.split('.')[1])).role;
      navigate(role === 'TEACHER' ? '/teacher' : '/submissions/student');
    } catch (error) {
      setError('Invalid credentials. Please try again! 😅');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 floating-animation">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Sign in to continue your learning journey 🚀
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Username
            </label>
            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({...form, userName: e.target.value})}
              placeholder="Enter your username"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔒 Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="Enter your password"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🎉</span>
                <span>Sign In</span>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300"
            >
              Create one here! ✨
            </Link>
          </p>
        </div>

        {/* Fun Elements */}
        <div className="mt-6 flex justify-center space-x-4 text-2xl">
          <span className="floating-animation" style={{ animationDelay: '0s' }}>📚</span>
          <span className="floating-animation" style={{ animationDelay: '0.5s' }}>🎓</span>
          <span className="floating-animation" style={{ animationDelay: '1s' }}>✏️</span>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-200 rounded-full opacity-20 floating-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-200 rounded-full opacity-20 floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}

export default Login;