import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = '/dashboard' }) => {
  const { user, hasAnyRole } = useAuth();

  if (!user) {
    return <Navigate to="/loginpage" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    // Redirect to appropriate dashboard based on user role
    const roleRedirects = {
      Owner: '/dashboard',
      Manager: '/dashboard',
      Chef: '/kitchenstaff',
      Waiter: '/waiter',
    };
    
    const redirectPath = roleRedirects[user.role] || fallbackPath;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;
