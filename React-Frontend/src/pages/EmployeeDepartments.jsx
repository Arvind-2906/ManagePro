import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, FileText } from 'lucide-react';

const EmployeeDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/v1/department', {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDepartments(response.data.data || []);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    if (loading) {
        return <div className="p-6 text-slate-500">Loading departments...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Departments</h2>
                <p className="text-slate-500 mt-1">Browse all departments added by admin.</p>
            </div>

            {departments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-500 font-medium">
                    No departments available.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {departments.map((dept) => (
                        <div
                            key={dept._id}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                            onClick={() => setSelectedDepartment(dept)}
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                    Department
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 capitalize mb-2">
                                {dept.dep_name || 'Unnamed Department'}
                            </h3>

                            <div className="flex items-start gap-2 text-sm text-slate-500 leading-relaxed">
                                <FileText className="w-4 h-4 mt-0.5 text-slate-400" />
                                <p>{dept.description?.trim() ? dept.description : 'No description provided.'}</p>
                            </div>

                            <p className="mt-4 text-xs font-semibold text-indigo-600">Click to view details</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedDepartment && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedDepartment(null)}
                >
                    <div
                        className="w-[96vw] max-w-4xl min-h-150 max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between gap-4">
                            <h3 className="text-xl font-bold text-slate-800">Department Details</h3>
                            <button
                                type="button"
                                className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                                onClick={() => setSelectedDepartment(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-10 space-y-8 overflow-y-auto flex-1">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Department Name</p>
                                <p className="text-lg font-semibold text-slate-800 capitalize">
                                    {selectedDepartment.dep_name || 'Unnamed Department'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedDepartment.description?.trim()
                                        ? selectedDepartment.description
                                        : 'No description provided.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDepartments;
