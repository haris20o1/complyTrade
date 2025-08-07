

// import React, { useState, useEffect, useRef } from 'react';
// import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader, Upload, Cpu } from 'lucide-react';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';
// import { validateLcNumber, uploadSupportingDocuments, getWebSocketUrl } from '../authentication/apiSupportingDocs';
// import { logoutUser } from '../authentication/auth';

// const LCSupportingDocsUploader = () => {
//   // State management
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const [uploadComplete, setUploadComplete] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const [processingStatus, setProcessingStatus] = useState('');
//   const [currentDocName, setCurrentDocName] = useState('');
//   const [unsupportedFileError, setUnsupportedFileError] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);

//   // WebSocket and reconnection refs
//   const socketRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Clean up WebSocket on unmount
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
//       // Redirect to login page is already handled in logoutUser()
//     } catch (error) {
//       console.error('Sign out error:', error);
//       // Fallback for error cases
//       localStorage.removeItem('access_token');
//       window.location.href = '/';
//     }
//   };

//   const handleLcValidation = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }

//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);

//     try {
//       const data = await validateLcNumber(lcNumber);

//       if (data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       handleLcValidation();
//     }
//   };

//   const handleFilesSelected = (selectedFiles) => {
//     const newFiles = [];
//     const duplicateFiles = [];

//     selectedFiles.forEach(newFile => {
//       // Check if file with same name already exists
//       const isDuplicate = files.some(existingFile => existingFile.name === newFile.name);

//       if (isDuplicate) {
//         duplicateFiles.push(newFile.name);
//       } else {
//         newFiles.push(newFile);
//       }
//     });

//     // Add only non-duplicate files
//     if (newFiles.length > 0) {
//       setFiles(prevFiles => [...prevFiles, ...newFiles]);
//     }

//     // Show warning for duplicates
//     if (duplicateFiles.length > 0) {
//       setErrorMessage(
//         `File${duplicateFiles.length > 1 ? 's' : ''} already selected: ${duplicateFiles.join(', ')}`
//       );
//       setUploadStatus('warning');

//       // Clear warning after 5 seconds
//       setTimeout(() => {
//         if (uploadStatus === 'warning') {
//           setErrorMessage('');
//           setUploadStatus(null);
//         }
//       }, 5000);
//     } else {
//       // Clear previous errors only if no duplicates
//       if (uploadStatus === 'error') {
//         setUploadStatus(null);
//         setErrors([]);
//         setErrorMessage('');
//         setUnsupportedFileError(null);
//       }
//     }
//   };

//   // const removeFile = (index) => {
//   //   setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   // };
//   const removeFile = (indexToRemove) => {
//   setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
// };

//   // WebSocket processing response handler

// // Smooth progress simulation timer
// const progressTimerRef = useRef(null);


// // Updated WebSocket processing response handler with accurate progress calculation
// const handleProcessingResponse = (data) => {
//   console.log('WebSocket response:', data);

//   // Handle the new API response format
//   if (data.progress !== undefined && data.status && data.lc_no) {
//     const progress = data.progress;
//     const status = data.status;
//     const processed = data.processed || 0;
//     const lastUpdate = data.last_update;

//     // Update PROCESSING progress bar with exact API progress
//     setProcessingProgress(progress);

//     // Handle different status states
//     switch (status) {
//       case 'processing':
//         setProcessingStatus('processing');
//         setCurrentDocName('Starting document processing...');
//         break;

//       case 'in-progress':
//         setProcessingStatus('in-progress');

//         // Show processing details if available
//         if (lastUpdate && lastUpdate.doc_path) {
//           const docTitle = lastUpdate.doc_title || lastUpdate.doc_name || `Document ${processed}`;
//           setCurrentDocName(`Processing: ${docTitle} (${processed} completed)`);
//         } else {
//           setCurrentDocName(`Processing documents... (${processed} completed)`);
//         }

//         // Update processed files list
//         if (lastUpdate && lastUpdate.status === 'completed' && processed > 0) {
//           setProcessedFiles(prevFiles => {
//             const docPath = lastUpdate.doc_path;
//             const fileExists = prevFiles.some(file => file.path === docPath);

//             if (!fileExists && docPath) {
//               return [...prevFiles, {
//                 name: lastUpdate.doc_title || lastUpdate.doc_name || `Document ${processed}`,
//                 status: lastUpdate.status,
//                 path: docPath,
//                 error: null
//               }];
//             }
//             return prevFiles;
//           });
//         }
//         break;

//       case 'completed':
//         setProcessingStatus('completed');
//         setCurrentDocName('Processing complete');
//         setProcessingProgress(100); // Ensure processing reaches 100%

//         // Finalize the upload process
//         setTimeout(() => {
//           cleanupWebSocket();
//           setUploading(false);
//           setUploadStatus('success');

//           setProcessedFiles(prevFiles => {
//             const hasErrors = prevFiles.some(file => file.status === "Error" || file.error);
//             if (hasErrors) {
//               setErrorMessage('One or more files failed to process. See details below.');
//             }
//             return prevFiles;
//           });
//         }, 500);
//         break;

//       case 'error':
//         setProcessingStatus('error');
//         setCurrentDocName('Processing failed');
//         setUploading(false);
//         setUploadStatus('error');
//         setErrorMessage('Document processing failed. Please try again.');
//         cleanupWebSocket();
//         break;

//       default:
//         console.log('Unknown status:', status);
//     }

//     return true;
//   }

//   // Fallback for error handling
//   if (data.error) {
//     setErrors(prevErrors => [
//       ...prevErrors,
//       {
//         id: Date.now().toString(),
//         fileName: data.fileName || 'Unknown file',
//         name: 'Processing Error',
//         description: data.error,
//         lineNumber: null,
//         lineContent: null,
//         suggestion: 'Please check the file format and try again.'
//       }
//     ]);

//     setUploadStatus('error');
//     setErrorMessage('One or more files failed to process.');
//   }

//   return false;
// };

//   // WebSocket monitoring function
//   const startWebSocketMonitoring = (id) => {
//     reconnectAttemptsRef.current = 0;
//     cleanupWebSocket();

//     try {
//       const wsUrl = getWebSocketUrl(id);
//       const socket = new WebSocket(wsUrl);
//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         reconnectAttemptsRef.current = 0;
//       };

//       socket.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           handleProcessingResponse(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };

//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//       socket.onclose = (event) => {
//         console.log('WebSocket connection closed with code:', event.code);

//         if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);

//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttemptsRef.current++;
//             startWebSocketMonitoring(id);
//           }, reconnectDelay);
//         } else if (uploading) {
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

// // Updated handleUpload with immediate UI feedback
//  const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await handleLcValidation();
//       if (!isValid) return;
//     }

//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
//       setUploadStatus('error');
//       return;
//     }

