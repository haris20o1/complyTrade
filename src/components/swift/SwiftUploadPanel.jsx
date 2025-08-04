// components/swift/SwiftUploadPanel.jsx
// import React, { useState } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import FileUploader from './FileUploader';
// import ErrorDropdown from './ErrorDropdown';

// const SwiftUploadPanel = () => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);

//   const handleFilesSelected = (selectedFiles) => {
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//     // Clear previous errors when new files are selected
//     if (uploadStatus === 'error') {
//       setUploadStatus(null);
//       setErrors([]);
//       setErrorMessage('');
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one file to upload');
//       setUploadStatus('error');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);

//     // Simulate upload progress
//     const progressInterval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(progressInterval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 500);

//     try {
//       // Simulate API call to upload files
//       await new Promise(resolve => setTimeout(resolve, 3000));

//       // Simulate random success/error (in a real app, this would be based on the API response)
//       const isSuccess = Math.random() > 0.2; // 80% success rate for demo

//       if (isSuccess) {
//         setUploadStatus('success');
//         setUploadProgress(100);
//         setFiles([]);
//       } else {
//         // Mock API error response
//         const mockErrors = [
//           {
//             id: '1',
//             fileName: files[0]?.name || 'Unknown file',
//             name: 'Invalid Message Format',
//             description: 'The SWIFT message format is invalid. Expected MT700 format but received an unsupported format.',
//             lineNumber: 5,
//             lineContent: '1:F01BANKDEFGXXX0000000000',
//             suggestion: 'Ensure the message follows MT700 format specifications.'
//           }
//         ];
        
//         // If more than one file, add a second error
//         if (files.length > 1) {
//           mockErrors.push({
//             id: '2',
//             fileName: files[1]?.name || 'Second file',
//             name: 'Missing Mandatory Field',
//             description: 'The required field 27A (Sequence of Total) is missing from the message.',
//             lineNumber: null,
//             lineContent: null,
//             suggestion: 'Add the mandatory field 27A to the message.'
//           });
//         }
        
//         setUploadStatus('error');
//         setErrorMessage('One or more files could not be validated. See details below.');
//         setErrors(mockErrors);
//         setUploadProgress(0);
//       }
//     } catch (error) {
//       setUploadStatus('error');
//       setErrorMessage('An error occurred while uploading files. Please try again.');
//       setUploadProgress(0);
//     } finally {
//       setUploading(false);
//       clearInterval(progressInterval);
//     }
//   };

//   const resetUpload = () => {
//     setFiles([]);
//     setUploadStatus(null);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadProgress(0);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-900">LC Swift Message Upload</h1>
//             <button
//               onClick={() => {
//                 localStorage.removeItem('auth_token');
//                 localStorage.removeItem('user_role');
//                 window.location.href = '/';
//               }}
//               className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </header>
      
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="bg-white rounded-lg shadow p-6">
//             {uploadStatus === 'success' ? (
//               <div className="text-center py-12">
//                 <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
//                 <p className="text-gray-600 mb-6">
//                   All Swift messages have been uploaded and validated successfully.
//                 </p>
//                 <button
//                   onClick={resetUpload}
//                   className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Upload More Files
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Upload LC Swift Messages</h2>
//                 <p className="text-gray-600 mb-6">
//                   Upload your SWIFT messages for Letter of Credit compliance checking. The system will validate each file and notify you of any issues.
//                 </p>
                
//                 {uploadStatus === 'error' && errorMessage && !errors.length && (
//                   <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
//                     <div className="flex">
//                       <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                       <p className="text-red-700">{errorMessage}</p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* New Error Dropdown component */}
//                 {errors.length > 0 && (
//                   <ErrorDropdown errors={errors} />
//                 )}

//                 {/* Using the FileUploader component */}
//                 <FileUploader 
//                   onFilesSelected={handleFilesSelected}
//                   disabled={uploading}
//                 />
                
//                 {files.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="text-md font-medium text-gray-900 mb-3">Selected Files ({files.length})</h3>
//                     <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                       {files.map((file, index) => (
//                         <li key={index} className="py-3 flex justify-between items-center">
//                           <div className="flex items-center">
//                             <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                             <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                             <span className="ml-2 text-xs text-gray-500">
//                               ({(file.size / 1024).toFixed(2)} KB)
//                             </span>
//                           </div>
//                           <button
//                             onClick={() => removeFile(index)}
//                             className="text-sm text-red-600 hover:text-red-800"
//                             disabled={uploading}
//                           >
//                             Remove
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
                
//                 {uploading && (
//                   <div className="mt-6">
//                     <h3 className="text-sm font-medium text-gray-900 mb-1">Uploading...</h3>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div 
//                         className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500 text-right">{uploadProgress}% complete</p>
//                   </div>
//                 )}
                
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={resetUpload}
//                     className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={uploading || files.length === 0}
//                   >
//                     Clear All
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleUpload}
//                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={uploading || files.length === 0}
//                   >
//                     {uploading ? 'Uploading...' : 'Upload Files'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SwiftUploadPanel;

// import React, { useState, useEffect, useRef } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import { LogOut, FileText } from 'lucide-react';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';
// import { uploadDocuments, checkDocumentProgress, createProgressWebSocket } from '../authentication/apiswift';
// import { logoutUser } from '../authentication/auth';

// const LCSwiftDocsUploader = () => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const [processingStatus, setProcessingStatus] = useState(''); // 'processing', 'completed', 'in-progress' etc.
//   const [currentDocName, setCurrentDocName] = useState('');
//   const [unsupportedFileError, setUnsupportedFileError] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);
  
//   // Reference to store the WebSocket connection
//   const socketRef = useRef(null);
  
//   // Reference to store the reconnection attempt timeout
//   const reconnectTimeoutRef = useRef(null);
  
//   // Track reconnection attempts
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Clean up the WebSocket when component unmounts
//   useEffect(() => {
//     return () => {
//       cleanupWebSocket();
//     };
//   }, []);

//   const cleanupWebSocket = () => {
//     if (socketRef.current) {
//       socketRef.current.close();
//       socketRef.current = null;
//     }
    
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await logoutUser();
//       // Redirect is handled in the logoutUser function
//     } catch (error) {
//       console.error('Sign out error:', error);
//       // Fallback manual logout if API fails
//       localStorage.removeItem('access_token');
//       window.location.href = '/';
//     }
//   };

//   const handleFilesSelected = (selectedFiles) => {
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//     // Clear previous errors when new files are selected
//     if (uploadStatus === 'error') {
//       setUploadStatus(null);
//       setErrors([]);
//       setErrorMessage('');
//       setUnsupportedFileError(null);
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   // Handle processing status and errors in WebSocket responses
//   const handleProcessingResponse = (data) => {
//     // Update current document name
//     console.log(data);
//     if (data.progress && data.progress.Doc_name) {
//       setCurrentDocName(data.progress.Doc_name);
      
//       // Store processed file information
//       if (data.progress.processing_status && data.progress.Doc_name) {
//         // Check if this file is already in the processed files array
//         const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
//         if (!fileExists) {
//           let isError = false;
//           let errorText = null;
          
//           // Check if the processing_error field indicates an actual error
//           // The API is sending "Read Done for file X.pdf" in processing_error even on success
//           if (data.progress.processing_error && 
//               !data.progress.processing_error.startsWith("Read Done for file")) {
//             isError = true;
//             errorText = data.progress.processing_error;
//           }
          
//           const newProcessedFile = {
//             name: data.progress.Doc_name,
//             status: isError ? "Error" : data.progress.processing_status,
//             error: errorText,
//             url: data.progress.doc_url || null
//           };
          
