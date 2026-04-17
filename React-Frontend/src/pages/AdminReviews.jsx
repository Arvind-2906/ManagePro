import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Save } from 'lucide-react';

const AdminReviews = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/v1/employee/all', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmployees(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || rating === 0) {
      setMessage({ type: 'error', text: 'Please select an employee and provide a rating.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/v1/review', {
        employeeId: selectedEmployee,
        rating,
        comments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setSelectedEmployee('');
      setRating(0);
      setComments('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit review' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 max-w-2xl mx-auto mt-8 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
      
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Submit Employee Review</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Employee</label>
          <select 
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white/80"
          >
            <option value="">-- Choose an employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.employeeId} - {emp.userId?.name || 'Unknown'} (Department: {emp.department?.name || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-10 h-10 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments (Optional)</label>
          <textarea 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="4"
            placeholder="Provide constructive feedback here..."
            className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white/80 resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-3 px-6 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Submitting...' : (
            <>
              <Save className="w-5 h-5" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminReviews;
