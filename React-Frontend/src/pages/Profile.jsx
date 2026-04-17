import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        designation: '',
        department: '',
        profileImage: null
    });
    
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        // Fetch specific departments on mount
        axios.get('/api/v1/department', { 
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setDepartments(res.data.data))
            .catch(err => console.error("Error fetching departments", err));
            
        // Fetch current profile
        axios.get('/api/v1/employee/profile', { 
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const data = res.data.data;
                const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : '';
                setFormData({
                    name: data.userId?.name || '',
                    age: age,
                    designation: data.designation || '',
                    department: data.department?._id || '',
                    profileImage: null
                });
            })
            .catch(err => console.error("Error fetching profile", err));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormData(prev => ({ ...prev, profileImage: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = new FormData();
            if (formData.name) dataToSubmit.append('name', formData.name);
            if (formData.age) dataToSubmit.append('age', formData.age);
            if (formData.designation) dataToSubmit.append('designation', formData.designation);
            if (formData.department) dataToSubmit.append('department', formData.department);
            if (formData.profileImage) dataToSubmit.append('profileImage', formData.profileImage);

            // Note: Adjusted path internally to match your backend mount points
            const response = await axios.patch('/api/v1/user/update-profile', dataToSubmit, {
                withCredentials: true,
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            showToast(response.data.message || "Profile and Cloudinary Image saved successfully!", "success");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-50">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`absolute top-4 right-4 px-6 py-3 rounded-md shadow-lg transform transition-all duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <div className="flex items-center space-x-2">
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="mb-8 border-b pb-5">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h2>
                <p className="text-gray-500 mt-2 text-sm">Update your personal details, designation, and profile picture here.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-gray-800"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-gray-800"
                            placeholder="e.g. 28"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                        <input 
                            type="text" 
                            name="designation" 
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-gray-800"
                            placeholder="e.g. Senior Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                        <select 
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-gray-800 bg-white"
                        >
                            <option value="">Select a department...</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-200 border-dashed rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-colors group">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-indigo-400 group-hover:text-indigo-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Upload a new image</span>
                                    <input id="file-upload" name="profileImage" type="file" className="sr-only" accept="image/*" onChange={handleChange} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                    {formData.profileImage && (
                        <p className="mt-2 text-sm text-indigo-600 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            Selected: {formData.profileImage.name}
                        </p>
                    )}
                </div>

                <div className="pt-5 border-t mt-8">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full md:w-auto md:min-w-[200px] flex justify-center py-3 px-6 border border-transparent rounded-lg shadow text-base font-semibold text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Updates'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
