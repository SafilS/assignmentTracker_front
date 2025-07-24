import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

function Register() {
  const [form, setForm] = useState({ userName: '', password: '', role: 'STUDENT' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Registration failed. Username might already exist! 😅');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="card text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 floating-animation">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-green-600 mb-2">
            Welcome to EduHub!
          </h1>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully! 🚀
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 floating-animation">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            Join EduHub!
          </h1>
          <p className="text-gray-600">
            Create your account and start learning today 🎓
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
              placeholder="Choose a unique username"
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
              placeholder="Create a strong password"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎭 I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                form.role === 'STUDENT' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={form.role === 'STUDENT'}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-semibold">Student</div>
                </div>
              </label>
              
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                form.role === 'TEACHER' 
                  ? 'border-secondary-500 bg-secondary-50 text-secondary-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="TEACHER"
                  checked={form.role === 'TEACHER'}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="font-semibold">Teacher</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-secondary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>Creating account...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Create Account</span>
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-secondary-600 hover:text-secondary-700 font-semibold transition-colors duration-300"
            >
              Sign in here! 🔑
            </Link>
          </p>
        </div>

        {/* Fun Elements */}
        <div className="mt-6 flex justify-center space-x-4 text-2xl">
          <span className="floating-animation" style={{ animationDelay: '0s' }}>🌟</span>
          <span className="floating-animation" style={{ animationDelay: '0.5s' }}>📖</span>
          <span className="floating-animation" style={{ animationDelay: '1s' }}>🎨</span>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 floating-animation"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent-200 rounded-full opacity-20 floating-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary-200 rounded-full opacity-20 floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}

export default Register;