// src/components/auth/ProtectedRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protected route component that checks if user is authenticated
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = () => {
  // Simple check for authentication token
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render child routes
  return <Outlet />;
};

/**
 * Role-based protected route component
 * Checks if user is both authenticated and has required role
 */
export const RoleBasedRoute = ({ allowedRoles }) => {
  // Check for authentication and user role
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  const userRole = localStorage.getItem('user_role');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(userRole);
  
  // If user doesn't have required role, show unauthorized page
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Otherwise, render child routes
  return <Outlet />;
};

/**
 * Special route for already authenticated users
 * Redirects logged in users away from login/signup pages to their appropriate dashboard
 */
export const AuthRedirectRoute = () => {
  // Check for authentication and user role
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  const userRole = localStorage.getItem('user_role');
  
  // If not authenticated, show login/signup pages
  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  // Redirect to appropriate dashboard based on role
  switch(userRole) {
    case 'admin':
      return <Navigate to="/dashboard" replace />;
    case 'complyce_manager':
      return <Navigate to="/dashboardd" replace />;
    case 'swift':
      return <Navigate to="/swift-upload" replace />;
    case 'support':
      return <Navigate to="/supporting-docs" replace />;
    case 'it_admin':
      return <Navigate to="/users" replace />;
    case 'it_admin':
      return <Navigate to="/policies" replace />;
    case 'super_admin':
      return <Navigate to="/super" replace />;
    default:
      // For unknown roles, redirect to login
      return <Navigate to="/" replace />;
  }
};