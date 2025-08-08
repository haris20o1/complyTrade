

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
//   const [editingRemarks, setEditingRemarks] = useState(null);
//   const [tempRemarks, setTempRemarks] = useState('');

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

//   const handleToggleStatus = (mainIndex, subPointId) => {
//     const currentSubPoint = mainPoints[mainIndex].subPoints.find(sp => sp.id === subPointId);
//     const newStatus = currentSubPoint.status === 'discripant' ? 'clean' : 'discripant';
//     onSelection(mainIndex, subPointId, newStatus === 'discripant' ? 'YES' : 'NO');
//   };

//   const handleRemarksClick = (mainIndex, subPointId, currentRemarks) => {
//     setEditingRemarks({ mainIndex, subPointId });
//     setTempRemarks(currentRemarks || '');
//   };

//   const handleSaveRemarks = () => {
//     if (editingRemarks) {
//       onRemarksChange(editingRemarks.mainIndex, editingRemarks.subPointId, tempRemarks);
//       setEditingRemarks(null);
//       setTempRemarks('');
//     }
//   };

//   const handleCancelRemarks = () => {
//     setEditingRemarks(null);
//     setTempRemarks('');
//   };

//   return (
//     <div className="space-y-6">
//       {pointsWithDiscrepancies.length > 0 ? (
//         pointsWithDiscrepancies.map((point) => (
//           <div key={point.doc_uuid} className="bg-white rounded-lg shadow-sm border border-gray-200">
//             {/* SWIFT Point Header */}
//             <div className="p-4 border-b border-gray-200 bg-gray-50">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <h2 className="text-sm font-semibold text-gray-900 mb-2">
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
//                 {/* <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
//                   <span className="text-xs font-semibold text-red-700 uppercase">Issues</span>
//                   <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                     {point.discrepantSubPoints.length}
//                   </span>
//                 </div> */}
//               </div>
//             </div>

//             {/* Issues List */}
//             <div className="p-4">
//               <div className="space-y-3">
//                 {point.discrepantSubPoints.map((subPoint) => (
//                   <div
//                     key={subPoint.id}
//                     className={`p-3 rounded-lg border transition-colors ${
//                       selectedSubPoint?.mainIndex === point.mainIndex &&
//                       selectedSubPoint?.subPointId === subPoint.id
//                         ? "border-blue-300 bg-blue-50"
//                         : subPoint.status === 'clean'
//                         ? "border-green-200 bg-green-50"
//                         : "border-red-200 bg-red-50"
//                     }`}
//                     onClick={() => onSubPointSelect({
//                       mainIndex: point.mainIndex,
//                       subPointId: subPoint.id
//                     })}
//                   >
//                     <div className="flex items-start justify-between">
//                       {/* Left side: Toggle button */}
//                       <div className="flex items-start space-x-3">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleToggleStatus(point.mainIndex, subPoint.id);
//                           }}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 mt-1 ${
//                             subPoint.status === 'clean'
//                               ? 'bg-green-500 focus:ring-green-500'
//                               : 'bg-red-500 focus:ring-red-500'
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                               subPoint.status === 'clean' ? 'translate-x-6' : 'translate-x-1'
//                             }`}
//                           />
//                         </button>
                        
//                         {/* Main content */}
//                         <div className="flex-1">
//                           <p className="text-sm text-gray-900 font-medium mb-2">
//                             {subPoint.text}
//                           </p>
                          
//                           {/* Remarks section - inline */}
//                           <div className="flex items-center space-x-2">
//                             <span className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                               REMARKS:
//                             </span>
//                             <div 
//                               className="flex-1 cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors border-b border-dashed border-gray-300 hover:border-blue-400 pb-0.5"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleRemarksClick(point.mainIndex, subPoint.id, subPoint.remarks);
//                               }}
//                             >
//                               {subPoint.remarks || 'Click to add remarks...'}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Right side: Status label */}
//                       <div className="ml-4">
//                         <div className="text-xs text-center">
//                           <span className={`font-medium ${
//                             subPoint.status === 'clean' ? 'text-green-700' : 'text-red-700'
//                           }`}>
//                             {subPoint.status === 'clean' ? 'Clean' : 'Discrepant'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
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

