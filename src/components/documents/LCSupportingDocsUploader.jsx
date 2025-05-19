import React, { useState, useEffect, useRef } from 'react';
import { LogOut, FileText, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

import FileUploader from '../swift/FileUploader';
import ErrorDropdown from '../swift/ErrorDropdown';
import { validateLcNumber, uploadSupportingDocuments, getWebSocketUrl } from '../authentication/apiSupportingDocs';
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
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    // Clear previous errors
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

  // WebSocket processing response handler
  const handleProcessingResponse = (data) => {
    // Update current document name
    if (data.progress && data.progress.Doc_name) {
      setCurrentDocName(data.progress.Doc_name);
      
      // Store processed file information
      if (data.progress.processing_status && data.progress.Doc_name) {
        // Check if file already processed
        const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
        if (!fileExists) {
          const newProcessedFile = {
            name: data.progress.Doc_name,
            status: data.progress.processing_status,
            error: data.progress.processing_error !== "None" ? data.progress.processing_error : null,
            url: data.progress.doc_url || null
          };
          
          setProcessedFiles(prev => [...prev, newProcessedFile]);
          
          // Handle errors
          if (data.progress.processing_status === "Error") {
            const errorMessage = data.progress.processing_error || 'Unknown error';
            
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
            
            setUploadStatus('error');
            setErrorMessage('One or more files failed to process. See details below.');
            
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
    
    // Update progress
    if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
      const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
      setUploadProgress(progressPercentage);
    }
    
    // Update processing status
    if (data.status) {
      setProcessingStatus(data.status);
    }
    
    // Check if processing completed
    if (data.status === 'completed') {
      setUploadProgress(100);
      cleanupWebSocket();
      setUploading(false);
      setUploadStatus('success');
      
      if (errors.length > 0 || processedFiles.some(file => file.status === "Error")) {
        setErrorMessage('One or more files failed to process. See details below.');
      }
      
      return true;
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

    setUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    setErrors([]);
    setUploadStatus(null);
    setProcessingStatus('initializing');
    setCurrentDocName('');
    setSessionId('');
    setUnsupportedFileError(null);
    setProcessedFiles([]);

    cleanupWebSocket();

    try {
      const data = await uploadSupportingDocuments(lcNumber, files);
      
      const newSessionId = data.session_id;
      setSessionId(newSessionId);
      setProcessingStatus('processing');
      
      startWebSocketMonitoring(newSessionId);
      
      // Safety timeout
      setTimeout(() => {
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
                <p className="text-sm text-gray-500">Supporting Documents Management</p>
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

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Upload LC Supporting Documents</h2>
          
          {/* LC Number Validation Section */}
          <div className="max-w-xl mb-8">
            <label htmlFor="lcNumber" className="block text-lg font-medium text-gray-700 mb-1">
              LC Number
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                id="lcNumber"
                name="lcNumber"
                value={lcNumber}
                onChange={handleLcNumberChange}
                onBlur={handleLcBlur}
                disabled={uploading || lcValidating}
                placeholder="Enter LC Number"
                className={`peer block w-full rounded-xl border px-4 py-2 pr-10 text-sm shadow-sm transition-all
                  placeholder-gray-400 focus:outline-none
                  ${lcValidationError ? 'border-red-400 text-red-700 focus:ring-red-500 focus:border-red-500' :
                    lcValidated ? 'border-green-400 text-green-700 focus:ring-green-500 focus:border-green-500' :
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                  ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                `}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {lcValidating && <Loader className="h-5 w-5 text-gray-400 animate-spin" />}
                {lcValidated && !lcValidating && <CheckCircle className="h-5 w-5 text-green-500" />}
                {lcValidationError && !lcValidating && <AlertTriangle className="h-5 w-5 text-red-500" />}
              </div>
            </div>
            
            {lcValidationError && (
              <p className="mt-2 text-sm text-red-600">{lcValidationError}</p>
            )}
            
            {lcValidated && (
              <p className="mt-2 text-sm text-green-600">LC Number validated successfully</p>
            )}
            
            {!lcValidated && !lcValidationError && !lcValidating && (
              <button
                type="button"
                onClick={handleLcValidation}
                className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Validate LC Number
              </button>
            )}
          </div>
          
          {/* Same UI components as before - Document Upload Section, File List, Progress Indicators, etc. */}
          {/* Document Upload Section (only shown after LC validation) */}
          {lcValidated && (
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-700 mb-3">Supporting Documents</h3>
              
              <FileUploader 
                onFilesSelected={handleFilesSelected}
                disabled={uploading}
              />
              
              {/* Selected Files List */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Documents ({files.length})</h4>
                  <div className="bg-gray-50 rounded-md border border-gray-200">
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {files.map((file, index) => (
                        <li key={index} className="px-4 py-3 flex justify-between items-center hover:bg-gray-100">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            disabled={uploading}
                            className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-400"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-6 bg-blue-50 rounded-md p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    {processingStatus === 'processing' ? 'Processing Documents' : 'Uploading Files'}
                  </h4>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center text-xs text-blue-700">
                    <span>{currentDocName ? `Processing: ${currentDocName}` : processingStatus}</span>
                    <span>{Math.round(uploadProgress)}% complete</span>
                  </div>
                  
                  {/* Processed Files List */}
                  {processedFiles.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-blue-800 mb-1">Processing Status:</h5>
                      <ul className="text-xs space-y-1">
                        {processedFiles.map((file, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="truncate max-w-md">{file.name}</span>
                            <span className={file.error ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                              {file.error ? "Error" : file.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Success Message */}
              {uploadStatus === 'success' && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Upload Complete</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your documents have been processed successfully.</p>
                        {sessionId && (
                          <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
                        )}
                      </div>
                      
                      {/* Successfully Processed Files */}
                      {processedFiles.filter(file => !file.error).length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-green-800">Processed Files:</h4>
                          <ul className="mt-1 list-disc list-inside text-sm text-green-700">
                            {processedFiles.filter(file => !file.error).map((file, index) => (
                              <li key={index}>
                                {file.name}
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
              
              {/* Error Messages */}
              {errors.length > 0 && <ErrorDropdown errors={errors} />}
              
              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetUpload}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
                </button>
                
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {uploading ? 'Processing...' : 'Upload Documents'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Document Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LCSupportingDocsUploader;


// import React, { useState, useEffect, useRef } from 'react';
// //import { LogOut, CheckCircle, FileText, Upload, AlertCircle } from 'lucide-react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';

// const LCSupportingDocsUploader = () => {
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
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

//   const validateLcNumber = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }
    
//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);
    
//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Make API call to validate LC number
//       const response = await fetch(`https://192.168.18.62:50013/lc/validate_lc/${lcNumber}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
      
//       // Handle the response
//       if (response.ok && data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       console.error('LC validation error:', error);
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     // Reset validation when LC number changes
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       validateLcNumber();
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
//           const newProcessedFile = {
//             name: data.progress.Doc_name,
//             status: data.progress.processing_status,
//             error: data.progress.processing_error !== "None" ? data.progress.processing_error : null,
//             url: data.progress.doc_url || null
//           };
          
//           setProcessedFiles(prev => [...prev, newProcessedFile]);
          
//           // If this file has an error, add it to the errors array for ErrorDropdown
//           if (data.progress.processing_status === "Error") {
//             const errorMessage = data.progress.processing_error || 'Unknown error';
            
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
//     // Modify in handleProcessingResponse function:
//     // Check if processing has completed
//     if (data.status === 'completed') {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
      
//       // Always set success status when processing completes,
//       // but also keep error status if there are errors
//       setUploadStatus('success');
      
//       // If we have errors, also set error message
//       if (errors.length > 0 || processedFiles.some(file => file.status === "Error")) {
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
//       const wsUrl = `wss://192.168.18.62:50013/supporting_docs/ws/progress/${id}?token=${encodeURIComponent(token)}`;
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

//   const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await validateLcNumber();
//       if (!isValid) return;
//     }
    
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
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
//       const response = await fetch(`https://192.168.18.62:50013/supporting_docs/upload_docs/?lc_no=${lcNumber}`, {
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
//     <div className="min-h-screen bg-gray-50 py-6">
//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Supporting Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload supporting documentation for Letter of Credit processing.
//             </p>

//             {/* LC Number input with validation */}
//             <div className="mt-6">
//               <label
//                 htmlFor="lcNumber"
//                 className="block text-sm font-semibold text-gray-800 mb-2"
//               >
//                 LC Number
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="lcNumber"
//                   name="lcNumber"
//                   value={lcNumber}
//                   onChange={handleLcNumberChange}
//                   onBlur={handleLcBlur}
//                   className={`w-full rounded-lg border px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm 
//                     ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
//                     ${lcValidationError ? 'border-red-300' : lcValidated ? 'border-green-300' : 'border-gray-300'}`}
//                   placeholder="Enter LC Number"
//                   disabled={uploading || lcValidating}
//                 />

//                 {lcValidating && (
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Validating...</span>
//                 )}
                
//                 {lcValidated && !lcValidating && (
//                   <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
//                 )}
//               </div>
              
//               {lcValidationError && (
//                 <p className="mt-1 text-sm text-red-600">{lcValidationError}</p>
//               )}
              
//               {lcValidated && (
//                 <p className="mt-1 text-sm text-green-600">LC Number is valid</p>
//               )}
              
//               {!lcValidated && !lcValidationError && (
//                 <div className="flex mt-2">
//                   <button
//                     type="button"
//                     onClick={validateLcNumber}
//                     className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={lcValidating || !lcNumber.trim()}
//                   >
//                     {lcValidating ? 'Validating...' : 'Validate LC Number'}
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Only show file uploader if LC is validated */}
//             {lcValidated && (
//               <>
//                 {/* Using the FileUploader component */}
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Supporting Documents
//                   </label>
//                   <FileUploader 
//                     onFilesSelected={handleFilesSelected}
//                     disabled={uploading}
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//                   </p>
//                 </div>
                
//                 {files.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
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
//                     <h3 className="text-sm font-medium text-gray-900 mb-1">
//                       {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                       processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                     </h3>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div 
//                         className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                     <div className="mt-1 flex justify-between items-center">
//                       <p className="text-xs text-gray-500">
//                         {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                       </p>
//                       <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
//                     </div>
//                     {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                       <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                     )}
                    
//                     {/* Display processed files during upload */}
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                         <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                         <ul className="mt-1 list-none text-xs text-gray-600">
//                           {processedFiles.map((file, index) => (
//                             <li key={index} className="py-1 flex justify-between">
//                               <span>{file.name}</span>
//                               <span className={file.error ? "text-red-600" : "text-green-600"}>
//                                 {file.error ? "Error" : file.status}
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}

      
//                 {/* Success message display - keep it on the same screen */}
//                 {uploadStatus === 'success' && (
//                   <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                     <div className="flex">
//                       <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                       <div className="text-sm text-green-700">
//                         <p className="font-medium">Upload Complete</p>
//                         <p className="mt-1">Your documents have been processed.</p>
//                         {sessionId && (
//                           <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                         )}
                        
//                         {processedFiles.length > 0 && (
//                           <div className="mt-3">
//                             <p className="font-medium">Processed Files:</p>
//                             <ul className="mt-1 list-disc list-inside text-xs">
//                               {processedFiles.filter(file => !file.error).map((file, index) => (
//                                 <li key={index}>
//                                   {file.name} - {file.status}
//                                   {file.url && (
//                                     <span className="ml-2">
//                                       (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
//                                     </span>
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Error message display with detailed errors in dropdown */}
//                 {errors.length > 0 && (
//                   <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                     <div className="flex">
//                       <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                       <div className="text-sm text-red-700 w-full">
//                         <p className="font-medium">Some Files Failed</p>
//                         <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                        
//                         {/* Display failed files if any */}
//                         {processedFiles.filter(file => file.error).length > 0 && (
//                           <div className="mt-3">
//                             <p className="font-medium">Failed Files:</p>
//                             <ul className="mt-1 list-disc list-inside text-xs">
//                               {processedFiles.filter(file => file.error).map((file, index) => (
//                                 <li key={index} className="text-red-700">
//                                   {file.name} - {file.status}
//                                   {file.error && <span className="ml-1">({file.error})</span>}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
                        
//                         {/* Always show error dropdown if there are errors */}
//                         <div className="mt-4">
//                           <ErrorDropdown errors={errors} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                                
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={resetUpload}
//                     className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={uploading}
//                   >
//                     {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleUpload}
//                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={uploading || files.length === 0}
//                   >
//                     {uploading ? 'Processing...' : 'Upload Documents'}
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
// export default LCSupportingDocsUploader;




// import React, { useState, useEffect, useRef } from 'react';
// import {
//   DocumentIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ArrowPathIcon,
//   CloudArrowUpIcon,
//   UserCircleIcon,
//   ArrowLeftOnRectangleIcon,
//   ChartPieIcon,
//   FolderIcon,
//   Cog6ToothIcon
// } from '@heroicons/react/24/outline';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';


// const LCSupportingDocsUploader = () => {
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
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

//   const validateLcNumber = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }
    
//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);
    
//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Make API call to validate LC number
//       const response = await fetch(`https://192.168.18.62:50013/lc/validate_lc/${lcNumber}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
      
//       // Handle the response
//       if (response.ok && data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       console.error('LC validation error:', error);
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     // Reset validation when LC number changes
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       validateLcNumber();
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

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     window.location.reload();
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
//           const newProcessedFile = {
//             name: data.progress.Doc_name,
//             status: data.progress.processing_status,
//             error: data.progress.processing_error !== "None" ? data.progress.processing_error : null,
//             url: data.progress.doc_url || null
//           };
          
//           setProcessedFiles(prev => [...prev, newProcessedFile]);
          
//           // If this file has an error, add it to the errors array for ErrorDropdown
//           if (data.progress.processing_status === "Error") {
//             const errorMessage = data.progress.processing_error || 'Unknown error';
            
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
//     // Modify in handleProcessingResponse function:
//     // Check if processing has completed
//     if (data.status === 'completed') {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
      
//       // Always set success status when processing completes,
//       // but also keep error status if there are errors
//       setUploadStatus('success');
      
//       // If we have errors, also set error message
//       if (errors.length > 0 || processedFiles.some(file => file.status === "Error")) {
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
//       const wsUrl = `wss://192.168.18.62:50013/supporting_docs/ws/progress/${id}?token=${encodeURIComponent(token)}`;
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

//   const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await validateLcNumber();
//       if (!isValid) return;
//     }
    
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
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
//       const response = await fetch(`https://192.168.18.62:50013/supporting_docs/upload_docs/?lc_no=${lcNumber}`, {
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
//     <div className="min-h-screen bg-gray-50">
//       {/* Dashboard Layout */}
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <div className="w-64 bg-gray-900 p-4 flex flex-col">
//           <div className="flex items-center space-x-2 mb-8">
//             <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
//             <span className="text-white font-semibold text-lg">TradeSecure</span>
//           </div>

//           <nav className="space-y-2 flex-1">
//             <a href="#" className="flex items-center space-x-3 p-2 text-gray-300 hover:bg-gray-800 rounded-lg">
//               <ChartPieIcon className="h-5 w-5" />
//               <span>Dashboard</span>
//             </a>
//             <a href="#" className="flex items-center space-x-3 p-2 bg-gray-800 text-white rounded-lg">
//               <FolderIcon className="h-5 w-5" />
//               <span>Documents</span>
//             </a>
//             <a href="#" className="flex items-center space-x-3 p-2 text-gray-300 hover:bg-gray-800 rounded-lg">
//               <Cog6ToothIcon className="h-5 w-5" />
//               <span>Settings</span>
//             </a>
//           </nav>

//           {/* User Profile */}
//           <div className="border-t border-gray-800 pt-4">
//             <div className="flex items-center space-x-3">
//               <UserCircleIcon className="h-8 w-8 text-gray-400" />
//               <div>
//                 <p className="text-sm font-medium text-white">John Doe</p>
//                 <p className="text-xs text-gray-400">Trade Operations</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Top Bar */}
//           <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
//             <h1 className="text-xl font-semibold text-gray-800">LC Document Management</h1>
//             <button 
//               onClick={handleLogout}
//               className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
//             >
//               <ArrowLeftOnRectangleIcon className="h-5 w-5" />
//               <span className="text-sm">Logout</span>
//             </button>
//           </header>

//           {/* Main Content Area */}
//           <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
//             <div className="max-w-4xl mx-auto">
//               {/* Process Steps */}
//               <div className="mb-8">
//                 <div className="flex justify-between">
//                   <div className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center 
//                       ${lcValidated ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
//                       {lcValidated ? <CheckCircleIcon className="h-5 w-5" /> : '1'}
//                     </div>
//                     <span className="text-sm mt-1 text-gray-600">LC Validation</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center 
//                       ${files.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//                       {files.length > 0 ? <CheckCircleIcon className="h-5 w-5" /> : '2'}
//                     </div>
//                     <span className="text-sm mt-1 text-gray-600">File Upload</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center 
//                       ${uploadStatus ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//                       {uploadStatus ? <CheckCircleIcon className="h-5 w-5" /> : '3'}
//                     </div>
//                     <span className="text-sm mt-1 text-gray-600">Processing</span>
//                   </div>
//                 </div>
//               </div>

//               {/* LC Validation Card */}
//               <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">LC Number Validation</h2>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={lcNumber}
//                     onChange={handleLcNumberChange}
//                     onBlur={handleLcBlur}
//                     className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
//                       ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
//                       ${lcValidationError ? 'border-red-400' : lcValidated ? 'border-green-400' : 'border-gray-300'}`}
//                     placeholder="Enter LC reference number"
//                     disabled={uploading || lcValidating}
//                   />
//                   <div className="absolute right-3 top-3.5">
//                     {lcValidating ? (
//                       <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
//                     ) : lcValidated ? (
//                       <CheckCircleIcon className="h-6 w-6 text-green-500" />
//                     ) : lcValidationError ? (
//                       <XCircleIcon className="h-6 w-6 text-red-500" />
//                     ) : null}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 flex items-center justify-between">
//                   {lcValidationError && (
//                     <p className="text-sm text-red-600">{lcValidationError}</p>
//                   )}
//                   {!lcValidated && !lcValidationError && (
//                     <button
//                       onClick={validateLcNumber}
//                       className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                       disabled={lcValidating || !lcNumber.trim()}
//                     >
//                       {lcValidating ? (
//                         <>
//                           <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                           Validating...
//                         </>
//                       ) : (
//                         'Verify LC Number'
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* File Upload Section */}
//               {lcValidated && (
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                   <div className="mb-6">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Upload</h2>
//                     <FileUploader 
//                       onFilesSelected={handleFilesSelected}
//                       disabled={uploading}
//                     />
//                     <p className="mt-3 text-sm text-gray-500">
//                       Supported formats: PDF, JPEG, PNG, TIFF (Max 25MB per file)
//                     </p>
//                   </div>

//                   {/* Selected Files */}
//                   {files.length > 0 && (
//                     <div className="mb-6">
//                       <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                         Selected Documents ({files.length})
//                       </h3>
//                       <div className="space-y-2">
//                         {files.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <DocumentIcon className="h-5 w-5 text-blue-600" />
//                               <div>
//                                 <p className="text-sm font-medium text-gray-700">{file.name}</p>
//                                 <p className="text-xs text-gray-500">
//                                   {(file.size / 1024).toLocaleString()} KB
//                                 </p>
//                               </div>
//                             </div>
//                             <button
//                               onClick={() => removeFile(index)}
//                               className="text-gray-400 hover:text-red-600 transition-colors"
//                               disabled={uploading}
//                             >
//                               <XCircleIcon className="h-5 w-5" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Progress and Actions */}
//                   <div className="space-y-6">
//                     {uploading && (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <div className="flex justify-between text-sm font-medium text-gray-700">
//                             <span>Processing Status</span>
//                             <span>{Math.round(uploadProgress)}%</span>
//                           </div>
//                           <div className="relative pt-1">
//                             <div className="overflow-hidden h-2.5 bg-gray-200 rounded-full">
//                               <div 
//                                 className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300" 
//                                 style={{ width: `${uploadProgress}%` }}
//                               />
//                             </div>
//                           </div>
//                           {currentDocName && (
//                             <p className="text-sm text-gray-500">
//                               Processing: <span className="font-medium">{currentDocName}</span>
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* Status Messages */}
//                     {uploadStatus === 'success' && (
//                       <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                         <div className="flex items-start space-x-3">
//                           <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
//                           <div>
//                             <h3 className="text-sm font-semibold text-green-800">Submission Complete</h3>
//                             <p className="mt-1 text-sm text-green-700">
//                               {processedFiles.length} documents processed successfully
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {errors.length > 0 && (
//                       <div className="p-4 bg-red-50 rounded-lg border border-red-200">
//                         <div className="flex items-start space-x-3">
//                           <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
//                           <div className="flex-1">
//                             <h3 className="text-sm font-semibold text-red-800">Processing Issues</h3>
//                             <ErrorDropdown errors={errors} className="mt-2" />
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex justify-end space-x-3 pt-4">
//                       <button
//                         onClick={resetUpload}
//                         className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
//                         disabled={uploading}
//                       >
//                         {uploadStatus === 'success' ? 'New Submission' : 'Clear All'}
//                       </button>
//                       <button
//                         onClick={handleUpload}
//                         disabled={uploading || files.length === 0}
//                         className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                       >
//                         {uploading ? (
//                           <>
//                             <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <CloudArrowUpIcon className="h-4 w-4 mr-2" />
//                             Submit Documents
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LCSupportingDocsUploader;





    
//               {/* Success message display - keep it on the same screen */}
//               {uploadStatus === 'success' && (
//                 <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                   <div className="flex">
//                     <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                     <div className="text-sm text-green-700">
//                       <p className="font-medium">Upload Complete</p>
//                       <p className="mt-1">Your documents have been processed.</p>
//                       {sessionId && (
//                         <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                       )}
                      
//                       {processedFiles.length > 0 && (
//                         <div className="mt-3">
//                           <p className="font-medium">Processed Files:</p>
//                           <ul className="mt-1 list-disc list-inside text-xs">
//                             {processedFiles.filter(file => !file.error).map((file, index) => (
//                               <li key={index}>
//                                 {file.name} - {file.status}
//                                 {file.url && (
//                                   <span className="ml-2">
//                                     (<a href={file.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>)
//                                   </span>
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

//               {/* Error message display with detailed errors in dropdown */}
//               {errors.length > 0 && (
//                 <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                   <div className="flex">
//                     <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                     <div className="text-sm text-red-700 w-full">
//                       <p className="font-medium">Some Files Failed</p>
//                       <p className="mt-1">{errorMessage || "One or more files failed to process. See details below."}</p>
                      
//                       {/* Display failed files if any */}
//                       {processedFiles.filter(file => file.error).length > 0 && (
//                         <div className="mt-3">
//                           <p className="font-medium">Failed Files:</p>
//                           <ul className="mt-1 list-disc list-inside text-xs">
//                             {processedFiles.filter(file => file.error).map((file, index) => (
//                               <li key={index} className="text-red-700">
//                                 {file.name} - {file.status}
//                                 {file.error && <span className="ml-1">({file.error})</span>}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
                      
//                       {/* Always show error dropdown if there are errors */}
//                       <div className="mt-4">
//                         <ErrorDropdown errors={errors} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
                              
//               <div className="mt-6 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={resetUpload}
//                   className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   disabled={uploading}
//                 >
//                   {uploadStatus === 'success' ? 'Upload More Documents' : 'Clear All'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleUpload}
//                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   disabled={uploading || files.length === 0}
//                 >
//                   {uploading ? 'Processing...' : 'Upload Documents'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   </div>
// );
// };
// export default LCSupportingDocsUploader;



// import React, { useState, useEffect, useRef } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';

// const LCSupportingDocsUploader = () => {
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
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

//   const validateLcNumber = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }
    
//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);
    
//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Make API call to validate LC number
//       const response = await fetch(`https://192.168.18.62:50013/lc/validate_lc/${lcNumber}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
      
//       // Handle the response
//       if (response.ok && data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       console.error('LC validation error:', error);
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     // Reset validation when LC number changes
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       validateLcNumber();
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
//   // Handle processing status and errors in WebSocket responses
// const handleProcessingResponse = (data) => {
//   // Update current document name
//   console.log(data);
//   if (data.progress && data.progress.Doc_name) {
//     setCurrentDocName(data.progress.Doc_name);
    
//     // Store processed file information
//     if (data.progress.processing_status && data.progress.Doc_name) {
//       // Check if this file is already in the processed files array
//       const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
      
//       if (!fileExists) {
//         const newProcessedFile = {
//           name: data.progress.Doc_name,
//           status: data.progress.processing_status,
//           error: data.progress.processing_error !== "None" ? data.progress.processing_error : null,
//           url: data.progress.doc_url || null
//         };
        
//         setProcessedFiles(prev => [...prev, newProcessedFile]);
        
//         // If this file has an error, add it to the errors array for ErrorDropdown
//         if (data.progress.processing_status === "Error") {
//           const errorMessage = data.progress.processing_error || 'Unknown error';
          
//           setErrors(prevErrors => [
//             ...prevErrors,
//             {
//               id: Date.now().toString(),
//               fileName: data.progress.Doc_name || 'Unknown file',
//               name: 'Processing Error',
//               description: errorMessage,
//               lineNumber: null,
//               lineContent: null,
//               suggestion: errorMessage.includes("Unsupported File type") 
//                 ? `The file type "${errorMessage.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
//                 : 'Please check the file format and try again with supported file types.'
//             }
//           ]);
          
//           // Update unsupported file error state if applicable
//           if (errorMessage.includes("Unsupported File type")) {
//             setUnsupportedFileError({
//               fileName: data.progress.Doc_name,
//               fileType: errorMessage.split(" ").pop()
//             });
//           }
//         }
//       }
//     }
//   }
  
//   // Update progress based on file index and total
//   if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
//     // Calculate progress percentage
//     const progressPercentage = ((data.progress.file_idx) / data.progress.total) * 100;
//     setUploadProgress(progressPercentage);
//   }
  
//   // Update processing status
//   if (data.status) {
//     setProcessingStatus(data.status);
//   }
  
//   // Check if processing has completed
//   if (data.status === 'completed') {
//     setUploadProgress(100);
//     cleanupWebSocket();
//     setUploading(false);
    
//     // If we have any errors in our errors array, set status to 'error', otherwise 'success'
//     if (errors.length > 0 || processedFiles.some(file => file.status === "Error")) {
//       setUploadStatus('error');
//       setErrorMessage('One or more files failed to process. See details below.');
//     } else {
//       setUploadStatus('success');
//     }
    
//     return true; // Completed
//   }
  
//   return false; // Not completed yet
// };

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
//       // This is more reliable than using protocols
//       const wsUrl = `wss://192.168.18.62:50013/supporting_docs/ws/progress/${id}?token=${encodeURIComponent(token)}`;
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

//   const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await validateLcNumber();
//       if (!isValid) return;
//     }
    
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
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
//       const response = await fetch(`https://192.168.18.62:50013/supporting_docs/upload_docs/?lc_no=${lcNumber}`, {
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
//     <div className="min-h-screen bg-gray-50 py-6">
//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Supporting Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload supporting documentation for Letter of Credit processing.
//             </p>

//             {uploadStatus === 'success' ? (
//               <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex">
//                   <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                   <div className="text-sm text-green-700">
//                     <p className="font-medium">Upload Successful!</p>
//                     <p className="mt-1">Your documents have been processed successfully.</p>
//                     {sessionId && (
//                       <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                     )}
                    
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.map((file, index) => (
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
                    
//                     <button
//                       type="button"
//                       onClick={resetUpload}
//                       className="mt-3 inline-flex items-center px-3 py-1.5 border border-green-700 rounded-md text-xs font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       Upload More Documents
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* LC Number input with validation */}
//                 <div className="mt-6">
//                   <label
//                     htmlFor="lcNumber"
//                     className="block text-sm font-semibold text-gray-800 mb-2"
//                   >
//                     LC Number
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="lcNumber"
//                       name="lcNumber"
//                       value={lcNumber}
//                       onChange={handleLcNumberChange}
//                       onBlur={handleLcBlur}
//                       className={`w-full rounded-lg border px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm 
//                         ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
//                         ${lcValidationError ? 'border-red-300' : lcValidated ? 'border-green-300' : 'border-gray-300'}`}
//                       placeholder="Enter LC Number"
//                       disabled={uploading || lcValidating}
//                     />

//                     {lcValidating && (
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Validating...</span>
//                     )}
                    
//                     {lcValidated && !lcValidating && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
//                     )}
//                   </div>
                  
//                   {lcValidationError && (
//                     <p className="mt-1 text-sm text-red-600">{lcValidationError}</p>
//                   )}
                  
//                   {lcValidated && (
//                     <p className="mt-1 text-sm text-green-600">LC Number is valid</p>
//                   )}
                  
//                   {!lcValidated && !lcValidationError && (
//                     <div className="flex mt-2">
//                       <button
//                         type="button"
//                         onClick={validateLcNumber}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={lcValidating || !lcNumber.trim()}
//                       >
//                         {lcValidating ? 'Validating...' : 'Validate LC Number'}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Only show file uploader if LC is validated */}
//                 {lcValidated && (
//                   <>
//                     {/* Using the FileUploader component */}
//                     <div className="mt-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Supporting Documents
//                       </label>
//                       <FileUploader 
//                         onFilesSelected={handleFilesSelected}
//                         disabled={uploading}
//                       />
//                       <p className="mt-1 text-xs text-gray-500">
//                         Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//                       </p>
//                     </div>
                    
//                     {files.length > 0 && (
//                       <div className="mt-6">
//                         <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
//                         <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                           {files.map((file, index) => (
//                             <li key={index} className="py-3 flex justify-between items-center">
//                               <div className="flex items-center">
//                                 <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                                 <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                                 <span className="ml-2 text-xs text-gray-500">
//                                   ({(file.size / 1024).toFixed(2)} KB)
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-sm text-red-600 hover:text-red-800"
//                                 disabled={uploading}
//                               >
//                                 Remove
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {uploading && (
//                       <div className="mt-6">
//                         <h3 className="text-sm font-medium text-gray-900 mb-1">
//                           {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                           processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                         </h3>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                             style={{ width: `${uploadProgress}%` }}
//                           ></div>
//                         </div>
//                         <div className="mt-1 flex justify-between items-center">
//                           <p className="text-xs text-gray-500">
//                             {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                           </p>
//                           <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
//                         </div>
//                         {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                           <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                         )}
                        
//                         {/* Display processed files during upload */}
//                         {processedFiles.length > 0 && (
//                           <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                             <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                             <ul className="mt-1 list-none text-xs text-gray-600">
//                               {processedFiles.map((file, index) => (
//                                 <li key={index} className="py-1 flex justify-between">
//                                   <span>{file.name}</span>
//                                   <span className={file.error ? "text-red-600" : "text-green-600"}>
//                                     {file.error ? "Error" : file.status}
//                                   </span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     <div className="mt-6 flex justify-end">
//                       <button
//                         type="button"
//                         onClick={resetUpload}
//                         className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={uploading || files.length === 0}
//                       >
//                         Clear All
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleUpload}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={uploading || files.length === 0}
//                       >
//                         {uploading ? 'Processing...' : 'Upload Documents'}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}

//             {/* Error message display */}
//             {uploadStatus === 'error' && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex">
//                   <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                   <div className="text-sm text-red-700">
//                     <p className="font-medium">Upload Failed</p>
//                     <p className="mt-1">{errorMessage}</p>
                    
//                     {/* Display specific message for unsupported file type */}
//                     {unsupportedFileError && (
//                       <div className="mt-2 p-2 bg-red-100 rounded-md">
//                         <p className="font-semibold">Unsupported File Type Error</p>
//                         <p>File: {unsupportedFileError.fileName}</p>
//                         <p>Type: {unsupportedFileError.fileType}</p>
//                         <p className="mt-1 text-xs">Please upload documents in a supported format.</p>
//                       </div>
//                     )}
                    
//                     {/* Display processed files if any */}
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.map((file, index) => (
//                             <li key={index} className={file.error ? "text-red-700" : ""}>
//                               {file.name} - {file.status}
//                               {file.error && <span className="ml-1">({file.error})</span>}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {errors.length > 0 && <ErrorDropdown errors={errors} />}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LCSupportingDocsUploader;


// import React, { useState, useEffect, useRef } from 'react';
// import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import FileUploader from '../swift/FileUploader';
// import ErrorDropdown from '../swift/ErrorDropdown';

// const LCSupportingDocsUploader = () => {
//   const [lcNumber, setLcNumber] = useState('');
//   const [lcValidated, setLcValidated] = useState(false);
//   const [lcValidating, setLcValidating] = useState(false);
//   const [lcValidationError, setLcValidationError] = useState('');
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

//   const validateLcNumber = async () => {
//     if (!lcNumber.trim()) {
//       setLcValidationError('Please enter an LC number');
//       setLcValidated(false);
//       return false;
//     }
    
//     setLcValidating(true);
//     setLcValidationError('');
//     setLcValidated(false);
    
//     try {
//       // Get the authentication token from localStorage
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found. Please log in again.');
//       }
      
//       // Make API call to validate LC number
//       const response = await fetch(`https://192.168.18.62:50013/lc/validate_lc/${lcNumber}`, {
//         method: 'GET',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const data = await response.json();
      
//       // Handle the response
//       if (response.ok && data.message === "LC Number is valid") {
//         setLcValidated(true);
//         setLcValidationError('');
//         return true;
//       } else {
//         setLcValidated(false);
//         setLcValidationError(data.detail || 'Invalid LC number');
//         return false;
//       }
//     } catch (error) {
//       console.error('LC validation error:', error);
//       setLcValidated(false);
//       setLcValidationError('Error validating LC number. Please try again.');
//       return false;
//     } finally {
//       setLcValidating(false);
//     }
//   };

//   const handleLcNumberChange = (e) => {
//     setLcNumber(e.target.value);
//     // Reset validation when LC number changes
//     if (lcValidated) {
//       setLcValidated(false);
//       setLcValidationError('');
//     }
//   };

//   const handleLcBlur = () => {
//     if (lcNumber.trim()) {
//       validateLcNumber();
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
//     console.log(data)
//     if (data.progress && data.progress.Doc_name) {
//       setCurrentDocName(data.progress.Doc_name);
      
//       // Store processed file information
//       if (data.progress.processing_status && data.progress.Doc_name) {
//         // Check if this file is already in the processed files array
//         const fileExists = processedFiles.some(file => file.name === data.progress.Doc_name);
        
//         if (!fileExists) {
//           setProcessedFiles(prev => [...prev, {
//             name: data.progress.Doc_name,
//             status: data.progress.processing_status,
//             error: data.progress.processing_error !== "None" ? data.progress.processing_error : null,
//             url: data.progress.doc_url || null
//           }]);
//         }
//       }
//     }
    
//     // Update progress based on file index and total
//     if (data.progress && typeof data.progress.file_idx !== 'undefined' && data.progress.total) {
//       // Calculate progress percentage (adding 1 to file_idx because it's zero-based)
//       const progressPercentage = ((data.progress.file_idx ) / data.progress.total) * 100;
//       setUploadProgress(progressPercentage);
//     }
    
//     // Update processing status
//     if (data.status) {
//       setProcessingStatus(data.status);
//     }
    
//     // Check if processing has completed with errors
//     if (data.progress && data.progress.processing_status === "Error") {
//       setUploadProgress(((data.progress.file_idx + 1) / data.progress.total) * 100);
//       cleanupWebSocket();
//       setUploading(false);
//       setUploadStatus('error');
      
//       // Set specific error message for unsupported file type
//       if (data.progress.processing_error && data.progress.processing_error.includes("Unsupported File type")) {
//         setUnsupportedFileError({
//           fileName: data.progress.Doc_name,
//           fileType: data.progress.processing_error.split(" ").pop()
//         });
//         setErrorMessage(`Error: ${data.progress.processing_error}`);
//       } else {
//         setErrorMessage('Error processing one or more documents');
//       }
      
//       // Create error object for the ErrorDropdown component
//       setErrors(prevErrors => [
//         ...prevErrors,
//         {
//           id: Date.now().toString(),
//           fileName: data.progress.Doc_name || 'Unknown file',
//           name: 'Processing Error',
//           description: data.progress.processing_error || 'An error occurred during document processing',
//           lineNumber: null,
//           lineContent: null,
//           suggestion: data.progress.processing_error && data.progress.processing_error.includes("Unsupported File type") 
//             ? `The file type "${data.progress.processing_error.split(" ").pop()}" is not supported. Please upload documents in a supported format.`
//             : 'Please check the file format and try again with supported file types.'
//         }
//       ]);
      
//       return true; // Completed (with error)
//     }
//     // Check if processing has completed successfully
//     else if (data.status === 'completed' && 
//             !(data.progress && data.progress.processing_status === "Error")) {
//       setUploadProgress(100);
//       cleanupWebSocket();
//       setUploading(false);
//       setUploadStatus('success');
//       return true; // Completed (successfully)
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
//       // This is more reliable than using protocols
//       const wsUrl = `wss://192.168.18.62:50013/supporting_docs/ws/progress/${id}?token=${encodeURIComponent(token)}`;
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

//   const handleUpload = async () => {
//     if (!lcValidated) {
//       const isValid = await validateLcNumber();
//       if (!isValid) return;
//     }
    
//     if (files.length === 0) {
//       setErrorMessage('Please select at least one supporting document to upload');
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
//       const response = await fetch(`https://192.168.18.62:50013/supporting_docs/upload_docs/?lc_no=${lcNumber}`, {
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
//     <div className="min-h-screen bg-gray-50 py-6">
//       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//           <div className="px-4 py-5 sm:p-6">
//             <h2 className="text-lg font-medium leading-6 text-gray-900">Upload LC Supporting Documents</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Upload supporting documentation for Letter of Credit processing.
//             </p>

//             {uploadStatus === 'success' ? (
//               <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
//                 <div className="flex">
//                   <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
//                   <div className="text-sm text-green-700">
//                     <p className="font-medium">Upload Successful!</p>
//                     <p className="mt-1">Your documents have been processed successfully.</p>
//                     {sessionId && (
//                       <p className="mt-1 font-mono text-xs">Session ID: {sessionId}</p>
//                     )}
                    
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.map((file, index) => (
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
                    
//                     <button
//                       type="button"
//                       onClick={resetUpload}
//                       className="mt-3 inline-flex items-center px-3 py-1.5 border border-green-700 rounded-md text-xs font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       Upload More Documents
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* LC Number input with validation */}
//                 <div className="mt-6">
//                   <label
//                     htmlFor="lcNumber"
//                     className="block text-sm font-semibold text-gray-800 mb-2"
//                   >
//                     LC Number
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       id="lcNumber"
//                       name="lcNumber"
//                       value={lcNumber}
//                       onChange={handleLcNumberChange}
//                       onBlur={handleLcBlur}
//                       className={`w-full rounded-lg border px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm 
//                         ${uploading || lcValidating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
//                         ${lcValidationError ? 'border-red-300' : lcValidated ? 'border-green-300' : 'border-gray-300'}`}
//                       placeholder="Enter LC Number"
//                       disabled={uploading || lcValidating}
//                     />

//                     {lcValidating && (
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Validating...</span>
//                     )}
                    
//                     {lcValidated && !lcValidating && (
//                       <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
//                     )}
//                   </div>
                  
//                   {lcValidationError && (
//                     <p className="mt-1 text-sm text-red-600">{lcValidationError}</p>
//                   )}
                  
//                   {lcValidated && (
//                     <p className="mt-1 text-sm text-green-600">LC Number is valid</p>
//                   )}
                  
//                   {!lcValidated && !lcValidationError && (
//                     <div className="flex mt-2">
//                       <button
//                         type="button"
//                         onClick={validateLcNumber}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={lcValidating || !lcNumber.trim()}
//                       >
//                         {lcValidating ? 'Validating...' : 'Validate LC Number'}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Only show file uploader if LC is validated */}
//                 {lcValidated && (
//                   <>
//                     {/* Using the FileUploader component */}
//                     <div className="mt-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Supporting Documents
//                       </label>
//                       <FileUploader 
//                         onFilesSelected={handleFilesSelected}
//                         disabled={uploading}
//                       />
//                       <p className="mt-1 text-xs text-gray-500">
//                         Supported file types: PDF, JPG, PNG, TIFF. Files with extensions like .docx are not supported.
//                       </p>
//                     </div>
                    
//                     {files.length > 0 && (
//                       <div className="mt-6">
//                         <h3 className="text-md font-medium text-gray-900 mb-3">Selected Documents ({files.length})</h3>
//                         <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
//                           {files.map((file, index) => (
//                             <li key={index} className="py-3 flex justify-between items-center">
//                               <div className="flex items-center">
//                                 <DocumentIcon className="h-5 w-5 text-indigo-500 mr-2" />
//                                 <span className="text-sm font-medium text-gray-900">{file.name}</span>
//                                 <span className="ml-2 text-xs text-gray-500">
//                                   ({(file.size / 1024).toFixed(2)} KB)
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-sm text-red-600 hover:text-red-800"
//                                 disabled={uploading}
//                               >
//                                 Remove
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {uploading && (
//                       <div className="mt-6">
//                         <h3 className="text-sm font-medium text-gray-900 mb-1">
//                           {processingStatus === 'in-progress' ? 'Processing Documents...' : 
//                           processingStatus === 'processing' ? 'Processing Documents...' : 'Uploading...'}
//                         </h3>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
//                             style={{ width: `${uploadProgress}%` }}
//                           ></div>
//                         </div>
//                         <div className="mt-1 flex justify-between items-center">
//                           <p className="text-xs text-gray-500">
//                             {currentDocName ? `Processing: ${currentDocName}` : processingStatus}
//                           </p>
//                           <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
//                         </div>
//                         {sessionId && (processingStatus === 'processing' || processingStatus === 'in-progress') && (
//                           <p className="text-xs text-gray-500 mt-1">Session ID: {sessionId}</p>
//                         )}
                        
//                         {/* Display processed files during upload */}
//                         {processedFiles.length > 0 && (
//                           <div className="mt-3 bg-gray-50 p-2 rounded-md">
//                             <p className="text-xs font-medium text-gray-700">Processed Files:</p>
//                             <ul className="mt-1 list-none text-xs text-gray-600">
//                               {processedFiles.map((file, index) => (
//                                 <li key={index} className="py-1 flex justify-between">
//                                   <span>{file.name}</span>
//                                   <span className={file.error ? "text-red-600" : "text-green-600"}>
//                                     {file.error ? "Error" : file.status}
//                                   </span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     <div className="mt-6 flex justify-end">
//                       <button
//                         type="button"
//                         onClick={resetUpload}
//                         className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={uploading || files.length === 0}
//                       >
//                         Clear All
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleUpload}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         disabled={uploading || files.length === 0}
//                       >
//                         {uploading ? 'Processing...' : 'Upload Documents'}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}

//             {/* Error message display */}
//             {uploadStatus === 'error' && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//                 <div className="flex">
//                   <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                   <div className="text-sm text-red-700">
//                     <p className="font-medium">Upload Failed</p>
//                     <p className="mt-1">{errorMessage}</p>
                    
//                     {/* Display specific message for unsupported file type */}
//                     {unsupportedFileError && (
//                       <div className="mt-2 p-2 bg-red-100 rounded-md">
//                         <p className="font-semibold">Unsupported File Type Error</p>
//                         <p>File: {unsupportedFileError.fileName}</p>
//                         <p>Type: {unsupportedFileError.fileType}</p>
//                         <p className="mt-1 text-xs">Please upload documents in a supported format.</p>
//                       </div>
//                     )}
                    
//                     {/* Display processed files if any */}
//                     {processedFiles.length > 0 && (
//                       <div className="mt-3">
//                         <p className="font-medium">Processed Files:</p>
//                         <ul className="mt-1 list-disc list-inside text-xs">
//                           {processedFiles.map((file, index) => (
//                             <li key={index} className={file.error ? "text-red-700" : ""}>
//                               {file.name} - {file.status}
//                               {file.error && <span className="ml-1">({file.error})</span>}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {errors.length > 0 && <ErrorDropdown errors={errors} />}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LCSupportingDocsUploader;