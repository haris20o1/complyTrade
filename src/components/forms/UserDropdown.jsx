// File: src/components/forms/UserDropdown.jsx
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const UserDropdown = ({ users, onSelect, placeholder = "Select a user" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelect = (user) => {
    setSelectedUser(user);
    onSelect(user);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUser ? selectedUser.name : placeholder}
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {users.map((user) => (
            <div
              key={user.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 text-gray-900"
              onClick={() => handleSelect(user)}
            >
              <div className="flex items-center">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}`}
                  alt={user.name}
                  className="h-6 w-6 rounded-full mr-3"
                />
                <span className="font-medium">{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