//           setProcessedFiles(prev => [...prev, newProcessedFile]);
          
//           // If this file has an error, add it to the errors array for ErrorDropdown
//           if (isError) {
//             const errorMessage = errorText || 'Unknown error';
            
//             // Add to errors array
//             setErrors(prevErrors => [
//               ...prevErrors,
//               {
//                 id: Date.now().toString(),
//                 fileName: data.progress.Doc_name || 'Unknown file',
//                 name: 'Processing Error',
//                 description: errorMessage,
//                 lineNumber: null,
//                 lineContent: null,
//                 suggestion: errorMessage.includes("Unsupported File type") 
//                   ? `The file type "${errorMessage.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
//                   : 'Please check the file format and try again with supported file types.'
//               }
//             ]);
            
//             // Set upload status to error as soon as we encounter any error
//             setUploadStatus('error');
//             setErrorMessage('One or more files failed to process. See details below.');
            
//             // Update unsupported file error state if applicable
//             if (errorMessage.includes("Unsupported File type")) {
//               setUnsupportedFileError({
//                 fileName: data.progress.Doc_name,
//                 fileType: errorMessage.split(" ").pop()
//               });
//             }
//           }
//         }
//       }
//     }
    
//     // Update progress based on file index and total
//     if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
//       // Calculate progress percentage
//       const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
//       setUploadProgress(progressPercentage);
//     }
    
//     // Update processing status
//     if (data.status) {
//       setProcessingStatus(data.status);
//     }
    
//     // Check if processing has completed
//     if (data.status === 'completed') {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
      
//       // Check if any files have errors
//       const hasErrors = errors.length > 0 || processedFiles.some(file => file.status === "Error");
      
//       // Always set success status when processing completes
//       setUploadStatus('success');
      
//       // If we have errors, also set error message
//       if (hasErrors) {
//         setErrorMessage('One or more files failed to process. See details below.');
//       }
      
//       return true; // Completed
//     }
    
//     return false; // Not completed yet
//   };
  
//   // Function to start WebSocket connection for monitoring progress
//   const startWebSocketMonitoring = (id) => {
//     // Reset reconnection attempts
//     reconnectAttemptsRef.current = 0;
    
//     // Close existing WebSocket if one exists
//     cleanupWebSocket();
    
//     try {
//       // Create a WebSocket using the service
//       const socket = createProgressWebSocket(id);
      
//       // Store the socket in the ref
//       socketRef.current = socket;
      
//       // Handle WebSocket events
//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         // Reset reconnection attempts on successful connection
//         reconnectAttemptsRef.current = 0;
//       };
      
//       socket.onmessage = (event) => {
//         try {
//           console.log('WebSocket message received:', event.data);
//           const data = JSON.parse(event.data);
//           handleProcessingResponse(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
      
//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         // Don't attempt to reconnect on error - let onclose handle it
//       };
      
//       socket.onclose = (event) => {
//         console.log('WebSocket connection closed with code:', event.code);
        
//         // If we're still uploading and haven't exceeded max reconnection attempts, try to reconnect
//         if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
//           console.log(`Attempting to reconnect WebSocket in ${reconnectDelay}ms...`);
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttemptsRef.current++;
//             startWebSocketMonitoring(id);
//           }, reconnectDelay);
//         } else if (uploading) {
//           // If we've exceeded reconnection attempts but are still uploading,
//           // set an error state
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Connection to server lost. Please try again.');
//         }
//       };
//     } catch (error) {
//       console.error('Error setting up WebSocket:', error);
//       setUploading(false);
//       setUploadStatus('error');
//       setErrorMessage(`WebSocket connection error: ${error.message}`);
//     }
//   };

//   // Function to manually check progress via REST API
//   const checkProgressManually = async (id) => {
//     try {
//       const data = await checkDocumentProgress(id);
//       console.log('Progress check response:', data);
      
//       // Process the data the same way we process WebSocket messages
//       handleProcessingResponse(data);
      
//       // If processing is not complete and we're still uploading, schedule another check
//       if (data.status !== 'completed' && uploading) {
//         setTimeout(() => checkProgressManually(id), 3000); // Check every 3 seconds
//       }
//     } catch (error) {
//       console.error('Error checking progress:', error);
//       // If we're still uploading, schedule another check despite the error
//       if (uploading) {
//         setTimeout(() => checkProgressManually(id), 5000); // Retry after 5 seconds
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one document to upload');
//       setUploadStatus('error');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);
//     setProcessingStatus('initializing');
//     setCurrentDocName('');
//     setSessionId(''); // Clear any previous session ID
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);

//     // Clean up any existing WebSocket connection
//     cleanupWebSocket();

//     try {
//       // Upload the files using the service
//       const data = await uploadDocuments(files);
//       console.log('Upload response:', data);
      
//       // Set the session ID from the response
//       const newSessionId = data.session_id;
//       setSessionId(newSessionId);
//       setProcessingStatus('processing');
      
//       // Start WebSocket monitoring
//       startWebSocketMonitoring(newSessionId);
      
//       // Also start a backup progress checking mechanism using REST API
//       // This will run in parallel with the WebSocket
//       checkProgressManually(newSessionId);
      
//       // Safety timeout to prevent hanging UI (5 minutes)
//       setTimeout(() => {
//         // Only set error if we're still uploading after timeout
//         if (uploading) {
//           cleanupWebSocket();
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Processing timed out. Please check the status manually.');
//         }
//       }, 300000);
      
//     } catch (error) {
//       console.error('Upload error:', error);
      
//       setUploading(false);
//       setUploadStatus('error');
      
//       // Handle errors
//       if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
//         setErrorMessage('Network error. Please check your connection and try again.');
//       } else if (error.message.includes('Authentication token')) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage(`Error uploading documents: ${error.message}`);
//       }
      
//       setErrors([{
//         id: '1',
//         fileName: 'Upload Error',
//         name: 'Upload Failed',
//         description: error.message || 'An unexpected error occurred during file upload.',
//         lineNumber: null,
//         lineContent: null,
//         suggestion: 'Please try again with smaller files or fewer files at once.'
//       }]);
      
//       setUploadProgress(0);
//     }
//   };

//   const resetUpload = () => {
//     // Clean up any WebSocket connections
//     cleanupWebSocket();
    
//     setFiles([]);
//     setUploadStatus(null);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadProgress(0);
//     setSessionId('');
//     setProcessingStatus('');
//     setCurrentDocName('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);
//   };

//   // Rest of the component (render method) remains the same
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Header with navigation and signout */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <FileText className="h-8 w-8 text-blue-600 mr-3" />
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">LC Document Portal</h1>
//                 <p className="text-sm text-gray-500">LC Documents Management</p>
//               </div>
//             </div>
//             <button
//               onClick={handleSignOut}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </header>
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Swift Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload SWIFT MT700 and other LC documents for processing.
//             </p>

//             {/* File Uploader */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Documents
//               </label>
//               <FileUploader 
//                 onFilesSelected={handleFilesSelected}
//                 disabled={uploading}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//               </p>
//             </div>
            
//             {files.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
//                 <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                   {files.map((file, index) => (
//                     <li key={index} className="py-3 flex justify-between items-center">
//                       <div className="flex items-center">
//                         <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                         <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                         <span className="ml-2 text-xs text-gray-500">
//                           ({(file.size / 1024).toFixed(2)} KB)
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="text-sm text-red-600 hover:text-red-800"
//                         disabled={uploading}
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
            
