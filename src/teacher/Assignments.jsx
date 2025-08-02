import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import './Assignment.css';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/assignments');
      setAssignments(res.data);
    } catch (error) {
      setError('Failed to load assignments 😅');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    
    try {
      await axios.post('/assignments', form ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setForm({ title: '', description: '', dueDate: '' });
      setShowForm(false);
      loadAssignments();
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setError('Failed to create assignment 😅');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAndSortedAssignments = assignments
    .filter(assignment => 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  useEffect(() => { loadAssignments(); }, []);

  return (
    <div className="assignments-container">
      <div className="assignments-background">
        <div className="assignments-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="assignments-content">
        {/* Header */}
        <div className="assignments-header">
          <div className="header-icon">
            <span>📝</span>
          </div>
          <h1 className="header-title">
            <span className="title-main">Assignment</span>
            <span className="title-gradient">Dashboard</span>
          </h1>
          <p className="header-subtitle">
            Manage and create assignments for your students
            <span className="subtitle-emoji">🎓</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="error-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Control Bar */}
        <div className="control-bar">
          <div className="search-section">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="sort-wrapper">
              <span className="sort-icon">📊</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`create-btn ${showForm ? 'cancel-btn' : 'primary-btn'}`}
          >
            <span className="btn-icon">
              {showForm ? '✕' : '➕'}
            </span>
            <span>{showForm ? 'Cancel' : 'Create Assignment'}</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Create Assignment Form */}
        {showForm && (
          <div className="form-container">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon">
                  <span>✨</span>
                </div>
                <h2 className="form-title">Create New Assignment</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="assignment-form">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📚</span>
                    Assignment Title
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                      placeholder="Enter assignment title"
                      className="form-input"
                      required
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📄</span>
                    Description
                  </label>
                  <div className="input-wrapper">
                    <textarea
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      placeholder="Describe the assignment requirements"
                      rows="4"
                      className="form-textarea"
                      required
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📅</span>
                    Due Date
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={e => setForm({...form, dueDate: e.target.value})}
                      className="form-input"
                      required
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className={`form-submit-btn ${isCreating ? 'loading' : ''}`}
                >
                  {isCreating ? (
                    <div className="btn-loading">
                      <div className="loading-spinner">
                        <div className="spinner-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="btn-content">
                      <span className="btn-icon">🚀</span>
                      <span>Create Assignment</span>
                      <span className="btn-arrow">→</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div className="assignments-list">
          <div className="list-header">
            <h2 className="list-title">
              <span className="list-icon">📋</span>
              Your Assignments ({filteredAndSortedAssignments.length})
            </h2>
            {assignments.length > 0 && (
              <div className="list-summary">
                <span className="summary-item active">
                  <span className="summary-count">{assignments.filter(a => !isOverdue(a.dueDate)).length}</span>
                  <span className="summary-label">Active</span>
                </span>
                <span className="summary-divider">•</span>
                <span className="summary-item overdue">
                  <span className="summary-count">{assignments.filter(a => isOverdue(a.dueDate)).length}</span>
                  <span className="summary-label">Overdue</span>
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner-large">
                <div className="spinner-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p className="loading-text">Loading assignments...</p>
            </div>
          ) : filteredAndSortedAssignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">
                {searchTerm ? 'No assignments found' : 'No assignments yet!'}
              </h3>
              <p className="empty-description">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Create your first assignment to get started'
                }
                <span className="empty-emoji">🚀</span>
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="empty-action-btn"
                >
                  <span className="btn-icon">➕</span>
                  <span>Create Assignment</span>
                  <span className="btn-arrow">→</span>
                </button>
              )}
            </div>
          ) : (
            <div className="assignments-grid">
              {filteredAndSortedAssignments.map(assignment => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;
                const overdue = isOverdue(assignment.dueDate);
                
                return (
                  <div
                    key={assignment.id}
                    className={`assignment-card ${overdue ? 'overdue' : isUrgent ? 'urgent' : 'active'}`}
                  >
                    <div className="card-status">
                      <span className={`status-badge ${overdue ? 'overdue' : isUrgent ? 'urgent' : 'active'}`}>
                        {overdue ? '⏰ Overdue' : isUrgent ? '⚠️ Due Soon' : '✅ Active'}
                      </span>
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{assignment.title}</h3>
                      <p className="card-description">{assignment.description}</p>
                    </div>

                    <div className="card-footer">
                      <div className="card-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">{formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🆔</span>
                          <span className="meta-text">#{assignment.id}</span>
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <button className="action-btn view-btn">
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        <button className="action-btn edit-btn">
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    {daysUntilDue >= 0 && (
                      <div className="days-remaining">
                        <span className="days-count">{daysUntilDue}</span>
                        <span className="days-label">day{daysUntilDue !== 1 ? 's' : ''} left</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {assignments.length > 0 && (
          <div className="stats-section">
            <div className="stats-card">
              <div className="stats-background">
                <div className="stats-glow"></div>
              </div>
              
              <div className="stats-content">
                <h3 className="stats-title">
                  <span className="stats-icon">📊</span>
                  <span>Assignment Analytics</span>
                </h3>
                
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon total">📝</div>
                    <div className="stat-value">{assignments.length}</div>
                    <div className="stat-label">Total Assignments</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon active">✅</div>
                    <div className="stat-value">{assignments.filter(a => !isOverdue(a.dueDate)).length}</div>
                    <div className="stat-label">Active</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon overdue">⏰</div>
                    <div className="stat-value">{assignments.filter(a => isOverdue(a.dueDate)).length}</div>
                    <div className="stat-label">Overdue</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon urgent">⚠️</div>
                    <div className="stat-value">
                      {assignments.filter(a => {
                        const days = getDaysUntilDue(a.dueDate);
                        return days <= 3 && days >= 0;
                      }).length}
                    </div>
                    <div className="stat-label">Due Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;
