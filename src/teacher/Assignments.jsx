import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

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
      await axios.post('/assignments', form);
      setForm({ title: '', description: '', dueDate: '' });
      setShowForm(false);
      loadAssignments();
    } catch (error) {
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

  useEffect(() => { loadAssignments(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 floating-animation">
          <span className="text-3xl">📝</span>
        </div>
        <h1 className="font-display text-4xl font-bold gradient-text mb-2">
          Assignment Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage and create assignments for your students 🎓
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      {/* Create Assignment Button */}
      <div className="mb-8 text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${showForm ? 'bg-gray-500 hover:bg-gray-600' : ''}`}
        >
          <span className="flex items-center space-x-2">
            <span>{showForm ? '❌' : '➕'}</span>
            <span>{showForm ? 'Cancel' : 'Create New Assignment'}</span>
          </span>
        </button>
      </div>

      {/* Create Assignment Form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-6 text-center">
            ✨ Create New Assignment
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📚 Assignment Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="Enter assignment title"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📄 Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe the assignment requirements"
                rows="4"
                className="input-field resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({...form, dueDate: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className={`w-full btn-accent ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCreating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>Creating...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Create Assignment</span>
                </span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Your Assignments ({assignments.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="loading-dots mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">
              No assignments yet!
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first assignment to get started 🚀
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>Create Assignment</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map(assignment => (
              <div
                key={assignment.id}
                className={`card card-hover ${
                  isOverdue(assignment.dueDate) 
                    ? 'border-l-4 border-red-400 bg-red-50/50' 
                    : 'border-l-4 border-green-400 bg-green-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-gray-800 flex-1">
                    {assignment.title}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isOverdue(assignment.dueDate)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isOverdue(assignment.dueDate) ? '⏰ Overdue' : '✅ Active'}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {assignment.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <span>📅</span>
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <span>📊</span>
                    <span>ID: {assignment.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      {assignments.length > 0 && (
        <div className="mt-12">
          <div className="glass-effect p-8 rounded-2xl">
            <h3 className="font-display text-xl font-semibold text-center mb-6 gradient-text">
              📊 Quick Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
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
                <div className="text-3xl font-bold text-red-600">
                  {assignments.filter(a => isOverdue(a.dueDate)).length}
                </div>
                <div className="text-gray-600 font-medium">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignments;