//             {uploading && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-900 mb-1">
//                   {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                   processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                 </h3>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//                 <div className="mt-1 flex justify-between items-center">
//                   <p className="text-xs text-gray-500">
//                     {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                   </p>
//                   <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
//                 </div>
//                 {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                   <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                 )}
                
//                 {/* Display processed files during upload */}
//                 {processedFiles.length > 0 && (
//                   <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                     <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                     <ul className="mt-1 list-none text-xs text-gray-600">
//                       {processedFiles.map((file, index) => (
//                         <li key={index} className="py-1 flex justify-between">
//                           <span>{file.name}</span>
//                           <span className={file.error ? "text-red-600" : "text-green-600"}>
//                             {file.error ? "Error" : file.status}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Success message display - keep it on the same screen */}
//             {uploadStatus === 'success' && (
//               <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex">
//                   <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                   <div className="text-sm text-green-700">
//                     <p className="font-medium">Upload Complete</p>
//                     <p className="mt-1">Your documents have been processed.</p>
//                     {sessionId && (
//                       <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                     )}
                    
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => !file.error).map((file, index) => (
//                             <li key={index}>
//                               {file.name} - {file.status}
//                               {file.url && (
//                                 <span className="ml-2">
//                                   (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error message display with detailed errors in dropdown */}
//             {errors.length > 0 && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex">
//                   <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                   <div className="text-sm text-red-700 w-full">
//                     <p className="font-medium">Some Files Failed</p>
//                     <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                    
//                     {/* Display failed files if any */}
//                     {processedFiles.filter(file => file.error).length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Failed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => file.error).map((file, index) => (
//                             <li key={index} className="text-red-700">
//                               {file.name} - {file.status}
//                               {file.error && <span className="ml-1">({file.error})</span>}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {/* Always show error dropdown if there are errors */}
//                     <div className="mt-4">
//                       <ErrorDropdown errors={errors} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
                            
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={resetUpload}
//                 className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading}
//               >
//                 {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleUpload}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading || files.length === 0}
//               >
//                 {uploading ? 'Processing...' : 'Upload Documents'}
//               </button>
//             </div>
       
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LCSwiftDocsUploader;




// import React, { useState, useEffect, useRef } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';

// const LCSwiftDocsUploader = () => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const [processingStatus, setProcessingStatus] = useState(''); // 'processing', 'completed', 'in-progress' etc.
//   const [currentDocName, setCurrentDocName] = useState('');
//   const [unsupportedFileError, setUnsupportedFileError] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);
  
//   // Reference to store the WebSocket connection
//   const socketRef = useRef(null);
  
//   // Reference to store the reconnection attempt timeout
//   const reconnectTimeoutRef = useRef(null);
  
//   // Track reconnection attempts
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Clean up the WebSocket when component unmounts
//   useEffect(() => {
//     return () => {
//       cleanupWebSocket();
//     };
//   }, []);

//   const cleanupWebSocket = () => {
//     if (socketRef.current) {
//       socketRef.current.close();
//       socketRef.current = null;
//     }
    
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }
//   };

//   const handleSignOut = () => {
//     // Clear auth tokens
//     localStorage.removeItem('access_token');
    
//     // Redirect to login page
//     window.location.href = '/';
//   };


//   const handleFilesSelected = (selectedFiles) => {
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//     // Clear previous errors when new files are selected
//     if (uploadStatus === 'error') {
//       setUploadStatus(null);
//       setErrors([]);
//       setErrorMessage('');
//       setUnsupportedFileError(null);
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   // Handle processing status and errors in WebSocket responses
//   const handleProcessingResponse = (data) => {
//     // Update current document name
//     console.log(data);
//     if (data.progress && data.progress.Doc_name) {
//       setCurrentDocName(data.progress.Doc_name);
      
//       // Store processed file information
//       if (data.progress.processing_status && data.progress.Doc_name) {
//         // Check if this file is already in the processed files array
//         const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
//         if (!fileExists) {
//           let isError = false;
//           let errorText = null;
          
//           // Check if the processing_error field indicates an actual error
//           // The API is sending "Read Done for file X.pdf" in processing_error even on success
//           if (data.progress.processing_error && 
//               !data.progress.processing_error.startsWith("Read done for file")) {
//             isError = true;
//             errorText = data.progress.processing_error;
//           }
          
//           const newProcessedFile = {
//             name: data.progress.Doc_name,
//             status: isError ? "Error" : data.progress.processing_status,
//             error: errorText,
//             url: data.progress.doc_url || null
//           };
          
//           setProcessedFiles(prev => [...prev, newProcessedFile]);
          
//           // If this file has an error, add it to the errors array for ErrorDropdown
//           if (isError) {
//             const errorMessage = errorText || 'Unknown error';
            
//             // Add to errors array
//             setErrors(prevErrors => [
//               ...prevErrors,
//               {
//                 id: Date.now().toString(),
//                 fileName: data.progress.Doc_name || 'Unknown file',
//                 name: 'Processing Error',
//                 description: errorMessage,
//                 lineNumber: null,
//                 lineContent: null,
//                 suggestion: errorMessage.includes("Unsupported File type") 
//                   ? `The file type "${errorMessage.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
//                   : 'Please check the file format and try again with supported file types.'
//               }
//             ]);
            
//             // Set upload status to error as soon as we encounter any error
//             setUploadStatus('error');
//             setErrorMessage('One or more files failed to process. See details below.');
            
//             // Update unsupported file error state if applicable
//             if (errorMessage.includes("Unsupported File type")) {
//               setUnsupportedFileError({
//                 fileName: data.progress.Doc_name,
//                 fileType: errorMessage.split(" ").pop()
//               });
//             }
//           }
//         }
//       }
//     }
    
//     // Update progress based on file index and total
//     if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
//       // Calculate progress percentage
//       const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
//       setUploadProgress(progressPercentage);
//     }
    
//     // Update processing status
//     if (data.status) {
//       setProcessingStatus(data.status);
//     }
    
//     // Check if processing has completed
//     if (data.status === 'completed') {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
      
//       // Check if any files have errors
//       const hasErrors = errors.length > 0 || processedFiles.some(file => file.status === "Error");
      
//       // Always set success status when processing completes
//       setUploadStatus('success');
      
//       // If we have errors, also set error message
//       if (hasErrors) {
//         setErrorMessage('One or more files failed to process. See details below.');
//       }
      
//       return true; // Completed
//     }
    
//     return false; // Not completed yet
//   };
  
//   // Function to start WebSocket connection for monitoring progress
//   const startWebSocketMonitoring = (id) => {
//     // Reset reconnection attempts
//     reconnectAttemptsRef.current = 0;
    
//     // Close existing WebSocket if one exists
//     cleanupWebSocket();
    
//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
      
//       // Create a WebSocket URL with authentication token as a query parameter
//       const wsUrl = `wss://192.168.18.132:50013/lc/ws/progress/${id}?token=${encodeURIComponent(token)}`;
//       const socket = new WebSocket(wsUrl);
      
//       // Store the socket in the ref
//       socketRef.current = socket;
      
//       // Handle WebSocket events
//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         // Reset reconnection attempts on successful connection
//         reconnectAttemptsRef.current = 0;
//       };
      
//       socket.onmessage = (event) => {
//         try {
//           console.log('WebSocket message received:', event.data);
//           const data = JSON.parse(event.data);
//           handleProcessingResponse(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
      
//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         // Don't attempt to reconnect on error - let onclose handle it
//       };
      
//       socket.onclose = (event) => {
//         console.log('WebSocket connection closed with code:', event.code);
        
//         // If we're still uploading and haven't exceeded max reconnection attempts, try to reconnect
//         if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
//           console.log(`Attempting to reconnect WebSocket in ${reconnectDelay}ms...`);
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttemptsRef.current++;
//             startWebSocketMonitoring(id);
//           }, reconnectDelay);
//         } else if (uploading) {
//           // If we've exceeded reconnection attempts but are still uploading,
//           // set an error state
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Connection to server lost. Please try again.');
//         }
//       };
//     } catch (error) {
//       console.error('Error setting up WebSocket:', error);
//       setUploading(false);
//       setUploadStatus('error');
//       setErrorMessage(`WebSocket connection error: ${error.message}`);
//     }
//   };

//   // Function to manually check progress via REST API
//   const checkProgressManually = async (id) => {
//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
      
//       const response = await fetch(`https://192.168.18.132:50013/lc/progress/${id}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Progress check response:', data);
      
//       // Process the data the same way we process WebSocket messages
//       handleProcessingResponse(data);
      
//       // If processing is not complete and we're still uploading, schedule another check
//       if (data.status !== 'completed' && uploading) {
//         setTimeout(() => checkProgressManually(id), 3000); // Check every 3 seconds
//       }
      
//     } catch (error) {
//       console.error('Error checking progress:', error);
//       // If we're still uploading, schedule another check despite the error
//       if (uploading) {
//         setTimeout(() => checkProgressManually(id), 5000); // Retry after 5 seconds
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one document to upload');
//       setUploadStatus('error');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);
//     setProcessingStatus('initializing');
//     setCurrentDocName('');
//     setSessionId(''); // Clear any previous session ID
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);

