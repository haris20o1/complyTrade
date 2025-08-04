// import axios from 'axios';

// // Create axios instance with base configuration
// export const axiosInstance = axios.create({
//   baseURL: 'https://192.168.18.132:50013',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Add request interceptor to include auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // User management API service
// export const userService = {
//   // Get all users
//   getAllUsers: async (skip = 0, limit = 100) => {
//     try {
//       const response = await axiosInstance.get(`/it_admin/users?skip=${skip}&limit=${limit}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw error;
//     }
//   },
  
//   // Create a new user
//   createUser: async (userData) => {
//     try {
//       const response = await axiosInstance.post('/it_admin/user-registeration', userData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw error;
//     }
//   },
  
//   // Update an existing user
//   updateUser: async (userId, userData) => {
//     try {
//       const response = await axiosInstance.put(`/it_admin/users/${userId}`, userData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating user:', error);
//       throw error;
//     }
//   },
  
//   // Delete a user
//   deleteUser: async (userId) => {
//     try {
//       const response = await axiosInstance.delete(`/it_admin/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       throw error;
//     }
//   }
// };

// // LC related API service
// export const lcService = {
//   // Get all LCs
//   getAllLCs: async () => {
//     try {
//       const response = await axiosInstance.get('/admin/lcs');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching LCs:', error);
//       throw error;
//     }
//   },
  
//   // Get all Complyce Managers (users)
//   getComplyceManagers: async () => {
//     try {
//       const response = await axiosInstance.get('/admin/users/complyce_managers');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching complyce managers:', error);
//       throw error;
//     }
//   },
  
//   // Get completed LCs
//   getCompletedLCs: async () => {
//     try {
//       const response = await axiosInstance.get('/compliance/lcs/complete');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching completed LCs:', error);
//       throw error;
//     }
//   },
// };

// // Audit service API
// export const auditService = {
//   // Request an audit for a specific user
//   requestAudit: async (userId) => {
//     try {
//       const response = await axiosInstance.get(`/it_admin/request-audit/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error requesting audit:', error);
//       throw error;
//     }
//   },
  
//   // Get audit status
//   getAuditStatus: async () => {
//     try {
//       const response = await axiosInstance.get('/it_admin/audit-status');
//       return response.data;
//     } catch (error) {
//       console.error('Error getting audit status:', error);
//       throw error;
//     }
//   },

//   // Get audit logs for a specific user
//   getAuditLogs: async (userId) => {
//     try {
//       const response = await axiosInstance.get(`/it_admin/audit-logs/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching audit logs:', error);
//       throw error;
//     }
//   },
  
//   // Get all audit requests
//   getAuditRequests: async () => {
//     try {
//       const response = await axiosInstance.get('/super_admin/audit-requests');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching audit requests:', error);
//       throw error;
//     }
//   }
// };

// export default { axiosInstance, userService, lcService, auditService };
import { axiosInstance } from './axios';

// import axios from 'axios';

// Create axios instance with base configuration
// export const axiosInstance = axios.create({
//   baseURL: 'https://192.168.18.132:50013',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// Add request interceptor to include auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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

// Bank document management API service
export const bankDocumentService = {
  // Upload a bank document
  uploadDocument: async (file, docType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', docType);
      
      const response = await axiosInstance.post('/it_admin/bank/docs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Get all bank documents
  getAllDocuments: async () => {
    try {
      const response = await axiosInstance.get('/it_admin/bank/docs');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Get a specific document (download)
  getDocument: async (docId) => {
    try {
      const response = await axiosInstance.get(`/it_admin/bank/docs/${docId}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (docId) => {
    try {
      const response = await axiosInstance.delete(`/it_admin/bank/docs/${docId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Download document helper
  downloadDocument: async (docId, filename) => {
    try {
      const response = await bankDocumentService.getDocument(docId);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use provided filename
      const contentDisposition = response.headers['content-disposition'];
      let downloadFilename = filename;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^'";]+)['"]?/);
        if (filenameMatch) {
          downloadFilename = decodeURIComponent(filenameMatch[1]);
        }
      }
      
      link.setAttribute('download', downloadFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Document downloaded successfully' };
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
};

export default { axiosInstance, userService, lcService, auditService, bankDocumentService };