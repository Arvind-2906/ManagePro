import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './components/PrivateRoutes';
import RoleBaseRoutes from './components/RoleBaseRoutes';

import AdminDashboard from './pages/AdminDashboard';
import AdminSummary from './pages/AdminSummary';
import AddDepartment from './pages/AddDepartment';
import AddEmployee from './pages/AddEmployee';
import DepartmentList from './pages/DepartmentList';
import EmployeeList from './pages/EmployeeList';
import ViewEmployee from './pages/ViewEmployee';
import Leave from './pages/Leave';
import Salary from './pages/Salary';
import AdminReviews from './pages/AdminReviews';
import AdminNotices from './pages/AdminNotices';

import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeSummary from './pages/EmployeeSummary';
import Profile from './pages/Profile';
import EmployeeLeaves from './pages/EmployeeLeaves';
import EmployeeSalary from './pages/EmployeeSalary';
import EmployeeDepartments from './pages/EmployeeDepartments';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoutes>
                <RoleBaseRoutes requiredRole={['admin']}>
                  <AdminDashboard />
                </RoleBaseRoutes>
              </PrivateRoutes>
            }
          >
            <Route index element={<AdminSummary />} />
            <Route path="add-department" element={<AddDepartment />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<ViewEmployee />} />
            <Route path="leaves" element={<Leave />} />
            <Route path="salary" element={<Salary />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="announcements" element={<AdminNotices />} />
          </Route>

          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoutes>
                <RoleBaseRoutes requiredRole={['employee', 'admin']}>
                  <EmployeeDashboard />
                </RoleBaseRoutes>
              </PrivateRoutes>
            }
          >
            <Route index element={<EmployeeSummary />} />
            <Route path="profile" element={<Profile />} />
            <Route path="leaves" element={<EmployeeLeaves />} />
            <Route path="departments" element={<EmployeeDepartments />} />
            <Route path="salary" element={<EmployeeSalary />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