//     // Clean up any existing WebSocket connection
//     cleanupWebSocket();

//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Create FormData object for the API request
//       const formData = new FormData();
      
//       // Append each file to the FormData
//       files.forEach(file => {
//         formData.append('files', file);
//       });

//       // Make the API request to upload the files with token in authorization header
//       const response = await fetch(`https://192.168.18.132:50013/lc/upload_docs/`, {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Upload response:', data);
      
//       // Set the session ID from the response
//       const newSessionId = data.session_id;
//       setSessionId(newSessionId);
//       setProcessingStatus('processing');
      
//       // Start WebSocket monitoring
//       startWebSocketMonitoring(newSessionId);
      
//       // Also start a backup progress checking mechanism using REST API
//       // This will run in parallel with the WebSocket
//       checkProgressManually(newSessionId);
      
//       // Safety timeout to prevent hanging UI (5 minutes)
//       setTimeout(() => {
//         // Only set error if we're still uploading after timeout
//         if (uploading) {
//           cleanupWebSocket();
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Processing timed out. Please check the status manually.');
//         }
//       }, 300000);
      
//     } catch (error) {
//       console.error('Upload error:', error);
      
//       setUploading(false);
//       setUploadStatus('error');
      
//       // Handle errors
//       if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
//         setErrorMessage('Network error. Please check your connection and try again.');
//       } else if (error.message.includes('Authentication token')) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage(`Error uploading documents: ${error.message}`);
//       }
      
//       setErrors([{
//         id: '1',
//         fileName: 'Upload Error',
//         name: 'Upload Failed',
//         description: error.message || 'An unexpected error occurred during file upload.',
//         lineNumber: null,
//         lineContent: null,
//         suggestion: 'Please try again with smaller files or fewer files at once.'
//       }]);
      
//       setUploadProgress(0);
//     }
//   };

//   const resetUpload = () => {
//     // Clean up any WebSocket connections
//     cleanupWebSocket();
    
//     setFiles([]);
//     setUploadStatus(null);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadProgress(0);
//     setSessionId('');
//     setProcessingStatus('');
//     setCurrentDocName('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//           {/* Header with navigation and signout */}
//           <header className="bg-white shadow-md">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex justify-between items-center py-4">
//                 <div className="flex items-center">
//                   <FileText className="h-8 w-8 text-blue-600 mr-3" />
//                   <div>
//                     <h1 className="text-xl font-bold text-gray-900">LC Document Portal</h1>
//                     <p className="text-sm text-gray-500">LC Documents Management</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleSignOut}
//                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </button>
//               </div>
//             </div>
//           </header>
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Swift Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload SWIFT MT700 and other LC documents for processing.
//             </p>

//             {/* File Uploader */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Documents
//               </label>
//               <FileUploader 
//                 onFilesSelected={handleFilesSelected}
//                 disabled={uploading}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//               </p>
//             </div>
            
//             {files.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
//                 <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                   {files.map((file, index) => (
//                     <li key={index} className="py-3 flex justify-between items-center">
//                       <div className="flex items-center">
//                         <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                         <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                         <span className="ml-2 text-xs text-gray-500">
//                           ({(file.size / 1024).toFixed(2)} KB)
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="text-sm text-red-600 hover:text-red-800"
//                         disabled={uploading}
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
            
//             {uploading && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-900 mb-1">
//                   {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                   processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                 </h3>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//                 <div className="mt-1 flex justify-between items-center">
//                   <p className="text-xs text-gray-500">
//                     {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                   </p>
//                   <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
//                 </div>
//                 {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                   <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                 )}
                
