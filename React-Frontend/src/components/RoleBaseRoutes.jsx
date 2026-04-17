import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBaseRoutes = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!requiredRole.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />;
    }

    return children;
};

export default RoleBaseRoutes;
