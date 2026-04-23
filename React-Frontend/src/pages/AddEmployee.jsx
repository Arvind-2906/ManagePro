import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'employee',
        employeeId: '',
        dob: '',
        gender: '',
        designation: '',
        department: '',
        salary: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [removeProfileImage, setRemoveProfileImage] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files?.[0] || null);
        setRemoveProfileImage(false);
    };

    const handleRemoveSelectedImage = () => {
        setProfileImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleToggleRemoveSavedImage = () => {
        setRemoveProfileImage((prev) => !prev);
        if (profileImage) {
            handleRemoveSelectedImage();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (profileImage) {
            data.append('profileImage', profileImage);
        }
        if (removeProfileImage) {
            data.append('removeProfileImage', 'true');
        }

        try {
            const res = await axios.post('/api/v1/user/add-employee', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth
                }
            });
            if (res.data.success) {
                setMessage(res.data.message || 'Employee profile saved successfully!');
                setFormData({
                    name: '',
                    email: '',
                    role: 'employee',
                    employeeId: '',
                    dob: '',
                    gender: '',
                    designation: '',
                    department: '',
                    salary: ''
                });
                setProfileImage(null);
                setRemoveProfileImage(false);
                setTimeout(() => {
                    navigate('/admin-dashboard/employees');
                }, 600);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to register employee.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 p-8 md:p-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8 border-b border-slate-100 pb-6 tracking-tight">Add / Update Employee</h2>

            {message && (
                <div className={`p-4 mb-8 text-sm font-medium rounded-xl border ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Personal Information */}
                <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Personal Details</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" placeholder="John Doe" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" placeholder="john.doe@company.com" />
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2">
                            Employee should register first using their own email and password. This form only links their profile details.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                            <input type="date" name="dob" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                            <select name="gender" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800 cursor-pointer">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Professional Details</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label>
                            <input type="text" name="employeeId" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" placeholder="EMP-001" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">System Role</label>
                            <select name="role" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800 cursor-pointer">
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
                        <input type="text" name="designation" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" placeholder="e.g. Senior Developer" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
                            <select name="department" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800 cursor-pointer">
                                <option value="">Select Dept</option>
                                <option value="HR">HR</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Annual Salary ($)</label>
                            <input type="number" name="salary" onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-800" placeholder="60000" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Image <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-400">PNG, JPG, JPEG (Max 2MB)</p>
                                </div>
                                <input ref={fileInputRef} type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        {profileImage && (
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <p className="text-sm text-emerald-600 font-medium flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {profileImage.name} selected</p>
                                <button
                                    type="button"
                                    onClick={handleRemoveSelectedImage}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Remove selected image
                                </button>
                            </div>
                        )}
                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={removeProfileImage}
                                onChange={handleToggleRemoveSavedImage}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Remove currently saved image while updating existing employee
                        </label>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 mt-4 pt-8 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-lg"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
