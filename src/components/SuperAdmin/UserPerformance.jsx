import React, { useState, useEffect } from 'react';
//import { format } from 'date-fns';
import DashboardLayout from '../layouts/DashboardLayout';
import PerformanceCharts from './PerformanceChart';
import { getAllUsers, getUserPerformance } from '../authentication/apiSuperAdmin';

const UserPerformanceDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching users...');
        const data = await getAllUsers();
        
        if (!Array.isArray(data)) {
          console.error('Received data is not an array:', data);
          setError('Invalid data format received from server. Expected an array.');
          return;
        }
        
        setUsers(data);
        console.log(`Successfully fetched ${data.length} users`);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        
        if (err.message.includes('Network Error')) {
          setError('Network error. Please check your connection and try again.');
        } else if (err.response?.status === 401) {
          setError('Authentication error. Please log in again.');
        } else {
          setError(`Failed to load users: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchUserPerformance = async () => {
      try {
        setLoadingPerformance(true);
        setError('');
        
        console.log(`Fetching performance data for user ${selectedUser.id}...`);
        const data = await getUserPerformance(selectedUser.id);
        
        if (!data || Object.keys(data).length === 0) {
          setPerformanceData(null);
          setError('No performance data available for this user.');
        } else {
          setPerformanceData(data);
          console.log('Performance data loaded successfully:', data);
        }
      } catch (err) {
        console.error('Failed to fetch user performance:', err);
        
        if (err.response?.status === 404) {
          setError('No performance data found for this user.');
        } else if (err.message.includes('Network Error')) {
          setError('Network error. Please check your connection and try again.');
        } else if (err.response?.status === 401) {
          setError('Authentication error. Please log in again.');
        } else {
          setError(`Failed to load performance data: ${err.message}`);
        }
      } finally {
        setLoadingPerformance(false);
      }
    };
  
    fetchUserPerformance();
  }, [selectedUser]);

  
  const handleUserSelect = (user) => {
    console.log('User selected:', user);
    setSelectedUser(user);
  };

  const rolesConfig = {
    admin: {
      displayName: 'Administrator',
      badgeColor: 'bg-red-100 text-red-800',
    },
    it_admin: {
      displayName: 'IT Admin',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    complyce_manager: {
      displayName: 'Compliance Manager',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    swift: {
      displayName: 'SWIFT Operator',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    support: {
      displayName: 'Support Staff',
      badgeColor: 'bg-gray-100 text-gray-800',
    },
    super_admin: {
      displayName: 'Super Admin',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  };
  
  // Convert to array format (equivalent to your availableRoles)
  const availableRoles = Object.entries(rolesConfig).map(([id, role]) => ({
    id,
    name: role.displayName,
  }));


  const handleRefresh = () => {
    console.log('Refreshing data...');
    setRefreshKey(prev => prev + 1);
    
    // If a user is selected, also refresh their performance data
    if (selectedUser) {
      const currentSelectedUser = selectedUser;
      setSelectedUser(null);
      // Small delay to ensure state update before setting again
      setTimeout(() => setSelectedUser(currentSelectedUser), 100);
    }
  };

  // Function to determine the user role badge color
  const getRoleBadgeColor = (role) => {
   return rolesConfig[role]?.badgeColor || 'bg-gray-100 text-gray-800';
    
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">User Performance Dashboard</h1>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Monitor performance metrics and activity for all users in the system.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto px-4 sm:px-6 md:px-8 py-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-500">Loading users...</span>
            </div>
          </div>
        ) : error && !selectedUser ? (
          <div className="mx-auto px-4 sm:px-6 md:px-8 py-8">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto px-4 sm:px-6 md:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* User List Panel */}
              <div className="lg:w-1/3">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a user to view their performance metrics
                    </p>
                  </div>
                  <ul className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {users.length === 0 ? (
                      <li className="px-4 py-4 flex items-center justify-center text-gray-500">
                        No users found
                      </li>
                    ) : (
                      users.map((user) => (
                        <li 
                          key={user.id}
                          className={`px-4 py-4 cursor-pointer hover:bg-gray-50 transition duration-150 ${
                            selectedUser?.id === user.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 uppercase font-bold">
                                {user.fullname?.charAt(0) || user.username?.charAt(0) || '?'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullname || user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getRoleBadgeColor(user.role)
                              }`}>
                               {rolesConfig[user.role]?.displayName || user.role}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              {/* Performance Details Panel */}
              <div className="lg:w-2/3">
                {!selectedUser ? (
                  <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-64">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No User Selected</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Select a user from the list to view their performance details
                      </p>
                    </div>
                  </div>
                ) : loadingPerformance ? (
                  <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-500">Loading performance data...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error loading performance data</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : performanceData ? (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {performanceData.fullname || performanceData.username} Performance
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Detailed metrics and activity data
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getRoleBadgeColor(selectedUser.role)
                        }`}>
                          {rolesConfig[selectedUser.role]?.displayName || selectedUser.role}

                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <PerformanceCharts performanceData={performanceData} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserPerformanceDashboard;