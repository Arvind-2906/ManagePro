import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';

const Salary = () => {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingIds, setLoadingIds] = useState({});
    const [formData, setFormData] = useState({
        employeeId: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        payDate: ''
    });

    useEffect(() => {
        fetchSalaries();
        fetchEmployees();
    }, []);

    const fetchSalaries = async () => {
        try {
            const response = await axios.get('/api/v1/salary', { withCredentials: true });
            setSalaries(response.data.data || []);
        } catch (error) {
            console.error("Error fetching salaries", error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/v1/employee/all', { withCredentials: true });
            setEmployees(response.data.data || []);
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/salary', formData, { withCredentials: true });
            setShowModal(false);
            setFormData({ employeeId: '', basicSalary: '', allowances: '', deductions: '', payDate: '' });
            fetchSalaries();
        } catch (error) {
            console.error("Error adding salary", error);
            alert("Failed to add salary.");
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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Salary Management</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Salary
                </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Employee</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Basic</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Allowances</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Deductions</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">Net Salary</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Pay Date</th>
                                <th className="py-4 px-6 bg-slate-50/50 font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {salaries.length > 0 ? salaries.map((salary) => (
                                <tr key={salary._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-800">{salary.employeeId?.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{salary.employeeId?.employeeId}</div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">₹{salary.basicSalary}</td>
                                    <td className="py-4 px-6 text-emerald-600 font-medium">+ ₹{salary.allowances}</td>
                                    <td className="py-4 px-6 text-rose-600 font-medium">- ₹{salary.deductions}</td>
                                    <td className="py-4 px-6 text-slate-800 font-extrabold">₹{salary.netSalary}</td>
                                    <td className="py-4 px-6 text-right text-slate-500 text-sm font-medium">{new Date(salary.payDate).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleDownloadSlip(salary._id)}
                                            disabled={loadingIds[salary._id]}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {loadingIds[salary._id] ? (
                                                <><Loader2 className="w-4 h-4 animate-spin"/> PDF...</>
                                            ) : (
                                                <><Download className="w-4 h-4" /> Slip</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="text-center py-8 text-slate-400 font-medium border-0">No salary records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Add Salary Record</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Employee</label>
                                <select 
                                    name="employeeId" 
                                    value={formData.employeeId} 
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-700"
                                >
                                    <option value="">-- Choose an employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.userId?.name || 'Unknown'} ({emp.employeeId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Basic Salary</label>
                                    <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} required className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pay Date</label>
                                    <input type="date" name="payDate" value={formData.payDate} onChange={handleChange} required className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Allowances</label>
                                    <input type="number" name="allowances" value={formData.allowances} onChange={handleChange} className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deductions</label>
                                    <input type="number" name="deductions" value={formData.deductions} onChange={handleChange} className="w-full border border-slate-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Salary</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Salary;
