// import React, { useState, useEffect } from 'react';
// import { Bell, Search } from 'lucide-react';

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const [userEmail, setUserEmail] = useState('');
  
//   useEffect(() => {
//     // Get user role from localStorage that was set during login
//     const role = localStorage.getItem('user_role');
//     setUserRole(role || '');
    
//     // Set email based on role
//     if (role === 'admin') {
//       setUserEmail('admin@lcompliance.com');
//     } else if (role === 'complyce_manager') {
//       setUserEmail('manager@lcompliance.com');
//     } else if (role === 'it_admin') {
//       setUserEmail('ITmanager@lcompliance.com');
//     } else if (role === 'super_admin') {
//       setUserEmail('superadmin@lcompliance.com');
//     }
//   }, []);

//   // Format role for display (capitalize and handle complyce_manager)
//   const getDisplayRole = () => {
//     if (!userRole) return '';
//     if (userRole === 'complyce_manager') return 'Compliance Manager';
//     return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    
//   };

//   // Generate avatar initials based on role
//   const getAvatarInitial = () => {
//     return getDisplayRole().charAt(0);
//   };

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
//       <div className="flex items-center">
//         <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
//           {userRole === 'admin' ? 'Admin Dashboard' : userRole === 'complyce_manager' ? 'Compliance Manager Dashboard' :userRole === 'super_admin' ? 'Super Admin Dashboard' : 'IT Manager Dashboard'}
//         </h1>
//       </div>
      
//       <div className="flex items-center space-x-2 md:space-x-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>
        
//         <button className="relative p-2 rounded-full hover:bg-gray-100">
//           <Bell className="h-6 w-6 text-gray-500" />
//           <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
//             3
//           </span>
//         </button>
        
//         <div className="flex items-center space-x-2">
//           <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
//             {getAvatarInitial()}
//           </div>
//           <div className="hidden md:block">
//             <div className="text-sm font-medium text-gray-800">{getDisplayRole()}</div>
//             <div className="text-xs text-gray-500">{userEmail}</div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import the auth context

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Get user role from AuthContext instead of localStorage
  const { userRole, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log('Header: Current userRole from context:', userRole);
    
    // Set email based on role
    if (userRole === 'admin') {
      setUserEmail('admin@lcompliance.com');
    } else if (userRole === 'complyce_manager') {
      setUserEmail('manager@lcompliance.com');
    } else if (userRole === 'it_admin') {
      setUserEmail('ITmanager@lcompliance.com');
    } else if (userRole === 'super_admin') {
      setUserEmail('superadmin@lcompliance.com');
    } else if (userRole === 'support') {
      setUserEmail('support@lcompliance.com');
    } else if (userRole === 'swift') {
      setUserEmail('swift@lcompliance.com');
    } else {
      setUserEmail('user@lcompliance.com');
    }
  }, [userRole]); // Re-run when userRole changes

  // Format role for display (capitalize and handle special cases)
  const getDisplayRole = () => {
    if (!userRole) return 'Loading...';
    
    switch(userRole) {
      case 'complyce_manager':
        return 'Compliance Manager';
      case 'it_admin':
        return 'IT Administrator';
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'support':
        return 'Support';
      case 'swift':
        return 'SWIFT User';
      default:
        return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    }
  };

  // Generate dashboard title based on role
  const getDashboardTitle = () => {
    if (!userRole) return 'Dashboard';
    
    switch(userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'complyce_manager':
        return 'Compliance Manager Dashboard';
      case 'it_admin':
        return 'IT Administrator Dashboard';
      case 'super_admin':
        return 'Super Admin Dashboard';
      case 'support':
        return 'Support Dashboard';
      case 'swift':
        return 'SWIFT Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Generate avatar initials based on role
  const getAvatarInitial = () => {
    const displayRole = getDisplayRole();
    if (displayRole === 'Loading...') return '?';
    
    // For multi-word roles, get first letter of each word
    if (displayRole.includes(' ')) {
      return displayRole.split(' ').map(word => word.charAt(0)).join('');
    }
    
    return displayRole.charAt(0);
  };

  // Show loading state if not authenticated or no role yet
  if (!isAuthenticated || !userRole) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            Loading Dashboard...
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button className="relative p-2 rounded-full hover:bg-gray-100" disabled>
            <Bell className="h-6 w-6 text-gray-500" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white">
              ?
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-800">Loading...</div>
              <div className="text-xs text-gray-500">Please wait...</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          {getDashboardTitle()}
        </h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-500" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {getAvatarInitial()}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">{getDisplayRole()}</div>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;