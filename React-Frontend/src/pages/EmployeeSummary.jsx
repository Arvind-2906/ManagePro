import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const EmployeeSummary = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-secondary tracking-tight">Personal Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Summary Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition hover:shadow-md duration-300">
                    <div className="bg-primary px-6 py-4 flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-2xl font-bold shadow-sm overflow-hidden">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white text-primary uppercase tracking-widest mt-1 shadow-sm">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center text-sm">
                            <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span className="font-medium text-gray-500 w-16">Email</span>
                            <span className="text-secondary font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <span className="font-medium text-gray-500 w-16">Status</span>
                            <span className="text-emerald-600 font-semibold flex items-center"><span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span> Active</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Info Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-secondary mb-2 tracking-tight">Quick Actions</h3>
                        <p className="text-sm text-gray-500 mb-6">Access your frequently used employee tools directly from here.</p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/employee-dashboard/leaves"
                            className="group relative w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <span className="font-semibold text-secondary group-hover:text-primary transition-colors">Request Leave</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>

                        <Link
                            to="/employee-dashboard/salary"
                            className="group relative w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-accent hover:shadow-sm transition-all overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-accent flex items-center justify-center mr-4 group-hover:bg-accent group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <span className="font-semibold text-secondary group-hover:text-accent transition-colors">View Salary Slips</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-accent transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSummary;
