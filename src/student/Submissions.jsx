import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import './style.css';

function Submissions() {
  const [assignments, setAssignments] = useState([]);
  const [fileUrls, setFileUrls] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittingIds, setSubmittingIds] = useState(new Set());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/assignments');
      setAssignments(res.data);
    } catch (error) {
      setError('Failed to load assignments ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (assignmentId, assignmentTitle) => {
    const fileUrl = fileUrls[assignmentId];
    if (!fileUrl || !fileUrl.trim()) {
      setError('Please provide a file URL before submitting! 📎');
      return;
    }

    setSubmittingIds(prev => new Set([...prev, assignmentId]));
    setError('');
    
    try {
      await axios.post('/submissions', {
        assignment: { id: assignmentId },
        fileUrl: fileUrl.trim(),
      });
      setSuccessMessage(`Successfully submitted "${assignmentTitle}"! `);
      setFileUrls(prev => ({ ...prev, [assignmentId]: '' }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Already Submitted');
    } finally {
      setSubmittingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
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

  const getAssignmentStatus = (assignment) => {
    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
    const overdue = isOverdue(assignment.dueDate);
    
    if (overdue) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    return 'active';
  };

  const filteredAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      return matchesSearch && getAssignmentStatus(assignment) === filterStatus;
    });

  useEffect(() => { loadAssignments(); }, []);

  return (
    <div className="submissions-container">
      <div className="submissions-background">
        <div className="submissions-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="submissions-content">
        {/* Header */}
        <div className="submissions-header">
          <div className="header-icon">
            <span>📋</span>
          </div>
          <h1 className="header-title">
            <span className="title-main">Assignment</span>
            <span className="title-gradient">Submissions</span>
          </h1>
          <p className="header-subtitle">
            Submit your assignments and track your progress
            <span className="subtitle-emoji"></span>
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="message-banner error-banner">
            <span className="message-icon">⚠️</span>
            <span className="message-text">{error}</span>
            <button 
              onClick={() => setError('')}
              className="message-close"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="message-banner success-banner">
            <span className="message-icon"></span>
            <span className="message-text">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage('')}
              className="message-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Control Bar */}
        <div className="control-bar">
          <div className="search-filter-section">
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
            
            <div className="filter-wrapper">
              <span className="filter-icon">📊</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Assignments</option>
                <option value="active">Active</option>
                <option value="urgent">Due Soon</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="status-summary">
            <span className="summary-item active">
              <span className="summary-count">{assignments.filter(a => !isOverdue(a.dueDate)).length}</span>
              <span className="summary-label">Active</span>
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-item urgent">
              <span className="summary-count">{assignments.filter(a => {
                const days = getDaysUntilDue(a.dueDate);
                return days <= 3 && days > 0;
              }).length}</span>
              <span className="summary-label">Due Soon</span>
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-item overdue">
              <span className="summary-count">{assignments.filter(a => isOverdue(a.dueDate)).length}</span>
              <span className="summary-label">Overdue</span>
            </span>
          </div>
        </div>

        {/* Assignments List */}
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
        ) : filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">
              {searchTerm || filterStatus !== 'all' ? 'No assignments found' : 'No assignments available!'}
            </h3>
            <p className="empty-description">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search terms or filters' 
                : 'Check back later for new assignments from your teachers'
              }
              <span className="empty-emoji">👨‍🏫</span>
            </p>
          </div>
        ) : (
          <div className="assignments-list">
            {filteredAssignments.map(assignment => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const overdue = isOverdue(assignment.dueDate);
              const isUrgent = daysUntilDue <= 3 && daysUntilDue > 0;
              const isSubmitting = submittingIds.has(assignment.id);
              
              return (
                <div
                  key={assignment.id}
                  className={`assignment-submission-card ${overdue ? 'overdue' : isUrgent ? 'urgent' : 'active'}`}
                >
                  <div className="card-layout">
                    {/* Assignment Info */}
                    <div className="assignment-info">
                      <div className="assignment-header">
                        <h3 className="assignment-title">{assignment.title}</h3>
                        <div className={`status-badge ${overdue ? 'overdue' : isUrgent ? 'urgent' : 'active'}`}>
                          {overdue 
                            ? '⏰ Overdue' 
                            : isUrgent 
                            ? `⚡ ${daysUntilDue} days left`
                            : '✅ Active'
                          }
                        </div>
                      </div>
                      
                      <p className="assignment-description">{assignment.description}</p>
                      
                      <div className="assignment-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🆔</span>
                          <span className="meta-text">ID: {assignment.id}</span>
                        </div>
                      </div>

                      {daysUntilDue >= 0 && (
                        <div className="days-remaining-banner">
                          <span className="days-count">{daysUntilDue}</span>
                          <span className="days-label">day{daysUntilDue !== 1 ? 's' : ''} remaining</span>
                        </div>
                      )}
                    </div>

                    {/* Submission Form */}
                    <div className="submission-form">
                      <div className="form-card">
                        <div className="form-header">
                          <h4 className="form-title">
                            <span className="form-icon">📎</span>
                            Submit Your Work
                          </h4>
                        </div>
                        
                        <div className="form-content">
                          <div className="input-wrapper">
                            <input
                              type="url"
                              value={fileUrls[assignment.id] || ''}
                              onChange={(e) => setFileUrls(prev => ({
                                ...prev,
                                [assignment.id]: e.target.value
                              }))}
                              placeholder="Paste your file URL here (Google Drive, GitHub, etc.)"
                              className="url-input"
                              disabled={isSubmitting}
                            />
                            <div className="input-focus-border"></div>
                          </div>
                          
                          <button
                            onClick={() => handleSubmit(assignment.id, assignment.title)}
                            disabled={isSubmitting || !fileUrls[assignment.id]?.trim()}
                            className={`submit-assignment-btn ${
                              (isSubmitting || !fileUrls[assignment.id]?.trim()) 
                                ? 'disabled' 
                                : ''
                            }`}
                          >
                            {isSubmitting ? (
                              <div className="btn-loading">
                                <div className="loading-spinner">
                                  <div className="spinner-ring">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                  </div>
                                </div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              <div className="btn-content">
                                <span className="btn-icon"></span>
                                <span>Submit Assignment</span>
                                <span className="btn-arrow">→</span>
                              </div>
                            )}
                          </button>
                        </div>
                        
                        <div className="form-tip">
                          <span className="tip-icon"></span>
                          <span className="tip-text">Make sure your file is publicly accessible!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
                  <span>Your Progress</span>
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
                    <div className="stat-icon urgent">⚡</div>
                    <div className="stat-value">
                      {assignments.filter(a => {
                        const days = getDaysUntilDue(a.dueDate);
                        return days <= 3 && days > 0;
                      }).length}
                    </div>
                    <div className="stat-label">Due Soon</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon overdue">⏰</div>
                    <div className="stat-value">{assignments.filter(a => isOverdue(a.dueDate)).length}</div>
                    <div className="stat-label">Overdue</div>
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

export default Submissions;
