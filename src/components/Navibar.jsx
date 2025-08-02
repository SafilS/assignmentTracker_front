import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navibar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  let userRole = null;
  if (token) {
    try {
      userRole = JSON.parse(atob(token.split('.')[1])).role;
    } catch (e) {
      console.error('Invalid token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <span>🎓</span>
          </div>
          <span className="logo-text">EduHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link register-btn ${isActive('/register') ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                Get Started
              </Link>
            </>
          ) : (
            <div className="user-menu">
              <Link
                to={userRole === 'TEACHER' ? '/teacher' : '/submissions/student'}
                className="nav-link dashboard-link"
              >
                <span className="nav-icon">{userRole === 'TEACHER' ? '📝' : '📋'}</span>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">🔑</span>
                Login
              </Link>
              <Link
                to="/register"
                className={`mobile-nav-link ${isActive('/register') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">✨</span>
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to={userRole === 'TEACHER' ? '/teacher' : '/submissions/student'}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{userRole === 'TEACHER' ? '📝' : '📋'}</span>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-logout-btn"
              >
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navibar;
