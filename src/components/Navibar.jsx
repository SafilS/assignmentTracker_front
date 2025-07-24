import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navibar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
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

  return (
    <nav className="glass-effect sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center floating-animation">
                <span className="text-white font-bold text-xl">📚</span>
              </div>
              <span className="font-display font-bold text-xl gradient-text">
                EduHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive('/login')
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive('/register')
                        ? 'bg-secondary-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-secondary-100 hover:text-secondary-700'
                    }`}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {userRole === 'TEACHER' && (
                    <Link
                      to="/teacher"
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isActive('/teacher')
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                      }`}
                    >
                      📝 Assignments
                    </Link>
                  )}
                  {userRole === 'STUDENT' && (
                    <Link
                      to="/submissions/student"
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isActive('/submissions/student')
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                      }`}
                    >
                      📋 Submissions
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-primary-100 transition-all duration-300"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-90' : ''
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm border-t border-white/20">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive('/login')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive('/register')
                    ? 'bg-secondary-500 text-white'
                    : 'text-gray-700 hover:bg-secondary-100 hover:text-secondary-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {userRole === 'TEACHER' && (
                <Link
                  to="/teacher"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive('/teacher')
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📝 Assignments
                </Link>
              )}
              {userRole === 'STUDENT' && (
                <Link
                  to="/submissions/student"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive('/submissions/student')
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📋 Submissions
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navibar;