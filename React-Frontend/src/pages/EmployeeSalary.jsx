import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';

const EmployeeSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [loadingIds, setLoadingIds] = useState({});

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            const response = await axios.get('/api/v1/salary/employee', { withCredentials: true });
            setSalaries(response.data.data);
        } catch (error) {
            console.error("Error fetching salaries", error);
        }
    };

    const handleDownloadSlip = async (id) => {
        setLoadingIds(prev => ({ ...prev, [id]: true }));
        try {
            const response = await axios.get(`/api/v1/salary/generate-slip/${id}`, {
                withCredentials: true,
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `salary-slip-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error("Failed to generate slip", error);
            alert("Failed to generate slip. Please try again.");
        } finally {
            setLoadingIds(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Salary History</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Pay Date</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Basic Salary</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Allowances</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Deductions</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Net Salary</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {salaries.length > 0 ? salaries.map((salary) => (
                                <tr key={salary._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6 text-slate-800 font-bold">{new Date(salary.payDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                                    <td className="py-4 px-6 text-slate-600 font-medium text-right">₹{salary.basicSalary}</td>
                                    <td className="py-4 px-6 text-emerald-600 font-medium text-right">+ ₹{salary.allowances}</td>
                                    <td className="py-4 px-6 text-rose-600 font-medium text-right">- ₹{salary.deductions}</td>
                                    <td className="py-4 px-6 text-slate-900 font-extrabold text-lg text-right">₹{salary.netSalary}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleDownloadSlip(salary._id)}
                                            disabled={loadingIds[salary._id]}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {loadingIds[salary._id] ? (
                                                <><Loader2 className="w-4 h-4 animate-spin"/> Generating...</>
                                            ) : (
                                                <><Download className="w-4 h-4" /> Download Slip</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400 font-medium border-0">No salary history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSalary;
