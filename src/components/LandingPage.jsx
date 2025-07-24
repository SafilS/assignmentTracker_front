import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
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
      description: 'Create, organize, and track assignments with ease'
    },
    {
      icon: '🎯',
      title: 'Real-time Submissions',
      description: 'Submit assignments instantly and track progress'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Get insights into performance and engagement'
    },
    {
      icon: '🤝',
      title: 'Collaborative Learning',
      description: 'Connect students and teachers seamlessly'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="floating-animation mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🎓</span>
          </div>
        </div>
        
        <h1 className="font-display text-6xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Welcome to</span>
          <br />
          <span className="text-gray-800">EduHub</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          The ultimate platform for modern education management. 
          Connect, learn, and grow together in a vibrant digital classroom! 🚀
        </p>

        {!isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>🎉</span>
              <span>Get Started Free</span>
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>🔑</span>
              <span>Sign In</span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link
              to={userRole === 'TEACHER' ? '/teacher' : '/submissions/student'}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>{userRole === 'TEACHER' ? '📝' : '📋'}</span>
              <span>Go to Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="py-20">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="gradient-text">Why Students Love EduHub</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card card-hover text-center ${
                index === currentFeature ? 'pulse-glow scale-105' : ''
              } transition-all duration-500`}
            >
              <div className="text-6xl mb-4 floating-animation" style={{ animationDelay: `${index * 0.5}s` }}>
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="glass-effect p-12 rounded-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Join the Community</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">1000+</div>
              <div className="text-gray-600 font-medium">Happy Students</div>
              <div className="text-2xl">🎓</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">50+</div>
              <div className="text-gray-600 font-medium">Amazing Teachers</div>
              <div className="text-2xl">👨‍🏫</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold gradient-text">5000+</div>
              <div className="text-gray-600 font-medium">Assignments Completed</div>
              <div className="text-2xl">📝</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isLoggedIn && (
        <div className="py-20 text-center">
          <div className="card max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Ready to Start Learning?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of students and teachers who are already using EduHub to enhance their educational experience!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-accent text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Create Account</span>
              </Link>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold text-lg px-8 py-4 border-2 border-primary-200 hover:border-primary-300 rounded-xl transition-all duration-300"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-200 mt-20">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">📚</span>
          </div>
          <span className="font-display font-bold text-xl gradient-text">EduHub</span>
        </div>
        <p className="text-gray-500">
          Made with ❤️ for students and teachers everywhere
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;