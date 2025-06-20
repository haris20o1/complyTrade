import { useState, useRef, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle, FileText, XCircle, Info, Eye, Trash2 } from "lucide-react";
import { bankDocumentService } from "../authentication/apiITManager"; // Import the real API service
import DashboardLayout from "../layouts/DashboardLayout";

const BankPolicyUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Document categories
  const documentCategories = [
    { value: "", label: "Select Category" },
    { value: "bank-policy", label: "Bank Policy" },
    { value: "ipo-prospectus", label: "IPO Prospectus" },
    { value: "sanction-policy", label: "Sanction Policy" },
    { value: "ispp", label: "ISPP" },
    { value: "ucp600", label: "UCP600" },
  ];

  // Real API service calls are now imported from bankDocumentService

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await bankDocumentService.getAllDocuments();
      setUploadedDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setUploadError('Failed to load documents. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUploadClick = () => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    if (!selectedCategory) {
      setUploadError("Please select a document category");
      return;
    }

    setUploadError(null);
    setShowConfirmDialog(true);
  };

  const confirmUpload = async () => {
    setShowConfirmDialog(false);
    setUploading(true);

    try {
      const uploadResponse = await bankDocumentService.uploadDocument(file, selectedCategory);

      // Reload documents to get the latest list
      await loadDocuments();

      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setFile(null);
        setSelectedCategory("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setShowConfirmDialog(false);
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

  const handleViewDocument = async (docId, filename) => {
    try {
      await bankDocumentService.downloadDocument(docId, filename);
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error downloading document. Please try again.');
    }
  };

  const handleDeleteDocument = async (docId, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await bankDocumentService.deleteDocument(docId);
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
        alert('Document deleted successfully');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getCategoryLabel = (value) => {
    const category = documentCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className=" mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Bank Policies</h2>
            <p className="text-gray-600">Upload PDF files containing bank policies for system-wide distribution</p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Category Dropdown */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Document Category *
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {documentCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
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
                      setSelectedCategory("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
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
                    {formatFileSize(file.size)} - PDF File
                  </p>
                  <div className="flex space-x-3">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      onClick={handleUploadClick}
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
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
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
                    <li>Select appropriate document category before uploading</li>
                    <li>Ensure all policies are approved before uploading</li>
                    <li>Files will be accessible to all users with appropriate permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Policies</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading documents...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadedDocuments.length > 0 ? (
                      uploadedDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{doc.original_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getCategoryLabel(doc.doc_type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(doc.upload_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(doc.file_size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDocument(doc.id, doc.original_name)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id, doc.original_name)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No documents uploaded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mt-2">Confirm Upload</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500 mb-2">
                      Are you sure you want to upload this document?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md text-left">
                      <p className="text-sm font-medium text-gray-900">File: {file?.name}</p>
                      <p className="text-sm text-gray-500">Size: {file ? formatFileSize(file.size) : ''}</p>
                      <p className="text-sm text-gray-500">Category: {getCategoryLabel(selectedCategory)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3 mt-4">
                    <button
                      onClick={cancelUpload}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmUpload}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Yes, Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BankPolicyUploadPage;