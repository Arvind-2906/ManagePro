import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-secondary text-white w-64 min-h-screen space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl z-20">
            <div className="flex items-center space-x-3 px-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary shadow-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-white">M</span>
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">Manage<span className="text-primary font-bold">Pro</span></span>
            </div>
            <nav className="space-y-3">
                <NavLink
                    to="/admin-dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/employees"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <span>Employees</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/departments"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8"></path></svg>
                    <span>Departments</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/leaves"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Leaves</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/salary"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Salary</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/announcements"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span>Announcements</span>
                </NavLink>
                <NavLink
                    to="/admin-dashboard/reviews"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-primary text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    <span>Reviews</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