//     // Set UI state immediately - no delays
//     setUploading(true);
//     setUploadProgress(1); // Start at 1% immediately
//     setProcessingProgress(0);
//     setUploadComplete(false);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);
//     setProcessingStatus('starting');
//     setCurrentDocName('Initializing upload...');
//     setSessionId('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);

//     cleanupWebSocket();

//     try {
//       // Small delay to let UI update, then start processing
//       setTimeout(async () => {
//         setCurrentDocName('Starting file processing...');

//         const data = await uploadSupportingDocuments(lcNumber, files, (progressData) => {
//           const { fileName, fileProgress, overallProgress, status, completedFiles } = progressData;

//           // Update UPLOAD progress bar with overall progress
//           setUploadProgress(Math.max(1, Math.round(overallProgress))); // Never go below 1%

//           // Update current status
//           if (status === 'starting') {
//             setProcessingStatus('preparing');
//             setCurrentDocName(`Preparing: ${fileName}`);
//           } else if (status === 'compressing') {
//             setProcessingStatus('compressing');
//             setCurrentDocName(`Compressing: ${fileName}`);
//           } else if (status === 'uploading') {
//             setProcessingStatus('uploading');
//             setCurrentDocName(`Uploading: ${fileName} (${Math.round(fileProgress)}%) - ${completedFiles}/${files.length} files`);
//           } else if (status === 'processing') {
//             setProcessingStatus('uploaded');
//             setCurrentDocName(`Upload complete. Processing ${completedFiles} files...`);
//             setUploadComplete(true);
//             setUploadProgress(100);
//           }
//         });

//         const newSessionId = data.session_id;
//         setSessionId(newSessionId);
//         setProcessingStatus('uploaded');
//         setCurrentDocName('All files uploaded, processing started...');
//         setUploadComplete(true);
//         setUploadProgress(100);

//         // Start WebSocket monitoring
//         startWebSocketMonitoring(newSessionId);

//         // Safety timeout
//         const timeoutDuration = Math.max(300000, files.length * 30000);
//         setTimeout(() => {
//           if (uploading && processingStatus !== 'completed') {
//             cleanupWebSocket();
//             setUploading(false);
//             setUploadStatus('error');
//             setErrorMessage('Processing timeout. Please check the status manually.');
//           }
//         }, timeoutDuration);
//       }, 50); // Very small delay just to let UI render

//     } catch (error) {
//       console.error('Upload error:', error);

//       setUploading(false);
//       setUploadStatus('error');

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
//       setProcessingProgress(0);
//     }
//   };


//   const resetUpload = () => {
//   cleanupWebSocket();

//   setFiles([]);
//   setUploadStatus(null);
//   setErrorMessage('');
//   setErrors([]);
//   setUploadProgress(0);
//   setProcessingProgress(0);
//   setUploadComplete(false);
//   setSessionId('');
//   setProcessingStatus('');
//   setCurrentDocName('');
//   setUnsupportedFileError(null);
//   setProcessedFiles([]);
// };

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
//                 <p className="text-sm text-gray-500">Supporting Documents Management</p>
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

//       {/* Main content area */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-6">Upload LC Supporting Documents</h2>

//           {/* LC Number Validation Section */}
//           <div className="max-w-xl mb-8">
//             <label htmlFor="lcNumber" className="block text-lg font-medium text-gray-700 mb-1">
//               LC Number
//             </label>
//             <div className="relative mt-1">
//               <input
//                 type="text"
//                 id="lcNumber"
//                 name="lcNumber"
//                 value={lcNumber}
//                 onChange={handleLcNumberChange}
//                 onBlur={handleLcBlur}
//                 disabled={uploading || lcValidating}
//                 placeholder="Enter LC Number"
//                 className={`peer block w-full rounded-xl border px-4 py-2 pr-10 text-sm shadow-sm transition-all
//                   placeholder-gray-400 focus:outline-none
//                   ${lcValidationError ? 'border-red-400 text-red-700 focus:ring-red-500 focus:border-red-500' :
//                     lcValidated ? 'border-green-400 text-green-700 focus:ring-green-500 focus:border-green-500' :
//                     'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
//                   ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
//                 `}
//               />
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                 {lcValidating && <Loader className="h-5 w-5 text-gray-400 animate-spin" />}
//                 {lcValidated && !lcValidating && <CheckCircle className="h-5 w-5 text-green-500" />}
//                 {lcValidationError && !lcValidating && <AlertTriangle className="h-5 w-5 text-red-500" />}
//               </div>
//             </div>

//             {lcValidationError && (
//               <p className="mt-2 text-sm text-red-600">{lcValidationError}</p>
//             )}

//             {lcValidated && (
//               <p className="mt-2 text-sm text-green-600">LC Number validated successfully</p>
//             )}

//             {!lcValidated && !lcValidating && (
//               <button
//                 type="button"
//                 onClick={handleLcValidation}
//                 className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Validate LC Number
//               </button>
//             )}
//           </div>

//           {/* Same UI components as before - Document Upload Section, File List, Progress Indicators, etc. */}
//           {/* Document Upload Section (only shown after LC validation) */}
//           {lcValidated && (
//             <div className="mt-8">
//               <h3 className="text-md font-medium text-gray-700 mb-3">Supporting Documents</h3>

//               <FileUploader 
//                 onFilesSelected={handleFilesSelected}
//                 disabled={uploading}
//               />

//               {/* Selected Files List */}
//              {files.length > 0 && (
//   <div className="mt-6">
//     <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Documents ({files.length})</h4>
//     <div className="bg-gray-50 rounded-md border border-gray-200">
//       <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//         {files.map((file, index) => (
//           <li key={`${file.name}_${file.size}_${index}`} className="px-4 py-3 flex justify-between items-center hover:bg-gray-100">
//             <div className="flex items-center">
//               <FileText className="h-5 w-5 text-blue-500 mr-2" />
//               <span className="text-sm font-medium text-gray-900">{file.name}</span>
//               <span className="ml-2 text-xs text-gray-500">
//                 ({(file.size / 1024).toFixed(2)} KB)
//               </span>
//             </div>
//             <button
//               onClick={() => removeFile(index)}
//               disabled={uploading}
//               className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-400"
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// )}
// {/* <FileUploader 
//   onFilesSelected={handleFilesSelected}
//   disabled={uploading}
// /> */}

//               {/* Upload Progress */}
//             {uploading && (
//   <div className="mt-6 space-y-4">
//     {/* Upload Progress Bar */}
//     <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
//       <div className="flex justify-between items-center mb-2">
//         <div className="flex items-center">
//           <Upload className="h-4 w-4 text-blue-600 mr-2" />
//           <h4 className="text-sm font-medium text-blue-800">
//             File Upload Progress
//           </h4>
//         </div>
//         <span className="text-sm font-medium text-blue-800">
//           {Math.round(uploadProgress)}%
//         </span>
//       </div>

