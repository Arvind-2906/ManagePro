import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('/api/v1/leave/employee', { withCredentials: true });
            setLeaves(response.data.data);
        } catch (error) {
            console.error("Error fetching leaves", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/leave', formData, { withCredentials: true });
            setShowModal(false);
            fetchLeaves(); // Refresh table
        } catch (error) {
            console.error("Error applying leave", error);
            alert("Failed to apply leave. Please check all fields.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Leaves</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Apply Leave
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Leave Type</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Start Date</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">End Date</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Reason</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6 text-slate-800 font-bold">{leave.leaveType}</td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">{new Date(leave.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">{new Date(leave.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                                    <td className="py-4 px-6 text-slate-500 text-sm max-w-xs xl:max-w-md truncate">{leave.reason}</td>
                                    <td className="py-4 px-6 font-semibold">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                            leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {leave.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium border-0">No leave requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Apply for Leave</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Leave Type</label>
                                <select 
                                    name="leaveType" 
                                    value={formData.leaveType} 
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white cursor-pointer"
                                >
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Annual Leave">Annual Leave</option>
                                </select>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-slate-700" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-slate-700" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason</label>
                                <textarea name="reason" value={formData.reason} onChange={handleChange} required className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow h-28 resize-none text-slate-700 placeholder-slate-400" placeholder="Please describe why you need this leave..."></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Apply Leave</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeLeaves;