//                 {/* Display processed files during upload */}
//                 {processedFiles.length > 0 && (
//                   <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                     <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                     <ul className="mt-1 list-none text-xs text-gray-600">
//                       {processedFiles.map((file, index) => (
//                         <li key={index} className="py-1 flex justify-between">
//                           <span>{file.name}</span>
//                           <span className={file.error ? "text-red-600" : "text-green-600"}>
//                             {file.error ? "Error" : file.status}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}

  
//             {/* Success message display - keep it on the same screen */}
//             {uploadStatus === 'success' && (
//               <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex">
//                   <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                   <div className="text-sm text-green-700">
//                     <p className="font-medium">Upload Complete</p>
//                     <p className="mt-1">Your documents have been processed.</p>
//                     {sessionId && (
//                       <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                     )}
                    
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => !file.error).map((file, index) => (
//                             <li key={index}>
//                               {file.name} - {file.status}
//                               {file.url && (
//                                 <span className="ml-2">
//                                   (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error message display with detailed errors in dropdown */}
//             {errors.length > 0 && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex">
//                   <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                   <div className="text-sm text-red-700 w-full">
//                     <p className="font-medium">Some Files Failed</p>
//                     <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                    
//                     {/* Display failed files if any */}
//                     {processedFiles.filter(file => file.error).length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Failed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => file.error).map((file, index) => (
//                             <li key={index} className="text-red-700">
//                               {file.name} - {file.status}
//                               {file.error && <span className="ml-1">({file.error})</span>}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {/* Always show error dropdown if there are errors */}
//                     <div className="mt-4">
//                       <ErrorDropdown errors={errors} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
                            
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={resetUpload}
//                 className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading}
//               >
//                 {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleUpload}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading || files.length === 0}
//               >
//                 {uploading ? 'Processing...' : 'Upload Documents'}
//               </button>
//             </div>
       
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LCSwiftDocsUploader;






// import React, { useState, useEffect, useRef } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';

// const LCSwiftDocsUploader = () => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const [processingStatus, setProcessingStatus] = useState(''); // 'processing', 'completed', 'in-progress' etc.
//   const [currentDocName, setCurrentDocName] = useState('');
//   const [unsupportedFileError, setUnsupportedFileError] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);
  
//   // Reference to store the WebSocket connection
//   const socketRef = useRef(null);
  
//   // Reference to store the reconnection attempt timeout
//   const reconnectTimeoutRef = useRef(null);
  
//   // Track reconnection attempts
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Clean up the WebSocket when component unmounts
//   useEffect(() => {
//     return () => {
//       cleanupWebSocket();
//     };
//   }, []);

//   const cleanupWebSocket = () => {
//     if (socketRef.current) {
//       socketRef.current.close();
//       socketRef.current = null;
//     }
    
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }
//   };

//   const handleSignOut = () => {
//     // Clear auth tokens
//     localStorage.removeItem('access_token');
    
//     // Redirect to login page
//     window.location.href = '/';
//   };

//   const handleFilesSelected = (selectedFiles) => {
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//     // Clear previous errors when new files are selected
//     if (uploadStatus === 'error') {
//       setUploadStatus(null);
//       setErrors([]);
//       setErrorMessage('');
//       setUnsupportedFileError(null);
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   // Handle processing status and errors in WebSocket responses
//   const handleProcessingResponse = (data) => {
//     console.log('Processing response:', data);
    
//     // Handle direct progress value from WebSocket
//     if (typeof data.progress === 'number') {
//       setUploadProgress(data.progress);
//     }
    
//     // Handle progress object with file information
//     if (data.progress && typeof data.progress === 'object') {
//       // Update current document name
//       if (data.progress.Doc_name) {
//         setCurrentDocName(data.progress.Doc_name);
        
//         // Store processed file information
//         if (data.progress.processing_status && data.progress.Doc_name) {
//           // Check if this file is already in the processed files array
//           const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
          
//           if (!fileExists) {
//             let isError = false;
//             let errorText = null;
            
//             // Check if the processing_error field indicates an actual error
//             // The API is sending "Read done for file X" in processing_error even on success
//             if (data.progress.processing_error && 
//                 !data.progress.processing_error.startsWith("Read done for file")) {
//               isError = true;
//               errorText = data.progress.processing_error;
//             }
            
//             const newProcessedFile = {
//               name: data.progress.Doc_name,
//               status: isError ? "Error" : data.progress.processing_status,
//               error: errorText,
//               url: data.progress.doc_url || null
//             };
            
//             setProcessedFiles(prev => [...prev, newProcessedFile]);
            
//             // If this file has an error, add it to the errors array for ErrorDropdown
//             if (isError) {
//               const errorMessage = errorText || 'Unknown error';
              
//               // Add to errors array
//               setErrors(prevErrors => [
//                 ...prevErrors,
//                 {
//                   id: Date.now().toString(),
//                   fileName: data.progress.Doc_name || 'Unknown file',
//                   name: 'Processing Error',
//                   description: errorMessage,
//                   lineNumber: null,
//                   lineContent: null,
//                   suggestion: errorMessage.includes("Unsupported File type") 
//                     ? `The file type "${errorMessage.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
//                     : 'Please check the file format and try again with supported file types.'
//                 }
//               ]);
              
//               // Set upload status to error as soon as we encounter any error
//               setUploadStatus('error');
//               setErrorMessage('One or more files failed to process. See details below.');
              
//               // Update unsupported file error state if applicable
//               if (errorMessage.includes("Unsupported File type")) {
//                 setUnsupportedFileError({
//                   fileName: data.progress.Doc_name,
//                   fileType: errorMessage.split(" ").pop()
//                 });
//               }
//             }
//           }
//         }
//       }
      
//       // Calculate progress based on file index and total if available
//       if (typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
//         const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
//         setUploadProgress(progressPercentage);
//       }
//     }
    
//     // Update processing status
//     if (data.status) {
//       setProcessingStatus(data.status);
//     }
    
//     // Check if processing has completed
//     if (data.status === 'completed') {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
      
//       // Check if any files have errors
//       const hasErrors = errors.length > 0 || processedFiles.some(file => file.status === "Error");
      
//       // Always set success status when processing completes
//       setUploadStatus('success');
      
//       // If we have errors, also set error message
//       if (hasErrors) {
//         setErrorMessage('One or more files failed to process. See details below.');
//       }
      
//       return true; // Completed
//     }
    
//     return false; // Not completed yet
//   };
  
//   // Function to start WebSocket connection for monitoring progress
//   const startWebSocketMonitoring = (id) => {
//     // Reset reconnection attempts
//     reconnectAttemptsRef.current = 0;
    
//     // Close existing WebSocket if one exists
//     cleanupWebSocket();
    
//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
      
//       // Create a WebSocket URL with authentication token as a query parameter
//       const wsUrl = `wss://192.168.18.132:50013/lc/ws/progress/${id}?token=${encodeURIComponent(token)}`;
//       const socket = new WebSocket(wsUrl);
      
//       // Store the socket in the ref
//       socketRef.current = socket;
      
//       // Handle WebSocket events
//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         // Reset reconnection attempts on successful connection
//         reconnectAttemptsRef.current = 0;
//       };
      
//       socket.onmessage = (event) => {
//         try {
//           console.log('WebSocket message received:', event.data);
//           const data = JSON.parse(event.data);
//           handleProcessingResponse(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
      
//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         // Don't attempt to reconnect on error - let onclose handle it
//       };
      
//       socket.onclose = (event) => {
//         console.log('WebSocket connection closed with code:', event.code);
        
//         // If we're still uploading and haven't exceeded max reconnection attempts, try to reconnect
//         if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
//           console.log(`Attempting to reconnect WebSocket in ${reconnectDelay}ms...`);
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttemptsRef.current++;
//             startWebSocketMonitoring(id);
//           }, reconnectDelay);
//         } else if (uploading) {
//           // If we've exceeded reconnection attempts but are still uploading,
//           // set an error state
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Connection to server lost. Please try again.');
//         }
//       };
//     } catch (error) {
//       console.error('Error setting up WebSocket:', error);
//       setUploading(false);
//       setUploadStatus('error');
//       setErrorMessage(`WebSocket connection error: ${error.message}`);
//     }
//   };

//   // Function to manually check progress via REST API
//   const checkProgressManually = async (id) => {
//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
      
//       const response = await fetch(`https://192.168.18.132:50013/lc/progress/${id}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Progress check response:', data);
      
//       // Process the data the same way we process WebSocket messages
//       handleProcessingResponse(data);
      
//       // If processing is not complete and we're still uploading, schedule another check
//       if (data.status !== 'completed' && uploading) {
//         setTimeout(() => checkProgressManually(id), 3000); // Check every 3 seconds
//       }
      
//     } catch (error) {
//       console.error('Error checking progress:', error);
//       // If we're still uploading, schedule another check despite the error
//       if (uploading) {
//         setTimeout(() => checkProgressManually(id), 5000); // Retry after 5 seconds
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one document to upload');
//       setUploadStatus('error');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);
//     setProcessingStatus('initializing');
//     setCurrentDocName('');
//     setSessionId(''); // Clear any previous session ID
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);

//     // Clean up any existing WebSocket connection
//     cleanupWebSocket();

//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Create FormData object for the API request
//       const formData = new FormData();
      
//       // Append each file to the FormData
//       files.forEach(file => {
//         formData.append('files', file);
//       });

//       // Make the API request to upload the files with token in authorization header
//       const response = await fetch(`https://192.168.18.132:50013/lc/upload_docs/`, {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Upload response:', data);
      
//       // Set the session ID from the response
//       const newSessionId = data.session_id;
//       setSessionId(newSessionId);
//       setProcessingStatus('processing');
      
//       // Start WebSocket monitoring
//       startWebSocketMonitoring(newSessionId);
      
//       // Also start a backup progress checking mechanism using REST API
//       // This will run in parallel with the WebSocket
//       checkProgressManually(newSessionId);
      