//       <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//         <div 
//           className={`h-3 rounded-full transition-all duration-300 ease-out ${
//             uploadComplete ? 'bg-green-500' : 'bg-blue-500'
//           }`}
//           style={{ width: `${uploadProgress}%` }}
//         ></div>
//       </div>

//       <div className="text-xs text-blue-700">
//         {uploadComplete ? (
//           <div className="flex items-center">
//             <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
//             <span>All files uploaded successfully</span>
//           </div>
//         ) : (
//           <div className="flex items-center">
//             <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
//             <span>Uploading files in chunks...</span>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Processing Progress Bar - Only show after upload is complete */}
//     {uploadComplete && (
//       <div className="bg-purple-50 rounded-md p-4 border border-purple-100">
//         <div className="flex justify-between items-center mb-2">
//           <div className="flex items-center">
//             <Cpu className="h-4 w-4 text-purple-600 mr-2" />
//             <h4 className="text-sm font-medium text-purple-800">
//               Document Processing Progress
//             </h4>
//           </div>
//           {/* <span className="text-sm font-medium text-purple-800">
//             {Math.round(processingProgress)}%
//           </span> */}
//         </div>

//         {/* <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//           <div 
//             className={`h-3 rounded-full transition-all duration-300 ease-out ${
//               processingStatus === 'error' ? 'bg-red-500' : 
//               processingStatus === 'completed' ? 'bg-green-500' : 
//               'bg-purple-600'
//             }`}
//             style={{ width: `${processingProgress}%` }}
//           ></div>
//         </div> */}

//         <div className="text-xs text-purple-700">
//           {currentDocName && (
//             <div className="flex items-center">
//               {processingStatus === 'in-progress' && (
//                 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
//               )}
//               {processingStatus === 'completed' && (
//                 <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
//               )}
//               <span>{currentDocName}</span>
//             </div>
//           )}
//         </div>

