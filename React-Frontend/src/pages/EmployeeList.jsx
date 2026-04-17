import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEmp, setEditingEmp] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', designation: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/v1/employee/all', { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEmployees(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axios.delete(`/api/v1/employee/${id}`, { withCredentials: true });
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert("Error deleting employee");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/v1/employee/${editingEmp._id}`, editForm, { withCredentials: true });
            setEditingEmp(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            alert("Error updating employee");
        }
    };

    if (loading) return <div className="p-6">Loading employees...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Employee Directory</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 w-16">Profile</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Name</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Department</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Role</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees.length > 0 ? (
                                employees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            {emp.profileImage ? (
                                                <img src={emp.profileImage} alt={emp.userId?.name} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                                                    {emp.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-800">{emp.userId?.name || 'N/A'}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{emp.employeeId}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.department?.dep_name ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                {emp.department?.dep_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">{emp.designation || 'N/A'}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    onClick={() => navigate(`/admin-dashboard/employees/${emp._id}`)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Profile"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setEditingEmp(emp);
                                                        setEditForm({
                                                            name: emp.userId?.name || '',
                                                            designation: emp.designation || ''
                                                        });
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(emp._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No employees found in the directory.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingEmp && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Edit Employee</h3>
                            <button onClick={() => setEditingEmp(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                <input type="text" className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
                                <input type="text" className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" value={editForm.designation} onChange={e => setEditForm({...editForm, designation: e.target.value})} />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingEmp(null)} className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