//       {/* Remarks Editing Modal */}
//       {editingRemarks && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Remarks</h3>
//               <textarea
//                 value={tempRemarks}
//                 onChange={(e) => setTempRemarks(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 rows={4}
//                 placeholder="Enter your remarks..."
//               />
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   onClick={handleCancelRemarks}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveRemarks}
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
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

  // Dummy documents data
  const mappedDocuments = [
    { id: 1, name: "Certificate of Received Quantity", type: "PDF", size: "2.3 MB" },
    { id: 2, name: "Signed Invoice", type: "PDF", size: "1.8 MB" },
    { id: 3, name: "Load Port Inspector Report", type: "PDF", size: "4.2 MB" },
     { id: 1, name: "Certificate of Received Quantity", type: "PDF", size: "2.3 MB" },
    { id: 2, name: "Signed Invoice", type: "PDF", size: "1.8 MB" },
    { id: 3, name: "Load Port Inspector Report", type: "PDF", size: "4.2 MB" }
  ];

  const unmappedDocuments = [
    { id: 4, name: "Insurance Certificate", type: "PDF", size: "1.2 MB" },
    { id: 5, name: "Bill of Lading", type: "PDF", size: "950 KB" },
    { id: 6, name: "Quality Report", type: "PDF", size: "2.1 MB" },
    { id: 7, name: "Packing List", type: "PDF", size: "780 KB" },
    { id: 8, name: "Insurance Certificate", type: "PDF", size: "1.2 MB" },
    { id: 9, name: "Bill of Lading", type: "PDF", size: "950 KB" },
    { id: 10, name: "Quality Report", type: "PDF", size: "2.1 MB" },
    { id: 11, name: "Packing List", type: "PDF", size: "780 KB" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 max-w-full">
        {/* Left side - Discrepancies (85%) */}
        <div className="w-full lg:w-[85%] space-y-6">
          {pointsWithDiscrepancies.length > 0 ? (
            pointsWithDiscrepancies.map((point) => (
            <div key={point.doc_uuid} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* SWIFT Point Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2 break-words">
                      {point.swift_point || point.text}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1">
                      <span className="text-sm text-gray-500 whitespace-nowrap">Document:</span>
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors duration-150 text-left break-words"
                        onClick={() => onDocumentClick(point.doc_uuid)}
                      >
                        📄 {point.text}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full flex-shrink-0">
                    <span className="text-xs font-semibold text-red-700 uppercase">Issues</span>
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {point.discrepantSubPoints.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div className="p-4">
                <div className="space-y-3">
                  {point.discrepantSubPoints.map((subPoint) => (
                    <div
                      key={subPoint.id}
                      className={`p-3 rounded-lg border transition-colors ${
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
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Main content */}
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(point.mainIndex, subPoint.id);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 mt-1 flex-shrink-0 ${
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
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium mb-2 break-words">
                              {subPoint.text}
                            </p>
                            
                            {/* Remarks section */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                REMARKS:
                              </span>
                              <div 
                                className="flex-1 cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors border-b border-dashed border-gray-300 hover:border-blue-400 pb-0.5 break-words"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemarksClick(point.mainIndex, subPoint.id, subPoint.remarks);
                                }}
                              >
                                {subPoint.remarks || 'Click to add remarks...'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status label */}
                        <div className="flex-shrink-0 self-start">
                          <div className="text-xs text-center">
                            <span className={`font-medium whitespace-nowrap ${
                              subPoint.status === 'clean' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {subPoint.status === 'clean' ? 'Clean' : 'Discrepant'}
                            </span>
                          </div>
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
            <div className="flex justify-end space-x-4 mt-8 pb-6">
              <button
                onClick={onSaveDraft}
                className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
                Save Draft
              </button>
            </div>
          )}
        </div>

        {/* Right side - Documents (15%) - Adaptive height containers */}
        <div className="w-full lg:w-[15%] lg:sticky lg:top-32 lg:self-start space-y-4">
          {/* Mapped Documents - Adaptive Height */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            <div className="px-2 py-1.5 border-b border-gray-200 bg-blue-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-blue-800 truncate">Mapped Documents</h3>
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-1 ml-1">
                  {mappedDocuments.length}
                </span>
              </div>
            </div>
            <div className={`p-1.5 ${mappedDocuments.length > 4 ? 'max-h-48 overflow-y-auto' : ''}`}>
              {mappedDocuments.length > 0 ? (
                <div className="space-y-1.5">
                  {mappedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-start p-2 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 mr-1.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 break-words leading-tight mb-0.5">{doc.name}</p>
                        {/* <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">No mapped documents</p>
                </div>
              )}
            </div>
          </div>

          {/* Unmapped Documents - Adaptive Height */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
            <div className="px-2 py-1.5 border-b border-gray-200 bg-amber-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-amber-800 truncate">Unmapped Documents</h3>
                <span className="bg-amber-600 text-white text-xs font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-1 ml-1">
                  {unmappedDocuments.length}
                </span>
              </div>
            </div>
            <div className={`p-1.5 ${unmappedDocuments.length > 4 ? 'max-h-48 overflow-y-auto' : ''}`}>
              {unmappedDocuments.length > 0 ? (
                <div className="space-y-1.5">
                  {unmappedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-start p-2 rounded-md border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 mr-1.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 break-words leading-tight mb-0.5">{doc.name}</p>
                        {/* <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-500">No unmapped documents</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remarks Editing Modal */}
      {editingRemarks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
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