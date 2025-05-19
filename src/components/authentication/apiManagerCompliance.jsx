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
      const response = await axiosInstance.get('/compliance/lcs/complete');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed LCs:', error);
      throw error;
    }
  },

  // Get assigned LCs
  getAssignedLCs: async () => {
    try {
      const response = await axiosInstance.get('/compliance/lcs/assign');
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned LCs:', error);
      throw error;
    }
  },

  // Get in-progress LCs
  getInProgressLCs: async () => {
    try {
      const response = await axiosInstance.get('/compliance/lcs/inprogress');
      return response.data;
    } catch (error) {
      console.error('Error fetching in-progress LCs:', error);
      throw error;
    }
  },

  // Get high priority/immediate LCs
  getPriorityLCs: async () => {
    try {
      const response = await axiosInstance.get('/compliance/lcs/immediate');
      return response.data;
    } catch (error) {
      console.error('Error fetching priority LCs:', error);
      throw error;
    }
  },

  // Start processing an LC (mark as in progress)
  startProcessingLC: async (lcNo) => {
    try {
      const response = await axiosInstance.post(`/compliance/lcs/${lcNo}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting LC processing:', error);
      throw error;
    }
  },

  // View LC details
  getLCDetails: async (lcNo) => {
    try {
      const response = await axiosInstance.get(`/compliance/lcs/${lcNo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching LC details:', error);
      throw error;
    }
  },

  // Download original LC document
  downloadLCDocument: async (filePath) => {
    try {
      const response = await axiosInstance.get(`/files/download`, {
        params: { path: filePath },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading LC document:', error);
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
};

export default lcService;