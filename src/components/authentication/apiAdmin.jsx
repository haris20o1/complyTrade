// // src/api/services/lcService.js
// import axios from 'axios';

// // Create a base axios instance with common configuration
// const apiClient = axios.create({
//   baseURL: 'https://192.168.18.152:50013',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add authorization interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token'); // Assuming you store the token in localStorage
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // LC related API functions
// export const lcService = {
//   // Get all LCs
//   getAllLCs: async () => {
//     try {
//       const response = await apiClient.get('/admin/lcs');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching LCs:', error);
//       throw error;
//     }
//   },
  
//   // Assign LC to user
//   assignLC: async (lcNumber, userId) => {
//     try {
//       const response = await apiClient.post('/admin/lcs/assign', {
//         lc_no: lcNumber,
//         user_id: userId
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error assigning LC:', error);
//       throw error;
//     }
//   },
  
//   // Get LC details by LC number
//   getLCDetails: async (lcNumber) => {
//     try {
//       const response = await apiClient.get(`/admin/lcs/${lcNumber}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching LC details for ${lcNumber}:`, error);
//       throw error;
//     }
//   }
// };

// export default lcService;

import { axiosInstance } from './axios';

// LC related API functions
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
      const response = await axiosInstance.get('/admin/lcs/users/complete');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed LCs:', error);
      throw error;
    }
  },
  
  // Assign LC to user
  assignLC: async (lcNumber, userId) => {
    try {
      const response = await axiosInstance.post('/admin/assign_lc', {
        lc_no: lcNumber,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning LC:', error);
      throw error;
    }
  },
  
  // Get LC details by LC number
  getLCDetails: async (lcNumber) => {
    try {
      const response = await axiosInstance.get(`/admin/lcs/${lcNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching LC details for ${lcNumber}:`, error);
      throw error;
    }
  },
  
  // Download LC document
  downloadLCDocument: async (lcNumber) => {
    try {
      const response = await axiosInstance.get(`/admin/lc_doc/${lcNumber}?support_docs=true`, {
        responseType: 'blob' // Important for handling binary data like PDFs
      });
      
      // Create a blob URL for opening in a new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      return { url };
    } catch (error) {
      console.error(`Error loading LC document for ${lcNumber}:`, error);
      throw error;
    }
  },

  getLCSupportDocsDiscrepancies: async (lcNumber) => {
    try {
      const response = await axiosInstance.get(`/admin/${lcNumber}/support_docs_discrepancies`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching support docs discrepancies for ${lcNumber}:`, error);
      throw error;
    }
  },
  
  // Add this if you need to update discrepancies
  updateDiscrepancy: async (lcNumber, discrepancyId, data) => {
    try {
      const response = await axiosInstance.put(`/admin/${lcNumber}/discrepancy/${discrepancyId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating discrepancy ${discrepancyId} for LC ${lcNumber}:`, error);
      throw error;
    }
  },
  
  // Add this if you need to add new discrepancies
  addDiscrepancy: async (lcNumber, docUuid, data) => {
    try {
      const response = await axiosInstance.post(`/admin/${lcNumber}/document/${docUuid}/discrepancy`, data);
      return response.data;
    } catch (error) {
      console.error(`Error adding discrepancy to doc ${docUuid} for LC ${lcNumber}:`, error);
      throw error;
    }
  },
  
  updateLCDiscrepancies: async (complete, docUpdates) => {
    try {
      const response = await axiosInstance.patch(
        `/compliance/discrepancies?complete=${complete}`,
        docUpdates
      );
      return response.data;
    } catch (error) {
      console.error('Error updating LC discrepancies:', error);
      throw error;
    }
  },
  getLCTimeline: async () => {
    try {
      const response = await axiosInstance.get('/admin/lcs/timeline');
      return response.data;
    } catch (error) {
      console.error('Error fetching LC timeline:', error);
      throw error;
    }
  },
  
  

};
// export const fetch_lcs_stats= async () => {
//   const response = await axiosInstance.get("/admin/lcs_stats");
//   console.log(response.data)
//   return response.data;

// };

// export const fetch_recent_activities= async () => {
//   const response = await axiosInstance.get("/admin/recent_activities");
//   console.log(response.data)
//   return response.data;

// };

export default lcService;