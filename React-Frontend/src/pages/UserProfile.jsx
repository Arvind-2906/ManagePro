import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeePerformance from '../components/EmployeePerformance';

const UserProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        department: '',
        profileImage: null
    });
    
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [employeeObjectId, setEmployeeObjectId] = useState(null);

    useEffect(() => {
        // Fetch specific departments on mount
        axios.get('/api/v1/department', { withCredentials: true })
            .then(res => setDepartments(res.data.data))
            .catch(err => console.error("Error fetching departments", err));
            
        // Fetch current profile
        axios.get('/api/v1/employee/profile', { withCredentials: true })
            .then(res => {
                const data = res.data.data;
                // Calculate age from DOB if present
                const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : '';
                setFormData({
                    name: data.userId?.name || '',
                    age: age,
                    department: data.department?._id || '',
                    profileImage: null
                });
                setEmployeeObjectId(data._id);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const dataToSubmit = new FormData();
            if (formData.name) dataToSubmit.append('name', formData.name);
            if (formData.age) dataToSubmit.append('age', formData.age);
            if (formData.department) dataToSubmit.append('department', formData.department);
            if (formData.profileImage) dataToSubmit.append('profileImage', formData.profileImage);

            const response = await axios.patch('/api/v1/user/update-profile', dataToSubmit, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage(response.data.message || "Profile updated successfully!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">Update Profile</h2>
            
            {message && (
                <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="John Doe"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., 28"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                        <select 
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                        >
                            <option value="">Select a department...</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="profileImage" type="file" className="sr-only" accept="image/*" onChange={handleChange} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                    {formData.profileImage && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {formData.profileImage.name}</p>}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>

            {employeeObjectId && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                    <EmployeePerformance employeeId={employeeObjectId} />
                </div>
            )}
        </div>
    );
};

export default UserProfile;
