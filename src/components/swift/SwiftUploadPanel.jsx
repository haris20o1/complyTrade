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




import React, { useState, useEffect, useRef } from 'react';
import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
import FileUploader from '../swift/FileUploader';
import ErrorDropdown from '../swift/ErrorDropdown';

const LCSwiftDocsUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
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
    // Update current document name
    console.log(data);
    if (data.progress && data.progress.Doc_name) {
      setCurrentDocName(data.progress.Doc_name);
      
      // Store processed file information
      if (data.progress.processing_status && data.progress.Doc_name) {
        // Check if this file is already in the processed files array
        const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
        if (!fileExists) {
          let isError = false;
          let errorText = null;
          
          // Check if the processing_error field indicates an actual error
          // The API is sending "Read Done for file X.pdf" in processing_error even on success
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
    
    // Update progress based on file index and total
    if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
      // Calculate progress percentage
      const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
      setUploadProgress(progressPercentage);
    }
    
    // Update processing status
    if (data.status) {
      setProcessingStatus(data.status);
    }
    
    // Check if processing has completed
    if (data.status === 'completed') {
      setUploadProgress(100);
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
      const wsUrl = `wss://192.168.18.152:50013/lc/ws/progress/${id}?token=${encodeURIComponent(token)}`;
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
      
      const response = await fetch(`https://192.168.18.152:50013/lc/progress/${id}`, {
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

      // Make the API request to upload the files with token in authorization header
      const response = await fetch(`https://192.168.18.152:50013/lc/upload_docs/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

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
    setSessionId('');
    setProcessingStatus('');
    setCurrentDocName('');
    setUnsupportedFileError(null);
    setProcessedFiles([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
          {/* Header with navigation and signout */}
          <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">LC Document Portal</h1>
                    <p className="text-sm text-gray-500">LC Documents Management</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      
            <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Swift Documents</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload SWIFT MT700 and other LC documents for processing.
            </p>

            {/* File Uploader */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Documents
              </label>
              <FileUploader 
                onFilesSelected={handleFilesSelected}
                disabled={uploading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                        disabled={uploading}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {uploading && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {processingStatus === 'in-progress' ? 'Processing Documents...' : 
                  processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
                  </p>
                  <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
                </div>
                {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
                  <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
                )}
                
                {/* Display processed files during upload */}
                {processedFiles.length > 0 && (
                  <div className="mt-3 bg-gray-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-gray-700">Processed Files:</p>
                    <ul className="mt-1 list-none text-xs text-gray-600">
                      {processedFiles.map((file, index) => (
                        <li key={index} className="py-1 flex justify-between">
                          <span>{file.name}</span>
                          <span className={file.error ? "text-red-600" : "text-green-600"}>
                            {file.error ? "Error" : file.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

  
            {/* Success message display - keep it on the same screen */}
            {uploadStatus === 'success' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium">Upload Complete</p>
                    <p className="mt-1">Your documents have been processed.</p>
                    {sessionId && (
                      <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
                    )}
                    
                    {processedFiles.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium">Processed Files:</p>
                        <ul className="mt-1 list-disc list-inside text-xs">
                          {processedFiles.filter(file => !file.error).map((file, index) => (
                            <li key={index}>
                              {file.name} - {file.status}
                              {file.url && (
                                <span className="ml-2">
                                  (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
                                </span>
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

            {/* Error message display with detailed errors in dropdown */}
            {errors.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <div className="text-sm text-red-700 w-full">
                    <p className="font-medium">Some Files Failed</p>
                    <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                    
                    {/* Display failed files if any */}
                    {processedFiles.filter(file => file.error).length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium">Failed Files:</p>
                        <ul className="mt-1 list-disc list-inside text-xs">
                          {processedFiles.filter(file => file.error).map((file, index) => (
                            <li key={index} className="text-red-700">
                              {file.name} - {file.status}
                              {file.error && <span className="ml-1">({file.error})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Always show error dropdown if there are errors */}
                    <div className="mt-4">
                      <ErrorDropdown errors={errors} />
                    </div>
                  </div>
                </div>
              </div>
            )}
                            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={resetUpload}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={uploading}
              >
                {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Processing...' : 'Upload Documents'}
              </button>
            </div>
       
        </div>
      </main>
    </div>
  );
};

export default LCSwiftDocsUploader;