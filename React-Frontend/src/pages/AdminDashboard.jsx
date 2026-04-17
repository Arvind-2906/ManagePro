import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    return (
        <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-200">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-8">
                    {/* The nested routes will render here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
