// import { axiosInstance } from './axios';

// export const loginUser = async (username, password) => {
//   try {
//     const formData = new URLSearchParams();
//     formData.append('grant_type', 'password');
//     formData.append('username', username);
//     formData.append('password', password);
//     formData.append('scope', '');
//     formData.append('client_id', 'string');
//     formData.append('client_secret', 'string');
    
//     const response = await axiosInstance.post('/authenticate/login', formData, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Login API error:', error);
//     throw error;
//   }
// };

// export const validateToken = async () => {
//   try {
//     const response = await axiosInstance.get('/authenticate/validate-token');
//     return response.status === 200;
//   } catch (error) {
//     console.error('Token validation failed:', error);
//     return false;
//   }
// };

// export const logoutUser = async () => {
//   try {
//     await axiosInstance.post('/authenticate/logout');
//     // Clear local storage
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('token_type');
//     localStorage.removeItem('user_role');
//     return true;
//   } catch (error) {
//     console.error('Logout failed:', error);
//     throw error;
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post('/authenticate/register', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration error:', error);
//     throw error;
//   }
// };

// export const changePassword = async (oldPassword, newPassword) => {
//   try {
//     const response = await axionsInstance.post('/authenticate/change-password', {
//       oldPassword,
//       newPassword
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Password change error:', error);
//     throw error;
//   }
// };

// export const requestPasswordReset = async (email) => {
//   try {
//     const response = await axiosInstance.post('/authenticate/forgot-password', { email });
//     return response.data;
//   } catch (error) {
//     console.error('Password reset request error:', error);
//     throw error;
//   }
// };

import { axiosInstance } from './axios';
import { jwtDecode } from 'jwt-decode';

// Enhanced getUserRole function with debugging
export const getUserRole = async () => {
  console.log('=== GET USER ROLE DEBUG ===');
  
  try {
    console.log('Making request to /authenticate/verify...');
    
    const response = await axiosInstance.get('/authenticate/verify');
    
    console.log('Response status:', response.status);
    console.log('Full response data:', response.data);
    
    // Try multiple possible role field names
    const role = response.data.role || 
                 response.data.user_role || 
                 response.data.userRole ||
                 response.data.user?.role ||
                 response.data.user?.user_role;
    
    if (role) {
      console.log('Role found:', role);
      console.log('Role type:', typeof role);
      return role;
    } else {
      console.log('No role found in any expected field');
      console.log('Available keys in response.data:', Object.keys(response.data || {}));
      
      // If the response structure is different, log it for debugging
      console.log('Complete response structure:', JSON.stringify(response.data, null, 2));
      
      return null;
    }
  } catch (error) {
    console.error('Failed to get user role:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    return null;
  } finally {
    console.log('=== END GET USER ROLE DEBUG ===');
  }
};

export const validateToken = async () => {
  console.log('=== VALIDATE TOKEN DEBUG ===');
  
  try {
    // Check if token exists
    const token = localStorage.getItem('access_token');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.log('No token found in localStorage');
      return false;
    }
    
    console.log('Making request to /authenticate/verify for validation...');
    
    // Use the correct endpoint for token verification
    const response = await axiosInstance.get('/authenticate/verify');
    
    console.log('Validation response status:', response.status);
    console.log('Validation response data:', response.data);
    
    const isValid = response.status === 200;
    console.log('Token is valid:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('Token validation failed:', error);
    console.error('Validation error response:', error.response?.data);
    return false;
  } finally {
    console.log('=== END VALIDATE TOKEN DEBUG ===');
  }
};

// Get user information with password_expired status from verify endpoint
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/authenticate/verify');
    return response.data;
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
};

// Alternative: Decode role from JWT token if it's included in token claims
export const getRoleFromToken = () => {
  console.log('=== GET ROLE FROM TOKEN DEBUG ===');
  
  try {
    const token = localStorage.getItem('access_token');
    console.log('Token for decoding exists:', !!token);
    
    if (!token) {
      console.log('No token to decode');
      return null;
    }
    
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    console.log('Role in token:', decoded.role);
    
    // Return role if it exists in the token payload
    return decoded.role || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  } finally {
    console.log('=== END GET ROLE FROM TOKEN DEBUG ===');
  }
};

// Store only the token in localStorage, not the role
export const loginUser = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', 'string');
    formData.append('client_secret', 'string');
    
    const response = await axiosInstance.post('/authenticate/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Login response:', response.data);
    
    // Store only the token, not the role
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('token_type', response.data.token_type);
    
    // Handle password_expired flag if needed
    if (response.data.password_expired) {
      return { ...response.data, requirePasswordChange: true };
    }
    
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/authenticate/logout');
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role'); // Also clear any stored role
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Other auth functions...
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/authenticate/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axiosInstance.post('/authenticate/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/authenticate/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};