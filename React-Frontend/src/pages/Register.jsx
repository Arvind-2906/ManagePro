import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Posting to requested route
            const response = await axios.post('/api/v1/auth/register', formData);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">
                        Create your account
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign in</Link>
                    </p>
                </div>
                {error && <div className="bg-rose-50 border-l-4 border-accent text-accent p-3 text-sm mb-6 rounded-r-lg font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-medium"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-medium"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-medium"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Designation</label>
                        <select
                            name="role"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium appearance-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="employee">Employee Role</option>
                            <option value="admin">Admin Role</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-4 text-sm tracking-wide font-bold text-white bg-primary hover:bg-primary-hover rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Creating Account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
