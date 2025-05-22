import axios from 'axios';

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: 'https://192.168.18.152:50013',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User management API service
export const userService = {
  // Get all users
  getAllUsers: async (skip = 0, limit = 100) => {
    try {
      const response = await axiosInstance.get(`/it_admin/users?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/it_admin/user-registeration', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update an existing user
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/it_admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/it_admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// LC related API service
export const lcService = {
  // Get all LCs
  getAllLCs: async () => {
    try {
      const response = await axiosInstance.get('/admin/lcs');
      return response.data;
    } catch (error) {
      console.error('Error fetching LCs:', error);
      throw error;
    }
  },
  
  // Get all Complyce Managers (users)
  getComplyceManagers: async () => {
    try {
      const response = await axiosInstance.get('/admin/users/complyce_managers');
      return response.data;
    } catch (error) {
      console.error('Error fetching complyce managers:', error);
      throw error;
    }
  },
  
  // Get completed LCs
  getCompletedLCs: async () => {
    try {
      const response = await axiosInstance.get('/compliance/lcs/complete');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed LCs:', error);
      throw error;
    }
  },
};

// Audit service API
export const auditService = {
  // Request an audit for a specific user
  requestAudit: async (userId) => {
    try {
      const response = await axiosInstance.get(`/it_admin/request-audit/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error requesting audit:', error);
      throw error;
    }
  },
  
  // Get audit status
  getAuditStatus: async () => {
    try {
      const response = await axiosInstance.get('/it_admin/audit-status');
      return response.data;
    } catch (error) {
      console.error('Error getting audit status:', error);
      throw error;
    }
  },

  // Get audit logs for a specific user
  getAuditLogs: async (userId) => {
    try {
      const response = await axiosInstance.get(`/it_admin/audit-logs/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  // Get all audit requests
  getAuditRequests: async () => {
    try {
      const response = await axiosInstance.get('/super_admin/audit-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching audit requests:', error);
      throw error;
    }
  }
};

export default { axiosInstance, userService, lcService, auditService };