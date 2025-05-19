// // src/services/auditRequestsService.js
// import { axiosInstance } from './axios';

// // Get all audit requests
// export const getAllAuditRequests = async () => {
//   try {
//     const response = await axiosInstance.get('/super_admin/audit-requests');
//     return response.data;
//   } catch (error) {
//     console.error('Fetch audit requests error:', error);
//     throw error;
//   }
// };

// // Get audit request by ID
// export const getAuditRequestById = async (requestId) => {
//   try {
//     const response = await axiosInstance.get(`/super_admin/audit-requests/${requestId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Fetch audit request details error:', error);
//     throw error;
//   }
// };

// // Approve audit request
// export const approveAuditRequest = async (requestId) => {
//   try {
//     const response = await axiosInstance.post(`/super_admin/audit-requests/${requestId}/approve`);
//     return response.data;
//   } catch (error) {
//     console.error('Approve audit request error:', error);
//     throw error;
//   }
// };

// // Reject audit request
// export const rejectAuditRequest = async (requestId, reason) => {
//   try {
//     const response = await axiosInstance.post(`/super_admin/audit-requests/${requestId}/reject`, {
//       reason
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Reject audit request error:', error);
//     throw error;
//   }
// };

// // src/services/auditService.js
// import { axiosInstance } from './axios';

// /**
//  * Get all audit requests
//  * @returns {Promise<Array>} Array of audit requests
//  */
// export const getAuditRequests = async () => {
//   try {
//     const response = await axiosInstance.get('/super_admin/audit-requests');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching audit requests:', error);
//     throw error;
//   }
// };

// /**
//  * Update the status of an audit request
//  * @param {number} requestId - The ID of the audit request to update
//  * @param {string} status - The new status ('approved' or 'rejected')
//  * @returns {Promise<Object>} The response data
//  */
// export const updateAuditRequestStatus = async (requestId, status) => {
//   try {
//     const response = await axiosInstance.put('/super_admin/audit-requests', {
//       request_id: requestId,
//       status: status
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating audit request ${requestId}:`, error);
//     throw error;
//   }
// };

// /**
//  * Request a new audit
//  * @returns {Promise<Object>} The response data with the new audit request
//  */
// export const requestAudit = async () => {
//   try {
//     const response = await axiosInstance.post('/super_admin/audit-requests');
//     return response.data;
//   } catch (error) {
//     console.error('Error requesting audit:', error);
//     throw error;
//   }
// };
import { axiosInstance } from './axios';

/**
 * Get all audit requests
 * @returns {Promise<Array>} Array of audit requests
 */
export const getAuditRequests = async () => {
  try {
    // Add detailed logging
    console.log('Attempting to fetch audit requests...');
    
    // Make the API call
    const response = await axiosInstance.get('/super_admin/audit-requests');
    
    // Log successful response
    console.log('Successfully fetched audit requests:', response);
    console.log('Response data:', response.data);
    
    // Return the data array
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('Error fetching audit requests:', error);
    
    // Log the full error response if available
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    // Rethrow the error with more context
    throw new Error(`Failed to fetch audit requests: ${error.message}`);
  }
};

/**
 * Update the status of an audit request
 * @param {number} requestById - The ID of the user who requested the audit
 * @param {number} requestForId - The ID of the user the audit is for
 * @param {string} status - The new status ('approved' or 'rejected')
 * @returns {Promise<Object>} The response data
 */
export const updateAuditRequestStatus = async (requestById, requestForId, status) => {
  try {
    // Ensure IDs are numbers
    const numericRequestById = Number(requestById);
    const numericRequestForId = Number(requestForId);
    
    // Create payload in the exact format expected by the updated API
    const payload = {
      request_by_id: numericRequestById,
      request_for_id: numericRequestForId,
      status: status
    };
    
    console.log('Sending update request with payload:', payload);
    
    // Make the PUT request with the correctly formatted payload
    const response = await axiosInstance.put('/super_admin/audit-requests', payload);
    
    console.log('Update response:', response);
    return response.data;
  } catch (error) {
    console.error(`Error updating audit request:`, error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    throw error;
  }
};

/**
 * Request a new audit
 * @returns {Promise<Object>} The response data with the new audit request
 */
export const requestAudit = async () => {
  try {
    const response = await axiosInstance.post('/super_admin/audit-requests');
    return response.data;
  } catch (error) {
    console.error('Error requesting audit:', error);
    throw error;
  }
};

/**
 * Get all users in the system
 * @param {number} skip - Number of records to skip for pagination
 * @param {number} limit - Number of records to return
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsers = async (skip = 0, limit = 100) => {
  try {
    console.log(`Fetching users with skip=${skip}, limit=${limit}`);
    const response = await axiosInstance.get(`/it_admin/users?skip=${skip}&limit=${limit}`);
    console.log('Successfully fetched users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Get performance metrics for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} User performance data
 */
export const getUserPerformance = async (userId) => {
  try {
    console.log(`Fetching performance for user ID: ${userId}`);
    const response = await axiosInstance.get(`/super_admin/users/performance/${userId}`);
    console.log('Successfully fetched user performance:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance for user ${userId}:`, error);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    
    throw new Error(`Failed to fetch user performance: ${error.message}`);
  }
};

/**
 * Get performance metrics for all users
 * @returns {Promise<Array>} Array of user performance data
 */
export const getAllUsersPerformance = async () => {
  try {
    console.log('Fetching performance for all users');
    const users = await getAllUsers();
    
    // Get performance data for each user
    const performancePromises = users.map(user => 
      getUserPerformance(user.id)
        .catch(error => {
          console.error(`Failed to get performance for user ${user.id}:`, error);
          // Return a default object with the user ID if we can't get performance
          return { 
            user_id: user.id,
            username: user.username,
            stats: { 
              total_assigned: 0,
              completed: 0,
              in_progress: 0,
              pending: 0,
              completion_rate: 0
            }
          };
        })
    );
    
    const performanceData = await Promise.all(performancePromises);
    console.log('Successfully fetched all users performance data');
    return performanceData;
  } catch (error) {
    console.error('Error fetching all users performance:', error);
    throw new Error(`Failed to fetch all users performance: ${error.message}`);
  }
};