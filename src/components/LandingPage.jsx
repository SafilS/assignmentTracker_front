import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: '📚',
      title: 'Smart Assignment Management',
      description: 'Create, organize, and track assignments with intelligent automation and real-time updates',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: '🎯',
      title: 'Real-time Submissions',
      description: 'Submit assignments instantly with live progress tracking and automatic backups',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      icon: '🤝',
      title: 'Collaborative Learning',
      description: 'Connect students and teachers with integrated chat, forums, and peer review systems',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Students', icon: '🎓', color: 'from-blue-400 to-blue-600' },
    { value: '500+', label: 'Expert Teachers', icon: '👨‍🏫', color: 'from-green-400 to-green-600' },
    { value: '50K+', label: 'Assignments Completed', icon: '📝', color: 'from-purple-400 to-purple-600' },
    { value: '98%', label: 'Success Rate', icon: '⭐', color: 'from-yellow-400 to-yellow-600' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>Welcome to the Future of Education</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">Transform Your</span>
            <span className="title-gradient">Learning Experience</span>
            <span className="title-sub">with EduHub</span>
          </h1>
          
          <p className="hero-description">
            The most advanced platform for modern education management. 
            Connect, collaborate, and excel in a revolutionary digital learning environment 
            designed for the next generation of learners.
          </p>

          <div className="hero-actions">
            {!isLoggedIn ? (
              <>
                <Link to="/register" className="btn btn-primary hero-btn">
                  <span className="btn-icon">✨</span>
                  <span>Start Your Journey</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/login" className="btn btn-secondary hero-btn">
                  <span className="btn-icon">🔑</span>
                  <span>Sign In</span>
                </Link>
              </>
            ) : (
              <Link
                to={userRole === 'TEACHER' ? '/teacher' : '/submissions/student'}
                className="btn btn-primary hero-btn"
              >
                <span className="btn-icon">{userRole === 'TEACHER' ? '📝' : '📋'}</span>
                <span>Go to Dashboard</span>
                <span className="btn-arrow">→</span>
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-highlight">Powerful Features</span>
            <span>Built for Modern Education</span>
          </h2>
          <p className="section-subtitle">
            Discover the tools that make EduHub the preferred choice for educators worldwide
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${index === currentFeature ? 'featured' : ''}`}
            >
              <div className={`feature-background bg-gradient-to-br ${feature.gradient}`}></div>
              <div className="feature-content">
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-background">
          <div className="stats-pattern"></div>
        </div>
        <div className="stats-content">
          <div className="section-header">
            <h2 className="section-title">
              <span>Join Our Growing</span>
              <span className="title-highlight">Community</span>
            </h2>
          </div>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-background">
              <div className="cta-glow"></div>
            </div>
            <div className="cta-content">
              <div className="cta-icon">
                <span>🎓</span>
              </div>
              <h2 className="cta-title">
                Ready to Transform Your Learning?
              </h2>
              <p className="cta-description">
                Join thousands of students and teachers who are already experiencing 
                the future of education with EduHub's innovative platform.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary cta-btn">
                  <span className="btn-icon">🚀</span>
                  <span>Get Started Free</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/login" className="btn btn-secondary cta-btn">
                  <span>Already a member? Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default LandingPage;