//         {/* Processing Statistics */}
//         {(processingStatus === 'in-progress' || processingStatus === 'completed') && processedFiles.length > 0 && (
//           <div className="mt-3 p-3 bg-white rounded border border-purple-200">
//             <h5 className="text-xs font-medium text-purple-800 mb-2">
//               Processing Status: {processedFiles.length} files
//             </h5>
//             <div className="max-h-32 overflow-y-auto">
//               <ul className="text-xs space-y-1">
//                 {processedFiles.map((file, index) => (
//                   <li key={index} className="flex justify-between items-center py-1">
//                     <span className="truncate max-w-xs" title={file.name}>
//                       {file.name}
//                     </span>
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${
//                       file.error ? 
//                         "bg-red-100 text-red-700" : 
//                         file.status === 'completed' ? 
//                           "bg-green-100 text-green-700" : 
//                           "bg-yellow-100 text-yellow-700"
//                     }`}>
//                       {file.error ? "Error" : file.status}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Show remaining files to be processed */}
//         {processingStatus === 'in-progress' && processedFiles.length < files.length && (
//           <div className="mt-2 text-xs text-purple-600">
//             Remaining: {files.length - processedFiles.length} files
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// )}

//               {/* Success Message */}
//               {uploadStatus === 'success' && (
//                 <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                   <div className="flex">
//                     <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-green-800">Upload Complete</h3>
//                       <div className="mt-2 text-sm text-green-700">
//                         <p>Your documents have been processed successfully.</p>
//                         {/* {sessionId && (
//                           <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                         )} */}
//                       </div>

//                       {/* Successfully Processed Files */}
//                       {processedFiles.filter(file => !file.error).length > 0 && (
//                         <div className="mt-3">
//                           <h4 className="text-sm font-medium text-green-800">Processed Files:</h4>
//                           <ul className="mt-1 list-disc list-inside text-sm text-green-700">
//                             {processedFiles.filter(file => !file.error).map((file, index) => (
//                               <li key={index} className="flex items-center justify-between py-1">
//                                 <span>{file.name}</span>
//                                 {file.path && (
//                                   <button
//                                     onClick={() => window.open(`https://192.168.18.132:50013/supporting_docs/view/${file.path}`, '_blank')}
//                                     className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
//                                   >
//                                     View Document
//                                   </button>
//                                 )}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Error Messages */}
//               {errors.length > 0 && <ErrorDropdown errors={errors} />}

//               {/* Action Buttons */}
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={resetUpload}
//                   disabled={uploading}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
//                 >
//                   {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleUpload}
//                   disabled={uploading || files.length === 0 || uploadStatus === 'success'}
//                   className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                     uploadStatus === 'success' 
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : uploading || files.length === 0 
//                         ? 'bg-blue-300' 
//                         : 'bg-blue-600 hover:bg-blue-700'
//                   }`}
//                 >
//                   {uploading ? 'Processing...' : uploadStatus === 'success' ? 'Upload Complete' : 'Upload Documents'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-4 text-center text-sm text-gray-500">
//             &copy; {new Date().getFullYear()} Document Management System. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LCSupportingDocsUploader;













// import React, { useState, useEffect, useRef } from 'react';
// import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader, Upload, Cpu, X, Plus, Eye, Download, Cloud, Shield, Zap } from 'lucide-react';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';
// import { validateLcNumber, uploadSupportingDocuments, getWebSocketUrl } from '../authentication/apiSupportingDocs';
// import { logoutUser } from '../authentication/auth';

// const LCSupportingDocsUploader = () => {
//   // State management
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const [uploadComplete, setUploadComplete] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const [processingStatus, setProcessingStatus] = useState('');
//   const [currentDocName, setCurrentDocName] = useState('');
//   const [unsupportedFileError, setUnsupportedFileError] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);

//   // WebSocket and reconnection refs
//   const socketRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Clean up WebSocket on unmount
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
//     } catch (error) {
//       console.error('Sign out error:', error);
//       localStorage.removeItem('access_token');
//       window.location.href = '/';
//     }
//   };

//   const handleLcValidation = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }

//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);

//     try {
//       const data = await validateLcNumber(lcNumber);

//       if (data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       handleLcValidation();
//     }
//   };

//   const handleFilesSelected = (selectedFiles) => {
//     const newFiles = [];
//     const duplicateFiles = [];

//     selectedFiles.forEach(newFile => {
//       const isDuplicate = files.some(existingFile => existingFile.name === newFile.name);

//       if (isDuplicate) {
//         duplicateFiles.push(newFile.name);
//       } else {
//         newFiles.push(newFile);
//       }
//     });

//     if (newFiles.length > 0) {
//       setFiles(prevFiles => [...prevFiles, ...newFiles]);
//     }

//     if (duplicateFiles.length > 0) {
//       setErrorMessage(
//         `File${duplicateFiles.length > 1 ? 's' : ''} already selected: ${duplicateFiles.join(', ')}`
//       );
//       setUploadStatus('warning');

//       setTimeout(() => {
//         if (uploadStatus === 'warning') {
//           setErrorMessage('');
//           setUploadStatus(null);
//         }
//       }, 5000);
//     } else {
//       if (uploadStatus === 'error') {
//         setUploadStatus(null);
//         setErrors([]);
//         setErrorMessage('');
//         setUnsupportedFileError(null);
//       }
//     }
//   };

//   const removeFile = (indexToRemove) => {
//     setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
//   };

//   const progressTimerRef = useRef(null);

//   const handleProcessingResponse = (data) => {
//     console.log('WebSocket response:', data);

//     if (data.progress !== undefined && data.status && data.lc_no) {
//       const progress = data.progress;
//       const status = data.status;
//       const processed = data.processed || 0;
//       const lastUpdate = data.last_update;

//       setProcessingProgress(progress);

//       switch (status) {
//         case 'processing':
//           setProcessingStatus('processing');
//           setCurrentDocName('Starting document processing...');
//           break;

//         case 'in-progress':
//           setProcessingStatus('in-progress');

//           if (lastUpdate && lastUpdate.doc_path) {
//             const docTitle = lastUpdate.doc_title || lastUpdate.doc_name || `Document ${processed}`;
//             setCurrentDocName(`Processing: ${docTitle} (${processed} completed)`);
//           } else {
//             setCurrentDocName(`Processing documents... (${processed} completed)`);
//           }

//           if (lastUpdate && lastUpdate.status === 'completed' && processed > 0) {
//             setProcessedFiles(prevFiles => {
//               const docPath = lastUpdate.doc_path;
//               const fileExists = prevFiles.some(file => file.path === docPath);

//               if (!fileExists && docPath) {
//                 return [...prevFiles, {
//                   name: lastUpdate.doc_title || lastUpdate.doc_name || `Document ${processed}`,
//                   status: lastUpdate.status,
//                   path: docPath,
//                   error: null
//                 }];
//               }
//               return prevFiles;
//             });
//           }
//           break;

//         case 'completed':
//           setProcessingStatus('completed');
//           setCurrentDocName('Processing complete');
//           setProcessingProgress(100);

//           setTimeout(() => {
//             cleanupWebSocket();
//             setUploading(false);
//             setUploadStatus('success');

//             setProcessedFiles(prevFiles => {
//               const hasErrors = prevFiles.some(file => file.status === "Error" || file.error);
//               if (hasErrors) {
//                 setErrorMessage('One or more files failed to process. See details below.');
//               }
//               return prevFiles;
//             });
//           }, 500);
//           break;

//         case 'error':
//           setProcessingStatus('error');
//           setCurrentDocName('Processing failed');
//           setUploading(false);
//           setUploadStatus('error');
//           setErrorMessage('Document processing failed. Please try again.');
//           cleanupWebSocket();
//           break;

//         default:
//           console.log('Unknown status:', status);
//       }

//       return true;
//     }

//     if (data.error) {
//       setErrors(prevErrors => [
//         ...prevErrors,
//         {
//           id: Date.now().toString(),
//           fileName: data.fileName || 'Unknown file',
//           name: 'Processing Error',
//           description: data.error,
//           lineNumber: null,
//           lineContent: null,
//           suggestion: 'Please check the file format and try again.'
//         }
//       ]);

//       setUploadStatus('error');
//       setErrorMessage('One or more files failed to process.');
//     }

//     return false;
//   };

//   const startWebSocketMonitoring = (id) => {
//     reconnectAttemptsRef.current = 0;
//     cleanupWebSocket();

//     try {
//       const wsUrl = getWebSocketUrl(id);
//       const socket = new WebSocket(wsUrl);
//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         reconnectAttemptsRef.current = 0;
//       };

//       socket.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           handleProcessingResponse(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };

//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//       socket.onclose = (event) => {
//         console.log('WebSocket connection closed with code:', event.code);

//         if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);

//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttemptsRef.current++;
//             startWebSocketMonitoring(id);
//           }, reconnectDelay);
//         } else if (uploading) {
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

//   const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await handleLcValidation();
//       if (!isValid) return;
//     }

//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
//       setUploadStatus('error');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(1);
//     setProcessingProgress(0);
//     setUploadComplete(false);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadStatus(null);
//     setProcessingStatus('starting');
//     setCurrentDocName('Initializing upload...');
//     setSessionId('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);

//     cleanupWebSocket();

//     try {
//       setTimeout(async () => {
//         setCurrentDocName('Starting file processing...');

//         const data = await uploadSupportingDocuments(lcNumber, files, (progressData) => {
//           const { fileName, fileProgress, overallProgress, status, completedFiles } = progressData;

//           setUploadProgress(Math.max(1, Math.round(overallProgress)));

//           if (status === 'starting') {
//             setProcessingStatus('preparing');
//             setCurrentDocName(`Preparing: ${fileName}`);
//           } else if (status === 'compressing') {
//             setProcessingStatus('compressing');
//             setCurrentDocName(`Compressing: ${fileName}`);
//           } else if (status === 'uploading') {
//             setProcessingStatus('uploading');
//             setCurrentDocName(`Uploading: ${fileName} (${Math.round(fileProgress)}%) - ${completedFiles}/${files.length} files`);
//           } else if (status === 'processing') {
//             setProcessingStatus('uploaded');
//             setCurrentDocName(`Upload complete. Processing ${completedFiles} files...`);
//             setUploadComplete(true);
//             setUploadProgress(100);
//           }
//         });

//         const newSessionId = data.session_id;
//         setSessionId(newSessionId);
//         setProcessingStatus('uploaded');
//         setCurrentDocName('All files uploaded, processing started...');
//         setUploadComplete(true);
//         setUploadProgress(100);

//         startWebSocketMonitoring(newSessionId);

//         const timeoutDuration = Math.max(300000, files.length * 30000);
//         setTimeout(() => {
//           if (uploading && processingStatus !== 'completed') {
//             cleanupWebSocket();
//             setUploading(false);
//             setUploadStatus('error');
//             setErrorMessage('Processing timeout. Please check the status manually.');
//           }
//         }, timeoutDuration);
//       }, 50);

//     } catch (error) {
//       console.error('Upload error:', error);

//       setUploading(false);
//       setUploadStatus('error');

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
//       setProcessingProgress(0);
//     }
//   };

//   const resetUpload = () => {
//     cleanupWebSocket();

//     setFiles([]);
//     setUploadStatus(null);
//     setErrorMessage('');
//     setErrors([]);
//     setUploadProgress(0);
//     setProcessingProgress(0);
//     setUploadComplete(false);
//     setSessionId('');
//     setProcessingStatus('');
//     setCurrentDocName('');
//     setUnsupportedFileError(null);
//     setProcessedFiles([]);
//   };



// return (
//   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
//     {/* Header */}
//     <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
//       <div className="w-full px-8 xl:px-16">
//         <div className="flex justify-between items-center py-4">
//           <div className="flex items-center space-x-3">
//             <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
//               <FileText className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-semibold text-white">LC Document Portal</h1>
//               <p className="text-xs text-gray-400">Professional Document Management</p>
//             </div>
//           </div>

//           <button
//             onClick={handleSignOut}
//             className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
//           >
//             <LogOut className="h-4 w-4" />
//             <span>Sign Out</span>
//           </button>
//         </div>
//       </div>
//     </header>

//     {/* Main Content */}
//     <main className="flex-1 w-full px-8 xl:px-16 py-8">
//       {/* Hero Section */}
//       <div className="text-center mb-10">
//         <h2 className="text-3xl font-bold text-white mb-2">
//           Upload LC Supporting Documents
//         </h2>
//         <p className="text-gray-400 text-base max-w-2xl mx-auto">
//           Securely manage your Letter of Credit documentation with enterprise-grade security
//         </p>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

//         {/* Main Upload Panel */}
//         <div className="lg:col-span-3">
//           <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">

//             {/* LC Number Section */}
//             <div className="p-6 border-b border-gray-700/50">
//               <div className="flex items-center space-x-2 mb-4">
//                 <Shield className="h-4 w-4 text-blue-400" />
//                 <h3 className="text-lg font-semibold text-white">LC Number Verification</h3>
//               </div>

//               <div className="max-w-md">
//                 <label htmlFor="lcNumber" className="block text-sm font-medium text-gray-300 mb-2">
//                   Enter LC Number for Authentication
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="lcNumber"
//                     value={lcNumber}
//                     onChange={handleLcNumberChange}
//                     onBlur={handleLcBlur}
//                     disabled={uploading || lcValidating}
//                     placeholder="LC-2024-XXXXXXXX"
//                     className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200
//                       ${lcValidationError 
//                         ? 'border-red-500 bg-red-500/10 text-red-300 focus:ring-red-500/50' 
//                         : lcValidated 
//                           ? 'border-green-500 bg-green-500/10 text-green-300 focus:ring-green-500/50' 
//                           : 'border-gray-600 bg-gray-700/50 text-white focus:ring-blue-500/50 focus:border-blue-500'
//                       }
//                       ${uploading || lcValidating ? 'opacity-50 cursor-not-allowed' : ''}
//                       focus:outline-none focus:ring-2 placeholder-gray-500`}
//                   />

//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                     {lcValidating && (
//                       <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
//                     )}
//                     {lcValidated && !lcValidating && (
//                       <CheckCircle className="h-4 w-4 text-green-400" />
//                     )}
//                     {lcValidationError && !lcValidating && (
//                       <AlertTriangle className="h-4 w-4 text-red-400" />
//                     )}
//                   </div>
//                 </div>

//                 {lcValidationError && (
//                   <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
//                     <p className="text-red-300 text-sm flex items-center space-x-2">
//                       <AlertTriangle className="h-3 w-3" />
//                       <span>{lcValidationError}</span>
//                     </p>
//                   </div>
//                 )}

//                 {lcValidated && (
//                   <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-3 w-3 text-green-400" />
//                       <p className="text-green-300 text-sm">LC Number validated successfully</p>
//                     </div>
//                   </div>
//                 )}

//                 {!lcValidated && !lcValidating && lcNumber && (
//                   <button
//                     onClick={handleLcValidation}
//                     className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
//                   >
//                     Validate LC Number
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Document Upload Section */}
//             {lcValidated && (
//               <div className="p-6">
//                 <div className="flex items-center space-x-2 mb-5">
//                   <Upload className="h-4 w-4 text-cyan-400" />
//                   <h4 className="text-lg font-semibold text-white">Supporting Documents</h4>
//                 </div>

