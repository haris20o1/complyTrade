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
          
          // Check if data is an array
          if (!Array.isArray(data)) {
            console.error('Received data is not an array:', data);
            setError('Invalid data format received from server. Expected an array.');
            return;
          }
          
          setAuditRequests(data);
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
            setError(`Failed to load audit requests: ${err.message}`);
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
      {
        key: 'id',
        header: 'Request ID',
        render: (row) => {
          console.log(`Row ID being displayed: ${row.id}`);
          return <span className="font-medium text-gray-700">#{row.id}</span>
        }
      },
      {
        key: 'requested_by_name',
        header: 'Requested By',
        render: (row) => <span>{row.requested_by_name || row.requested_by_id}</span>
      },
      {
        key: 'request_for_name',
        header: 'Request For',
        render: (row) => <span>{row.request_for_name || row.request_for_id}</span>
      },
      {
        key: 'request_for_role',
        header: 'Role',
        render: (row) => <span className="capitalize">{row.request_for_role}</span>
      },
      {
        key: 'created_at',
        header: 'Request Date',
        render: (row) => (
          <span className="text-gray-600">
            {format(new Date(row.created_at), 'MMM dd, yyyy HH:mm')}
          </span>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            row.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
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
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Approve
              </button>
              <button
                onClick={() => {
                  console.log(`Rejecting audit request for ${row.requested_by_name}`);
                  onRowAction('reject', row);
                }}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
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
                  <div className="px-4 py-5 sm:px-6">
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleRefresh}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                ) : auditRequests.length === 0 ? (
                  <div className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    No audit requests found.
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