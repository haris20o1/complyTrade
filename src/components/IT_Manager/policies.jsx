import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle, FileText, XCircle, Info } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
//import UserManagement from "./main";

const BankPolicyUploadPage =() => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
//   const [recentUploads, setRecentUploads] = useState([
//     { id: 1, filename: "Bank_Policy_2025.pdf", timestamp: "May 14, 2025", size: "1.2 MB" },
//     { id: 2, filename: "Compliance_Guidelines_Q2_2025.pdf", timestamp: "May 10, 2025", size: "3.4 MB" },
//     { id: 3, filename: "Security_Protocol_Update.pdf", timestamp: "May 05, 2025", size: "0.8 MB" },
//   ]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      
      // Add to recent uploads
      setRecentUploads(prev => [{
        id: Date.now(),
        filename: file.name,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
      }, ...prev]);
      
      // Reset after 3 seconds
      setTimeout(() => {
        // We no longer need this auto-reset since we added a button
        // setUploadSuccess(false);
        // setFile(null);
      }, 3000);
    }, 2000);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed");
        return;
      }
      
      setFile(droppedFile);
      setUploadError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };


  return (
    <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
            

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">

            <main className="p-6">
                <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Bank Policies</h2>
                <p className="text-gray-600">Upload PDF files containing bank policies for system-wide distribution</p>
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                    />
                    
                    {uploadSuccess ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                        <p className="text-green-600 font-medium text-lg mb-3">Upload Successful!</p>
                        <button
                        onClick={() => {
                            setUploadSuccess(false);
                            setFile(null);
                            fileInputRef.current.value = "";
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Upload More Documents
                        </button>
                    </div>
                    ) : file ? (
                    <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-blue-500 mb-3" />
                        <p className="text-gray-800 font-medium text-lg mb-2">{file.name}</p>
                        <p className="text-gray-500 mb-4">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB - PDF File
                        </p>
                        <div className="flex space-x-3">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                            ) : (
                            <>Upload</>
                            )}
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center"
                            onClick={() => setFile(null)}
                            disabled={uploading}
                        >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                        </button>
                        </div>
                    </div>
                    ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-800 font-medium text-lg mb-2">Drag and drop your PDF file here</p>
                        <p className="text-gray-500 mb-4">or</p>
                        <button
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Browse Files
                        </button>
                        <p className="mt-4 text-gray-500">Only PDF files are allowed</p>
                    </div>
                    )}
                    
                    {uploadError && (
                    <div className="mt-4 flex items-center justify-center text-red-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {uploadError}
                    </div>
                    )}
                </div>
                </div>
                
                {/* Guidelines Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Policy Upload Guidelines</h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                        <li>All files must be in PDF format</li>
                        <li>Maximum file size: 10MB</li>
                        <li>Ensure all policies are approved before uploading</li>
                        <li>Files will be accessible to all users with appropriate permissions</li>
                        </ul>
                    </div>
                    </div>
                </div>
                </div>

                {/* Recent Uploads */}
                {/* <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Uploads</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentUploads.map((upload) => (
                        <tr key={upload.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{upload.filename}</span>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.timestamp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.size}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                            <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div> */}
            </main>
            </div>
        </div>
        </div>
    </DashboardLayout>
  );
};
export default BankPolicyUploadPage; 