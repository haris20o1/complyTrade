// File: src/components/navigation/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: ChartBarIcon 
    },
    { 
      name: 'Uploaded', 
      path: '/uploaded', 
      icon: DocumentTextIcon 
    },
    { 
      name: 'Assigned', 
      path: '/assigned', 
      icon: ClipboardDocumentCheckIcon 
    },
    { 
      name: 'Completed', 
      path: '/completed', 
      icon: ClipboardDocumentCheckIcon 
    },
    { 
      name: 'Users', 
      // path: '/admin/users', 
      icon: UsersIcon 
    },
    { 
      name: 'Settings', 
      // path: '/admin/settings', 
      icon: Cog6ToothIcon 
    },
  ];

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
        <Link
          to="/"
          className="flex items-center text-indigo-100 hover:bg-indigo-800 px-2 py-2 rounded-md transition-all"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
          {expanded && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
