import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployeeProfile = () => {
    const { user, login } = useAuth(); // assuming login or a setAuth context logic updates local Auth
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        profileImage: '' // Handled as string URL for now
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/v1/employee/profile', { withCredentials: true });
            const data = response.data.data;
            setProfile(data);
            setFormData({
                name: data.userId?.name || '',
                dob: data.dob ? data.dob.split('T')[0] : '',
                profileImage: data.profileImage || ''
            });
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            setFormData({ ...formData, profileImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append('name', formData.name);
            dataToSubmit.append('dob', formData.dob);
            
            if (formData.profileImage instanceof File) {
                dataToSubmit.append('profileImage', formData.profileImage);
            }

            const response = await axios.put('/api/v1/employee/profile', dataToSubmit, { 
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setProfile(response.data.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile.");
        }
    };

    if (!profile) return <div className="p-6">Loading profile...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition text-sm font-semibold"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                    {profile.profileImage ? (
                        <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                            {profile.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{profile.userId?.name}</h3>
                    <p className="text-gray-600">{profile.designation} - {profile.department?.dep_name}</p>
                    <p className="text-gray-500 text-sm mt-1 bg-gray-100 px-2 py-1 rounded inline-block">Emp ID: {profile.employeeId}</p>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                                type="date" 
                                name="dob" 
                                value={formData.dob} 
                                onChange={handleChange} 
                                required 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                            <input 
                                type="file" 
                                name="profileImage" 
                                accept="image/*"
                                onChange={handleChange} 
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload a new profile picture (optional).</p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold">Save Changes</button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-gray-800 font-semibold">{profile.userId?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p className="text-gray-800 font-semibold">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-gray-800 font-semibold">{profile.gender}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">System Role</p>
                        <p className="text-gray-800 font-semibold capitalize">{profile.userId?.role}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeProfile;
