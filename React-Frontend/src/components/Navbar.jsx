import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [notices, setNotices] = useState([]);
    const [showNotices, setShowNotices] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/v1/notice', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setNotices(response.data.data.slice(0, 5)); // Keep recent 5
            } catch (error) {
                console.error("Error fetching notices", error);
            }
        };
        fetchNotices();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotices(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm py-4 px-8 flex justify-between items-center text-secondary transition-all">
            <h1 className="text-lg font-semibold tracking-tight">Welcome back, {user?.name}</h1>
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 mr-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-500 tracking-wide">Online</span>
                </div>
                
                {/* Notifications Bell */}
                {user?.role === 'employee' && (
                    <div className="relative mr-4" ref={dropdownRef}>
                        <button 
                            onClick={() => setShowNotices(!showNotices)} 
                            className="p-2 text-gray-500 hover:text-primary transition-colors focus:outline-none relative"
                        >
                            <Bell className="w-6 h-6" />
                            {notices.length > 0 && (
                                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
                            )}
                        </button>
                        
                        {showNotices && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all">
                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-secondary tracking-tight">Recent Notices</h3>
                                    <span className="text-xs font-semibold bg-blue-50 text-primary px-2 py-1 rounded-full border border-blue-100">{notices.length} New</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notices.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">No new announcements.</div>
                                    ) : (
                                        notices.map(notice => (
                                            <div key={notice._id} className="p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
                                                    <span className="text-[10px] text-gray-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2">{notice.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-semibold bg-white text-secondary border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-sm"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