//                 {/* Upload Zone */}
//                 <div className="mb-6">
//                   <div 
//                     className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500 transition-all duration-300 cursor-pointer bg-gray-700/20 hover:bg-gray-700/40"
//                     onClick={() => document.getElementById('file-input').click()}
//                   >
//                     <input
//                       id="file-input"
//                       type="file"
//                       multiple
//                       className="hidden"
//                       onChange={(e) => handleFilesSelected(Array.from(e.target.files))}
//                       disabled={uploading}
//                     />

//                     <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
//                       <Upload className="h-6 w-6 text-white" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to browse</h3>
//                     <p className="text-gray-400 text-sm">PDF, DOC, DOCX, JPG, PNG • Max 10MB per file</p>
//                   </div>
//                 </div>

//                 {/* Selected Files */}
//                 {files.length > 0 && (
//                   <div className="mb-5">
//                     <h5 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
//                       <FileText className="h-4 w-4 text-cyan-400" />
//                       <span>Selected Documents ({files.length})</span>
//                     </h5>

//                     <div className="max-h-32 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
//                       {files.slice(0, 4).map((file, index) => (
//                         <div key={`${file.name}_${index}`} className="group flex items-center justify-between p-2 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
//                               <FileText className="h-3 w-3 text-white" />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="text-white text-xs font-medium truncate max-w-xs" title={file.name}>
//                                 {file.name}
//                               </p>
//                               <p className="text-gray-400 text-xs">
//                                 {(file.size / 1024 / 1024).toFixed(2)} MB
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => removeFile(index)}
//                             disabled={uploading}
//                             className="opacity-0 group-hover:opacity-100 w-5 h-5 bg-red-500/20 hover:bg-red-500/40 rounded flex items-center justify-center transition-all duration-200 disabled:opacity-30"
//                           >
//                             <X className="h-2.5 w-2.5 text-red-400" />
//                           </button>
//                         </div>
//                       ))}
//                       {files.slice(4).map((file, index) => (
//                         <div key={`${file.name}_${index + 4}`} className="group flex items-center justify-between p-2 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
//                               <FileText className="h-3 w-3 text-white" />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="text-white text-xs font-medium truncate max-w-xs" title={file.name}>
//                                 {file.name}
//                               </p>
//                               <p className="text-gray-400 text-xs">
//                                 {(file.size / 1024 / 1024).toFixed(2)} MB
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => removeFile(index + 4)}
//                             disabled={uploading}
//                             className="opacity-0 group-hover:opacity-100 w-5 h-5 bg-red-500/20 hover:bg-red-500/40 rounded flex items-center justify-center transition-all duration-200 disabled:opacity-30"
//                           >
//                             <X className="h-2.5 w-2.5 text-red-400" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {files.length > 4 && (
//                       <p className="text-xs text-gray-500 mt-2">Showing all {files.length} files • Scroll to view more</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Upload Progress */}
//                 {uploading && (
//                   <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-2">
//                         <Upload className="h-4 w-4 text-blue-400" />
//                         <span className="text-sm font-medium text-blue-300">Processing Upload</span>
//                       </div>
//                       <span className="text-sm font-bold text-blue-300">
//                         {Math.round(uploadProgress)}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-700/50 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Success Message */}
//                 {uploadStatus === 'success' && (
//                   <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
//                     <div className="flex items-start space-x-3">
//                       <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
//                       <div>
//                         <h3 className="text-sm font-semibold text-green-300 mb-1">Upload Complete!</h3>
//                         <p className="text-green-400 text-sm">Your documents have been processed successfully.</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
//                   <button
//                     onClick={() => {
//                       setFiles([]);
//                       setUploadStatus('');
//                       setUploadProgress(0);
//                       setUploading(false);
//                     }}
//                     disabled={uploading}
//                     className="px-5 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:border-gray-500 hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 disabled:opacity-50"
//                   >
//                     {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//                   </button>

