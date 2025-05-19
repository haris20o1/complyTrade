import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    // Get user role from localStorage that was set during login
    const role = localStorage.getItem('user_role');
    setUserRole(role || '');
    
    // Set email based on role
    if (role === 'admin') {
      setUserEmail('admin@lcompliance.com');
    } else if (role === 'complyce_manager') {
      setUserEmail('manager@lcompliance.com');
    } else if (role === 'it_admin') {
      setUserEmail('ITmanager@lcompliance.com');
    } else if (role === 'super_admin') {
      setUserEmail('superadmin@lcompliance.com');
    }
  }, []);

  // Format role for display (capitalize and handle complyce_manager)
  const getDisplayRole = () => {
    if (!userRole) return '';
    if (userRole === 'complyce_manager') return 'Compliance Manager';
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    
  };

  // Generate avatar initials based on role
  const getAvatarInitial = () => {
    return getDisplayRole().charAt(0);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          {userRole === 'admin' ? 'Admin Dashboard' : userRole === 'complyce_manager' ? 'Compliance Manager Dashboard' :userRole === 'super_admin' ? 'Super Admin Dashboard' : 'IT Manager Dashboard'}
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
          <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
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


// import React, { useState, useEffect } from 'react';
// import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
//     }
//   }, []);

//   // Format role for display (capitalize and handle complyce_manager)
//   const getDisplayRole = () => {
//     if (!userRole) return '';
//     if (userRole === 'complyce_manager') return 'Compliance Manager';
//     return userRole.charAt(0).toUpperCase() + userRole.slice(1);
//   };

//   return (
//     <div className="bg-indigo-900 border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Left side - Title based on role */}
//           <div>
//             <h1 className="text-xl font-bold text-white tracking-wider">
//               {userRole === 'admin' ? 'Admin Dashboard' : 'Compliance Manager Dashboard'}
//             </h1>
//           </div>
          
//           {/* Right side - Search, notifications, user info */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 placeholder="Search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
            
//             {/* Notifications */}
//             <button className="relative p-1 rounded-full text-gray-400 hover:text-blue-400 focus:outline-none">
//               <span className="sr-only">View notifications</span>
//               <BellIcon className="h-6 w-6" aria-hidden="true" />
//               <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
//                 3
//               </span>
//             </button>
            
//             {/* User info */}
//             <div className="flex items-center">
//               {/* User avatar placeholder */}
//               <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
//                 {getDisplayRole().charAt(0)}
//               </div>
              
//               <div className="ml-3">
//                 <div className="text-sm font-medium text-white">
//                   {getDisplayRole()}
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   {userEmail}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;