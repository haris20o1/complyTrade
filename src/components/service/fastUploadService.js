// src/services/fastUploadService.js - Compatible with existing backend
import { axiosInstance } from '../authentication/axios';

const MAX_CONCURRENT_UPLOADS = 4; // Upload 4 files simultaneously
const MAX_FILE_SIZE_FOR_PARALLEL = 50 * 1024 * 1024; // 50MB limit for parallel uploads

class FastUploadService {
  constructor() {
    this.activeUploads = new Map();
    this.uploadResults = [];
  }

  // Fast parallel upload using existing endpoint
  async uploadFile(file, lcNumber, progressCallback) {
    const formData = new FormData();
    formData.append('files', file);
    
    try {
      const response = await axiosInstance.post(
        `/supporting_docs/upload_docs/?lc_no=${lcNumber}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // 1 minute timeout per file
          onUploadProgress: (event) => {
            if (progressCallback) {
              progressCallback({
                progress: (event.loaded / event.total) * 100,
                loaded: event.loaded,
                total: event.total,
                fileName: file.name
              });
            }
          }
        }
      );
      
      return {
        success: true,
        fileName: file.name,
        fileSize: file.size,
        data: response.data
      };
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }

  // Process files in parallel batches
  async uploadFilesInBatches(files, lcNumber, globalProgressCallback) {
    const results = [];
    const totalFiles = files.length;
    let completedFiles = 0;
    const fileProgress = new Map();

    // Initialize progress tracking
    files.forEach((_, index) => {
      fileProgress.set(index, 0);
    });

    const updateGlobalProgress = () => {
      const totalProgress = Array.from(fileProgress.values()).reduce((sum, prog) => sum + prog, 0);
      const overallProgress = totalProgress / totalFiles;
      
      if (globalProgressCallback) {
        globalProgressCallback({
          overallProgress: overallProgress,
          completedFiles,
          totalFiles,
          currentlyUploading: Math.min(MAX_CONCURRENT_UPLOADS, totalFiles - completedFiles)
        });
      }
    };

    // Create upload function for individual file
    const uploadSingleFile = async (file, fileIndex) => {
      const fileProgressCallback = (progress) => {
        fileProgress.set(fileIndex, progress.progress || 0);
        updateGlobalProgress();
        
        if (globalProgressCallback) {
          globalProgressCallback({
            fileIndex,
            fileName: file.name,
            progress: progress.progress,
            totalFiles,
            overallProgress: Array.from(fileProgress.values()).reduce((sum, prog) => sum + prog, 0) / totalFiles
          });
        }
      };

      try {
        const result = await this.uploadFile(file, lcNumber, fileProgressCallback);
        completedFiles++;
        fileProgress.set(fileIndex, 100);
        updateGlobalProgress();
        return result;
      } catch (error) {
        completedFiles++;
        fileProgress.set(fileIndex, 0); // Reset failed upload progress
        updateGlobalProgress();
        throw error;
      }
    };

    // Process files in parallel batches
    for (let i = 0; i < files.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = files.slice(i, i + MAX_CONCURRENT_UPLOADS);
      const batchPromises = batch.map((file, batchIndex) => 
        uploadSingleFile(file, i + batchIndex)
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        console.error('Batch upload error:', error);
        // Continue with next batch even if current batch has failures
      }
    }

    return results;
  }

  // Analyze upload strategy based on file sizes
  shouldUseBatchUpload(files) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const hasLargeFiles = files.some(file => file.size > MAX_FILE_SIZE_FOR_PARALLEL);
    
    return {
      useBatch: files.length > 1 && !hasLargeFiles,
      totalSize,
      strategy: hasLargeFiles ? 'sequential' : 'parallel'
    };
  }
}

// Main upload function with intelligent parallel processing
export const uploadSupportingDocuments = async (lcNumber, files, progressCallback = null) => {
  const fastService = new FastUploadService();
  
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  try {
    const uploadAnalysis = fastService.shouldUseBatchUpload(files);
    
    if (uploadAnalysis.useBatch) {
      // Parallel batch upload for multiple small-medium files
      const results = await fastService.uploadFilesInBatches(files, lcNumber, progressCallback);
      
      // Process results
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length > 0) {
        console.warn(`${failed.length} files failed to upload:`, failed);
      }
      
      if (successful.length === 0) {
        throw new Error('All file uploads failed');
      }
      
      // Get session ID from first successful upload
      const sessionId = successful[0]?.value?.data?.session_id;
      
      return {
        session_id: sessionId,
        successful: successful.length,
        failed: failed.length,
        results: results,
        strategy: 'parallel'
      };
      
    } else {
      // Sequential upload for large files or single file
      const results = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const fileProgressCallback = progressCallback ? (progress) => {
          progressCallback({
            ...progress,
            fileIndex: i,
            fileName: file.name,
            totalFiles: files.length,
            overallProgress: ((i / files.length) * 100) + (progress.progress / files.length)
          });
        } : null;
        
        try {
          const result = await fastService.uploadFile(file, lcNumber, fileProgressCallback);
          results.push({ status: 'fulfilled', value: result });
        } catch (error) {
          results.push({ status: 'rejected', reason: error });
        }
      }
      
      const successful = results.filter(r => r.status === 'fulfilled');
      const sessionId = successful[0]?.value?.data?.session_id;
      
      return {
        session_id: sessionId,
        successful: successful.length,
        failed: results.length - successful.length,
        results: results,
        strategy: 'sequential'
      };
    }
    
  } catch (error) {
    console.error('Fast upload service error:', error);
    throw error;
  }
};

// Keep existing functions unchanged
export const validateLcNumber = async (lcNumber) => {
  try {
    const response = await axiosInstance.get(`/lc/validate_lc/${lcNumber}`);
    return response.data;
  } catch (error) {
    console.error('LC validation error:', error);
    throw error;
  }
};

export const getWebSocketUrl = (sessionId) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return `wss://192.168.18.132:50013/supporting_docs/ws/progress/${sessionId}`;
};