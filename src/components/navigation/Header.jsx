// File: src/components/navigation/Header.jsx
import React, { useState } from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
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
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-500" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff"
            alt="Admin User"
            className="h-8 w-8 rounded-full"
          />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-800">Admin User</div>
            <div className="text-xs text-gray-500">admin@lcompliance.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;