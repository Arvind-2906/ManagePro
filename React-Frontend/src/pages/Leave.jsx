import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leave = () => {
    const [leaves, setLeaves] = useState([]);

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('/api/v1/leave', {
                withCredentials: true,
                headers: authHeaders()
            });
            setLeaves(response.data.data);
        } catch (error) {
            console.error("Error fetching leaves", error);
        }
    };

    const handleAction = async (leaveId, status) => {
        try {
            await axios.patch(`/api/v1/leave/${leaveId}`, { status }, {
                withCredentials: true,
                headers: authHeaders()
            });
            fetchLeaves();
        } catch (error) {
            console.error(`Error updating leave to ${status}`, error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Leave Management</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Employee</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Leave Type</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Dates</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Reason</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-800">{leave.employeeId?.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{leave.employeeId?.employeeId}</div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-700 font-medium">{leave.leaveType}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm font-medium">
                                        {new Date(leave.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {new Date(leave.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                    </td>
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
                                    <td className="py-4 px-6 text-right">
                                        {leave.status === 'Pending' ? (
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => handleAction(leave._id, 'Approved')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </button>
                                                <button onClick={() => handleAction(leave._id, 'Rejected')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end text-slate-300">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400 font-medium border-0">No leave requests found in the system.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leave;
