// // src/components/common/UnauthorizedPage.js
// import React from 'react';
// import { Link } from 'react-router-dom';

// const UnauthorizedPage = () => {
//   // Simplified function to determine where to go based on role
//   const getBackPath = () => {
//     const userRole = localStorage.getItem('user_role');
    
//     switch(userRole) {
//       case 'admin': return '/dashboard';
//       case 'complyce_manager': return '/dashboardd';
//       case 'swift': return '/swift-upload';
//       case 'support': return '/supporting-docs';
//       case 'it_admin': return '/users';
//       case 'super_admin': return '/super';
//       default: return '/';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
//       <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700 max-w-md w-full">
//         <div className="bg-red-900 py-5 px-6 border-b border-gray-700">
//           <div className="text-center">
//             <h2 className="text-xl font-bold text-white tracking-wider">ACCESS DENIED</h2>
//           </div>
//         </div>
        
//         <div className="p-8 text-center">
//           <h3 className="text-lg font-medium text-white mb-2">Unauthorized Access</h3>
//           <p className="text-gray-300 mb-6">
//             You don't have permission to access this page.
//           </p>
          
//           <Link 
//             to={getBackPath()}
//             className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//           >
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnauthorizedPage;


import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the auth context

const UnauthorizedPage = () => {
  // Use the auth context instead of localStorage
  const { userRole } = useAuth();
  
  // Determine where to go based on role from context
  const getBackPath = () => {
    switch(userRole) {
      case 'admin': return '/dashboard';
      case 'complyce_manager': return '/dashboardd';
      case 'swift': return '/swift-upload';
      case 'support': return '/supporting-docs';
      case 'it_admin': return '/users';
      case 'super_admin': return '/super';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700 max-w-md w-full">
        <div className="bg-red-900 py-5 px-6 border-b border-gray-700">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-wider">ACCESS DENIED</h2>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-white mb-2">Unauthorized Access</h3>
          <p className="text-gray-300 mb-6">
            You don't have permission to access this page.
          </p>
          
          <Link 
            to={getBackPath()}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;