import React from 'react';
import { NavLink } from 'react-router-dom';

const EmployeeSidebar = () => {
    return (
        <div className="bg-secondary text-white w-64 min-h-screen space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl z-20">
            <div className="flex items-center space-x-3 px-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-accent shadow-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-white">E</span>
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">Portal</span>
            </div>
            <nav className="space-y-3">
                <NavLink
                    to="/employee-dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-accent text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/employee-dashboard/profile"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-accent text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>My Profile</span>
                </NavLink>
                <NavLink
                    to="/employee-dashboard/leaves"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-accent text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>My Leaves</span>
                </NavLink>
                <NavLink
                    to="/employee-dashboard/departments"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-accent text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8"></path></svg>
                    <span>Departments</span>
                </NavLink>
                <NavLink
                    to="/employee-dashboard/salary"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${isActive ? 'bg-white/5 border-l-4 border-accent text-white shadow-sm' : 'text-gray-400 border-l-4 border-transparent hover:bg-white/5 hover:text-gray-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>My Salary</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default EmployeeSidebar;
