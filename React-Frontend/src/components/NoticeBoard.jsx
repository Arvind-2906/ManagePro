import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, Calendar } from 'lucide-react';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('/api/v1/notice', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setNotices(response.data.data);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading notices...</div>;
  }

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 w-full max-w-md mx-auto relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-purple-500" />
        Notice Board
      </h2>

      {notices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No new announcements.</p>
      ) : (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{notice.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {notice.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{notice.content}</p>
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
