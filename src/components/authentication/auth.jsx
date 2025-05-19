import { axiosInstance } from './axios';

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
    
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await axiosInstance.get('/authenticate/validate-token');
    return response.status === 200;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/authenticate/logout');
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_role');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

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
    const response = await axionsInstance.post('/authenticate/change-password', {
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