import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                        Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline transition-all">Create one</Link>
                    </p>
                </div>
                {error && <div className="bg-rose-50 border-l-4 border-accent text-accent p-3 text-sm mb-6 rounded-r-lg font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Label</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                            <a href="#" className="text-xs font-bold text-primary hover:text-indigo-700 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 text-slate-800 font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center pt-1 pb-2">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer transition-all" />
                            <span className="ml-2.5 text-sm text-slate-600 font-medium">Remember me for 30 days</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all text-sm tracking-wide"
                    >
                        Sign in to account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