//       // Safety timeout to prevent hanging UI (5 minutes)
//       setTimeout(() => {
//         // Only set error if we're still uploading after timeout
//         if (uploading) {
//           cleanupWebSocket();
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Processing timed out. Please check the status manually.');
//         }
//       }, 300000);
      
//     } catch (error) {
//       console.error('Upload error:', error);
      
//       setUploading(false);
//       setUploadStatus('error');
      
//       // Handle errors
//       if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
//         setErrorMessage('Network error. Please check your connection and try again.');
//       } else if (error.message.includes('Authentication token')) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage(`Error uploading documents: ${error.message}`);
//       }
      
//       setErrors([{
//         id: '1',
//         fileName: 'Upload Error',
//         name: 'Upload Failed',
//         description: error.message || 'An unexpected error occurred during file upload.',
//         lineNumber: null,
//         lineContent: null,
//         suggestion: 'Please try again with smaller files or fewer files at once.'
//       }]);
      
//       setUploadProgress(0);
//     }
//   };

//   const resetUpload = () => {
//     // Clean up any WebSocket connections
//     cleanupWebSocket();
    
//     setFiles([]);
//     setUploadStatus(null);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadProgress(0);
//     setSessionId('');
//     setProcessingStatus('');
//     setCurrentDocName('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//           {/* Header with navigation and signout */}
//           <header className="bg-white shadow-md">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex justify-between items-center py-4">
//                 <div className="flex items-center">
//                   <FileText className="h-8 w-8 text-blue-600 mr-3" />
//                   <div>
//                     <h1 className="text-xl font-bold text-gray-900">LC Document Portal</h1>
//                     <p className="text-sm text-gray-500">LC Documents Management</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleSignOut}
//                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </button>
//               </div>
//             </div>
//           </header>
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Swift Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload SWIFT MT700 and other LC documents for processing.
//             </p>

//             {/* File Uploader */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Documents
//               </label>
//               <FileUploader 
//                 onFilesSelected={handleFilesSelected}
//                 disabled={uploading}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//               </p>
//             </div>
            
//             {files.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
//                 <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                   {files.map((file, index) => (
//                     <li key={index} className="py-3 flex justify-between items-center">
//                       <div className="flex items-center">
//                         <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                         <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                         <span className="ml-2 text-xs text-gray-500">
//                           ({(file.size / 1024).toFixed(2)} KB)
//                         </span>
//                       </div>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="text-sm text-red-600 hover:text-red-800"
//                         disabled={uploading}
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
            
//             {uploading && (
//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-900 mb-1">
//                   {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                   processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                 </h3>
//                 {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div> */}
//                 <div className="mt-1 flex justify-between items-center">
//                   <p className="text-xs text-gray-500">
//                     {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                   </p>
//                   {/* <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p> */}
//                 </div>
//                 {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                   <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                 )}
                
