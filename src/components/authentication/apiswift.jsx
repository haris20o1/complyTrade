// src/services/documentService.js
import { axiosInstance } from './axios';

// Upload documents to the server
export const uploadDocuments = async (files) => {
  try {
    const formData = new FormData();
    
    // Append each file to the FormData
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post('/lc/upload_docs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Override default content type for file uploads
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
};

// Check progress of document processing
export const checkDocumentProgress = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/lc/progress/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Progress check error:', error);
    throw error;
  }
};

// Create WebSocket connection for real-time progress updates
export const createProgressWebSocket = (sessionId) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const wsUrl = `wss://192.168.18.132:50013/lc/ws/progress/${sessionId}?token=${encodeURIComponent(token)}`;
  return new WebSocket(wsUrl);
};
export const cancelUploadSession = async (sessionId) => {
  try {
    const response = await axiosInstance.post(`/supporting_docs/session/${sessionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Cancel session error:', error);
    throw error;
  }
};