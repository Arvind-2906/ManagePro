import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/api/v1/employee/${id}`, { withCredentials: true });
                setEmployee(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching employee details:", error);
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    if (loading) return <div className="p-6">Loading employee details...</div>;
    if (!employee) return <div className="p-6">Employee not found.</div>;

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Upper Gradient Banner */}
                <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow transition font-semibold flex items-center gap-2 border border-white/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                </div>

                {/* Profile Info Overlaying Banner */}
                <div className="px-8 pb-10">
                    <div className="relative flex justify-between items-end -mt-16 mb-8">
                        <div className="flex items-end space-x-6">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg shrink-0">
                                {employee.profileImage ? (
                                    <img src={employee.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 text-4xl font-extrabold">
                                        {employee.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="pb-2">
                                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{employee.userId?.name || 'N/A'}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm border border-indigo-100 drop-shadow-sm">{(employee.designation || 'N/A')}</p>
                                    <p className="text-slate-500 font-medium">{(employee.department?.dep_name || 'N/A')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pb-2">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Employee ID</p>
                                <p className="text-xl font-mono text-slate-700 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200">{employee.employeeId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-1">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <p className="text-sm font-semibold text-slate-500">Email Address</p>
                                </div>
                                <p className="text-slate-800 font-bold ml-8">{employee.userId?.email || 'N/A'}</p>
                            </div>
                            
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-1">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p className="text-sm font-semibold text-slate-500">Date of Birth</p>
                                </div>
                                <p className="text-slate-800 font-bold ml-8">{employee.dob ? new Date(employee.dob).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'}) : 'N/A'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-1">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    <p className="text-sm font-semibold text-slate-500">Gender</p>
                                </div>
                                <p className="text-slate-800 font-bold ml-8">{employee.gender || 'N/A'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-1">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <p className="text-sm font-semibold text-slate-500">System Role</p>
                                </div>
                                <p className="text-slate-800 font-bold ml-8 capitalize">{employee.userId?.role || 'N/A'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-1">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-sm font-semibold text-slate-500">Base Salary</p>
                                </div>
                                <p className="text-slate-800 font-bold ml-8">{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEmployee;
