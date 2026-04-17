import React, { useState } from 'react';
import axios from 'axios';

const AddDepartment = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Replace with actual endpoint
            const res = await axios.post('/api/v1/department/add', 
                { dep_name: name, description }, 
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            if (res.data.success) {
                setMessage('Department added successfully!');
                setName('');
                setDescription('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding department.');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Add New Department</h2>
            {message && (
                <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Department Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-slate-800 placeholder-slate-400 font-medium bg-slate-50 focus:bg-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g. Engineering, Marketing, HR"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea
                        rows="4"
                        className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-slate-800 placeholder-slate-400 font-medium bg-slate-50 focus:bg-white resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the department's role..."
                    />
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Create Department
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDepartment;
