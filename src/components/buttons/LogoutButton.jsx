// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

// const LogoutButton = ({ expanded }) => {
//   const navigate = useNavigate();
  
//   const handleLogout = (e) => {
//     e.preventDefault();
    
//     // Clear all authentication data from localStorage
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user_role');
    
//     // Any other auth-related items that might be in localStorage can be removed here
//     // localStorage.removeItem('user_name');
//     // localStorage.removeItem('user_id');
    
//     console.log('User logged out');
    
//     // Redirect to login page
//     navigate('/', { replace: true });
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="w-full flex items-center text-indigo-100 hover:bg-indigo-800 px-2 py-2 rounded-md transition-all"
//     >
//       <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
//       {expanded && <span>Logout</span>}
//     </button>
//   );
// };

// export default LogoutButton;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { logoutUser } from '../authentication/auth';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({ expanded }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async (e) => {
    e.preventDefault();
    
    console.log('LogoutButton: Logout initiated');
    
    try {
      // First, call the context logout to immediately clear state
      logout();
      
      // Then call the API logout (this also clears localStorage)
      await logoutUser();
      
      console.log('LogoutButton: User logged out successfully');
      
    } catch (error) {
      console.error('LogoutButton: Logout failed:', error);
      
      // Even if API call fails, ensure everything is cleared
      localStorage.clear();
      sessionStorage.clear();
      
      // Call context logout again to be sure
      logout();
      
      // Force redirect to login
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center text-indigo-100 hover:bg-indigo-800 px-2 py-2 rounded-md transition-all"
      data-testid="logout-button"
    >
      <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
      {expanded && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;