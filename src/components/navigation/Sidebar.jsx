// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ChartBarIcon, 
//   DocumentTextIcon, 
//   ClipboardDocumentCheckIcon,
//   UsersIcon,
//   Cog6ToothIcon,
//   ArrowLeftOnRectangleIcon,
//   ShieldCheckIcon
// } from '@heroicons/react/24/outline';
// import LogoutButton from '../buttons/LogoutButton';
// import { BeakerIcon } from 'lucide-react';

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); // Add useNavigate hook for programmatic navigation
//   const [expanded, setExpanded] = useState(true);
//   const [userRole, setUserRole] = useState('');
  
//   // Get the user role from localStorage on component mount
//   useEffect(() => {
//     const storedRole = localStorage.getItem('user_role');
//     console.log('Retrieved user role from localStorage:', storedRole);
//     setUserRole(storedRole || 'manager');
//   }, []);
  

//   // Define all navigation items
//   const allNavItems = [
//     { 
//       name: 'Dashboard', 
//       path: '/dashboard', 
//       icon: ChartBarIcon,
//       roles: ['admin'] // Both roles can see this
//     },
//     { 
//       name: 'Dashboard', 
//       path: '/dashboardd', 
//       icon: ChartBarIcon,
//       roles: ['complyce_manager'] // Both roles can see this
//     },
//     { 
//       name: 'Uploaded', 
//       path: '/uploaded', 
//       icon: DocumentTextIcon,
//       roles: ['admin'] // Admin only
//     },
//     // { 
//     //   name: 'Assigned', 
//     //   path: '/assigned', 
//     //   icon: ClipboardDocumentCheckIcon,
//     //   roles: ['admin'] // Admin only
//     // },
//     { 
//       name: 'Completed', 
//       path: '/completed', 
//       icon: ClipboardDocumentCheckIcon,
//       roles: ['admin'] // Both roles can see this
//     },
//     { 
//       name: 'Completed', 
//       path: '/complete', 
//       icon: ClipboardDocumentCheckIcon,
//       roles: ['complyce_manager'] // Both roles can see this
//     },
//     { 
//       name: 'Timeline', 
//       path: '/timeline', 
//       icon: ClipboardDocumentCheckIcon,
//       roles: ['admin'] // Admin only
//     },
   
//     { 
//       name: 'Users', 
//       path: '/users', 
//       icon: UsersIcon,
//       roles: ['it_admin'] // Admin only
//     },
//     { 
//       name: 'Upload Policies', 
//       path: '/policies', 
//       icon: DocumentTextIcon,
//       roles: ['it_admin'] // Admin only
//     },
//     { 
//       name: 'Audit', 
//       path: '/audit', 
//       icon: ShieldCheckIcon,
//       roles: ['it_admin'] // Admin only
//     },
//     { 
//       name: 'Audit', 
//       path: '/super', 
//       icon: ShieldCheckIcon,
//       roles: ['super_admin'] // Admin only
//     },
//     { 
//       name: 'User Performance', 
//       path: '/userperformance', 
//       icon: ChartBarIcon,
//       roles: ['super_admin'] // Admin only
//     },
//     { 
//       name: 'Settings', 
//       // path: '/admin/settings', 
//       icon: Cog6ToothIcon,
//       roles: ['admin','it_admin','complyce_manager','super_admin'] // Admin only
//     },
//   ];  

//   // Filter navigation items based on user role
//   const navItems = allNavItems.filter(item => 
//     item.roles.includes(userRole)
//   );
  
//   console.log('Current user role:', userRole);
//   console.log('Visible navigation items:', navItems.map(item => item.name));

