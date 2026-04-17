import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, AlertCircle, Calendar } from 'lucide-react';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/v1/notice', {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotices(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/v1/notice', {
        title,
        content,
        category
      }, {
         withCredentials: true,
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ type: 'success', text: 'Announcement posted successfully!' });
      setTitle('');
      setContent('');
      setCategory('General');
      fetchNotices(); // Refresh the list
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to post announcement' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Announcements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Create Notice Form */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create Announcement</h2>
          
          {message && (
            <div className={`p-4 mb-6 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                placeholder="Holiday Alert..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
              >
                <option value="General">General</option>
                <option value="Holiday">Holiday</option>
                <option value="Policy">Policy</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none"
                placeholder="Details about the announcement..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-3 px-6 font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Posting...' : <><Send className="w-5 h-5" /> Post Announcement</>}
            </button>
          </form>
        </div>

        {/* Existing Notices List */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-purple-500" /> Recent Announcements
          </h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {notices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No announcements found.</p>
            ) : (
              notices.map((notice) => (
                <div key={notice._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{notice.content}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(notice.createdAt).toLocaleString()} by {notice.createdBy?.name || 'Admin'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotices;
