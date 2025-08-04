

// import { axiosInstance } from './axios';

// // Validate LC number
// export const validateLcNumber = async (lcNumber) => {
//   try {
//     const response = await axiosInstance.get(`/lc/validate_lc/${lcNumber}`);
//     return response.data;
//   } catch (error) {
//     console.error('LC validation error:', error);
//     throw error;
//   }
// };

// // Generate unique session ID
// // const generateSessionId = () => {
// //   return Date.now().toString() + Math.random().toString(36).substr(2, 9);
// // };
// const generateSessionId = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0;
//     const v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };
// // Upload file in chunks
// const uploadFileInChunks = async (lcNumber, file, sessionId, onProgress) => {
//   const CHUNK_SIZE = 16 * 1024 * 1024; // 1MB chunks
//   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
//   for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//     const start = chunkIndex * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     const chunk = file.slice(start, end);
    
//     const formData = new FormData();
//     formData.append('lc_no', lcNumber);
//     formData.append('session_id', sessionId);
//     formData.append('filename', file.name);
//     formData.append('chunk_index', chunkIndex.toString());
//     formData.append('total_chunks', totalChunks.toString());
//     formData.append('file', chunk);
    
//     try {
//       const response = await axiosInstance.post('/supporting_docs/upload_chunk/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });
      
//       // Call progress callback with file-specific progress
//       if (onProgress) {
//         const chunkProgress = ((chunkIndex + 1) / totalChunks) * 100;
//         onProgress(file.name, chunkProgress, response.data.status);
//       }
      
//       // If this is the last chunk and processing started, return the response
//       if (chunkIndex === totalChunks - 1 && response.data.status === 'processing') {
//         return response.data;
//       }
      
//     } catch (error) {
//       console.error(`Error uploading chunk ${chunkIndex} for file ${file.name}:`, error);
//       throw new Error(`Failed to upload ${file.name}: ${error.response?.data?.detail || error.message}`);
//     }
//   }
// };

// // Upload supporting documents with chunked upload
// export const uploadSupportingDocuments = async (lcNumber, files, onProgress) => {
//   try {
//     const sessionId = generateSessionId();
//     const totalFiles = files.length;
//     let completedFiles = 0;
    
//     // Upload files sequentially to avoid overwhelming the server
//     for (const file of files) {
//       await uploadFileInChunks(lcNumber, file, sessionId, (fileName, fileProgress, status) => {
//         // Calculate overall progress
//         const overallProgress = ((completedFiles * 100) + fileProgress) / totalFiles;
        
//         if (onProgress) {
//           onProgress({
//             fileName,
//             fileProgress,
//             overallProgress,
//             status,
//             completedFiles: status === 'processing' ? completedFiles + 1 : completedFiles
//           });
//         }
//       });
      
//       completedFiles++;
//     }
    
//     return {
//       session_id: sessionId,
//       message: "All files uploaded and processing started",
//       status: "processing"
//     };
    
//   } catch (error) {
//     console.error('Upload error:', error);
//     throw error;
//   }
// };

// // WebSocket URL generator
// export const getWebSocketUrl = (sessionId) => {
//   const token = localStorage.getItem('access_token');
//   if (!token) {
//     throw new Error('Authentication token not found');
//   }
  
//   return `wss://192.168.18.132:50013/supporting_docs/ws/progress/${sessionId}`;
// };

















import { axiosInstance } from './axios';

// Import pdf-lib for PDF compression
// Make sure to install: npm install pdf-lib
import { PDFDocument } from 'pdf-lib';

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

// Generate unique session ID using crypto.randomUUID() for better performance
const generateSessionId = () => {
  // Use native crypto.randomUUID() if available, fallback to manual generation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Fast PDF compression function
const compressPdf = async (inputBytes) => {
  try {
    const pdfDoc = await PDFDocument.load(inputBytes);
    const newPdfDoc = await PDFDocument.create();
    
    // Copy all pages to new document
    const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => {
      newPdfDoc.addPage(page);
    });
    
    // Save compressed PDF (strips metadata and rebuilds pages)
    return await newPdfDoc.save();
  } catch (error) {
    console.error('PDF compression error:', error);
    // If compression fails, return original bytes
    return inputBytes;
  }
};

