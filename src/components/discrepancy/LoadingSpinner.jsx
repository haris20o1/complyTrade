import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
    </div>
  );
};

export default LoadingSpinner;
