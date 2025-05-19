import React, { useState, useEffect } from 'react';
import { lcService } from '../authentication/apiManagerCompliance';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  EyeIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const CompletedLCs = () => {
  const [completedLCs, setCompletedLCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCompletedLCs = async () => {
      try {
        setLoading(true);
        const data = await lcService.getCompletedLCs();
        setCompletedLCs(data);
        setTotalItems(data.length);
      } catch (err) {
        console.error('Error fetching completed LCs:', err);
        setError('Failed to load completed Letters of Credit. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedLCs();
  }, []);

  // Format date to YYYY-MM-DD format
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch (err) {
      return dateString;
    }
  };

  // Calculate processing time in days
  const calculateProcessingTime = (startDate, completeDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(completeDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (err) {
      return 'N/A';
    }
  };

  // Handle viewing LC details
  const handleViewLC = (lcNo) => {
    console.log('Viewing LC details:', lcNo);
    // Add navigation logic here
  };

  // Handle downloading LC files
  const handleDownloadFiles = (lcNo, filePath) => {
    console.log('Downloading files for LC:', lcNo, filePath);

    // Implementation for downloading files
    lcService.downloadLCDocument(filePath)
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LC${lcNo}_documents.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => {
        console.error('Error downloading file:', err);
        alert('Failed to download file. Please try again.');
      });
  };

  // Export to CSV or Excel
  const handleExport = () => {
    console.log('Exporting data');
    // Implementation for exporting data
    alert('Export functionality will be implemented here');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = completedLCs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout> 
    {/* <div className="p-6 max-w-7xl mx-auto"> */}
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Completed Letters of Credit</h1>
        <p className="text-gray-600">View history of completed LC processing and access archived documents.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <span className="text-gray-600 font-medium">{completedLCs.length} documents completed</span>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filter
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        {completedLCs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No completed Letters of Credit found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LC Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((lc) => (
                  <tr key={lc.lc_no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{lc.lc_no}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {lc.assigned_user ? 'CM' : 'N/A'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {lc.assigned_user ? `User ID: ${lc.assigned_user}` : 'Not assigned'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(lc.user_complete_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateProcessingTime(lc.created_at, lc.user_complete_at)} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLC(lc.lc_no)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <EyeIcon className="h-5 w-5 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadFiles(lc.lc_no, lc.orginal_700_message_path)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                          Files
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Processing Statistics</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Average processing time</p>
              <p className="text-xl font-bold text-gray-900">
                {completedLCs.length > 0
                  ? (
                      completedLCs.reduce(
                        (acc, lc) => 
                          acc + calculateProcessingTime(lc.created_at, lc.user_complete_at), 
                        0
                      ) / completedLCs.length
                    ).toFixed(1)
                  : 0} days
              </p>
            </div>
            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Processed</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Completed LCs</p>
              <p className="text-xl font-bold text-gray-900">{completedLCs.length}</p>
            </div>
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Document Access</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available files</p>
              <p className="text-xl font-bold text-gray-900">
                {completedLCs.filter(lc => lc.orginal_700_message_path).length}
              </p>
            </div>
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout> 
  );
};

export default CompletedLCs;