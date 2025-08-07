import React, { useState, useEffect } from 'react';
import { 
  KeyIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  CogIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../layouts/DashboardLayout';

// Dummy data for password reset requests
const initialPasswordRequests = [
  {
    id: 1,
    username: 'complyce_manager',
    fullname: 'Ali',
    email: 'ali@resolve.com',
    role: 'complyce_manager',
    requestedAt: '2025-08-05T10:30:00Z',
    status: 'pending'
  },
  {
    id: 2,
    username: 'swift_manager',
    fullname: 'Sarah',
    email: 'sarah@resolve.com',
    role: 'swift_manager',
    requestedAt: '2025-08-05T09:15:00Z',
    status: 'pending'
  },
  {
    id: 3,
    username: 'support',
    fullname: 'Ahmad',
    email: 'ahmad@resolve.com',
    role: 'support_doc_manager',
    requestedAt: '2025-08-04T16:45:00Z',
    status: 'completed'
  }
];

// Dummy data for user passwords (for admin view)
const initialUserPasswords = [
  {
    id: 1,
    username: 'complyce_manager',
    fullname: 'Ali',
    role: 'complyce_manager',
    password: 'TempPass123!',
    lastReset: '2025-08-05T11:00:00Z',
    resetBy: 'it_admin'
  },
  {
    id: 2,
    username: 'swift_manage',
    fullname: 'Sarah',
    role: 'swift_manager',
    password: 'SecurePass456@',
    lastReset: '2025-08-05T10:30:00Z',
    resetBy: 'it_admin'
  },
  {
    id: 3,
    username: 'mike_johnson',
    fullname: 'Mike Johnson',
    role: 'support_doc_manager',
    password: 'NewPass789#',
    lastReset: '2025-08-04T17:00:00Z',
    resetBy: 'it_admin'
  }
];

const PasswordResetManagement = () => {
  const [currentView, setCurrentView] = useState('it_admin'); // 'it_admin' or 'admin'
  const [passwordRequests, setPasswordRequests] = useState(initialPasswordRequests);
  const [userPasswords, setUserPasswords] = useState(initialUserPasswords);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase  
    password += '0123456789'[Math.floor(Math.random() * 10)]; // number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special
    
    // Fill remaining length
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Handle password reset
  const handlePasswordReset = (requestId) => {
    const request = passwordRequests.find(req => req.id === requestId);
    if (!request) return;

    const newPassword = generatePassword();
    
    // Update request status
    setPasswordRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed' }
          : req
      )
    );

    // Add/update password in admin view
    setUserPasswords(prev => {
      const existing = prev.find(user => user.username === request.username);
      if (existing) {
        return prev.map(user => 
          user.username === request.username
            ? { ...user, password: newPassword, lastReset: new Date().toISOString(), resetBy: 'it_admin' }
            : user
        );
      } else {
        return [...prev, {
          id: Date.now(),
          username: request.username,
          fullname: request.fullname,
          role: request.role,
          password: newPassword,
          lastReset: new Date().toISOString(),
          resetBy: 'it_admin'
        }];
      }
    });

    // Show success notification
    setNotification({
      show: true,
      message: `Password reset for ${request.username}. New password generated successfully!`,
      type: 'success'
    });

    // Auto-hide notification
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Copy password to clipboard
  const copyToClipboard = (password, username) => {
    navigator.clipboard.writeText(password).then(() => {
      setNotification({
        show: true,
        message: `Password for ${username} copied to clipboard!`,
        type: 'success'
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'it_admin':
        return 'bg-purple-100 text-purple-800';
      case 'complyce_manager':
        return 'bg-blue-100 text-blue-800';
      case 'swift_manager':
        return 'bg-green-100 text-green-800';
      case 'support_doc_manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'super_admin':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const ITAdminView = () => (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Password Reset Requests</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                IT Admin Panel
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Process password reset requests from users. Generate new passwords automatically.
          </p>
        </div>

        {/* Requests List */}
        <div className="overflow-hidden">
          {passwordRequests.length === 0 ? (
            <div className="text-center py-12">
              <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No password reset requests</h3>
              <p className="mt-1 text-sm text-gray-500">All requests have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {passwordRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {request.fullname}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(request.role)}`}>
                            {request.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>@{request.username}</span>
                          <span>•</span>
                          <span>{request.email}</span>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>Requested: {formatDate(request.requestedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {request.status === 'pending' ? (
                        <>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                          <button
                            onClick={() => handlePasswordReset(request.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <KeyIcon className="h-4 w-4 mr-2" />
                            Generate Password
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeyIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">User Password Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Administrator Panel
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            View and manage user passwords. Share passwords physically with users when needed.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Security Notice:</strong> These passwords should only be shared physically and in secure environments. Never transmit passwords electronically.
              </p>
            </div>
          </div>
        </div>

        {/* Password List */}
        <div className="overflow-hidden">
          {userPasswords.length === 0 ? (
            <div className="text-center py-12">
              <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No password records</h3>
              <p className="mt-1 text-sm text-gray-500">No passwords have been reset recently.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userPasswords.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.fullname}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>@{user.username}</span>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                          <span>Reset by: {user.resetBy}</span>
                          <span>•</span>
                          <span>Last reset: {formatDate(user.lastReset)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                        <code className="text-sm font-mono">
                          {visiblePasswords[user.id] ? user.password : '••••••••••••'}
                        </code>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title={visiblePasswords[user.id] ? 'Hide password' : 'Show password'}
                        >
                          {visiblePasswords[user.id] ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(user.password, user.username)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Copy password"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('it_admin')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentView === 'it_admin'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CogIcon className="h-4 w-4 mr-2" />
                IT Admin View
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentView === 'admin'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <KeyIcon className="h-4 w-4 mr-2" />
                Admin View
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
            notification.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.type === 'success' ? 'Success!' : 'Error!'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  >
                    <span className="sr-only">Close</span>
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">

        {currentView === 'it_admin' ? <ITAdminView /> : <AdminView />}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default PasswordResetManagement;