//                 {/* Display processed files during upload */}
//                 {processedFiles.length > 0 && (
//                   <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                     <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                     <ul className="mt-1 list-none text-xs text-gray-600">
//                       {processedFiles.map((file, index) => (
//                         <li key={index} className="py-1 flex justify-between">
//                           <span>{file.name}</span>
//                           <span className={file.error ? "text-red-600" : "text-green-600"}>
//                             {file.error ? "Error" : file.status}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}

  
//             {/* Success message display - keep it on the same screen */}
//             {uploadStatus === 'success' && (
//               <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex">
//                   <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                   <div className="text-sm text-green-700">
//                     <p className="font-medium">Upload Complete</p>
//                     <p className="mt-1">Your documents have been processed.</p>
//                     {sessionId && (
//                       <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                     )}
                    
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => !file.error).map((file, index) => (
//                             <li key={index}>
//                               {file.name} - {file.status}
//                               {file.url && (
//                                 <span className="ml-2">
//                                   (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
//                                 </span>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error message display with detailed errors in dropdown */}
//             {errors.length > 0 && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex">
//                   <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                   <div className="text-sm text-red-700 w-full">
//                     <p className="font-medium">Some Files Failed</p>
//                     <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                    
//                     {/* Display failed files if any */}
//                     {processedFiles.filter(file => file.error).length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Failed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.filter(file => file.error).map((file, index) => (
//                             <li key={index} className="text-red-700">
//                               {file.name} - {file.status}
//                               {file.error && <span className="ml-1">({file.error})</span>}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {/* Always show error dropdown if there are errors */}
//                     <div className="mt-4">
//                       <ErrorDropdown errors={errors} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
                            
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={resetUpload}
//                 className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading}
//               >
//                 {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleUpload}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 disabled={uploading || files.length === 0}
//               >
//                 {uploading ? 'Processing...' : 'Upload Documents'}
//               </button>
//             </div>
       
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LCSwiftDocsUploader;



import React, { useState, useEffect, useRef } from 'react';
import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader, Shield, Upload, Cpu, X } from 'lucide-react';
import FileUploader from '../swift/FileUploader';
import ErrorDropdown from '../swift/ErrorDropdown';


const LCSwiftDocsUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [processingStatus, setProcessingStatus] = useState(''); // 'processing', 'completed', 'in-progress' etc.
  const [currentDocName, setCurrentDocName] = useState('');
  const [unsupportedFileError, setUnsupportedFileError] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);
  
  // Reference to store the WebSocket connection
  const socketRef = useRef(null);
  
  // Reference to store the reconnection attempt timeout
  const reconnectTimeoutRef = useRef(null);
  
  // Track reconnection attempts
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Clean up the WebSocket when component unmounts
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);

  const cleanupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const handleSignOut = () => {
    // Clear auth tokens
    localStorage.removeItem('access_token');
    
    // Redirect to login page
    window.location.href = '/';
  };

  const handleFilesSelected = (selectedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    // Clear previous errors when new files are selected
    if (uploadStatus === 'error') {
      setUploadStatus(null);
      setErrors([]);
      setErrorMessage('');
      setUnsupportedFileError(null);
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Handle processing status and errors in WebSocket responses
const handleProcessingResponse = (data) => {
  console.log('Processing response:', data);
  
  // CRITICAL FIX: Never update upload progress from WebSocket once upload is complete
  // The WebSocket sends processing progress, not upload progress
  // Upload progress should stay at 100% once files are uploaded
  
  // Handle progress object with file information (but don't update upload progress)
  if (data.progress && typeof data.progress === 'object') {
    // Update current document name
    if (data.progress.Doc_name) {
      setCurrentDocName(data.progress.Doc_name);
      
      // Store processed file information
      if (data.progress.processing_status && data.progress.Doc_name) {
        // Check if this file is already in the processed files array
        const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
        if (!fileExists) {
          let isError = false;
          let errorText = null;
          
          // Check if the processing_error field indicates an actual error
          if (data.progress.processing_error && 
              !data.progress.processing_error.startsWith("Read done for file")) {
            isError = true;
            errorText = data.progress.processing_error;
          }
          
          const newProcessedFile = {
            name: data.progress.Doc_name,
            status: isError ? "Error" : data.progress.processing_status,
            error: errorText,
            url: data.progress.doc_url || null
          };
          
          setProcessedFiles(prev => [...prev, newProcessedFile]);
          
          // If this file has an error, add it to the errors array for ErrorDropdown
          if (isError) {
            const errorMessage = errorText || 'Unknown error';
            
            // Add to errors array
            setErrors(prevErrors => [
              ...prevErrors,
              {
                id: Date.now().toString(),
                fileName: data.progress.Doc_name || 'Unknown file',
                name: 'Processing Error',
                description: errorMessage,
                lineNumber: null,
                lineContent: null,
                suggestion: errorMessage.includes("Unsupported File type") 
                  ? `The file type "${errorMessage.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
                  : 'Please check the file format and try again with supported file types.'
              }
            ]);
            
            // Set upload status to error as soon as we encounter any error
            setUploadStatus('error');
            setErrorMessage('One or more files failed to process. See details below.');
            
            // Update unsupported file error state if applicable
            if (errorMessage.includes("Unsupported File type")) {
              setUnsupportedFileError({
                fileName: data.progress.Doc_name,
                fileType: errorMessage.split(" ").pop()
              });
            }
          }
        }
      }
    }
    
    // DO NOT update upload progress from WebSocket data - it should stay at 100%
  }

  // Handle the WebSocket response format you're receiving
  if (data.doc_name && data.processing_status) {
    setCurrentDocName(data.doc_name);
    
    // Check if this file is already in the processed files array
    const fileExists = processedFiles.some(file => file.name === data.doc_name);
    
    if (!fileExists) {
      let isError = false;
      let errorText = null;
      
      // Check if processing_status is "error" or if there's a processing_error
      if (data.processing_status === 'error' || 
          (data.processing_error && !data.processing_error.startsWith("Read done for file"))) {
        isError = true;
        errorText = data.processing_error || 'Processing failed';
      }
      
      const newProcessedFile = {
        name: data.doc_name,
        status: isError ? "Error" : data.processing_status,
        error: errorText,
        url: data.doc_url || null
      };
      
      setProcessedFiles(prev => [...prev, newProcessedFile]);
      
      // If this file has an error, add it to the errors array
      if (isError) {
        const errorMessage = errorText || 'Unknown error';
        
        setErrors(prevErrors => [
          ...prevErrors,
          {
            id: `${Date.now()}-${data.doc_name}`,
            fileName: data.doc_name || 'Unknown file',
            name: 'Processing Error',
            description: errorMessage,
            lineNumber: null,
            lineContent: null,
            suggestion: errorMessage.includes("already processed") || errorMessage.includes("already exists")
              ? 'This document or amendment already exists in the system. Please check if this is a duplicate upload.'
              : errorMessage.includes("Unsupported File type") 
                ? `The file type is not supported. Please upload documents in a supported format.`
                : 'Please check the file format and try again with supported file types.'
          }
        ]);
        
        // Set upload status to error
        setUploadStatus('error');
        setErrorMessage('One or more files failed to process. See details below.');
      }
    }
  }
  
  // Update processing status
  if (data.status) {
    setProcessingStatus(data.status);
  }
  
  // Check if processing has completed
  if (data.status === 'completed') {
    cleanupWebSocket();
    setUploading(false);
    
    // Check if any files have errors
    const hasErrors = errors.length > 0 || processedFiles.some(file => file.status === "Error");
    
    // Always set success status when processing completes
    setUploadStatus('success');
    
    // If we have errors, also set error message
    if (hasErrors) {
      setErrorMessage('One or more files failed to process. See details below.');
    }
    
    return true; // Completed
  }
  
  return false; // Not completed yet
};

// Additional fix: Make sure upload progress stays at 100% in the UI
// Add this check in the component render or create a computed value:

const displayUploadProgress = uploadComplete ? 100 : uploadProgress;
  
  // Function to start WebSocket connection for monitoring progress
  const startWebSocketMonitoring = (id) => {
    // Reset reconnection attempts
    reconnectAttemptsRef.current = 0;
    
    // Close existing WebSocket if one exists
    cleanupWebSocket();
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create a WebSocket URL with authentication token as a query parameter
      const wsUrl = `wss://192.168.18.132:50013/lc/ws/progress/${id}?token=${encodeURIComponent(token)}`;
      const socket = new WebSocket(wsUrl);
      
      // Store the socket in the ref
      socketRef.current = socket;
      
      // Handle WebSocket events
      socket.onopen = () => {
        console.log('WebSocket connection established');
        // Reset reconnection attempts on successful connection
        reconnectAttemptsRef.current = 0;
      };
      
      socket.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          handleProcessingResponse(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't attempt to reconnect on error - let onclose handle it
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket connection closed with code:', event.code);
        
        // If we're still uploading and haven't exceeded max reconnection attempts, try to reconnect
        if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`Attempting to reconnect WebSocket in ${reconnectDelay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            startWebSocketMonitoring(id);
          }, reconnectDelay);
        } else if (uploading) {
          // If we've exceeded reconnection attempts but are still uploading,
          // set an error state
          setUploading(false);
          setUploadStatus('error');
          setErrorMessage('Connection to server lost. Please try again.');
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setUploading(false);
      setUploadStatus('error');
      setErrorMessage(`WebSocket connection error: ${error.message}`);
    }
  };

  // Function to manually check progress via REST API
  const checkProgressManually = async (id) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`https://192.168.18.132:50013/lc/progress/${id}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Progress check response:', data);
      
      // Process the data the same way we process WebSocket messages
      handleProcessingResponse(data);
      
      // If processing is not complete and we're still uploading, schedule another check
      if (data.status !== 'completed' && uploading) {
        setTimeout(() => checkProgressManually(id), 3000); // Check every 3 seconds
      }
      
    } catch (error) {
      console.error('Error checking progress:', error);
      // If we're still uploading, schedule another check despite the error
      if (uploading) {
        setTimeout(() => checkProgressManually(id), 5000); // Retry after 5 seconds
      }
    }
  };

const handleUpload = async () => {
  if (files.length === 0) {
    setErrorMessage('Please select at least one document to upload');
    setUploadStatus('error');
    return;
  }

  setUploading(true);
  setUploadProgress(0);
  setUploadComplete(false);
  setErrorMessage('');
  setErrors([]);
  setUploadStatus(null);
  setProcessingStatus('initializing');
  setCurrentDocName('');
  setSessionId(''); // Clear any previous session ID
  setUnsupportedFileError(null);
  setProcessedFiles([]);

  // Clean up any existing WebSocket connection
  cleanupWebSocket();

  try {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    // Create FormData object for the API request
    const formData = new FormData();
    
    // Append each file to the FormData
    files.forEach(file => {
      formData.append('files', file);
    });

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 95) {
        progress = 95;
      }
      setUploadProgress(Math.min(progress, 95));
    }, 200);

    // Make the API request to upload the files with token in authorization header
    const response = await fetch(`https://192.168.18.132:50013/lc/upload_docs/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    clearInterval(uploadInterval);
    setUploadProgress(100);
    setUploadComplete(true);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upload response:', data);
    
    // Set the session ID from the response
    const newSessionId = data.session_id;
    setSessionId(newSessionId);
    setProcessingStatus('processing');
    
    // Start WebSocket monitoring
    startWebSocketMonitoring(newSessionId);
    
    // Also start a backup progress checking mechanism using REST API
    // This will run in parallel with the WebSocket
    checkProgressManually(newSessionId);
    
    // Safety timeout to prevent hanging UI (5 minutes)
    setTimeout(() => {
      // Only set error if we're still uploading after timeout
      if (uploading) {
        cleanupWebSocket();
        setUploading(false);
        setUploadStatus('error');
        setErrorMessage('Processing timed out. Please check the status manually.');
      }
    }, 300000);
    
  } catch (error) {
    console.error('Upload error:', error);
    
    setUploading(false);
    setUploadComplete(false);
    setUploadStatus('error');
    
    // Handle errors
    if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
      setErrorMessage('Network error. Please check your connection and try again.');
    } else if (error.message.includes('Authentication token')) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage(`Error uploading documents: ${error.message}`);
    }
    
    setErrors([{
      id: '1',
      fileName: 'Upload Error',
      name: 'Upload Failed',
      description: error.message || 'An unexpected error occurred during file upload.',
      lineNumber: null,
      lineContent: null,
      suggestion: 'Please try again with smaller files or fewer files at once.'
    }]);
    
    setUploadProgress(0);
  }
};

  const resetUpload = () => {
    // Clean up any WebSocket connections
    cleanupWebSocket();
    
    setFiles([]);
    setUploadStatus(null);
    setErrorMessage('');
    setErrors([]);
    setUploadProgress(0);
    setUploadComplete(false);
    setSessionId('');
    setProcessingStatus('');
    setCurrentDocName('');
    setUnsupportedFileError(null);
    setProcessedFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="w-full px-8 xl:px-16">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Compy Trade</h1>
                <p className="text-xs text-gray-400">LC Document Portal</p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-8 xl:px-16 py-5">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-sans font-medium text-white tracking-tight">
            Upload LC Swift Documents
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload SWIFT MT700 and other LC documents for processing with enterprise-grade security
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          {/* Main Upload Panel */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
              
              {/* Document Upload Section */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-5">
                  <Upload className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-white">Document Upload</h4>
                </div>

                {/* FileUploader Component */}
                <div className="mb-6">
                  <FileUploader 
                    onFilesSelected={handleFilesSelected}
                    disabled={uploading}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center text-cyan-400 text-xs font-medium mb-3">
                      <FileText className="h-3 w-3 mr-2" />
                      Selected Documents ({files.length})
                    </div>
                    
                    <div className="bg-gray-700/20 backdrop-blur-sm rounded-lg border border-gray-600/50 overflow-hidden">
                      <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        {files.map((file, index) => (
                          <div 
                            key={`${file.name}_${file.size}_${index}`} 
                            className="group flex items-center justify-between px-3 py-2 hover:bg-gray-700/30 transition-all duration-200 border-b border-gray-600/30 last:border-b-0"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="h-3 w-3 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-xs font-medium truncate max-w-xs" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              disabled={uploading}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded transition-all duration-200 disabled:opacity-30"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-800/20 border-t border-gray-600/30">
                        Showing all {files.length} files • Scroll to view more
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
  <div className="mb-6 space-y-4">
    {/* Upload Progress Bar */}
    <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Upload className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">File Upload Progress</span>
        </div>
        <span className="text-sm font-bold text-blue-300">
          {/* Use computed progress that stays at 100% once upload is complete */}
          {Math.round(uploadComplete ? 100 : uploadProgress)}%
        </span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out ${
            uploadComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          style={{ width: `${uploadComplete ? 100 : uploadProgress}%` }}
        ></div>
      </div>
      <div className="text-xs text-blue-300">
        {uploadComplete ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-400" />
            <span>All files uploaded successfully</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading files...</span>
          </div>
        )}
      </div>
    </div>

                    {/* Processing Progress Bar - Only show after upload is complete */}
                    {uploadComplete && (
                      <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Cpu className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">Document Processing Progress</span>
                          </div>
                        </div>

                        <div className="text-xs text-purple-300 mb-3">
                          {currentDocName && (
                            <div className="flex items-center space-x-2">
                              {(processingStatus === 'processing' || processingStatus === 'in-progress') && (
                                <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                              )}
                              {processingStatus === 'completed' && (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              )}
                              <span>Processing: {currentDocName}</span>
                            </div>
                          )}
                          {/* {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
                            <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
                          )} */}
                        </div>

                        {/* Processing Statistics */}
                        {(processingStatus === 'in-progress' || processingStatus === 'completed' || processingStatus === 'processing') && processedFiles.length > 0 && (
                          <div className="p-3 bg-gray-800/40 rounded-lg border border-purple-500/20">
                            <h5 className="text-xs font-medium text-purple-300 mb-2">
                              Processing Status: {processedFiles.length} files
                            </h5>
                            <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                              <ul className="text-xs space-y-1">
                                {processedFiles.map((file, index) => (
                                  <li key={index} className="flex justify-between items-center py-1">
                                    <span className="truncate max-w-xs text-gray-300" title={file.name}>
                                      {file.name}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      file.error ? 
                                        "bg-red-500/20 text-red-300" : 
                                        file.status === 'completed' ? 
                                          "bg-green-500/20 text-green-300" : 
                                          "bg-yellow-500/20 text-yellow-300"
                                    }`}>
                                      {file.error ? "Error" : file.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Show remaining files to be processed */}
                        {(processingStatus === 'processing' || processingStatus === 'in-progress') && processedFiles.length < files.length && (
                          <div className="mt-2 text-xs text-purple-400">
                            Remaining: {files.length - processedFiles.length} files
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Success Message */}
                {uploadStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-green-300 mb-1">Upload Complete!</h3>
                        <p className="text-green-400 text-sm mb-3">Your documents have been processed successfully.</p>
                        {sessionId && (
                          <p className="mt-1 font-mono text-xs text-green-400">Session ID: {sessionId}</p>
                        )}

                        {/* Successfully Processed Files */}
                        {processedFiles.filter(file => !file.error).length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-green-300 mb-2">Processed Files:</h4>
                            <ul className="space-y-1">
                              {processedFiles.filter(file => !file.error).map((file, index) => (
                                <li key={index} className="flex items-center justify-between py-1">
                                  <span className="text-green-400 text-sm">{file.name} - {file.status}</span>
                                  {file.url && (
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors underline">
                                      View
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Messages using ErrorDropdown component */}
                {errors.length > 0 && (
                  <div className="mb-6">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="w-full">
                          <h3 className="text-sm font-semibold text-red-300 mb-1">Some Files Failed</h3>
                          <p className="text-red-400 text-sm mb-3">{errorMessage || "One or more files failed to process. See details below."}</p>
                          
                          {/* Display failed files if any */}
                          {processedFiles.filter(file => file.error).length > 0 && (
                            <div className="mt-3 mb-4">
                              <p className="font-medium text-red-300 text-sm mb-2">Failed Files:</p>
                              <ul className="space-y-1">
                                {processedFiles.filter(file => file.error).map((file, index) => (
                                  <li key={index} className="text-red-400 text-sm">
                                    {file.name} - {file.status}
                                    {file.error && <span className="ml-1">({file.error})</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Error dropdown */}
                          <ErrorDropdown errors={errors} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Error Messages */}
                {uploadStatus === 'error' && errorMessage && !errors.length && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <p className="text-red-300 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Unsupported File Error */}
                {unsupportedFileError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <p className="text-red-300 text-sm">
                        Unsupported file type detected: {unsupportedFileError.fileName} ({unsupportedFileError.fileType})
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={resetUpload}
                    disabled={uploading}
                    className="px-5 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:border-gray-500 hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 disabled:opacity-50"
                  >
                    {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Processing...' : 'Upload Documents'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Security Card */}
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Bank-grade 256-bit encryption with multi-layer security protocols</p>
            </div>

            {/* Performance Card */}
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Optimized uploads with real-time processing and validation</p>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-5 text-white">
              <h3 className="text-base font-semibold mb-2">Need Help?</h3>
              <p className="text-purple-100 text-xs mb-3">Our support team is available 24/7 to assist you</p>
              <button className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-gray-800/30 backdrop-blur-lg border-t border-gray-700/50 mt-auto">
        <div className="w-full px-8 xl:px-16 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} LC Comply Trade
              </p>
            </div>
            {/* <div className="flex space-x-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LCSwiftDocsUploader;