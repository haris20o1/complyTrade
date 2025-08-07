// // import React from 'react';

// // const LCOverviewView = ({
// //   mainPoints,
// //   newSubPoint,
// //   selectedSubPoint,
// //   onRemarksChange,
// //   onSelection,
// //   onAddSubPoint,
// //   onDeleteSubPoint,
// //   onNewSubPointChange,
// //   onSubPointSelect,
// //   onSaveDraft,
// //   onDocumentClick
// // }) => {
// //   // Show all points that have any subpoints (not just discrepant ones)
// //   // This prevents issues from disappearing when status changes
// //   const pointsWithIssues = mainPoints.map((point, mainIndex) => ({
// //     ...point,
// //     mainIndex,
// //     // Show all subpoints, but highlight discrepant ones
// //     allSubPoints: point.subPoints || [],
// //     discrepantCount: (point.subPoints || []).filter(sp => sp.status === 'discripant').length
// //   })).filter(point => point.allSubPoints.length > 0);

// //   return (
// //     <div className="space-y-8">
// //       {pointsWithIssues.length > 0 ? (
// //         pointsWithIssues.map((point) => (
// //           <div key={point.doc_uuid} className="bg-white rounded-lg shadow-sm border border-gray-200">
// //             {/* SWIFT Point Header */}
// //             <div className="p-6 border-b border-gray-200 bg-gray-50">
// //               <div className="flex justify-between items-start">
// //                 <div className="flex-1">
// //                   <h2 className="text-lg font-semibold text-gray-900 mb-2">
// //                     {point.swift_point || point.text}
// //                   </h2>
// //                   <div className="flex items-center space-x-2">
// //                     <span className="text-sm text-gray-500">Document:</span>
// //                     <button 
// //                       className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors duration-150"
// //                       onClick={() => onDocumentClick(point.doc_uuid)}
// //                     >
// //                       📄 {point.text}
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center space-x-2">
// //                   {point.discrepantCount > 0 ? (
// //                     <div className="bg-red-50 px-3 py-1 rounded-full">
// //                       <span className="text-xs font-semibold text-red-700 uppercase">Discrepant Issues</span>
// //                       <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2 inline-flex">
// //                         {point.discrepantCount}
// //                       </span>
// //                     </div>
// //                   ) : (
// //                     <div className="bg-green-50 px-3 py-1 rounded-full">
// //                       <span className="text-xs font-semibold text-green-700 uppercase">All Issues Resolved</span>
// //                       <span className="text-green-600 ml-2">✓</span>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* All Issues Table - now showing all subpoints */}
// //             <div className="overflow-hidden">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-indigo-900">
// //                   <tr>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
// //                       Issue Description
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
// //                       Remarks
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                         C
// //                       </span>
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
// //                         D
// //                       </span>
// //                     </th>
// //                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
// //                         RA
// //                       </span>
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {point.allSubPoints.map((subPoint) => (
// //                     <tr
// //                       key={subPoint.id}
// //                       className={`hover:bg-blue-50 cursor-pointer transition-colors ${
// //                         selectedSubPoint?.mainIndex === point.mainIndex &&
// //                         selectedSubPoint?.subPointId === subPoint.id
// //                           ? "bg-blue-100"
// //                           : subPoint.status === 'discripant'
// //                           ? "bg-red-50"
// //                           : subPoint.status === 'clean'
// //                           ? "bg-green-50"
// //                           : subPoint.status === 'review'
// //                           ? "bg-yellow-50"
// //                           : ""
// //                       }`}
// //                       onClick={() => onSubPointSelect({
// //                         mainIndex: point.mainIndex,
// //                         subPointId: subPoint.id
// //                       })}
// //                     >
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         <div className="flex items-center">
// //                           {subPoint.status === 'discripant' && (
// //                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
// //                               Discrepant
// //                             </span>
// //                           )}
// //                           {subPoint.status === 'clean' && (
// //                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
// //                               Clean
// //                             </span>
// //                           )}
// //                           {subPoint.status === 'review' && (
// //                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
// //                               Review
// //                             </span>
// //                           )}
// //                           <span>{subPoint.text}</span>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <div className="relative">
// //                           <input
// //                             type="text"
// //                             value={subPoint.remarks || ''}
// //                             onChange={(e) => onRemarksChange(point.mainIndex, subPoint.id, e.target.value)}
// //                             className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
// //                             placeholder="Add remarks..."
// //                             onClick={(e) => e.stopPropagation()}
// //                           />
// //                           {subPoint.remarks && (
// //                             <button
// //                               onClick={(e) => {
// //                                 e.stopPropagation();
// //                                 onRemarksChange(point.mainIndex, subPoint.id, '');
// //                               }}
// //                               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
// //                               aria-label="Clear remarks"
// //                             >
// //                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                               </svg>
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-center">
// //                         <div className="flex items-center justify-center">
// //                           <input
// //                             type="radio"
// //                             name={`point-${point.mainIndex}-${subPoint.id}`}
// //                             value="NO"
// //                             checked={subPoint.status === 'clean'}
// //                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'NO')}
// //                             className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
// //                           />
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-center">
// //                         <div className="flex items-center justify-center">
// //                           <input
// //                             type="radio"
// //                             name={`point-${point.mainIndex}-${subPoint.id}`}
// //                             value="YES"
// //                             checked={subPoint.status === 'discripant'}
// //                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'YES')}
// //                             className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
// //                           />
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-center">
// //                         <div className="flex items-center justify-center">
// //                           <input
// //                             type="radio"
// //                             name={`point-${point.mainIndex}-${subPoint.id}`}
// //                             value="RA"
// //                             checked={subPoint.status === 'review'}
// //                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'RA')}
// //                             className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
// //                           />
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ))
// //       ) : (
// //         <div className="bg-white rounded-lg shadow-lg p-12">
// //           <div className="flex flex-col items-center justify-center text-center">
// //             <div className="h-24 w-24 text-green-500 mb-6 bg-green-100 rounded-full flex items-center justify-center">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //               </svg>
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-900 mb-2">No Issues Found</h3>
// //             <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
// //               There are no issues recorded for this Letter of Credit.
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {/* Action Buttons - Show when there are any issues */}
// //       {pointsWithIssues.length > 0 && (
// //         <div className="flex justify-end space-x-4 mt-8">
// //           <button
// //             onClick={onSaveDraft}
// //             className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //             </svg>
// //             Save Draft
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default LCOverviewView;

// import React, { useState, useEffect } from 'react';

// const LCOverviewView = ({
//   mainPoints,
//   newSubPoint,
//   selectedSubPoint,
//   onRemarksChange,
//   onSelection,
//   onAddSubPoint,
//   onDeleteSubPoint,
//   onNewSubPointChange,
//   onSubPointSelect,
//   onSaveDraft,
//   onDocumentClick
// }) => {
//   // Track which subpoints were originally discrepant when component first loaded
//   const [originallyDiscrepantIds, setOriginallyDiscrepantIds] = useState(new Set());

//   // Initialize the set of originally discrepant IDs on first load
//   useEffect(() => {
//     const discrepantIds = new Set();
//     mainPoints.forEach(point => {
//       point.subPoints.forEach(subPoint => {
//         if (subPoint.status === 'discripant') {
//           discrepantIds.add(subPoint.id);
//         }
//       });
//     });
//     setOriginallyDiscrepantIds(discrepantIds);
//   }, [mainPoints.length]); // Only run when mainPoints array length changes (i.e., on initial load)

//   // Filter points that have subpoints which were originally discrepant
//   const pointsWithDiscrepancies = mainPoints.map((point, mainIndex) => ({
//     ...point,
//     mainIndex,
//     discrepantSubPoints: point.subPoints.filter(sp => originallyDiscrepantIds.has(sp.id))
//   })).filter(point => point.discrepantSubPoints.length > 0);

//   return (
//     <div className="space-y-8">
//       {pointsWithDiscrepancies.length > 0 ? (
//         pointsWithDiscrepancies.map((point) => (
//           <div key={point.doc_uuid} className="bg-white rounded-lg shadow-sm border border-gray-200">
//             {/* SWIFT Point Header */}
//             <div className="p-6 border-b border-gray-200 bg-gray-50">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <h2 className="text-lg font-semibold text-gray-900 mb-2">
//                     {point.swift_point || point.text}
//                   </h2>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-500">Document:</span>
//                     <button 
//                       className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors duration-150"
//                       onClick={() => onDocumentClick(point.doc_uuid)}
//                     >
//                       📄 {point.text}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
//                   <span className="text-xs font-semibold text-red-700 uppercase">Discrepant Issues</span>
//                   <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                     {point.discrepantSubPoints.length}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Discrepant Issues Table */}
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-indigo-900">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                       Issue Description
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                       Remarks
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         C
//                       </span>
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         D
//                       </span>
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                         RA
//                       </span>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {point.discrepantSubPoints.map((subPoint) => (
//                     <tr
//                       key={subPoint.id}
//                       className={`hover:bg-blue-50 cursor-pointer transition-colors ${
//                         selectedSubPoint?.mainIndex === point.mainIndex &&
//                         selectedSubPoint?.subPointId === subPoint.id
//                           ? "bg-blue-100"
//                           : subPoint.status === 'clean'
//                           ? "bg-green-50"
//                           : subPoint.status === 'review'
//                           ? "bg-yellow-50"
//                           : ""
//                       }`}
//                       onClick={() => onSubPointSelect({
//                         mainIndex: point.mainIndex,
//                         subPointId: subPoint.id
//                       })}
//                     >
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="flex items-center">
//                           {subPoint.status === 'clean' && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
//                               Clean
//                             </span>
//                           )}
//                           {subPoint.status === 'review' && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
//                               Review
//                             </span>
//                           )}
//                           {subPoint.status === 'discripant' && (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
//                               Discrepant
//                             </span>
//                           )}
//                           <span>{subPoint.text}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="relative">
//                           <input
//                             type="text"
//                             value={subPoint.remarks || ''}
//                             onChange={(e) => onRemarksChange(point.mainIndex, subPoint.id, e.target.value)}
//                             className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
//                             placeholder="Add remarks..."
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                           {subPoint.remarks && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 onRemarksChange(point.mainIndex, subPoint.id, '');
//                               }}
//                               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                               aria-label="Clear remarks"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                               </svg>
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         <div className="flex items-center justify-center">
//                           <input
//                             type="radio"
//                             name={`point-${point.mainIndex}-${subPoint.id}`}
//                             value="NO"
//                             checked={subPoint.status === 'clean'}
//                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'NO')}
//                             className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         <div className="flex items-center justify-center">
//                           <input
//                             type="radio"
//                             name={`point-${point.mainIndex}-${subPoint.id}`}
//                             value="YES"
//                             checked={subPoint.status === 'discripant'}
//                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'YES')}
//                             className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         <div className="flex items-center justify-center">
//                           <input
//                             type="radio"
//                             name={`point-${point.mainIndex}-${subPoint.id}`}
//                             value="RA"
//                             checked={subPoint.status === 'review'}
//                             onChange={() => onSelection(point.mainIndex, subPoint.id, 'RA')}
//                             className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="bg-white rounded-lg shadow-lg p-12">
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="h-24 w-24 text-green-500 mb-6 bg-green-100 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">All Issues Resolved!</h3>
//             <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
//               There are no discrepant issues remaining in this Letter of Credit.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       {pointsWithDiscrepancies.length > 0 && (
//         <div className="flex justify-end space-x-4 mt-8">
//           <button
//             onClick={onSaveDraft}
//             className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             Save Draft
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LCOverviewView;













import React, { useState, useEffect } from 'react';

const LCOverviewView = ({
  mainPoints,
  newSubPoint,
  selectedSubPoint,
  onRemarksChange,
  onSelection,
  onAddSubPoint,
  onDeleteSubPoint,
  onNewSubPointChange,
  onSubPointSelect,
  onSaveDraft,
  onDocumentClick
}) => {
  // Track which subpoints were originally discrepant when component first loaded
  const [originallyDiscrepantIds, setOriginallyDiscrepantIds] = useState(new Set());
  const [editingRemarks, setEditingRemarks] = useState(null);
  const [tempRemarks, setTempRemarks] = useState('');

  // Initialize the set of originally discrepant IDs on first load
  useEffect(() => {
    const discrepantIds = new Set();
    mainPoints.forEach(point => {
      point.subPoints.forEach(subPoint => {
        if (subPoint.status === 'discripant') {
          discrepantIds.add(subPoint.id);
        }
      });
    });
    setOriginallyDiscrepantIds(discrepantIds);
  }, [mainPoints.length]); // Only run when mainPoints array length changes (i.e., on initial load)

  // Filter points that have subpoints which were originally discrepant
  const pointsWithDiscrepancies = mainPoints.map((point, mainIndex) => ({
    ...point,
    mainIndex,
    discrepantSubPoints: point.subPoints.filter(sp => originallyDiscrepantIds.has(sp.id))
  })).filter(point => point.discrepantSubPoints.length > 0);

  const handleToggleStatus = (mainIndex, subPointId) => {
    const currentSubPoint = mainPoints[mainIndex].subPoints.find(sp => sp.id === subPointId);
    const newStatus = currentSubPoint.status === 'discripant' ? 'clean' : 'discripant';
    onSelection(mainIndex, subPointId, newStatus === 'discripant' ? 'YES' : 'NO');
  };

  const handleRemarksClick = (mainIndex, subPointId, currentRemarks) => {
    setEditingRemarks({ mainIndex, subPointId });
    setTempRemarks(currentRemarks || '');
  };

  const handleSaveRemarks = () => {
    if (editingRemarks) {
      onRemarksChange(editingRemarks.mainIndex, editingRemarks.subPointId, tempRemarks);
      setEditingRemarks(null);
      setTempRemarks('');
    }
  };

  const handleCancelRemarks = () => {
    setEditingRemarks(null);
    setTempRemarks('');
  };

  return (
    <div className="space-y-8">
      {pointsWithDiscrepancies.length > 0 ? (
        pointsWithDiscrepancies.map((point) => (
          <div key={point.doc_uuid} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* SWIFT Point Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {point.swift_point || point.text}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Document:</span>
                    <button 
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors duration-150"
                      onClick={() => onDocumentClick(point.doc_uuid)}
                    >
                      📄 {point.text}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-red-700 uppercase">Issues</span>
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {point.discrepantSubPoints.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Issues List */}
            <div className="p-6">
              <div className="space-y-4">
                {point.discrepantSubPoints.map((subPoint) => (
                  <div
                    key={subPoint.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedSubPoint?.mainIndex === point.mainIndex &&
                      selectedSubPoint?.subPointId === subPoint.id
                        ? "border-blue-300 bg-blue-50"
                        : subPoint.status === 'clean'
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                    onClick={() => onSubPointSelect({
                      mainIndex: point.mainIndex,
                      subPointId: subPoint.id
                    })}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {subPoint.text}
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(point.mainIndex, subPoint.id);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            subPoint.status === 'clean'
                              ? 'bg-green-500 focus:ring-green-500'
                              : 'bg-red-500 focus:ring-red-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              subPoint.status === 'clean' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div className="text-xs text-center mt-1">
                          <span className={`font-medium ${
                            subPoint.status === 'clean' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {subPoint.status === 'clean' ? 'Clean' : 'Discrepant'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remarks section */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Remarks:
                        </span>
                      </div>
                      <div 
                        className="mt-1 p-2 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors min-h-[2.5rem] flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemarksClick(point.mainIndex, subPoint.id, subPoint.remarks);
                        }}
                      >
                        <p className="text-sm text-gray-700 flex-1">
                          {subPoint.remarks || 'Click to add remarks...'}
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 text-green-500 mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Issues Resolved!</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
              There are no discrepant issues remaining in this Letter of Credit.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {pointsWithDiscrepancies.length > 0 && (
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onSaveDraft}
            className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Draft
          </button>
        </div>
      )}

      {/* Remarks Editing Modal */}
      {editingRemarks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Remarks</h3>
              <textarea
                value={tempRemarks}
                onChange={(e) => setTempRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Enter your remarks..."
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelRemarks}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRemarks}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LCOverviewView;