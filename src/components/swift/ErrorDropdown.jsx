// import React, { useState } from 'react';
// import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// const ErrorDropdown = ({ errors }) => {
//   const [expandedErrors, setExpandedErrors] = useState({});

//   if (!errors || errors.length === 0) {
//     return null;
//   }

//   const toggleError = (errorId) => {
//     setExpandedErrors(prev => ({
//       ...prev,
//       [errorId]: !prev[errorId]
//     }));
//   };

//   return (
//     <div className="mt-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded overflow-hidden">
//       <div className="p-4">
//         <div className="flex items-center">
//           <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//           <h3 className="text-red-800 font-medium">Upload failed with {errors.length} error{errors.length > 1 ? 's' : ''}</h3>
//         </div>
        
//         <ul className="mt-3 divide-y divide-red-200">
//           {errors.map((error) => (
//             <li key={error.id} className="py-2">
//               <button 
//                 onClick={() => toggleError(error.id)}
//                 className="w-full flex justify-between items-center text-left"
//               >
//                 <span className="text-red-700 font-medium">{error.description || error.name}</span>
//                 {expandedErrors[error.id] ? (
//                   <ChevronUpIcon className="h-4 w-4 text-red-700" />
//                 ) : (
//                   <ChevronDownIcon className="h-4 w-4 text-red-700" />
//                 )}
//               </button>
              
//               {expandedErrors[error.id] && (
//                 <div className="mt-2 pl-4 text-red-700 text-sm">
//                   {error.fileName && <p><span className="font-medium">File:</span> {error.fileName}</p>}
//                   <p>{error.description}</p>
//                   {error.lineNumber && (
//                     <p className="mt-1">
//                       <span className="font-medium">Line {error.lineNumber}:</span> {error.lineContent}
//                     </p>
//                   )}
//                   {error.suggestion && (
//                     <p className="mt-1 text-red-600">
//                       <span className="font-medium">Suggestion:</span> {error.suggestion}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ErrorDropdown;



import React, { useState } from 'react';
// import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon, X } from '@heroicons/react/24/outline';
import { Upload, FileText, X } from 'lucide-react';

const ErrorDropdown = ({ errors }) => {
  const [expandedErrors, setExpandedErrors] = React.useState({});

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
    <div className="bg-orange-500/10 backdrop-blur-sm rounded-lg border border-orange-500/30 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
            <X className="h-3 w-3 text-white" />
          </div>
          <h3 className="text-orange-300 font-medium">
            Upload failed with {errors.length} error{errors.length > 1 ? 's' : ''}
          </h3>
        </div>
        
        <div className="space-y-3">
          {errors.map((error) => (
            <div key={error.id} className="bg-gray-800/40 rounded-lg border border-orange-500/20">
              <button 
                onClick={() => toggleError(error.id)}
                className="w-full flex justify-between items-center text-left p-3 hover:bg-gray-700/30 transition-all duration-200 rounded-lg"
              >
                <span className="text-orange-200 font-medium text-sm">
                  {error.description || error.name}
                </span>
                <div className="text-gray-400 text-sm">
                  {expandedErrors[error.id] ? '−' : '+'}
                </div>
              </button>
              
              {expandedErrors[error.id] && (
                <div className="px-3 pb-3 space-y-2">
                  {error.fileName && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 text-orange-400" />
                      <span className="text-orange-300 text-xs font-medium">File:</span>
                      <span className="text-gray-300 text-xs">{error.fileName}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-400 text-xs leading-relaxed pl-5">
                    {error.description}
                  </p>
                  
                  {error.lineNumber && (
                    <div className="pl-5">
                      <p className="text-xs">
                        <span className="text-orange-400 font-medium">Line {error.lineNumber}:</span> 
                        <span className="ml-2 text-gray-300">{error.lineContent}</span>
                      </p>
                    </div>
                  )}
                  
                  {error.suggestion && (
                    <div className="mt-3 p-3 bg-cyan-500/10 rounded-lg border-l-2 border-cyan-500">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        <span className="text-cyan-400 font-medium text-xs">Suggestion</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {error.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorDropdown;
