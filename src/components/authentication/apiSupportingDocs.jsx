// src/services/lcDocumentsService.js
import { axiosInstance } from './axios';

// Validate LC number
export const validateLcNumber = async (lcNumber) => {
  try {
    const response = await axiosInstance.get(`/lc/validate_lc/${lcNumber}`);
    return response.data;
  } catch (error) {
    console.error('LC validation error:', error);
    throw error;
  }
};

// Upload supporting documents
export const uploadSupportingDocuments = async (lcNumber, files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await axiosInstance.post(`/supporting_docs/upload_docs/?lc_no=${lcNumber}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// WebSocket URL generator
export const getWebSocketUrl = (sessionId) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  return `wss://192.168.18.62:50013/supporting_docs/ws/progress/${sessionId}?token=${encodeURIComponent(token)}`;
};