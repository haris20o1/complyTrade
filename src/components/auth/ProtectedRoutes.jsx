// // src/components/auth/ProtectedRoutes.js
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// /**
//  * Protected route component that checks if user is authenticated
//  * Redirects to login if not authenticated
//  */
// export const ProtectedRoute = () => {
//   // Simple check for authentication token
//   const isAuthenticated = localStorage.getItem('access_token') !== null;
  
//   // If not authenticated, redirect to login page
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
  
//   // Otherwise, render child routes
//   return <Outlet />;
// };

// /**
//  * Role-based protected route component
//  * Checks if user is both authenticated and has required role
//  */
// export const RoleBasedRoute = ({ allowedRoles }) => {
//   // Check for authentication and user role
//   const isAuthenticated = localStorage.getItem('access_token') !== null;
//   const userRole = localStorage.getItem('user_role');
  
//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
  
//   // Check if user has required role
//   const hasRequiredRole = allowedRoles.includes(userRole);
  
//   // If user doesn't have required role, show unauthorized page
//   if (!hasRequiredRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   // Otherwise, render child routes
//   return <Outlet />;
// };

// /**
//  * Special route for already authenticated users
//  * Redirects logged in users away from login/signup pages to their appropriate dashboard
//  */
// export const AuthRedirectRoute = () => {
//   // Check for authentication and user role
//   const isAuthenticated = localStorage.getItem('access_token') !== null;
//   const userRole = localStorage.getItem('user_role');
  
//   // If not authenticated, show login/signup pages
//   if (!isAuthenticated) {
//     return <Outlet />;
//   }
  
//   // Redirect to appropriate dashboard based on role
//   switch(userRole) {
//     case 'admin':
//       return <Navigate to="/dashboard" replace />;
//     case 'complyce_manager':
//       return <Navigate to="/dashboardd" replace />;
//     case 'swift':
//       return <Navigate to="/swift-upload" replace />;
//     case 'support':
//       return <Navigate to="/supporting-docs" replace />;
//     case 'it_admin':
//       return <Navigate to="/users" replace />;
    
//     case 'super_admin':
//       return <Navigate to="/super" replace />;
//     default:
//       // For unknown roles, redirect to login
//       return <Navigate to="/" replace />;
//   }
// };

//// src/components/auth/ProtectedRoutes.js
// import React, { useState, useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { validateToken, getUserRole } from '../authentication/auth'
// import LoadingSpinner from '../common/LoadingSpinner'; // Create this component

// /**
//  * Protected route component that checks if user is authenticated
//  * Redirects to login if not authenticated
//  */
// export const ProtectedRoute = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const isValid = await validateToken();
//         setIsAuthenticated(isValid);
//       } catch (error) {
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     checkAuth();
//   }, []);
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
  
//   // If not authenticated, redirect to login page
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
  
//   // Otherwise, render child routes
//   return <Outlet />;
// };

// /**
//  * Role-based protected route component
//  * Checks if user is both authenticated and has required role
//  */
// export const RoleBasedRoute = ({ allowedRoles }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null);
  
//   useEffect(() => {
//     const checkAuthAndRole = async () => {
//       try {
//         const isValid = await validateToken();
//         setIsAuthenticated(isValid);
        
//         if (isValid) {
//           // Get user role from backend, not localStorage
//           const role = await getUserRole();
//           setUserRole(role);
//         }
//       } catch (error) {
//         setIsAuthenticated(false);
//         setUserRole(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     checkAuthAndRole();
//   }, []);
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
  
//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
  
//   // Check if user has required role
//   const hasRequiredRole = allowedRoles.includes(userRole);
  
//   // If user doesn't have required role, show unauthorized page
//   if (!hasRequiredRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  
//   // Otherwise, render child routes
//   return <Outlet />;
// };

// /**
//  * Special route for already authenticated users
//  * Redirects logged in users away from login/signup pages
//  */
// export const AuthRedirectRoute = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null);
  
//   useEffect(() => {
//     const checkAuthAndRole = async () => {
//       try {
//         const isValid = await validateToken();
//         setIsAuthenticated(isValid);
        
//         if (isValid) {
//           // Get user role from backend, not localStorage
//           const role = await getUserRole();
//           setUserRole(role);
//         }
//       } catch (error) {
//         setIsAuthenticated(false);
//         setUserRole(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     checkAuthAndRole();
//   }, []);
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
  
//   // If not authenticated, show login/signup pages
//   if (!isAuthenticated) {
//     return <Outlet />;
//   }
  
//   // Redirect to appropriate dashboard based on role
//   switch(userRole) {
//     case 'admin':
//       return <Navigate to="/dashboard" replace />;
//     case 'complyce_manager':
//       return <Navigate to="/dashboardd" replace />;
//     case 'swift':
//       return <Navigate to="/swift-upload" replace />;
//     case 'support':
//       return <Navigate to="/supporting-docs" replace />;
//     case 'it_admin':
//       return <Navigate to="/users" replace />;
//     case 'super_admin':
//       return <Navigate to="/super" replace />;
//     default:
//       // For unknown roles, redirect to login
//       return <Navigate to="/" replace />;
//   }
// };



// src/components/auth/ProtectedRoutes.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Protected route component that checks if user is authenticated
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, authChecked } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'authChecked:', authChecked);
  
  // Show loading while auth is being checked
  if (isLoading || !authChecked) {
    return <LoadingSpinner />;
  }
  
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
  const { isAuthenticated, userRole, isLoading, authChecked } = useAuth();
  
  console.log('RoleBasedRoute - isAuthenticated:', isAuthenticated, 'userRole:', userRole, 'allowedRoles:', allowedRoles);
  
  // Show loading while auth is being checked
  if (isLoading || !authChecked) {
    return <LoadingSpinner />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If no role assigned, show unauthorized
  if (!userRole) {
    return <Navigate to="/unauthorized" replace />;
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
 * FIXED: Special route for already authenticated users
 * This was the main problem - it was interfering with login navigation
 */
export const AuthRedirectRoute = () => {
  const { isAuthenticated, userRole, isLoading, authChecked } = useAuth();
  
  console.log('AuthRedirectRoute - isAuthenticated:', isAuthenticated, 'userRole:', userRole, 'isLoading:', isLoading, 'authChecked:', authChecked);
  
  // CRITICAL FIX: Don't show loading screen at all for login page
  // This prevents the redirect loop issue
  
  // If we're still checking auth status, show the login page anyway
  // Don't block with loading screen
  if (!authChecked) {
    console.log('AuthRedirectRoute: Auth not checked yet, showing login page');
    return <Outlet />;
  }
  
  // ONLY redirect if we are DEFINITELY authenticated AND have a role
  // AND we're not in a loading state
  if (isAuthenticated && userRole && !isLoading) {
    console.log('AuthRedirectRoute: User is fully authenticated with role:', userRole, '- Redirecting...');
    
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
      case 'super_admin':
        return <Navigate to="/super" replace />;
      default:
        console.log('AuthRedirectRoute: Unknown role, staying on login');
        return <Outlet />;
    }
  }
  
  // Default: show login page (this includes cases where user is not authenticated)
  console.log('AuthRedirectRoute: Showing login page');
  return <Outlet />;
};