import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import './style.css';

function Login() {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      console.log('Token:', res.data.token);
      const payload = res.data.token.split('.')[1];
      console.log('Payload (Base64):', payload);
      console.log('Decoded Payload:', JSON.parse(atob(payload)));

      const role = JSON.parse(atob(res.data.token.split('.')[1])).roles;
      console.log(role);
      navigate(role === 'ROLE_TEACHER' ? '/teacher' : '/submissions/student');
    } catch (error) {
      setError('Invalid credentials. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">
            <span className="title-main">Welcome</span>
            <span className="title-gradient">Back!</span>
          </h1>
          <p className="auth-subtitle">
            Sign in to continue your learning journey
            <span className="subtitle-emoji"></span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon"></span>
              Username
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                value={form.userName}
                onChange={(e) => setForm({...form, userName: e.target.value})}
                placeholder="Enter your username"
                className="form-input"
                required
              />
              <div className="input-focus-border"></div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon"></span>
              Password
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="Enter your password"
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                <span>{showPassword ? '👁️' : '👁️‍🗨️'}</span>
              </button>
              <div className="input-focus-border"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <div className="btn-loading">
                <div className="loading-spinner">
                  <div className="spinner-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="btn-content">
                <span className="btn-icon"></span>
                <span>Sign In</span>
                <span className="btn-arrow">→</span>
              </div>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link register-link">
              <span>Create one here!</span>
              <span className="link-emoji"></span>
            </Link>
          </p>
        </div>

        {/* Fun Elements */}
        {/* <div className="auth-decorations">
          <span className="decoration-emoji" style={{ animationDelay: '0s' }}>📚</span>
          <span className="decoration-emoji" style={{ animationDelay: '0.5s' }}>🎓</span>
          <span className="decoration-emoji" style={{ animationDelay: '1s' }}>✏️</span>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
