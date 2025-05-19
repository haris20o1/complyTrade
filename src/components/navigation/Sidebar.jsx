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
import { BeakerIcon } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook for programmatic navigation
  const [expanded, setExpanded] = useState(true);
  const [userRole, setUserRole] = useState('');
  
  // Get the user role from localStorage on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem('user_role');
    console.log('Retrieved user role from localStorage:', storedRole);
    setUserRole(storedRole || 'manager');
  }, []);
  

  // Define all navigation items
  const allNavItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: ChartBarIcon,
      roles: ['admin'] // Both roles can see this
    },
    { 
      name: 'Dashboard', 
      path: '/dashboardd', 
      icon: ChartBarIcon,
      roles: ['complyce_manager'] // Both roles can see this
    },
    { 
      name: 'Uploaded', 
      path: '/uploaded', 
      icon: DocumentTextIcon,
      roles: ['admin'] // Admin only
    },
    { 
      name: 'Assigned', 
      path: '/assigned', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['admin'] // Admin only
    },
    { 
      name: 'Completed', 
      path: '/completed', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['admin'] // Both roles can see this
    },
    { 
      name: 'Completed', 
      path: '/complete', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['complyce_manager'] // Both roles can see this
    },
    { 
      name: 'Timeline', 
      path: '/timeline', 
      icon: ClipboardDocumentCheckIcon,
      roles: ['admin'] // Admin only
    },
    { 
      name: 'Users', 
      // path: '/admin/users', 
      icon: UsersIcon,
      roles: ['admin'] // Admin only
    },
    { 
      name: 'Users', 
      path: '/users', 
      icon: UsersIcon,
      roles: ['it_admin'] // Admin only
    },
    { 
      name: 'Upload Policies', 
      path: '/policies', 
      icon: DocumentTextIcon,
      roles: ['it_admin'] // Admin only
    },
    { 
      name: 'Audit', 
      path: '/audit', 
      icon: ShieldCheckIcon,
      roles: ['it_admin'] // Admin only
    },
    { 
      name: 'Audit', 
      path: '/super', 
      icon: ShieldCheckIcon,
      roles: ['super_admin'] // Admin only
    },
    { 
      name: 'User Performance', 
      path: '/userperformance', 
      icon: ChartBarIcon,
      roles: ['super_admin'] // Admin only
    },
    { 
      name: 'Settings', 
      // path: '/admin/settings', 
      icon: Cog6ToothIcon,
      roles: ['admin','it_admin','complyce_manager','super_admin'] // Admin only
    },
  ];  

  // Filter navigation items based on user role
  const navItems = allNavItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  console.log('Current user role:', userRole);
  console.log('Visible navigation items:', navItems.map(item => item.name));

  return (
    <div className={`bg-indigo-900 text-white transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} flex flex-col`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-800">
        {expanded ? (
          <span className="text-xl font-semibold">LC Compliance</span>
        ) : (
          <span className="text-xl font-semibold">LC</span>
        )}
        <button onClick={() => setExpanded(!expanded)} className="text-white p-1">
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
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all`}
              >
                <Icon className="h-6 w-6 mr-3" />
                {expanded && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-indigo-800">
        {/* Change Link to button with onClick handler */}
        <LogoutButton expanded={expanded} />
      </div>
    </div>
  );
};

export default Sidebar;