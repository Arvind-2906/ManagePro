import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, BarChart3, LayoutDashboard, Clock, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white flex flex-col overflow-hidden relative">
            
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="relative z-50 mt-4 mx-4 md:mx-auto max-w-7xl w-[calc(100%-2rem)] bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-sm">
                <div className="px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-display font-bold text-lg">M</span>
                        </div>
                        <span className="font-display font-extrabold text-xl tracking-tight text-slate-800">Manage<span className="text-indigo-600">Pro</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="px-5 py-2 font-semibold text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/login" className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 ml-2">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section & Bento Grid */}
            <main className="flex-grow flex flex-col relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* Main Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                        </span>
                        System v2.0 Live
                    </div>
                    <h1 className="text-6xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
                        Workforce <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">mastery</span> at scale.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        Say goodbye to scattered spreadsheets. ManagePro unifies payroll, attendance, and department coordination into one seamless grid.
                    </p>
                </div>

                {/* The Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                    
                    {/* BENTO: Core Call to Action (Spans 2x2 on large screens) */}
                    <div className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-slate-900 rounded-[32px] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                <Zap className="w-7 h-7 text-indigo-300" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Start managing intelligently.</h2>
                            <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
                                Get a bird's eye view of your entire organization. Experience performance tracking like never before.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-wrap gap-4 mt-auto">
                            <Link to="/login" className="px-8 py-4 text-sm font-bold rounded-2xl text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-lg">
                                Access Dashboard
                            </Link>
                            <Link to="#features" className="px-8 py-4 text-sm font-bold rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-colors">
                                Learn More
                            </Link>
                        </div>
                    </div>

                    {/* BENTO: Analytics / Visual Preview */}
                    <div className="md:col-span-1 lg:col-span-2 bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center relative overflow-hidden group">
                        <div className="w-full flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                                <span className="font-bold text-slate-800 text-sm">Real-time Metrics</span>
                            </div>
                        </div>
                        {/* Mock Graph Layout */}
                        <div className="w-full flex-grow flex items-end justify-between gap-2 md:gap-4 px-2 mt-4">
                            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                                <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group-hover:bg-indigo-50 transition-colors duration-500 overflow-hidden" style={{height: `${height}%`}}>
                                    <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-1000 ease-out" style={{height: `${height * 0.8}%`}}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BENTO: Leaves & Attendance */}
                    <div className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-indigo-50 to-white rounded-[32px] p-8 border border-indigo-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-indigo-50 text-indigo-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Attendance & Time</h3>
                            <p className="text-slate-500 text-sm font-medium">Frictionless leave requests. Approve or deny in a single click.</p>
                        </div>
                    </div>

                    {/* BENTO: Payroll */}
                    <div className="md:col-span-1 lg:col-span-1 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 border border-emerald-100 text-emerald-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Automated Payroll</h3>
                            <p className="text-slate-500 text-sm font-medium">Generate salary slips and track compensation history flawlessly.</p>
                        </div>
                    </div>

                    {/* BENTO: Security (Spans 2) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-100 text-slate-700">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Role-based Access</h3>
                            <p className="text-slate-500 text-sm font-medium">Strict barrier between Admin and Employee portals. Sensitive data is securely managed and restricted appropriately.</p>
                        </div>
                    </div>

                    {/* BENTO: Departments */}
                    <div className="md:col-span-1 lg:col-span-2 bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-sm text-white flex flex-col justify-between bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/10 text-white">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-2xl mb-2">Department Sync</h3>
                            <p className="text-slate-400 text-sm font-medium">Group employees dynamically and monitor team velocity securely.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-xl mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-display font-bold text-[10px]">M</span>
                        </div>
                        <span className="font-bold text-sm text-slate-800">ManagePro Solutions</span>
                    </div>
                    <div className="text-center text-sm text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