// Compress file if it's a PDF, otherwise return original
const compressFileIfNeeded = async (file, onProgress) => {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    if (onProgress) {
      onProgress(file.name, 0, 'compressing');
    }
    
    try {
      const originalSize = file.size;
      console.log(`📄 Original PDF size: ${(originalSize / (1024 * 1024)).toFixed(2)} MB`);
      
      const arrayBuffer = await file.arrayBuffer();
      const compressedBytes = await compressPdf(arrayBuffer);
      const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
      
      const compressedSize = compressedBlob.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`🗜️  Compressed PDF size: ${(compressedSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`📊 Compression ratio: ${compressionRatio}% reduction`);
      console.log(`💾 Space saved: ${((originalSize - compressedSize) / (1024 * 1024)).toFixed(2)} MB`);
      
      if (onProgress) {
        onProgress(file.name, 100, 'compressed');
      }
      
      return compressedBlob;
    } catch (error) {
      console.error('Compression failed, using original file:', error);
      return file;
    }
  }
  
  console.log(`📎 Non-PDF file (${file.name}): ${(file.size / (1024 * 1024)).toFixed(2)} MB - No compression applied`);
  return file; // Return original file if not PDF
};

// Parallel chunk upload with compression
const uploadFileInChunksParallel = async (lcNumber, file, sessionId, totalFiles, onProgress, maxConcurrent = 3) => {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 4MB chunks
  
  // Compress file if it's a PDF
  const processedFile = await compressFileIfNeeded(file, (fileName, progress, status) => {
    if (onProgress) {
      onProgress(fileName, progress * 0.3, status); // Compression takes 30% of progress
    }
  });
  
  const totalChunks = Math.ceil(processedFile.size / CHUNK_SIZE);
  let completedChunks = 0;
  
  // Create array of chunk upload promises
  const chunkPromises = [];
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const uploadChunk = async (index) => {
      const start = index * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, processedFile.size);
      const chunk = processedFile.slice(start, end);
      
      const formData = new FormData();
      formData.append('lc_no', lcNumber);
      formData.append('session_id', sessionId);
      formData.append('filename', file.name); // Keep original filename
      formData.append('chunk_index', index.toString());
      formData.append('total_chunks', totalChunks.toString());
      formData.append('total_files', totalFiles.toString()); // Add total files count
      formData.append('file', chunk, file.name);
      
      const response = await axiosInstance.post('/supporting_docs/upload_chunk/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000
      });
      
      completedChunks++;
      if (onProgress) {
        // Upload progress is 70% of total (30% was compression)
        const uploadProgress = 30 + (completedChunks / totalChunks) * 70;
        onProgress(file.name, uploadProgress, response.data.status);
      }
      
      return response.data;
    };
    
    chunkPromises.push(uploadChunk(chunkIndex));
  }
  
  // Upload chunks with controlled concurrency
  const results = [];
  for (let i = 0; i < chunkPromises.length; i += maxConcurrent) {
    const batch = chunkPromises.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  
  // Return the last successful response
  return results[results.length - 1];
};

// Upload supporting documents with automatic PDF compression
export const uploadSupportingDocuments = async (lcNumber, files, onProgress, maxConcurrent = 3) => {
  try {
    const sessionId = generateSessionId();
    const totalFiles = files.length;
    let completedFiles = 0;
    
    console.log(`🚀 Starting upload session for ${totalFiles} files with session ID: ${sessionId}`);
    
    // Upload files sequentially, but chunks in parallel
    for (const file of files) {
      await uploadFileInChunksParallel(lcNumber, file, sessionId, totalFiles, (fileName, fileProgress, status) => {
        // Calculate overall progress
        const overallProgress = ((completedFiles * 100) + fileProgress) / totalFiles;
        
        if (onProgress) {
          onProgress({
            fileName,
            fileProgress,
            overallProgress,
            status,
            completedFiles: status === 'processing' ? completedFiles + 1 : completedFiles,
            totalFiles // Include total files in progress callback
          });
        }
      }, maxConcurrent);
      
      completedFiles++;
    }
    
    return {
      session_id: sessionId,
      message: "All files uploaded and processing started",
      status: "processing",
      total_files: totalFiles
    };
    
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
  
  return `wss://192.168.18.132:50013/supporting_docs/ws/progress/${sessionId}`;
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










// import { axiosInstance } from './axios';
// import { PDFDocument } from 'pdf-lib';

// // Generate unique session ID
// const generateSessionId = () => {
//   if (typeof crypto !== 'undefined' && crypto.randomUUID) {
//     return crypto.randomUUID();
//   }
  
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0;
//     const v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

// // Create inline Web Worker blob (avoids MIME type issues)
// const createCompressionWorker = () => {
//   const workerScript = `
//     // Import pdf-lib for Web Worker
//     importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

//     const compressPdf = async (inputBytes) => {
//       try {
//         const { PDFDocument } = PDFLib;
//         const pdfDoc = await PDFDocument.load(inputBytes);
//         const newPdfDoc = await PDFDocument.create();
        
//         const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
//         pages.forEach((page) => {
//           newPdfDoc.addPage(page);
//         });
        
//         return await newPdfDoc.save();
//       } catch (error) {
//         console.error('PDF compression error:', error);
//         return inputBytes;
//       }
//     };

//     self.onmessage = async function(e) {
//       const { fileId, fileName, fileBuffer, type } = e.data;
      
//       if (type === 'COMPRESS_PDF') {
//         try {
//           self.postMessage({
//             type: 'COMPRESSION_PROGRESS',
//             fileId,
//             fileName,
//             progress: 0,
//             status: 'starting'
//           });
          
//           const originalSize = fileBuffer.byteLength;
          
//           self.postMessage({
//             type: 'COMPRESSION_PROGRESS',
//             fileId,
//             fileName,
//             progress: 50,
//             status: 'compressing'
//           });
          
//           const compressedBytes = await compressPdf(fileBuffer);
//           const compressedSize = compressedBytes.byteLength;
//           const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
          
//           self.postMessage({
//             type: 'COMPRESSION_COMPLETE',
//             fileId,
//             fileName,
//             compressedBytes,
//             originalSize,
//             compressedSize,
//             compressionRatio,
//             status: 'completed'
//           });
          
//         } catch (error) {
//           self.postMessage({
//             type: 'COMPRESSION_ERROR',
//             fileId,
//             fileName,
//             originalBytes: fileBuffer,
//             error: error.message,
//             status: 'error'
//           });
//         }
//       }
//     };
//   `;

//   try {
//     const blob = new Blob([workerScript], { type: 'application/javascript' });
//     return new Worker(URL.createObjectURL(blob));
//   } catch (error) {
//     console.error('Failed to create inline worker:', error);
//     return null;
//   }
// };

// // Fallback compression function for main thread
// const compressPdfMainThread = async (inputBytes, onProgress) => {
//   try {
//     if (onProgress) onProgress(10, 'loading');
    
//     const pdfDoc = await PDFDocument.load(inputBytes);
    
//     if (onProgress) onProgress(40, 'processing');
    
//     const newPdfDoc = await PDFDocument.create();
    
//     if (onProgress) onProgress(60, 'copying');
    
//     const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    
//     if (onProgress) onProgress(80, 'rebuilding');
    
//     pages.forEach((page) => {
//       newPdfDoc.addPage(page);
//     });
    
//     if (onProgress) onProgress(95, 'saving');
    
//     const compressedBytes = await newPdfDoc.save();
    
//     if (onProgress) onProgress(100, 'completed');
    
//     return compressedBytes;
//   } catch (error) {
//     console.error('PDF compression error:', error);
//     return inputBytes;
//   }
// };

// // Enhanced processing queue with fallback support
// class FileProcessingQueue {
//   constructor(maxConcurrentCompressions = 2, maxConcurrentUploads = 3) {
//     this.compressionQueue = [];
//     this.uploadQueue = [];
//     this.activeCompressions = new Map();
//     this.activeUploads = new Map();
//     this.completedFiles = new Map();
//     this.workers = [];
//     this.maxConcurrentCompressions = maxConcurrentCompressions;
//     this.maxConcurrentUploads = maxConcurrentUploads;
//     this.useWorkers = false;
    
//     // Try to initialize workers
//     this.initializeWorkers();
//   }

//   initializeWorkers() {
//     try {
//       for (let i = 0; i < this.maxConcurrentCompressions; i++) {
//         const worker = createCompressionWorker();
//         if (worker) {
//           worker.onmessage = (e) => this.handleWorkerMessage(e);
//           worker.onerror = (error) => {
//             console.error('Worker error:', error);
//             this.useWorkers = false;
//           };
//           this.workers.push(worker);
//         }
//       }
//       this.useWorkers = this.workers.length > 0;
//       console.log(`Compression workers: ${this.useWorkers ? 'ENABLED' : 'DISABLED'} (${this.workers.length} workers)`);
//     } catch (error) {
//       console.error('Failed to initialize workers:', error);
//       this.useWorkers = false;
//     }
//   }

//   handleWorkerMessage(e) {
//     const { type, fileId, fileName, compressedBytes, originalBytes, error, progress, status } = e.data;
    
//     switch (type) {
//       case 'COMPRESSION_PROGRESS':
//         if (this.onProgress) {
//           this.onProgress(fileName, progress, 'compressing');
//         }
//         break;
        
//       case 'COMPRESSION_COMPLETE':
//         this.activeCompressions.delete(fileId);
//         const fileData = this.completedFiles.get(fileId);
//         if (fileData) {
//           fileData.compressedBytes = compressedBytes;
//           fileData.status = 'compressed';
//           this.addToUploadQueue(fileData);
//         }
//         this.processNextCompression();
//         break;
        
//       case 'COMPRESSION_ERROR':
//         this.activeCompressions.delete(fileId);
//         const errorFileData = this.completedFiles.get(fileId);
//         if (errorFileData) {
//           errorFileData.compressedBytes = originalBytes;
//           errorFileData.status = 'compression_failed';
//           this.addToUploadQueue(errorFileData);
//         }
//         this.processNextCompression();
//         break;
//     }
//   }

//   addFileForProcessing(file, lcNumber, sessionId, totalFiles, onProgress) {
//     const fileId = `${file.name}_${Date.now()}_${Math.random()}`;
//     const fileData = {
//       fileId,
//       file,
//       lcNumber,
//       sessionId,
//       totalFiles,
//       onProgress,
//       status: 'queued',
//       compressedBytes: null
//     };
    
//     this.completedFiles.set(fileId, fileData);
//     this.onProgress = onProgress;
    
//     const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
//     if (isPdf && this.useWorkers) {
//       // Use Web Workers for PDF compression
//       this.compressionQueue.push(fileData);
//       this.processNextCompression();
//     } else if (isPdf && !this.useWorkers) {
//       // Use main thread compression for PDFs
//       this.processMainThreadCompression(fileData);
//     } else {
//       // Non-PDF files go directly to upload
//       fileData.compressedBytes = file;
//       fileData.status = 'ready_for_upload';
//       this.addToUploadQueue(fileData);
//     }
//   }

//   async processMainThreadCompression(fileData) {
//     try {
//       const { file, fileId, fileName } = fileData;
      
//       if (this.onProgress) {
//         this.onProgress(fileName, 0, 'compressing');
//       }
      
//       const arrayBuffer = await file.arrayBuffer();
      
//       const compressedBytes = await compressPdfMainThread(arrayBuffer, (progress, status) => {
//         if (this.onProgress) {
//           this.onProgress(fileName, progress, `compressing_${status}`);
//         }
//       });
      
//       fileData.compressedBytes = compressedBytes;
//       fileData.status = 'compressed';
      
//       this.addToUploadQueue(fileData);
      
//     } catch (error) {
//       console.error('Main thread compression failed:', error);
//       fileData.compressedBytes = fileData.file;
//       fileData.status = 'compression_failed';
//       this.addToUploadQueue(fileData);
//     }
//   }

//   processNextCompression() {
//     if (!this.useWorkers || this.compressionQueue.length === 0 || this.activeCompressions.size >= this.maxConcurrentCompressions) {
//       return;
//     }

//     const availableWorker = this.workers.find(worker => 
//       !Array.from(this.activeCompressions.values()).includes(worker)
//     );

//     if (!availableWorker) return;

//     const fileData = this.compressionQueue.shift();
//     this.activeCompressions.set(fileData.fileId, availableWorker);
    
//     fileData.file.arrayBuffer().then(buffer => {
//       availableWorker.postMessage({
//         type: 'COMPRESS_PDF',
//         fileId: fileData.fileId,
//         fileName: fileData.file.name,
//         fileBuffer: buffer
//       });
//     }).catch(error => {
//       console.error('Error reading file for compression:', error);
//       this.activeCompressions.delete(fileData.fileId);
//       this.processNextCompression();
//     });
//   }

//   addToUploadQueue(fileData) {
//     this.uploadQueue.push(fileData);
//     this.processNextUpload();
//   }

//   async processNextUpload() {
//     if (this.uploadQueue.length === 0 || this.activeUploads.size >= this.maxConcurrentUploads) {
//       return;
//     }

//     const fileData = this.uploadQueue.shift();
//     this.activeUploads.set(fileData.fileId, fileData);
    
//     try {
//       await this.uploadFileInChunks(fileData);
//     } catch (error) {
//       console.error('Upload failed:', error);
//     } finally {
//       this.activeUploads.delete(fileData.fileId);
//       this.processNextUpload();
//     }
//   }

//   async uploadFileInChunks(fileData) {
//     const { fileId, file, compressedBytes, lcNumber, sessionId, totalFiles, onProgress } = fileData;
//     const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
    
//     // Create blob from compressed bytes or original file
//     const processedFile = compressedBytes instanceof Uint8Array 
//       ? new Blob([compressedBytes], { type: file.type })
//       : compressedBytes instanceof Blob 
//         ? compressedBytes 
//         : file;
    
//     const totalChunks = Math.ceil(processedFile.size / CHUNK_SIZE);
//     let completedChunks = 0;
    
//     // Upload chunks sequentially for each file
//     for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//       const start = chunkIndex * CHUNK_SIZE;
//       const end = Math.min(start + CHUNK_SIZE, processedFile.size);
//       const chunk = processedFile.slice(start, end);
      
//       const formData = new FormData();
//       formData.append('lc_no', lcNumber);
//       formData.append('session_id', sessionId);
//       formData.append('filename', file.name);
//       formData.append('chunk_index', chunkIndex.toString());
//       formData.append('total_chunks', totalChunks.toString());
//       formData.append('total_files', totalFiles.toString());
//       formData.append('file', chunk, file.name);
      
//       const response = await axiosInstance.post('/supporting_docs/upload_chunk/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 60000
//       });
      
//       completedChunks++;
//       if (onProgress) {
//         const uploadProgress = (completedChunks / totalChunks) * 100;
//         onProgress(file.name, uploadProgress, 'uploading');
//       }
//     }
//   }

//   cleanup() {
//     this.workers.forEach(worker => {
//       try {
//         worker.terminate();
//       } catch (error) {
//         console.error('Error terminating worker:', error);
//       }
//     });
//     this.workers = [];
//     this.compressionQueue = [];
//     this.uploadQueue = [];
//     this.activeCompressions.clear();
//     this.activeUploads.clear();
//     this.completedFiles.clear();
//   }
// }

// // Main upload function with automatic fallback
// export const uploadSupportingDocuments = async (lcNumber, files, onProgress, maxConcurrentCompressions = 2, maxConcurrentUploads = 3) => {
//   try {
//     const sessionId = generateSessionId();
//     const totalFiles = files.length;
    
//     console.log(`🚀 Starting upload session for ${totalFiles} files with session ID: ${sessionId}`);
    
//     // Create processing queue
//     const queue = new FileProcessingQueue(maxConcurrentCompressions, maxConcurrentUploads);
    
//     // Track overall progress
//     const fileProgress = new Map();
//     let completedFiles = 0;
    
//     const progressCallback = (fileName, fileProgressValue, status) => {
//       fileProgress.set(fileName, { progress: fileProgressValue, status });
      
//       if (status === 'processing') {
//         completedFiles++;
//       }
      
//       // Calculate overall progress
//       const totalProgress = Array.from(fileProgress.values())
//         .reduce((sum, fp) => sum + fp.progress, 0) / totalFiles;
      
//       if (onProgress) {
//         onProgress({
//           fileName,
//           fileProgress: fileProgressValue,
//           overallProgress: totalProgress,
//           status,
//           completedFiles,
//           totalFiles
//         });
//       }
//     };
    
//     // Add all files to processing queue
//     files.forEach(file => {
//       queue.addFileForProcessing(file, lcNumber, sessionId, totalFiles, progressCallback);
//     });
    
//     // Wait for all processing to complete
//     return new Promise((resolve, reject) => {
//       const checkCompletion = () => {
//         const allCompleted = queue.activeCompressions.size === 0 && 
//                            queue.activeUploads.size === 0 && 
//                            queue.compressionQueue.length === 0 && 
//                            queue.uploadQueue.length === 0;
        
//         if (allCompleted) {
//           queue.cleanup();
//           resolve({
//             session_id: sessionId,
//             message: "All files uploaded and processing started",
//             status: "processing",
//             total_files: totalFiles
//           });
//         } else {
//           setTimeout(checkCompletion, 1000);
//         }
//       };
      
//       checkCompletion();
      
//       // Timeout after 15 minutes
//       setTimeout(() => {
//         queue.cleanup();
//         reject(new Error('Upload timeout after 15 minutes'));
//       }, 900000);
//     });
    
//   } catch (error) {
//     console.error('Upload error:', error);
//     throw error;
//   }
// };

// // Keep existing functions unchanged
// export const validateLcNumber = async (lcNumber) => {
//   try {
//     const response = await axiosInstance.get(`/lc/validate_lc/${lcNumber}`);
//     return response.data;
//   } catch (error) {
//     console.error('LC validation error:', error);
//     throw error;
//   }
// };

// export const getWebSocketUrl = (sessionId) => {
//   const token = localStorage.getItem('access_token');
//   if (!token) {
//     throw new Error('Authentication token not found');
//   }
  
//   return `wss://192.168.18.132:50013/supporting_docs/ws/progress/${sessionId}`;
// };