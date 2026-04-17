import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/EmployeeSidebar';
import Navbar from '../components/Navbar';

const EmployeeDashboard = () => {
    return (
        <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-200">
            <EmployeeSidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