//                   <button
//                     onClick={handleUpload}
//                     disabled={uploading || files.length === 0 || uploadStatus === 'success'}
//                     className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {uploading ? 'Processing...' : uploadStatus === 'success' ? 'Upload Complete' : 'Upload Documents'}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Security Card */}
//           <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5">
//             <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
//               <Shield className="h-5 w-5 text-white" />
//             </div>
//             <h3 className="text-base font-semibold text-white mb-2">Enterprise Security</h3>
//             <p className="text-gray-400 text-xs leading-relaxed">Bank-grade 256-bit encryption with multi-layer security protocols</p>
//           </div>

//           {/* Performance Card */}
//           <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
//               <Upload className="h-5 w-5 text-white" />
//             </div>
//             <h3 className="text-base font-semibold text-white mb-2">Lightning Fast</h3>
//             <p className="text-gray-400 text-xs leading-relaxed">Optimized chunked uploads with real-time processing and validation</p>
//           </div>

//           {/* Support Card */}
//           <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-5 text-white">
//             <h3 className="text-base font-semibold mb-2">Need Help?</h3>
//             <p className="text-purple-100 text-xs mb-3">Our support team is available 24/7 to assist you</p>
//             <button className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
//               Contact Support
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>

//     {/* Fixed Footer */}
//     <footer className="bg-gray-800/30 backdrop-blur-lg border-t border-gray-700/50 mt-auto">
//       <div className="w-full px-8 xl:px-16 py-4">
//         <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
//           <div className="text-center md:text-left">
//             <p className="text-gray-400 text-sm">
//               &copy; {new Date().getFullYear()} LC Document Management System
//             </p>
//           </div>
//           <div className="flex space-x-6 text-xs text-gray-500">
//             <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
//             <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
//             <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   </div>
// );
// };

// export default LCSupportingDocsUploader;











import React, { useState, useEffect, useRef } from 'react';
import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader, Upload, Cpu, X, Plus, Eye, Download, Cloud, Shield, Zap } from 'lucide-react';
import FileUploader from '../swift/FileUploader';
import ErrorDropdown from '../swift/ErrorDropdown';
import { validateLcNumber, uploadSupportingDocuments, getWebSocketUrl, cancelUploadSession } from '../authentication/apiSupportingDocs';
import { logoutUser } from '../authentication/auth';

const LCSupportingDocsUploader = () => {
  // State management
  const [lcNumber, setLcNumber] = useState('');
  const [lcValidated, setLcValidated] = useState(false);
  const [lcValidating, setLcValidating] = useState(false);
  const [lcValidationError, setLcValidationError] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [currentDocName, setCurrentDocName] = useState('');
  const [unsupportedFileError, setUnsupportedFileError] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);

  // WebSocket and reconnection refs
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Clean up WebSocket on unmount
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

  const handleSignOut = async () => {
    try {
      await logoutUser();
      // Redirect to login page is already handled in logoutUser()
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback for error cases
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
  };

  const handleLcValidation = async () => {
    if (!lcNumber.trim()) {
      setLcValidationError('Please enter an LC number');
      setLcValidated(false);
      return false;
    }

    setLcValidating(true);
    setLcValidationError('');
    setLcValidated(false);

    try {
      const data = await validateLcNumber(lcNumber);

      if (data.message === "LC Number is valid") {
        setLcValidated(true);
        setLcValidationError('');
        return true;
      } else {
        setLcValidated(false);
        setLcValidationError(data.detail || 'Invalid LC number');
        return false;
      }
    } catch (error) {
      setLcValidated(false);
      setLcValidationError('Error validating LC number. Please try again.');
      return false;
    } finally {
      setLcValidating(false);
    }
  };

  const handleLcNumberChange = (e) => {
    setLcNumber(e.target.value);
    if (lcValidated) {
      setLcValidated(false);
      setLcValidationError('');
    }
  };

  const handleLcBlur = () => {
    if (lcNumber.trim()) {
      handleLcValidation();
    }
  };

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = [];
    const duplicateFiles = [];

    selectedFiles.forEach(newFile => {
      // Check if file with same name already exists
      const isDuplicate = files.some(existingFile => existingFile.name === newFile.name);

      if (isDuplicate) {
        duplicateFiles.push(newFile.name);
      } else {
        newFiles.push(newFile);
      }
    });

    // Add only non-duplicate files
    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }

    // Show warning for duplicates
    if (duplicateFiles.length > 0) {
      setErrorMessage(
        `File${duplicateFiles.length > 1 ? 's' : ''} already selected: ${duplicateFiles.join(', ')}`
      );
      setUploadStatus('warning');

      // Clear warning after 5 seconds
      setTimeout(() => {
        if (uploadStatus === 'warning') {
          setErrorMessage('');
          setUploadStatus(null);
        }
      }, 5000);
    } else {
      // Clear previous errors only if no duplicates
      if (uploadStatus === 'error') {
        setUploadStatus(null);
        setErrors([]);
        setErrorMessage('');
        setUnsupportedFileError(null);
      }
    }
  };

  // const removeFile = (index) => {
  //   setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  // };
  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // WebSocket processing response handler

  // Smooth progress simulation timer
  const progressTimerRef = useRef(null);


  // Updated WebSocket processing response handler with accurate progress calculation
 // Updated WebSocket processing response handler with correct data structure handling
