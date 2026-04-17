import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Star } from 'lucide-react';

const EmployeePerformance = ({ employeeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/v1/review/${employeeId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReviews(response.data.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [employeeId]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading performance data...</div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Performance Overview</h2>
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span className="font-bold text-purple-900 dark:text-purple-100">{averageRating} AVG</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No review data available for the last 6 months.
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reviews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="rating" fill="url(#colorUv)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EmployeePerformance;
