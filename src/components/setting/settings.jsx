import React, { useState, useEffect } from 'react';
import { UserIcon, KeyIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../layouts/DashboardLayout';
import { userService } from '../authentication/apiITManager';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const Settings = () => {
  // Get user info from AuthContext instead of fetching separately
  const { userInfo, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false); // Only for password change operations
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Roles mapping for display
  const roleDisplayNames = {
    'admin': 'Administrator',
    'it_admin': 'IT Admin',
    'complyce_manager': 'Compliance Manager',
    'swift_manager': 'SWIFT Operator',
    'support_doc_manager': 'Support Uploader',
    'super_admin': 'Super Admin'
  };

  // Clear any existing errors when userInfo is available
  useEffect(() => {
    if (userInfo) {
      setError('');
    }
  }, [userInfo]);

  // Handle password form input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Password changed successfully!',
        type: 'success'
      });
      
      // Reset form and hide change password section
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      
    } catch (err) {
      console.error('Password change failed:', err);
      let errorMessage = 'Failed to change password';
      
      // Extract API error message if available
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setNotification({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowChangePassword(false);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  return (
    <DashboardLayout>
      <div className=" bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{notification.message}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                      className={`inline-flex rounded-md p-1.5 ${notification.type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'}`}
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className=" mx-auto space-y-6">
            {/* Page Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your account information and security settings</p>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Profile Information
                </h3>
              </div>
              
              {error ? (
                <div className="p-6 text-center">
                  <div className="text-red-500 mb-4">{error}</div>
                </div>
              ) : authLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : userInfo ? (
                <div className="px-6 py-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userInfo.username || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userInfo.fullname || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userInfo.email || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userInfo.role)}`}>
                          {roleDisplayNames[userInfo.role] || userInfo.role || '-'}
                        </span>
                      </dd>
                    </div>
                    {/* Show password expiry status if available */}
                    {/* {userInfo.password_expired !== undefined && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Password Status</dt>
                        <dd className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userInfo.password_expired 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {userInfo.password_expired ? 'Password Expired' : 'Password Active'}
                          </span>
                          {userInfo.password_expired && (
                            <p className="mt-1 text-sm text-red-600">
                              Your password has expired. Please change it below.
                            </p>
                          )}
                        </dd>
                      </div>
                    )} */}
                  </dl>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-gray-500">No user information available</div>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Security
                </h3>
              </div>
              
              <div className="px-6 py-4">
                {!showChangePassword ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-500">
                        Change your account password
                        {/* {userInfo?.password_expired && (
                          <span className="text-red-600 font-medium"> (Password Expired - Change Required)</span>
                        )} */}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500`}
                    >
                      {userInfo?.password_expired ? 'Change Expired Password' : 'Change Password'}
                    </button>

                    {/* <button
                      onClick={() => setShowChangePassword(true)}
                      className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        userInfo?.password_expired
                          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                      }`}
                    >
                      {userInfo?.password_expired ? 'Change Expired Password' : 'Change Password'}
                    </button> */}
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
                      
                      {/* Current Password */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="currentPassword"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInputChange}
                            className={`block w-full pr-10 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      {/* New Password */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                            className={`block w-full pr-10 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            className={`block w-full pr-10 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Password Requirements */}
                      <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Password Requirements</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <ul className="list-disc list-inside space-y-1">
                                <li>At least 8 characters long</li>
                                <li>Must be different from your current password</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancelPasswordChange}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get role badge colors
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

export default Settings;