//   return (
//     <div className={`bg-indigo-900 text-white transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} flex flex-col`}>
//       <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-800">
//         {expanded ? (
//           <span className="text-xl font-semibold">LC Compliance</span>
//         ) : (
//           <span className="text-xl font-semibold">LC</span>
//         )}
//         <button onClick={() => setExpanded(!expanded)} className="text-white p-1">
//           {expanded ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//             </svg>
//           )}
//         </button>
//       </div>
//       <div className="flex flex-col flex-1 overflow-y-auto">
//         <nav className="flex-1 px-2 py-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`${
//                   location.pathname === item.path
//                     ? 'bg-indigo-800 text-white'
//                     : 'text-indigo-100 hover:bg-indigo-800'
//                 } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all`}
//               >
//                 <Icon className="h-6 w-6 mr-3" />
//                 {expanded && <span>{item.name}</span>}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//       <div className="p-4 border-t border-indigo-800">
//         {/* Change Link to button with onClick handler */}
//         <LogoutButton expanded={expanded} />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import LogoutButton from '../buttons/LogoutButton';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  
  // Use the auth context
  const { userRole, isAuthenticated, isLoading, authChecked } = useAuth();
  
  // console.log('=== SIDEBAR RENDER ===');
  // console.log('userRole:', userRole);
  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('isLoading:', isLoading);
  // console.log('authChecked:', authChecked);
  
  // Define all navigation items
  const allNavItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: ChartBarIcon,
      roles: ['admin']
    },
    { 
      name: 'Dashboard', 
      path: '/dashboardd', 
      icon: ChartBarIcon,
      roles: ['complyce_manager']
    },
    { 
      name: 'Uploaded', 
      path: '/uploaded', 
      icon: DocumentTextIcon,
      roles: ['admin']
    },
    { 
      name: 'Completed', 
      path: '/completed', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['admin']
    },
    { 
      name: 'Completed', 
      path: '/complete', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['complyce_manager']
    },
    { 
      name: 'Timeline', 
      path: '/timeline', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['admin']
    },
    { 
      name: 'Users', 
      path: '/users', 
      icon: UsersIcon,
      roles: ['it_admin']
    },
    { 
      name: 'Upload Policies', 
      path: '/policies', 
      icon: DocumentTextIcon,
      roles: ['it_admin']
    },
    { 
      name: 'Audit', 
      path: '/audit', 
      icon: ShieldCheckIcon,
      roles: ['it_admin']
    },
    { 
      name: 'Audit', 
      path: '/super', 
      icon: ShieldCheckIcon,
      roles: ['super_admin']
    },
    { 
      name: 'User Performance', 
      path: '/userperformance', 
      icon: ChartBarIcon,
      roles: ['super_admin']
    },
    { 
      name: 'Settings', 
      // path: '/settings', 
      icon: Cog6ToothIcon,
      roles: ['admin','it_admin','complyce_manager','super_admin']
    },
  ];

  // Filter navigation items based on user role
  let navItems = [];
  
  if (isAuthenticated && userRole && typeof userRole === 'string') {
    navItems = allNavItems.filter(item => {
      const hasRole = item.roles.includes(userRole);
      // console.log(`Item: ${item.name} - Role check for '${userRole}':`, hasRole);
      return hasRole;
    });
  }
  
  // console.log('Final navItems count:', navItems.length);
  // console.log('=== END SIDEBAR RENDER ===');

  // KEY FIX: Only hide sidebar if we're sure the user is not authenticated
  // Don't hide during the initial loading phase
  if (authChecked && !isAuthenticated) {
    console.log('Sidebar hidden: User is not authenticated');
    return null;
  }

  // Show loading state while auth is being checked
  if (!authChecked || (isLoading && !userRole)) {
    return (
      <div className="bg-indigo-900 text-white w-64 flex flex-col h-screen">
        <div className="h-16 flex items-center justify-center px-4 border-b border-indigo-800">
          <span className="text-xl font-semibold">LC Compliance</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-indigo-300">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300 mx-auto mb-2"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-indigo-900 text-white transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} flex flex-col h-screen`}
      data-testid="sidebar"
    >
      {/* Header with Logo and Toggle Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-800">
        {expanded ? (
          <span className="text-xl font-semibold">LC Compliance</span>
        ) : (
          <span className="text-xl font-semibold">LC</span>
        )}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-white p-1 hover:bg-indigo-800 rounded-md"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          data-testid="sidebar-toggle"
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation Items */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* Show message if no items are available but we have a role */}
          {isAuthenticated && userRole && navItems.length === 0 && (
            <div className="text-center text-red-300 py-4">
              {expanded ? `No menu items for role: ${userRole}` : "?"}
            </div>
          )}
          
          {/* Show message if authenticated but no role yet */}
          {isAuthenticated && !userRole && !isLoading && (
            <div className="text-center text-yellow-300 py-4">
              {expanded ? "No role assigned to user" : "!"}
            </div>
          )}
          
          {/* Render navigation items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={`${item.name}-${item.path}`}
                to={item.path}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                data-testid={`nav-item-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {/* Always show the icon */}
                <Icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                
                {/* Only show text when expanded */}
                {expanded && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Logout section */}
      <div className="p-4 border-t border-indigo-800">
        <LogoutButton expanded={expanded} />
      </div>
    </div>
  );
};

export default Sidebar;