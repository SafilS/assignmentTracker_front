import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

function Submissions() {
  const [assignments, setAssignments] = useState([]);
  const [fileUrls, setFileUrls] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submittingIds, setSubmittingIds] = useState(new Set());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      setSuccessMessage(`Successfully submitted "${assignmentTitle}"! 🎉`);
      setFileUrls(prev => ({ ...prev, [assignmentId]: '' }));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to submit assignment. Please try again! 😅');
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

  useEffect(() => { loadAssignments(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 floating-animation">
          <span className="text-3xl">📋</span>
        </div>
        <h1 className="font-display text-4xl font-bold gradient-text mb-2">
          Assignment Submissions
        </h1>
        <p className="text-gray-600 text-lg">
          Submit your assignments and track your progress 🚀
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-center">
          {successMessage}
        </div>
      )}

      {/* Assignments List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="loading-dots mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">
            No assignments available!
          </h3>
          <p className="text-gray-600">
            Check back later for new assignments from your teachers 👨‍🏫
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map(assignment => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const overdue = isOverdue(assignment.dueDate);
            const isSubmitting = submittingIds.has(assignment.id);
            
            return (
              <div
                key={assignment.id}
                className={`card ${
                  overdue 
                    ? 'border-l-4 border-red-400 bg-red-50/50' 
                    : daysUntilDue <= 3
                    ? 'border-l-4 border-yellow-400 bg-yellow-50/50'
                    : 'border-l-4 border-green-400 bg-green-50/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  {/* Assignment Info */}
                  <div className="flex-1 mb-6 lg:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-display text-xl font-semibold text-gray-800">
                        {assignment.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        overdue
                          ? 'bg-red-100 text-red-700'
                          : daysUntilDue <= 3
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {overdue 
                          ? '⏰ Overdue' 
                          : daysUntilDue <= 3 
                          ? `⚡ ${daysUntilDue} days left`
                          : '✅ Active'
                        }
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {assignment.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🆔</span>
                        <span>ID: {assignment.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="lg:w-80">
                    <div className="glass-effect p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">📎</span>
                        Submit Your Work
                      </h4>
                      
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={fileUrls[assignment.id] || ''}
                          onChange={(e) => setFileUrls(prev => ({
                            ...prev,
                            [assignment.id]: e.target.value
                          }))}
                          placeholder="Paste your file URL here (Google Drive, GitHub, etc.)"
                          className="input-field text-sm"
                          disabled={isSubmitting}
                        />
                        
                        <button
                          onClick={() => handleSubmit(assignment.id, assignment.title)}
                          disabled={isSubmitting || !fileUrls[assignment.id]?.trim()}
                          className={`w-full btn-primary text-sm py-2 ${
                            (isSubmitting || !fileUrls[assignment.id]?.trim()) 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="loading-dots scale-50">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <span className="flex items-center justify-center space-x-2">
                              <span>🚀</span>
                              <span>Submit Assignment</span>
                            </span>
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        💡 Tip: Make sure your file is publicly accessible!
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
        <div className="mt-12">
          <div className="glass-effect p-8 rounded-2xl">
            <h3 className="font-display text-xl font-semibold text-center mb-6 gradient-text">
              📊 Your Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">
                  {assignments.length}
                </div>
                <div className="text-gray-600 font-medium">Total Assignments</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {assignments.filter(a => !isOverdue(a.dueDate)).length}
                </div>
                <div className="text-gray-600 font-medium">Active</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-600">
                  {assignments.filter(a => {
                    const days = getDaysUntilDue(a.dueDate);
                    return days <= 3 && days > 0;
                  }).length}
                </div>
                <div className="text-gray-600 font-medium">Due Soon</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-red-600">
                  {assignments.filter(a => isOverdue(a.dueDate)).length}
                </div>
                <div className="text-gray-600 font-medium">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8">
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="font-display text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Submission Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 mt-1">🔗</span>
              <span>Use Google Drive, Dropbox, GitHub, or any public file sharing service</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">👀</span>
              <span>Make sure your file permissions are set to "Anyone with the link can view"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">⏰</span>
              <span>Submit early to avoid last-minute technical issues</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1">📝</span>
              <span>Double-check your work before submitting</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Submissions;