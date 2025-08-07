import React from 'react';

const DocumentHeader = ({ mainPoint, onDocumentClick }) => {
  return (
    <div className="mb-6">
      {/* Swift Point Title - Clean and Bold */}
      <h1 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
        {mainPoint.swift_point || mainPoint.text}
      </h1>
      
      {/* Document Info Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Document:</span>
          <button 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors duration-150"
            onClick={() => onDocumentClick(mainPoint.doc_uuid)}
          >
            📄 {mainPoint.text}
          </button>
        </div>

        {/* Status Pills - Matching your dashboard style */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-green-700 uppercase">Clean</span>
            <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-red-700 uppercase">Discrepant</span>
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-yellow-700 uppercase">Review</span>
            <span className="bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {mainPoint.subPoints.filter(sp => sp.status === 'review').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;


// import React from 'react';

// const DocumentHeader = ({ mainPoint, onDocumentClick }) => {
//   return (
//     <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#343de7]">
//       <div className="p-5 bg-gradient-to-r from-white to-[#3d43a8] border border-gray-300 shadow-2xl rounded-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 
//               className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 hover:underline transition-colors duration-200"
//               onClick={() => onDocumentClick(mainPoint.doc_uuid)}
//             >
//               {mainPoint.text}
//             </h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
//             </p>
//           </div>

//           {/* Status Summary */}
//           <div className="flex space-x-2">
//             <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//               <span className="text-xs text-green-800 font-medium">Clean (C)</span>
//               <p className="text-lg font-bold text-green-600">
//                 {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
//               </p>
//             </div>
//             <div className="text-center px-3 py-1 bg-red-100 rounded-md">
//               <span className="text-xs text-red-800 font-medium">Discrepant (D)</span>
//               <p className="text-lg font-bold text-red-600">
//                 {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
//               </p>
//             </div>
//             <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//               <span className="text-xs text-yellow-800 font-medium">Review (RA)</span>
//               <p className="text-lg font-bold text-yellow-600">
//                 {mainPoint.subPoints.filter(sp => sp.status === 'review').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentHeader;

