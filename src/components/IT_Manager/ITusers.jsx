// import React, { useState, useEffect } from 'react';
// import DataTable from '../tables/DataTable';
// import { UserIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import DashboardLayout from '../layouts/DashboardLayout';
// import { userService } from'../authentication/apiITManager'

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
//   const [currentUser, setCurrentUser] = useState({
//     id: null,
//     username: '',
//     email: '',
//     fullname: '',
//     role: 'complyce_manager',
//     password: ''
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

//   // Roles available in the system
//   const availableRoles = [
//     { id: 'admin', name: 'Administrator' },
//     { id: 'it_admin', name: 'IT Admin' },
//     { id: 'complyce_manager', name: 'Compliance Manager' },
//     { id: 'swift', name: 'SWIFT Operator' },
//     { id: 'support', name: 'Support Staff' }
//   ];

//   // Fetch users from API
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await userService.getAllUsers();
//       setUsers(data);
//     } catch (err) {
//       console.error('Failed to fetch users:', err);
//       setError('Failed to load users. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle modal open for add or edit
//   const handleOpenModal = (mode, user = null) => {
//     setModalMode(mode);
//     setFormErrors({});
    
//     if (mode === 'edit' && user) {
//       setCurrentUser({ 
//         ...user,
//         password: mode === 'add' ? '' : 'placeholder_for_unchanged_password'
//       });
//     } else {
//       setCurrentUser({
//         id: null,
//         username: '',
//         email: '',
//         fullname: '',
//         role: 'complyce_manager',
//         password: ''
//       });
//     }
    