// Updated WebSocket processing response handler with correct data structure handling
const handleProcessingResponse = (data) => {
  console.log('WebSocket response:', data);

  // Handle the actual API response format from your logs
  if (data.session_id && data.lc_no && data.status) {
    const status = data.status;
    const totalFiles = data.total_files || 0; // Total documents extracted from all uploaded files
    const completedFiles = data.completed_files || 0; // Files uploaded (not documents)
    const processedDocs = data.processed_docs || 0; // Individual documents processed
    const overallProgress = data.overall_progress || 0;
    const currentProgress = data.current_progress || null;

    // Calculate progress percentage based on processed documents vs total documents
    const progressPercentage = totalFiles > 0 ? Math.round((processedDocs / totalFiles) * 100) : 0;
    
    // Update PROCESSING progress bar with calculated progress
    setProcessingProgress(progressPercentage);

    // Handle different status states
    switch (status) {
      case 'processing':
        setProcessingStatus('processing');
        setCurrentDocName('Starting document processing...');
        break;

      case 'in-progress':
        setProcessingStatus('in-progress');

        // Show processing details from current_progress
        if (currentProgress && currentProgress.doc_title) {
          const docTitle = currentProgress.doc_title;
          const docStatus = currentProgress.status || 'processing';
          setCurrentDocName(`Processing: ${docTitle} (${processedDocs} documents completed)`);
          
          // Add completed document to processed files list
          if (docStatus === 'completed' && currentProgress.doc_path) {
            setProcessedFiles(prevFiles => {
              const docPath = currentProgress.doc_path;
              const fileExists = prevFiles.some(file => file.path === docPath);

              if (!fileExists) {
                return [...prevFiles, {
                  name: docTitle,
                  status: 'completed',
                  path: docPath,
                  error: null
                }];
              }
              return prevFiles;
            });
          }
        } else {
          setCurrentDocName(`Processing documents... (${processedDocs}/${totalFiles} documents completed)`);
        }

        // DO NOT auto-complete here - wait for explicit 'completed' status from server
        // The server knows when all documents from all files are truly processed
        break;

      case 'completed':
        // Only complete when server explicitly says so
        setProcessingStatus('completed');
        setCurrentDocName(`Processing complete - ${processedDocs} documents processed from ${files.length} uploaded files`);
        setProcessingProgress(100);

        // Finalize the upload process
        setTimeout(() => {
          cleanupWebSocket();
          setUploading(false);
          setUploadStatus('success');

          setProcessedFiles(prevFiles => {
            const hasErrors = prevFiles.some(file => file.status === "Error" || file.error);
            if (hasErrors) {
              setErrorMessage('One or more files failed to process. See details below.');
            }
            return prevFiles;
          });
        }, 500);
        break;

      case 'error':
        setProcessingStatus('error');
        setCurrentDocName('Processing failed');
        setUploading(false);
        setUploadStatus('error');
        setErrorMessage('Document processing failed. Please try again.');
        cleanupWebSocket();
        break;

      default:
        console.log('Unknown status:', status);
    }

    return true;
  }

  // Fallback for error handling (keeping your original error handling)
  if (data.error) {
    setErrors(prevErrors => [
      ...prevErrors,
      {
        id: Date.now().toString(),
        fileName: data.fileName || 'Unknown file',
        name: 'Processing Error',
        description: data.error,
        lineNumber: null,
        lineContent: null,
        suggestion: 'Please check the file format and try again.'
      }
    ]);

    setUploadStatus('error');
    setErrorMessage('One or more files failed to process.');
  }

  return false;
};


  // WebSocket monitoring function
  const startWebSocketMonitoring = (id) => {
    reconnectAttemptsRef.current = 0;
    cleanupWebSocket();

    try {
      const wsUrl = getWebSocketUrl(id);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttemptsRef.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleProcessingResponse(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed with code:', event.code);

        if (uploading && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            startWebSocketMonitoring(id);
          }, reconnectDelay);
        } else if (uploading) {
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

  // Updated handleUpload with immediate UI feedback
  const handleUpload = async () => {
    if (!lcValidated) {
      const isValid = await handleLcValidation();
      if (!isValid) return;
    }

    if (files.length === 0) {
      setErrorMessage('Please select at least one supporting document to upload');
      setUploadStatus('error');
      return;
    }

    // Set UI state immediately - no delays
    setUploading(true);
    setUploadProgress(1); // Start at 1% immediately
    setProcessingProgress(0);
    setUploadComplete(false);
    setErrorMessage('');
    setErrors([]);
    setUploadStatus(null);
    setProcessingStatus('starting');
    setCurrentDocName('Initializing upload...');
    setSessionId('');
    setUnsupportedFileError(null);
    setProcessedFiles([]);

    cleanupWebSocket();

    try {
      // Small delay to let UI update, then start processing
      setTimeout(async () => {
        setCurrentDocName('Starting file processing...');

        const data = await uploadSupportingDocuments(lcNumber, files, (progressData) => {
          const { fileName, fileProgress, overallProgress, status, completedFiles } = progressData;

          // Update UPLOAD progress bar with overall progress
          setUploadProgress(Math.max(1, Math.round(overallProgress))); // Never go below 1%

          // Update current status
          if (status === 'starting') {
            setProcessingStatus('preparing');
            setCurrentDocName(`Preparing: ${fileName}`);
          } else if (status === 'compressing') {
            setProcessingStatus('compressing');
            setCurrentDocName(`Compressing: ${fileName}`);
          } else if (status === 'uploading') {
            setProcessingStatus('uploading');
            setCurrentDocName(`Uploading: ${fileName} (${Math.round(fileProgress)}%) - ${completedFiles}/${files.length} files`);
          } else if (status === 'processing') {
            setProcessingStatus('uploaded');
            setCurrentDocName(`Upload complete. Processing ${completedFiles} files...`);
            setUploadComplete(true);
            setUploadProgress(100);
          }
        });

        const newSessionId = data.session_id;
        setSessionId(newSessionId);
        setProcessingStatus('uploaded');
        setCurrentDocName('All files uploaded, processing started...');
        setUploadComplete(true);
        setUploadProgress(100);

        // Start WebSocket monitoring
        startWebSocketMonitoring(newSessionId);

        // Safety timeout
        const timeoutDuration = Math.max(300000, files.length * 30000);
        setTimeout(() => {
          if (uploading && processingStatus !== 'completed') {
            cleanupWebSocket();
            setUploading(false);
            setUploadStatus('error');
            setErrorMessage('Processing timeout. Please check the status manually.');
          }
        }, timeoutDuration);
      }, 50); // Very small delay just to let UI render

    } catch (error) {
      console.error('Upload error:', error);

      setUploading(false);
      setUploadStatus('error');

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
      setProcessingProgress(0);
    }
  };


  const resetUpload = async () => {
    // If uploading is in progress, cancel the session
    if (uploading && sessionId) {
      try {
        await cancelUploadSession(sessionId);
        console.log('Upload session cancelled successfully');
      } catch (error) {
        console.error('Error cancelling session:', error);
        // Continue with cleanup even if cancel fails
      }
    }

    cleanupWebSocket();

    setFiles([]);
    setUploadStatus(null);
    setErrorMessage('');
    setErrors([]);
    setUploadProgress(0);
    setProcessingProgress(0);
    setUploadComplete(false);
    setUploading(false); // Add this to stop the uploading state
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
                <h1 className="text-lg font-semibold text-white">Comply Trade</h1>
                <p className="text-xs text-gray-400">LC Document Portal</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-8 xl:px-16 py-5">  {/* reduced py from 8 to 4 */}
        {/* Hero Section */}
        <div className="text-center mb-6"> {/* reduced mb from 10 to 6 */}
          <h2 className="text-3xl font-sans font-medium text-white tracking-tight">
            Upload LC Supporting Documents
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Securely manage your Letter of Credit documentation with enterprise-grade security
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {/* Main Upload Panel */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">

              {/* LC Number Section */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">LC Number Verification</h3>
                </div>

                <div className="flex items-start space-x-4">
                  {/* LC Number Input Section */}
                  <div className="flex-1 max-w-md">
                    <label htmlFor="lcNumber" className="block text-sm font-medium text-gray-300 mb-2">
                      Enter LC Number for Authentication
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="lcNumber"
                        value={lcNumber}
                        onChange={handleLcNumberChange}
                        onBlur={handleLcBlur}
                        disabled={uploading || lcValidating}
                        placeholder="LC-2024-XXXXXXXX"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200
            ${lcValidationError
                            ? 'border-red-500 bg-red-500/10 text-red-300 focus:ring-red-500/50'
                            : lcValidated
                              ? 'border-green-500 bg-green-500/10 text-green-300 focus:ring-green-500/50'
                              : 'border-gray-600 bg-gray-700/50 text-white focus:ring-blue-500/50 focus:border-blue-500'
                          }
            ${uploading || lcValidating ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 placeholder-gray-500`}
                      />

                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {lcValidating && (
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {lcValidated && !lcValidating && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                        {lcValidationError && !lcValidating && (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Error message below input */}
                    {lcValidationError && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-red-300 text-sm flex items-center space-x-2">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{lcValidationError}</span>
                        </p>
                      </div>
                    )}

                    {/* Validate button below input */}
                    {!lcValidated && !lcValidating && lcNumber && (
                      <button
                        onClick={handleLcValidation}
                        className="mt-3 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      >
                        Validate LC Number
                      </button>
                    )}
                  </div>

                  {/* Success message parallel to input */}
                  {lcValidated && (
                    <div className="flex-shrink-0 mt-8"> {/* mt-8 to align with input field */}
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <p className="text-green-300 text-sm whitespace-nowrap">LC Number validated successfully</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload Section */}
              {lcValidated && (
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-5">
                    <Upload className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-white">Supporting Documents</h4>
                  </div>

                  {/* FileUploader Component */}
                  <div className="mb-6">
                    <FileUploader
                      onFilesSelected={handleFilesSelected}
                      disabled={uploading}
                    />
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
                                onClick={() => removeFile && removeFile(index)}
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
    <div className="mt-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Upload className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">File Upload Progress</span>
        </div>
        <span className="text-sm font-bold text-blue-300">
          {Math.round(uploadProgress)}%
        </span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-blue-500 to-cyan-500"
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <div className="text-xs text-blue-300">
        {uploadComplete ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-blue-400" />
            <span>All files uploaded successfully</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading files in chunks...</span>
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
          {/* <span className="text-sm font-bold text-purple-300">
            {Math.round(processingProgress)}%
          </span> */}
        </div>
        {/* <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-out ${
              processingStatus === 'completed' 
                ? 'bg-gradient-to-r from-purple-500 to-violet-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div> */}

        <div className="text-xs text-purple-300 mb-3">
          {currentDocName && (
            <div className="flex items-center space-x-2">
              {processingStatus === 'in-progress' && (
                <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              {processingStatus === 'completed' && (
                <CheckCircle className="h-3 w-3 text-purple-400" />
              )}
              <span>{currentDocName}</span>
            </div>
          )}
        </div>

        {/* Processing Statistics */}
        {(processingStatus === 'in-progress' || processingStatus === 'completed') && processedFiles.length > 0 && (
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
                          "bg-purple-500/20 text-purple-300" :
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
        {processingStatus === 'in-progress' && processedFiles.length < files.length && (
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
  <div className="mt-4 mb-10 bg-purple-500/10 border border-purple-500/30 rounded-lg overflow-hidden">
    {/* Header */}
    <div className="p-4 border-b border-purple-500/20">
      <div className="flex items-center space-x-2">
        <Cpu className="h-4 w-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-purple-300">Document Processing Progress</h3>
      </div>
      <p className="text-purple-400 text-sm mt-1">
        Processing: Clean On Board Bill of Lading ({processedFiles.length} documents completed)
      </p>
    </div>

    {/* Processing Status */}
    <div className="px-4 py-3 bg-purple-500/5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-purple-300">Processing Status: {processedFiles.length} files</span>
      </div>
    </div>

    {/* Document List */}
    <div className="bg-purple-900/10">
      {processedFiles.length > 0 ? (
        <div className="max-h-48 overflow-y-auto">
          {processedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10 last:border-b-0 hover:bg-purple-500/5 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-300 text-sm font-medium">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {file.path && (
                  <button
                    onClick={() => window.open(`https://192.168.18.132:50013/supporting_docs/view/${file.path}`, '_blank')}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </button>
                )}
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  file.error
                    ? "bg-red-500/20 text-red-300"
                    : file.status === 'completed'
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {file.error ? "Error" : file.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-gray-400 text-sm">No processed files to display</p>
        </div>
      )}
    </div>

    {/* Footer with additional info if needed */}
    {processedFiles.some(file => file.error) && (
      <div className="px-4 py-3 bg-red-500/5 border-t border-red-500/20">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <p className="text-red-300 text-sm">Some files encountered errors during processing</p>
        </div>
      </div>
    )}
  </div>
)}

                  {/* Error Messages using ErrorDropdown component */}
                  {errors.length > 0 && (
                    <div className="mb-6">
                      <ErrorDropdown errors={errors} />
                    </div>
                  )}

                  {/* Warning/Error Messages */}
                  {uploadStatus === 'warning' && errorMessage && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <p className="text-yellow-300 text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  )}

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
                        <p className="text-red-300 text-sm">{unsupportedFileError}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={resetUpload}
                      disabled={false} // Always enable the button so users can cancel
                      className="px-5 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:border-gray-500 hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                    >
                      {uploading ? 'Cancel Upload' : uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
                    </button>

                    <button
                      onClick={handleUpload}
                      disabled={uploading || files.length === 0 || uploadStatus === 'success'}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Processing...' : uploadStatus === 'success' ? 'Upload Complete' : 'Upload Documents'}
                    </button>
                  </div>
                </div>
              )}
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
              <p className="text-gray-400 text-xs leading-relaxed">Optimized chunked uploads with real-time processing and validation</p>
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

export default LCSupportingDocsUploader;

