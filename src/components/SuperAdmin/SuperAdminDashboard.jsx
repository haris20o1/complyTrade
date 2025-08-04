import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../tables/DataTable';
import { getAuditRequests, updateAuditRequestStatus } from '../authentication/apiSuperAdmin';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SuperAdminAudits = () => {
    const [auditRequests, setAuditRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
  
    useEffect(() => {
      const fetchAuditRequests = async () => {
        try {
          setLoading(true);
          setError(''); // Clear previous errors
          
          console.log('Starting to fetch audit requests...');
          const data = await getAuditRequests();
          
          // Verify data structure
          console.log('Received audit requests data:', data);
          
          // Handle different data scenarios more gracefully
          if (data === null || data === undefined) {
            // API returned no data, treat as empty array
            console.log('API returned null/undefined, treating as empty array');
            setAuditRequests([]);
          } else if (Array.isArray(data)) {
            // Valid array response
            setAuditRequests(data);
          } else {
            // Unexpected data format - this is a real error
            console.error('Received data is not an array:', data);
            throw new Error('Invalid data format received from server. Expected an array.');
          }
          
        } catch (err) {
          console.error('Failed to fetch audit requests:', err);
          
          // Set a more specific error message based on the error
          if (err.message.includes('Network Error')) {
            setError('Network error. Please check your connection and try again.');
          } else if (err.response?.status === 401) {
            setError('Authentication error. Please log in again.');
          } else if (err.response?.status === 403) {
            setError('You do not have permission to access audit requests.');
          } else if (err.response?.status === 404) {
            setError('Audit requests endpoint not found. API route may have changed.');
          } else {
            setError(`No Audit Requests Available`);
            console.log(err.message);
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchAuditRequests();
    }, [refreshKey]);
  
    const handleStatusUpdate = async (requestById, requestForId, status) => {
      try {
        setError(''); // Clear previous errors
        
        // Ensure IDs are numbers
        const numericRequestById = Number(requestById);
        const numericRequestForId = Number(requestForId);
        
        console.log(`Updating request by: ${numericRequestById}, for: ${numericRequestForId} to status: ${status}`);
        
        // Call API with updated parameters
        await updateAuditRequestStatus(numericRequestById, numericRequestForId, status);
        
        // Show success message
        alert(`Audit request has been ${status} successfully`);
        
        // Refresh data after successful update
        setRefreshKey(old => old + 1);
      } catch (err) {
        console.error('Failed to update audit request:', err);
        
        // Set a more specific error message based on the error
        if (err.message.includes('Network Error')) {
          setError('Network error. Please check your connection and try again.');
        } else if (err.response?.status === 401) {
          setError('Authentication error. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to update audit requests.');
        } else if (err.response?.status === 404) {
          setError('Audit requests update endpoint not found.');
        } else {
          setError(`Failed to update the audit request: ${err.message}`);
        }
      }
    };

    const columns = [
      // {
      //   key: 'id',
      //   header: 'Request ID',
      //   render: (row) => {
      //     console.log(`Row ID being displayed: ${row.id}`);
      //     return <div className="font-medium text-gray-900">#{row.id}</div>
      //   }
      // },
      {
        key: 'requested_by_name',
        header: 'Requested By',
        render: (row) => (
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${(row.requested_by_name || 'User').replace(' ', '+')}`}
              alt={row.requested_by_name || 'User'}
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-800">{row.requested_by_name || row.requested_by_id}</span>
          </div>
        )
      },
      {
        key: 'request_for_name',
        header: 'Request For',
        render: (row) => (
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${(row.request_for_name || 'User').replace(' ', '+')}`}
              alt={row.request_for_name || 'User'}
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-800">{row.request_for_name || row.request_for_id}</span>
          </div>
        )
      },
      {
        key: 'request_for_role',
        header: 'Role',
        render: (row) => (
          <div className="text-sm text-gray-500 capitalize">{row.request_for_role}</div>
        )
      },
      {
        key: 'created_at',
        header: 'Request Date',
        render: (row) => (
          <div className="text-sm text-gray-500">
            {format(new Date(row.created_at), 'MMM dd, yyyy HH:mm')}
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <div className="text-sm">
            <span className={`px-2 py-1 text-xs rounded-full ${
              row.status === 'approved' ? 'bg-green-100 text-green-800' :
              row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
          </div>
        )
      }
    ];
  
  
const actionColumn = (row, onRowAction) => {
  console.log('Action column row object:', row);
  
  return (
    <div className="flex space-x-2">
      {row.status === 'pending' && (
        <>
          <button
            onClick={() => {
              console.log(`Approving audit request for ${row.requested_by_name}`);
              onRowAction('approve', row);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
          >
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Approve
          </button>
          <button
            onClick={() => {
              console.log(`Rejecting audit request for ${row.requested_by_name}`);
              onRowAction('reject', row);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
          >
            <XCircleIcon className="h-3 w-3 mr-1" />
            Reject
          </button>
        </>
      )}
      {row.status !== 'pending' && (
        <span className="text-sm text-gray-500 italic">
          {row.status === 'approved' ? 'Approved' : 'Rejected'}
        </span>
      )}
    </div>
  );
};
  
    const handleRowAction = (action, row) => {
      console.log(`handleRowAction called with action: ${action}`, row);
      
      if (action === 'approve') {
        handleStatusUpdate(row.requested_by_id, row.request_for_id, 'approved');
      } else if (action === 'reject') {
        handleStatusUpdate(row.requested_by_id, row.request_for_id, 'rejected');
      }
    };
  
    const handleRefresh = () => {
      console.log('Refreshing audit requests...');
      setRefreshKey(old => old + 1);
    };
  
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Audit Requests</h1>
          </div>
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Manage Audit Access Requests
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Review and take action on pending audit access requests.
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Refresh
                  </button>
                </div>
  
                {loading ? (
                  <div className="px-4 py-10 sm:px-6 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-500">Loading audit requests...</span>
                    </div>
                  </div>
                ) : error ? (
                  // <div className="px-4 py-5 sm:px-6">
                  //   <div className="rounded-md bg-red-50 p-4">
                  //     <div className="flex">
                  //       <div className="flex-shrink-0">
                  //         <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  //       </div>
                  //       <div className="ml-3">
                  //         <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                  //         <div className="mt-2 text-sm text-red-700">
                  //           <p>{error}</p>
                  //         </div>
                  //       </div>
                  //     </div>
                  //     <div className="mt-3 flex justify-end">
                  //       <button
                  //         onClick={handleRefresh}
                  //         className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  //       >
                  //         Try Again
                  //       </button>
                  //     </div>
                  //   </div>
                  // </div>
                    <div className="bg-gray-50 border border-gray-300 text-gray-600 text-sm px-4 py-3 rounded-md text-center shadow-sm">
            {error}
          </div>
                ) : auditRequests.length === 0 ? (
                  <div className="px-4 py-10 sm:px-6 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                      <p className="mt-1 text-sm text-gray-500">There are currently no audit requests to display.</p>
                    </div>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={auditRequests}
                    onRowAction={handleRowAction}
                    actionColumn={actionColumn}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };
  
  export default SuperAdminAudits;