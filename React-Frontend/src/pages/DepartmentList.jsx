import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get('/api/v1/department', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDepartments(res.data.data || []);
            } catch (error) {
                console.error("Error fetching departments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    if (loading) return <div className="p-6">Loading departments...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Departments</h2>
                <Link to="/admin-dashboard/add-department" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    New Department
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Sr No</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Department Name</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Description</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {departments.length > 0 ? (
                                departments.map((dept, idx) => (
                                    <tr key={dept._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6 text-slate-500 font-medium">{idx + 1}</td>
                                        <td className="py-4 px-6 text-slate-800 font-bold">{dept.dep_name}</td>
                                        <td className="py-4 px-6 text-slate-500 text-sm max-w-md truncate">{dept.description}</td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                                                    Edit
                                                </button>
                                                <button className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400 font-medium">No departments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DepartmentList;
