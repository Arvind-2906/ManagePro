import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, Megaphone, CheckCircle, PlusCircle, CreditCard, Building } from 'lucide-react';

const AdminSummary = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState(0);
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/v1/employee/all', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEmployees(response.data.data || []);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        const fetchLeaves = async () => {
            try {
                const response = await axios.get('/api/v1/leave', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const allLeaves = response.data.data || [];
                const pending = allLeaves.filter(leave => leave.status === 'Pending').length;
                setPendingLeaves(pending);
            } catch (error) {
                console.error("Error fetching leaves:", error);
            }
        };

        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/v1/notice', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setNotices(response.data.data || []);
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        };

        fetchEmployees();
        fetchLeaves();
        fetchNotices();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Dashboard Overview
            </h2>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (Wide elements) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* CARD 1: Welcome & Quick Actions */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-1">
                                Welcome back, {user?.name || 'Admin'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Here is what's happening in your organization today.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link to="/admin-dashboard/add-employee" className="flex flex-col items-center justify-center p-4 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-indigo-900">Add Employee</span>
                            </Link>
                            
                            <Link to="/admin-dashboard/departments" className="flex flex-col items-center justify-center p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Building className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-slate-700">Departments</span>
                            </Link>

                            <Link to="/admin-dashboard/leaves" className="flex flex-col items-center justify-center p-4 bg-amber-50/50 hover:bg-amber-50 border border-amber-100 rounded-xl transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-amber-800">Leaves</span>
                            </Link>

                            <Link to="/admin-dashboard/salary" className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-xl transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold text-emerald-800">Payroll</span>
                            </Link>
                        </div>
                    </div>

                    {/* CARD 5: Recent Registrations Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Registrations</h3>
                            <Link to="/admin-dashboard/employees" className="text-sm font-semibold text-primary hover:text-indigo-700 transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Employee</th>
                                        <th className="py-3 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Department</th>
                                        <th className="py-3 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Date Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {employees.slice(0, 5).map(emp => (
                                        <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {emp.userId?.profileImage || emp.profileImage ? (
                                                        <img 
                                                            src={emp.userId?.profileImage || emp.profileImage} 
                                                            alt={emp.userId?.name || 'Employee'} 
                                                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" 
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm ring-2 ring-white shadow-sm">
                                                            {(emp.userId?.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-slate-800">{emp.userId?.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.department?.dep_name ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {emp.department?.dep_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-right text-slate-500 text-sm font-medium">
                                                {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active'}
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 px-6 text-center text-slate-400 font-medium">No registrations found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Numeric widgets & Boards) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                        {/* CARD 2: Total Employees */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center space-x-4">
                            <div className="p-3 bg-indigo-50 rounded-xl text-primary">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Employees</p>
                                <h4 className="text-3xl font-extrabold text-slate-800">{employees.length}</h4>
                            </div>
                        </div>

                        {/* CARD 3: Pending Leaves */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center space-x-4">
                            <div className="p-3 bg-rose-50 rounded-xl text-accent">
                                <ClipboardList className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Leave Requests</p>
                                <h4 className="text-3xl font-extrabold text-slate-800">{pendingLeaves}</h4>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Recent Announcements */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden max-h-[500px]">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Notice Board</h3>
                            </div>
                            <Link to="/admin-dashboard/announcements" className="text-sm font-semibold text-primary hover:text-indigo-700 transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            {notices.length === 0 ? (
                                <p className="text-center text-slate-400 font-medium py-4">No recent announcements.</p>
                            ) : (
                                notices.slice(0, 4).map((notice) => (
                                    <div key={notice._id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm">{notice.title}</h4>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{notice.category}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">{notice.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminSummary;
