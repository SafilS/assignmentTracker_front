import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import './style.css';

function Register() {
  const [form, setForm] = useState({ userName: '', password: '', role: 'ROLE_STUDENT' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      }, 3000);
    } catch (error) {
      setError('Registration failed. Username might already exist! 😅');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-background success-bg">
          <div className="success-pattern"></div>
        </div>
        
        <div className="success-card">
          <div className="success-icon">
            <span>🎉</span>
          </div>
          <h1 className="success-title">
            Welcome to <span className="title-gradient">EduHub!</span>
          </h1>
          <p className="success-message">
            Your account has been created successfully!
          </p>
          <div className="success-animation">
            <div className="celebration-emoji"></div>
            <div className="celebration-emoji"></div>
            <div className="celebration-emoji"></div>
          </div>
          <div className="countdown">
            <div className="countdown-spinner"></div>
            <span>Redirecting to login...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1 register-shape"></div>
          <div className="shape shape-2 register-shape"></div>
          <div className="shape shape-3 register-shape"></div>
        </div>
      </div>

      <div className="auth-card register-card">
        {/* Header */}
        <div className="auth-header">

          <h1 className="auth-title">
            <span className="title-main">Join</span>
            <span className="title-gradient">EduHub!</span>
          </h1>
          <p className="auth-subtitle">
            Create your account and start learning today
            <span className="subtitle-emoji">🎓</span>
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
                placeholder="Choose a unique username"
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
                placeholder="Create a strong password"
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

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon"></span>
              I am a...
            </label>
            <div className="input-wrapper">
              <div className="role-dropdown-wrapper">
                <select
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="role-dropdown"
                  required
                >
                  <option value="ROLE_STUDENT">🎓 Student - Learn and grow</option>
                  <option value="ROLE_TEACHER">👨‍🏫 Teacher - Educate and inspire</option>
                </select>
                <span className="dropdown-arrow">▼</span>
              </div>
              <div className="input-focus-border"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-btn register-btn ${isLoading ? 'loading' : ''}`}
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
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="btn-content">
                <span className="btn-icon"></span>
                <span>Create Account</span>
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
            Already have an account?{' '}
            <Link to="/login" className="auth-link login-link">
              <span>Sign in here!</span>
              <span className="link-emoji"></span>
            </Link>
          </p>
        </div>

        {/* Fun Elements */}
        {/* <div className="auth-decorations">
          <span className="decoration-emoji" style={{ animationDelay: '0s' }}>🌟</span>
          <span className="decoration-emoji" style={{ animationDelay: '0.5s' }}>📖</span>
          <span className="decoration-emoji" style={{ animationDelay: '1s' }}>🎨</span>
        </div> */}
      </div>
    </div>
  );
}

export default Register;
