// import { useState, useEffect, createContext} from "react";
// // import { useNavigate } from "react-router-dom";


// // Create the AuthContext
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem('token') || null);
//     const [loading, setLoading] = useState(true);
//     // const navigate = useNavigate();
//     useEffect(() => {
//       const verifyToken = async () => {
//         try {
//           if (token) {
//             const response = await fetch('/api/auth/verify', {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             });
//             if (response.ok) {
//               const userData = await response.json();
//               setUser(userData);
//             } else {
//               logout();
//             }
//           }
//         } catch (error) {
//           console.error('Token verification failed:', error);
//           logout();
//         } finally {
//           setLoading(false);
//         }
//       };
//       verifyToken();
//     }, []);
//     // ... (keep login and logout functions the same)
//     // Add a function to check user roles
//     const hasRole = (requiredRole) => {
//       if (!user || !user.roles) return false;
//       return user.roles.includes(requiredRole);
//     };
//     return (
//       <AuthContext.Provider value={{ user, token, loading, hasRole }}>
//         {!loading && children}
//       </AuthContext.Provider>
//     );
//   };


// src/contexts/AuthContext.js
// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateToken, getUserRole } from '../components/authentication/auth';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('=== AUTH CONTEXT: Checking auth status ===');
    setIsLoading(true);
    setAuthChecked(false);
    
    try {
      // Check if token exists first
      const token = localStorage.getItem('access_token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No token found, user is not authenticated');
        setIsAuthenticated(false);
        setUserRole(null);
        return;
      }

      // Validate the token
      const isValid = await validateToken();
      console.log('Token validation result:', isValid);
      
      if (isValid) {
        // Get user role from the backend
        const role = await getUserRole();
        console.log('Role received:', role);
        
        if (role) {
          // Update state synchronously
          setIsAuthenticated(true);
          setUserRole(role);
          console.log('User role set in context:', role);
        } else {
          console.log('No role received, clearing auth state');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        console.log('Token invalid, clearing auth state');
        setIsAuthenticated(false);
        setUserRole(null);
        // Clear invalid token
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
      console.log('=== AUTH CONTEXT: Auth check complete ===');
    }
  };

  // Function to update auth state after login - SYNCHRONOUS UPDATE
  const login = async () => {
    console.log('=== AUTH CONTEXT: Login method called ===');
    setIsLoading(true);
    
    try {
      const isValid = await validateToken();
      console.log('Login validation result:', isValid);
      
      if (isValid) {
        const role = await getUserRole();
        console.log('Login role result:', role);
        
        if (role) {
          // CRITICAL: Update all state synchronously
          setIsAuthenticated(true);
          setUserRole(role);
          setIsLoading(false);
          setAuthChecked(true);
          
          console.log('Login successful - State updated:', {
            isAuthenticated: true,
            userRole: role,
            isLoading: false,
            authChecked: true
          });
          
          // Force a small delay to ensure React processes the state updates
          await new Promise(resolve => setTimeout(resolve, 50));
          
          return role;
        } else {
          throw new Error('No role received from server');
        }
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Login state update failed:', error);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsLoading(false);
      setAuthChecked(true);
      return null;
    }
  };

  // Function to clear auth state after logout
  const logout = () => {
    console.log('=== AUTH CONTEXT: Logging out ===');
    setIsAuthenticated(false);
    setUserRole(null);
    setIsLoading(false);
    setAuthChecked(true);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  };

  // Function to check if user has specific role
  const hasRole = (requiredRoles) => {
    if (!isAuthenticated || !userRole) return false;

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }

    return userRole === requiredRoles;
  };

  // Export auth context value
  const value = {
    isAuthenticated,    
    userRole,
    isLoading,
    authChecked,
    login,
    logout,
    hasRole,
    checkAuthStatus
  };

  console.log('AuthContext current state:', {
    isAuthenticated,
    userRole,
    isLoading,
    authChecked
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


