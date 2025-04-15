import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ErrorDropdown = ({ errors }) => {
  const [expandedErrors, setExpandedErrors] = useState({});

  if (!errors || errors.length === 0) {
    return null;
  }

  const toggleError = (errorId) => {
    setExpandedErrors(prev => ({
      ...prev,
      [errorId]: !prev[errorId]
    }));
  };

  return (
    <div className="mt-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-red-800 font-medium">Upload failed with {errors.length} error{errors.length > 1 ? 's' : ''}</h3>
        </div>
        
        <ul className="mt-3 divide-y divide-red-200">
          {errors.map((error) => (
            <li key={error.id} className="py-2">
              <button 
                onClick={() => toggleError(error.id)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-red-700 font-medium">{error.description || error.name}</span>
                {expandedErrors[error.id] ? (
                  <ChevronUpIcon className="h-4 w-4 text-red-700" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-red-700" />
                )}
              </button>
              
              {expandedErrors[error.id] && (
                <div className="mt-2 pl-4 text-red-700 text-sm">
                  {error.fileName && <p><span className="font-medium">File:</span> {error.fileName}</p>}
                  <p>{error.description}</p>
                  {error.lineNumber && (
                    <p className="mt-1">
                      <span className="font-medium">Line {error.lineNumber}:</span> {error.lineContent}
                    </p>
                  )}
                  {error.suggestion && (
                    <p className="mt-1 text-red-600">
                      <span className="font-medium">Suggestion:</span> {error.suggestion}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorDropdown;