// export const authService = {
//     // Function to log user in
//     login: (token, tokenType, role) => {
//       localStorage.setItem('access_token', token);
//       localStorage.setItem('token_type', tokenType);
//       localStorage.setItem('user_role', role);
//       localStorage.setItem('login_time', Date.now().toString());
//     },
    
//     // Function to log user out - CRITICAL to clear tokens
//     logout: () => {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('token_type');
//       localStorage.removeItem('user_role');
//       localStorage.removeItem('login_time');
//     },
    
//     // Function to check if user is authenticated
//     isAuthenticated: () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) return false;
      
//       // Optional: Check token expiration
//       const loginTime = localStorage.getItem('login_time');
//       if (loginTime) {
//         // Example: token expires after 2 hours
//         const expirationTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
//         if (Date.now() - parseInt(loginTime) > expirationTime) {
//           // Token expired, logout user
//           authService.logout();
//           return false;
//         }
//       }
      
//       return true;
//     },
    
//     // Function to get user role
//     getUserRole: () => {
//       return localStorage.getItem('user_role');
//     }
//   };



// src/utils/authUtils.js

// Check if the user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token; // Returns true if token exists, false otherwise
  };
  
  // Check if the user has the required role
  export const hasRole = (allowedRoles) => {
    const userRole = localStorage.getItem('user_role');
    return allowedRoles.includes(userRole);
  };
  
  // Logout function
  export const logout = () => {
    // Clear all authentication-related items from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    
    // Redirect to login page
    window.location.href = '/login';
  };
  
  // Validate token (you can expand this with more sophisticated token validation)
  export const validateToken = () => {
    const token = localStorage.getItem('access_token');
    
    // Basic token validation
    if (!token) {
      return false;
    }
  
    // TODO: Add token expiration check
    // You might want to decode the token and check its expiration
    // This is a placeholder for more complex token validation
    return true;
  };