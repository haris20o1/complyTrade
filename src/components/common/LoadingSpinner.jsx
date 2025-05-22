// // src/components/common/LoadingSpinner.js
// import React from 'react';

// const LoadingSpinner = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900">
//       <div className="flex flex-col items-center">
//         <div className="h-12 w-12 relative">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
//           <div className="absolute top-0 left-0 animate-ping h-2 w-2 rounded-full bg-blue-500 opacity-75"></div>
//         </div>
//         <p className="mt-4 text-gray-300 text-sm font-medium">Loading secure environment...</p>
//       </div>
//     </div>
//   );
// };

// export default LoadingSpinner;


// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;