//     setShowModal(true);
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentUser(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error for this field when user types
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // Validate form data
//   const validateForm = () => {
//     const errors = {};
//     if (!currentUser.username.trim()) errors.username = 'Username is required';
//     if (!currentUser.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
//       errors.email = 'Email is invalid';
//     }
//     if (!currentUser.fullname.trim()) errors.fullname = 'Full name is required';
    
//     // Password validation for new users or when changing password
//     if (modalMode === 'add' && !currentUser.password.trim()) {
//       errors.password = 'Password is required';
//     } else if (currentUser.password && currentUser.password !== 'placeholder_for_unchanged_password' && currentUser.password.length < 8) {
//       errors.password = 'Password must be at least 8 characters';
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     try {
//       if (modalMode === 'add') {
//         // Create new user with the registration API
//         await userService.createUser({
//           username: currentUser.username,
//           email: currentUser.email,
//           fullname: currentUser.fullname,
//           role: currentUser.role,
//           password: currentUser.password
//         });
//       } else {
//         // Update existing user
//         const userData = {
//           id: currentUser.id,
//           username: currentUser.username,
//           email: currentUser.email,
//           fullname: currentUser.fullname,
//           role: currentUser.role
//         };
        
//         // Only include password if it was changed
//         if (currentUser.password && currentUser.password !== 'placeholder_for_unchanged_password') {
//           userData.password = currentUser.password;
//         }
        
//         await userService.updateUser(currentUser.id, userData);
//       }
      
//       // Refresh the user list
//       await fetchUsers();
      
//       // Show success notification
//       setNotification({
//         show: true,
//         message: modalMode === 'add' ? 'User created successfully!' : 'User updated successfully!',
//         type: 'success'
//       });
      
//       // Close the modal
//       setShowModal(false);
      
//       // Auto-hide notification after 3 seconds
//       setTimeout(() => {
//         setNotification(prev => ({ ...prev, show: false }));
//       }, 3000);
      
//     } catch (err) {
//       console.error('Operation failed:', err);
//       let errorMessage = 'Operation failed';
      
//       // Extract API error message if available
//       if (err.response && err.response.data && err.response.data.detail) {
//         if (Array.isArray(err.response.data.detail)) {
//           // Handle validation errors
//           errorMessage = err.response.data.detail.map(e => `${e.msg} (${e.loc.join('.')})`).join(', ');
//         } else {
//           errorMessage = err.response.data.detail;
//         }
//       }
      
//       setNotification({
//         show: true,
//         message: errorMessage,
//         type: 'error'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle user deletion
//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       return;
//     }
    
//     setLoading(true);
//     try {
//       await userService.deleteUser(userId);
      
//       // Refresh the user list
//       await fetchUsers();
      
//       // Show success notification
//       setNotification({
//         show: true,
//         message: 'User deleted successfully!',
//         type: 'success'
//       });
      
//       // Auto-hide notification after 3 seconds
//       setTimeout(() => {
//         setNotification(prev => ({ ...prev, show: false }));
//       }, 3000);
      
//     } catch (err) {
//       console.error('Delete operation failed:', err);
//       setNotification({
//         show: true,
//         message: `Delete failed: ${err.message}`,
//         type: 'error'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define table columns
//   const columns = [
//     {
//       key: 'id',
//       header: 'ID',
//       render: (row) => <span className="text-gray-600">#{row.id}</span>
//     },
//     {
//       key: 'username',
//       header: 'Username'
//     },
//     {
//       key: 'email',
//       header: 'Email'
//     },
//     {
//       key: 'fullname',
//       header: 'Full Name'
//     },
//     {
//       key: 'role',
//       header: 'Role',
//       render: (row) => {
//         const role = availableRoles.find(r => r.id === row.role);
//         return (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(row.role)}`}>
//             {role ? role.name : row.role}
//           </span>
//         );
//       }
//     }
//   ];

//   // Action column for the table
//   const actionColumn = (row, onRowAction) => (
//     <div className="flex space-x-2">
//       <button
//         onClick={() => handleOpenModal('edit', row)}
//         className="text-blue-600 hover:text-blue-800"
//         title="Edit User"
//       >
//         <PencilIcon className="h-5 w-5" />
//       </button>
//       <button
//         onClick={() => handleDeleteUser(row.id)}
//         className="text-red-600 hover:text-red-800"
//         title="Delete User"
//         disabled={row.username === 'root'} // Prevent deleting the root user
//       >
//         <TrashIcon className={`h-5 w-5 ${row.username === 'root' ? 'opacity-30 cursor-not-allowed' : ''}`} />
//       </button>
//     </div>
//   );

//   // Helper to get badge color based on role
//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin':
//         return 'bg-red-100 text-red-800';
//       case 'it_admin':
//         return 'bg-purple-100 text-purple-800';
//       case 'complyce_manager':
//         return 'bg-blue-100 text-blue-800';
//       case 'swift':
//         return 'bg-green-100 text-green-800';
//       case 'support':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <DashboardLayout>
//     <div className="min-h-screen bg-gray-100">
      
//       {/* Main content */}
//       <div className="container mx-auto py-8 px-4">
//         {/* Notification */}
//         {notification.show && (
//           <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 {notification.type === 'success' ? (
//                   <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 ) : (
//                   <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm">{notification.message}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <div className="-mx-1.5 -my-1.5">
//                   <button
//                     onClick={() => setNotification(prev => ({ ...prev, show: false }))}
//                     className={`inline-flex rounded-md p-1.5 ${notification.type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'}`}
//                   >
//                     <span className="sr-only">Dismiss</span>
//                     <XMarkIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-lg font-medium text-gray-900">User Management</h2>
//             <button
//               onClick={() => handleOpenModal('add')}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <PlusIcon className="h-4 w-4 mr-2" />
//               Add User
//             </button>
//           </div>
          
//           {error ? (
//             <div className="p-6 text-center">
//               <div className="text-red-500 mb-4">{error}</div>
//               <button
//                 onClick={fetchUsers}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : loading && users.length === 0 ? (
//             <div className="flex justify-center items-center p-12">
//               <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
//                 <span className="sr-only">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <DataTable
//               columns={columns}
//               data={users}
//               actionColumn={actionColumn}
//             />
//           )}
//         </div>
//       </div>
      
//       {/* Add/Edit User Modal */}
//       {showModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <form onSubmit={handleSubmit}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                       <UserIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                       <h3 className="text-lg leading-6 font-medium text-gray-900">
//                         {modalMode === 'add' ? 'Add New User' : 'Edit User'}
//                       </h3>
//                       <div className="mt-4 space-y-4">
//                         {/* Username field - now editable even in edit mode */}
//                         <div>
//                           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                             Username
//                           </label>
//                           <input
//                             type="text"
//                             name="username"
//                             id="username"
//                             value={currentUser.username}
//                             onChange={handleInputChange}
//                             className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               formErrors.username ? 'border-red-300' : 'border-gray-300'
//                             }`}
//                           />
//                           {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
//                         </div>

//                         {/* Email field */}
//                         <div>
//                           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                             Email
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             id="email"
//                             value={currentUser.email}
//                             onChange={handleInputChange}
//                             className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               formErrors.email ? 'border-red-300' : 'border-gray-300'
//                             }`}
//                           />
//                           {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
//                         </div>

//                         {/* Full Name field */}
//                         <div>
//                           <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
//                             Full Name
//                           </label>
//                           <input
//                             type="text"
//                             name="fullname"
//                             id="fullname"
//                             value={currentUser.fullname}
//                             onChange={handleInputChange}
//                             className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               formErrors.fullname ? 'border-red-300' : 'border-gray-300'
//                             }`}
//                           />
//                           {formErrors.fullname && <p className="mt-1 text-sm text-red-600">{formErrors.fullname}</p>}
//                         </div>

//                         {/* Password field - new field with conditional label */}
//                         <div>
//                           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             {modalMode === 'add' ? 'Password' : 'Password (Leave empty to keep current)'}
//                           </label>
//                           <input
//                             type="password"
//                             name="password"
//                             id="password"
//                             value={modalMode === 'edit' && currentUser.password === 'placeholder_for_unchanged_password' ? '' : currentUser.password}
//                             onChange={handleInputChange}
//                             placeholder={modalMode === 'edit' ? '••••••••' : ''}
//                             className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               formErrors.password ? 'border-red-300' : 'border-gray-300'
//                             }`}
//                           />
//                           {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
//                         </div>

//                         {/* Role field */}
//                         <div>
//                           <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                             Role
//                           </label>
//                           <select
//                             name="role"
//                             id="role"
//                             value={currentUser.role}
//                             onChange={handleInputChange}
//                             disabled={currentUser.username === 'root'} // Can't change root's role
//                             className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                               currentUser.username === 'root' ? 'bg-gray-100' : ''
//                             }`}
//                           >
//                             {availableRoles.map((role) => (
//                               <option key={role.id} value={role.id}>
//                                 {role.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         {modalMode === 'add' && (
//                           <div className="rounded-md bg-yellow-50 p-4">
//                             <div className="flex">
//                               <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                               </div>
//                               <div className="ml-3">
//                                 <h3 className="text-sm font-medium text-yellow-800">Password Requirements</h3>
//                                 <div className="mt-2 text-sm text-yellow-700">
//                                   <p>Password must be at least 8 characters long.</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </>
//                     ) : modalMode === 'add' ? 'Add User' : 'Save Changes'}
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                     onClick={() => setShowModal(false)}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </DashboardLayout>
//   );
// };

// export default UserManagement;

import React, { useState, useEffect } from 'react';
import { UserIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../tables/DataTable';
import { userService } from '../authentication/apiITManager';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: '',
    email: '',
    fullname: '',
    role: 'complyce_manager',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Roles available in the system
  const availableRoles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'it_admin', name: 'IT Admin' },
    { id: 'complyce_manager', name: 'Compliance Manager' },
    { id: 'swift', name: 'SWIFT Operator' },
    { id: 'support', name: 'Support Staff' },
    { id: 'super_admin', name: 'Super Admin' }
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and selected role
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(lowerCaseSearch) ||
        user.email.toLowerCase().includes(lowerCaseSearch) ||
        user.fullname.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply role filter
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, selectedRole, users]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (roleId) => {
    setSelectedRole(roleId);
    setShowFilterDropdown(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setShowFilterDropdown(false);
  };

  // Handle modal open for add or edit
  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setFormErrors({});
    
    if (mode === 'edit' && user) {
      setCurrentUser({ 
        ...user,
        password: mode === 'add' ? '' : 'placeholder_for_unchanged_password'
      });
    } else {
      setCurrentUser({
        id: null,
        username: '',
        email: '',
        fullname: '',
        role: 'complyce_manager',
        password: ''
      });
    }
    
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    if (!currentUser.username.trim()) errors.username = 'Username is required';
    if (!currentUser.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentUser.email)) {
      errors.email = 'Email is invalid';
    }
    if (!currentUser.fullname.trim()) errors.fullname = 'Full name is required';
    
    // Password validation for new users or when changing password
    if (modalMode === 'add' && !currentUser.password.trim()) {
      errors.password = 'Password is required';
    } else if (currentUser.password && currentUser.password !== 'placeholder_for_unchanged_password' && currentUser.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (modalMode === 'add') {
        // Create new user with the registration API
        await userService.createUser({
          username: currentUser.username,
          email: currentUser.email,
          fullname: currentUser.fullname,
          role: currentUser.role,
          password: currentUser.password
        });
      } else {
        // Update existing user
        const userData = {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          fullname: currentUser.fullname,
          role: currentUser.role
        };
        
        // Only include password if it was changed
        if (currentUser.password && currentUser.password !== 'placeholder_for_unchanged_password') {
          userData.password = currentUser.password;
        }
        
        await userService.updateUser(currentUser.id, userData);
      }
      
      // Refresh the user list
      await fetchUsers();
      
      // Show success notification
      setNotification({
        show: true,
        message: modalMode === 'add' ? 'User created successfully!' : 'User updated successfully!',
        type: 'success'
      });
      
      // Close the modal
      setShowModal(false);
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      
    } catch (err) {
      console.error('Operation failed:', err);
      let errorMessage = 'Operation failed';
      
      // Extract API error message if available
      if (err.response && err.response.data && err.response.data.detail) {
        if (Array.isArray(err.response.data.detail)) {
          // Handle validation errors
          errorMessage = err.response.data.detail.map(e => `${e.msg} (${e.loc.join('.')})`).join(', ');
        } else {
          errorMessage = err.response.data.detail;
        }
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

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await userService.deleteUser(userId);
      
      // Refresh the user list
      await fetchUsers();
      
      // Show success notification
      setNotification({
        show: true,
        message: 'User deleted successfully!',
        type: 'success'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      
    } catch (err) {
      console.error('Delete operation failed:', err);
      setNotification({
        show: true,
        message: `Delete failed: ${err.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Define table columns - removed ID column
  const columns = [
    {
      key: 'username',
      header: 'Username'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'fullname',
      header: 'Full Name'
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => {
        const role = availableRoles.find(r => r.id === row.role);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(row.role)}`}>
            {role ? role.name : row.role}
          </span>
        );
      }
    }
  ];

  // Action column for the table
  const actionColumn = (row) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleOpenModal('edit', row)}
        className="text-blue-600 hover:text-blue-800"
        title="Edit User"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDeleteUser(row.id)}
        className="text-red-600 hover:text-red-800"
        title="Delete User"
        disabled={row.username === 'root'} // Prevent deleting the root user
      >
        <TrashIcon className={`h-5 w-5 ${row.username === 'root' ? 'opacity-30 cursor-not-allowed' : ''}`} />
      </button>
    </div>
  );

  // Helper to get badge color based on role
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'it_admin':
        return 'bg-purple-100 text-purple-800';
      case 'complyce_manager':
        return 'bg-blue-100 text-blue-800';
      case 'swift':
        return 'bg-green-100 text-green-800';
      case 'support':
        return 'bg-yellow-100 text-yellow-800';
        case 'super_admin':
          return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter dropdown component
  const FilterDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <FunnelIcon className="h-4 w-4 mr-1" aria-hidden="true" />
        Filter
      </button>
      
      {showFilterDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Filter by Role</h3>
            </div>
            <div className="py-1">
              <button
                onClick={() => handleRoleFilterChange('')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${!selectedRole ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                role="menuitem"
              >
                All Roles
              </button>
              {availableRoles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleFilterChange(role.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedRole === role.id ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                  role="menuitem"
                >
                  {role.name}
                </button>
              ))}
            </div>
            {selectedRole && (
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="w-full text-left text-sm text-red-600 hover:text-red-800"
                  role="menuitem"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Main content */}
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
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
              <button
                onClick={() => handleOpenModal('add')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search users..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <FilterDropdown />
                  {(searchTerm || selectedRole) && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              {/* Active filters display */}
              {(searchTerm || selectedRole) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedRole && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Role: {availableRoles.find(r => r.id === selectedRole)?.name || selectedRole}
                    </span>
                  )}
                </div>
              )}
            </div>
          
            {error ? (
              <div className="p-6 text-center">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                  onClick={fetchUsers}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              </div>
            ) : loading && users.length === 0 ? (
              <div className="flex justify-center items-center p-12">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No users found with the current filters.</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredUsers}
                actionColumn={actionColumn}
              />
            )}
          </div>
        </div>
        
        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <UserIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                        </h3>
                        <div className="mt-4 space-y-4">
                          {/* Username field */}
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                              Username
                            </label>
                            <input
                              type="text"
                              name="username"
                              id="username"
                              value={currentUser.username}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formErrors.username ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
                          </div>

                          {/* Email field */}
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={currentUser.email}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formErrors.email ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                          </div>

                          {/* Full Name field */}
                          <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="fullname"
                              id="fullname"
                              value={currentUser.fullname}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formErrors.fullname ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.fullname && <p className="mt-1 text-sm text-red-600">{formErrors.fullname}</p>}
                          </div>

                          {/* Password field */}
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              {modalMode === 'add' ? 'Password' : 'Password (Leave empty to keep current)'}
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              value={modalMode === 'edit' && currentUser.password === 'placeholder_for_unchanged_password' ? '' : currentUser.password}
                              onChange={handleInputChange}
                              placeholder={modalMode === 'edit' ? '••••••••' : ''}
                              className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                formErrors.password ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                          </div>

                          {/* Role field */}
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                              Role
                            </label>
                            <select
                              name="role"
                              id="role"
                              value={currentUser.role}
                              onChange={handleInputChange}
                              disabled={currentUser.username === 'root'} // Can't change root's role
                              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                currentUser.username === 'root' ? 'bg-gray-100' : ''
                              }`}
                            >
                              {availableRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {modalMode === 'add' && (
                            <div className="rounded-md bg-yellow-50 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-yellow-800">Password Requirements</h3>
                                  <div className="mt-2 text-sm text-yellow-700">
                                    <p>Password must be at least 8 characters long.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      disabled={loading}
                    >
                      {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : modalMode === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default UserManagement;