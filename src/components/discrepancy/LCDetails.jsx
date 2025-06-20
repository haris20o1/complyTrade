// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const LCDetails = () => {

//     const navigate = useNavigate();
//     // Use useParams to get the lcNumber from URL parameters
//     const { lcNumber } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
//   const [newSubPoint, setNewSubPoint] = useState("");
//   const [selectedSubPoint, setSelectedSubPoint] = useState(null);
//   const [mainPoints, setMainPoints] = useState([]);
//   const [lcCompleted, setLcCompleted] = useState(false);
//   const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);

//   // Mock data to replace API call
//   const generateDummyData = (lcNumber) => {
//     return {
//       lcNumber,
//       missing_document_status: false,
//       discrepancies: [
//         {
//           doc_uuid: "doc-001",
//           doc_title: "Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial InvoiceV Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial Invoice Commercial InvoiceV Commercial Invoice",
//           discrepancies: [
//             { id: 1, issue: "Invoice amount doesn't match LC value", status: "discripant", remarks: "Amount is $5000 instead of $4500" },
//             { id: 2, issue: "Missing beneficiary signature", status: "clean", remarks: "" },
//           ]
//         },
//         {
//           doc_uuid: "doc-002",
//           doc_title: "Bill of Lading",
//           discrepancies: [
//             { id: 4, issue: "Late shipment date", status: "discripant", remarks: "Shipped on 12/15 instead of 12/10" },
//             { id: 5, issue: "Inconsistent goods description", status: "reassign", remarks: "Need clarification from shipper" },
//             { id: 6, issue: "Missing vessel details", status: "clean", remarks: "" }
//           ]
//         },
//         {
//           doc_uuid: "doc-004",
//           doc_title: "Certificate of Origin",
//           discrepancies: [
//             { id: 7, issue: "Country of origin doesn't match requirements", status: "discripant", remarks: "Listed as China instead of Vietnam" },
//             { id: 8, issue: "Incorrect HS code", status: "clean", remarks: "" }
//           ]
//         }
//       ]
//     };
//   };

//   useEffect(() => {
//     // Simulate API call with dummy data
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Simulate network delay
//         await new Promise(resolve => setTimeout(resolve, 800));

//         const data = generateDummyData(lcNumber);

//         if (!data || !data.discrepancies) {
//           setHasSupportingDocs(false);
//           setError('No supporting documents available for this LC');
//           return;
//         }

//         setMissingDocumentStatus(data.missing_document_status);

//         const initializedPoints = data.discrepancies.map(doc => ({
//             doc_uuid: doc.doc_uuid,
//             text: doc.doc_title || 'Untitled Document',
//             subPoints: doc.discrepancies?.map(d => ({
//               id: d.id,
//               text: d.issue,
//               status: d.status,
//               remarks: d.remarks || "" // Add remarks property
//             })) || []
//           }));

//         setMainPoints(initializedPoints);



//         const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
//         if (savedStatus) {
//           setLcCompleted(savedStatus === 'true');
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setHasSupportingDocs(false);
//         setError('Failed to load LC data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [lcNumber]);

//   const handleRemarksChange = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
//       setMainPoints(updatedMainPoints);
//     }
// };

//   const checkAllSubpointsDiscrepant = () => {
//     return mainPoints.every(mainPoint => 
//       mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
//     );
//   };

//   const isStatusCheckboxEnabled = () => {
//     return !missingDocumentStatus && checkAllSubpointsDiscrepant();
//   };

//   const handleSelection = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       let newStatus = '';
//       switch (value) {
//         case 'NO':
//           newStatus = 'clean';
//           break;
//         case 'YES':
//           newStatus = 'discripant';
//           break;
//         case 'RA':
//           newStatus = 'reassign';
//           break;
//         default:
//           newStatus = '';
//       }

//       updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const addSubPoint = (mainIndex) => {
//     if (newSubPoint.trim() !== "") {
//         const updatedMainPoints = [...mainPoints];
//         const newId = -Math.floor(Math.random() * 10000);
//         updatedMainPoints[mainIndex].subPoints.push({
//         id: newId,
//         text: newSubPoint,
//         status: 'clean',
//         remarks: ""  // Initialize with empty remarks
//         });
//         setMainPoints(updatedMainPoints);
//         setNewSubPoint("");
//     }
//     };

//   const deleteSubPoint = () => {
//     if (selectedSubPoint) {
//       const { mainIndex, subPointId } = selectedSubPoint;
//       const updatedMainPoints = [...mainPoints];
//       updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
//         sp => sp.id !== subPointId
//       );
//       setMainPoints(updatedMainPoints);
//       setSelectedSubPoint(null);
//     }
//   };

//   const saveToPDF = () => {
//     alert("PDF export functionality would go here. This requires html2canvas and jsPDF libraries.");
//   };

//   const handleBackToDashboard = () => {
//     navigate('/completed');
//   };

//   const remainingCount = mainPoints.reduce((count, mp) => 
//     count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//             <div className="text-lg text-red-600 font-medium">
//               {error}
//             </div>
//           </div>
//           <button 
//             onClick={handleBackToDashboard}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main content
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Full width, colorful */}
//       <header className="bg-indigo-800 shadow-md sticky top-0 z-10">
//         <div className="w-full px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <button 
//                 onClick={handleBackToDashboard}
//                 className="mr-3 text-white bg-indigo-800 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Back to dashboard"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-bold text-white">
//                 Letter of Credit <span className="bg-indigo-800 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
//               </h1>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
//                 <span className="text-sm font-medium">
//                   {lcCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               </div>
//               <button
//                 onClick={saveToPDF}
//                 className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Export PDF
//               </button>

//               <button className="inline-flex items-center px-12 py-3 border border-white text-sm font-medium rounded-md shadow-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">

//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//                 Generate final report
//               </button>

//             </div>
//           </div>
//         </div>
//       </header>


//       {/* Main Content - Full-width layout with sidebar */}
//       <div className="flex w-full">

//         {/* Left Sidebar - Fixed width with colorful elements */}
//         <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
//           {/* Status Box */}
//           <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-800 bg-indigo-800]">

//             {!isStatusCheckboxEnabled() && (
//               <div className="text-xs text-white/90 bg-indigo-800 p-2 rounded-md">
//                 {missingDocumentStatus
//                   ? "Missing supporting documents"
//                   : `${remainingCount} issues need resolution`}
//               </div>
//             )}
//           </div>

//           {/* Document Navigation */}
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-sm font-bold text-gray-900 mb-3">Documents</h2>
//             <div className="space-y-1">
//               {mainPoints.map((point, index) => (
//                 <button
//                   key={point.doc_uuid}
//                   className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//                     activeTab === index
//                       ? 'bg-indigo-800 text-white'
//                       : 'text-gray-700 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
//                   }`}
//                   onClick={() => setActiveTab(index)}
//                 >
//                   <span className="truncate">{point.text}</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//                     activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                     {point.subPoints.length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="p-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
//             <div className="space-y-3">

//               <div className="flex items-center p-2 bg-green-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-xs font-bold">
//                   Clean
//                 </span>
//                 <span className="text-sm text-green-700">No discrepancy</span>
//               </div>

//               <div className="flex items-center p-2 bg-red-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-xs font-bold">
//                   Issue
//                 </span>
//                 <span className="text-sm text-red-700">Discrepancy confirmed</span>
//               </div>

//               <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-xs font-bold">
//                   RA
//                 </span>
//                 <span className="text-sm text-yellow-700">Reassignment needed</span>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* Right Content Area - Expands to fill remaining width */}
//         <div className="flex-1 p-6 ml-64">



//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#646cffaa]"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//                 <div className="text-lg text-red-600 font-medium mb-6">
//                   {error}
//                 </div>
//                 <button 
//                   onClick={handleBackToDashboard}
//                   className="bg-indigo-800 hover:bg-[#646cffaa]/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors mx-auto"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Dashboard
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {mainPoints.map((mainPoint, mainIndex) => (
//                 <div 
//                   key={mainPoint.doc_uuid} 
//                   className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
//                 >
//                   {/* Document Header Card */}
//                   <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#646cffaa]">
//                   <div className="p-5 bg-gradient-to-r from-white to-[#646cffaa] border border-gray-300 shadow-2xl rounded-lg ">

//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h2 className="text-xl font-bold text-gray-900">{mainPoint.text}</h2>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
//                           </p>
//                         </div>

//                         {/* Status Summary */}
//                         <div className="flex space-x-2">
//                           <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                             <span className="text-xs text-green-800 font-medium">Clean</span>
//                             <p className="text-lg font-bold text-green-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-red-100 rounded-md">
//                             <span className="text-xs text-red-800 font-medium">Discrepant</span>
//                             <p className="text-lg font-bold text-red-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                             <span className="text-xs text-yellow-800 font-medium">Reassign</span>
//                             <p className="text-lg font-bold text-yellow-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'reassign').length}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Issues Section */}
//                   <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
//                     <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>

//                       {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
//                         <button
//                           onClick={deleteSubPoint}
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           Delete Selected
//                         </button>
//                       )}
//                     </div>

//                     {/* Issues Table */}
//                     <div className="overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-indigo-700">
//                             <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Issue Description
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Remarks
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Clean
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                 issue
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                 RA
//                                 </span>
//                             </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {mainPoint.subPoints.length > 0 ? (
//                             mainPoint.subPoints.map((subPoint) => (
//                                 <tr
//                                 key={subPoint.id}
//                                 className={`hover:bg-[#646cffaa]/5 cursor-pointer transition-colors ${
//                                     selectedSubPoint?.mainIndex === mainIndex &&
//                                     selectedSubPoint?.subPointId === subPoint.id
//                                     ? "bg-[#646cffaa]/10"
//                                     : ""
//                                 }`}
//                                 onClick={() => setSelectedSubPoint({
//                                     mainIndex,
//                                     subPointId: subPoint.id
//                                 })}
//                                 >
//                                 <td className="px-6 py-4 text-md text-gray-900">
//                                     {subPoint.text}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="relative">
//                                         <input
//                                             type="text"
//                                             value={subPoint.remarks || ''}
//                                             onChange={(e) => handleRemarksChange(mainIndex, subPoint.id, e.target.value)}
//                                             className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
//                                             placeholder="Add remarks..."
//                                             onClick={(e) => e.stopPropagation()}
//                                         />
//                                         {subPoint.remarks && (
//                                             <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleRemarksChange(mainIndex, subPoint.id, '');
//                                             }}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                                             aria-label="Clear remarks"
//                                             >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                             </svg>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="NO"
//                                         checked={subPoint.status === 'clean'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'NO')}
//                                         className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="YES"
//                                         checked={subPoint.status === 'discripant'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'YES')}
//                                         className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="RA"
//                                         checked={subPoint.status === 'reassign'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'RA')}
//                                         className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 </tr>
//                             ))
//                             ) : (
//                             <tr>
//                                 <td colSpan="5" className="px-6 py-10 text-center">
//                                 <div className="flex flex-col items-center">
//                                     <div className="h-16 w-16 text-gray-400 mb-4">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     </div>
//                                     <p className="text-gray-500 text-lg">No issues found for this document</p>
//                                 </div>
//                                 </td>
//                             </tr>
//                             )}
//                         </tbody>
//                         </table>
//                     </div>

//                     {/* Add New Issue */}
//                     <div className="p-5 border-t border-gray-200 bg-gray-50">
//                       <div className="flex rounded-md shadow-sm">
//                         <input
//                           type="text"
//                           value={newSubPoint}
//                           onChange={(e) => setNewSubPoint(e.target.value)}
//                           placeholder="Add a new issue..."
//                           className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
//                         />
//                         <button
//                           onClick={() => addSubPoint(mainIndex)}
//                           className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                           Add Issue
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex justify-end space-x-4 mt-8">
//                     <button className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Save Draft
//                     </button>

//                   </div>
//                 </div>
//               ))}

//               {/* Empty State */}
//               {mainPoints.length === 0 && (
//                 <div className="bg-white rounded-lg shadow-lg p-12">
//                   <div className="flex flex-col items-center justify-center text-center">
//                     <div className="h-24 w-24 text-[#646cff] mb-6 bg-[#646cffaa]/10 rounded-full flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
//                     <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
//                       There are no documents or discrepancies recorded for this Letter of Credit.
//                     </p>
//                     <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-[#646cffaa] hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add First Document
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LCDetails;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { lcService } from "../authentication/apiAdmin";

// const LCDetails = () => {
//   const navigate = useNavigate();
//   const { lcNumber } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
//   const [newSubPoint, setNewSubPoint] = useState("");
//   const [selectedSubPoint, setSelectedSubPoint] = useState(null);
//   const [mainPoints, setMainPoints] = useState([]);
//   const [lcCompleted, setLcCompleted] = useState(false);
//   const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [allTabsVisited, setAllTabsVisited] = useState(false);
//   const [visitedTabs, setVisitedTabs] = useState({});

//   useEffect(() => {
//     // Fetch LC discrepancies from API
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Use the lcService instead of direct fetch
//         const data = await lcService.getLCSupportDocsDiscrepancies(lcNumber);

//         if (!data || data.length === 0) {
//           setHasSupportingDocs(false);
//           setError('No supporting documents available for this LC');
//           return;
//         }

//         // Initialize visited tabs object
//         const initialVisitedTabs = {};
//         data.forEach((_, index) => {
//           initialVisitedTabs[index] = false;
//         });
//         setVisitedTabs(initialVisitedTabs);

//         // Transform API data to match our component's structure
//         const initializedPoints = data.map(doc => ({
//           doc_uuid: doc.doc_uuid,
//           text: doc.doc_title || 'Untitled Document',
//           subPoints: doc.discrepancies?.map(d => ({
//             id: d.id,
//             text: d.issue,
//             status: d.status?.toLowerCase() || 'clean',
//             remarks: d.remarks || ""
//           })) || []
//         }));

//         setMainPoints(initializedPoints);

//         // Check if LC is completed in localStorage
//         const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
//         if (savedStatus) {
//           setLcCompleted(savedStatus === 'true');
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setHasSupportingDocs(false);
//         setError('Failed to load LC data: ' + (err.response?.data?.message || err.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [lcNumber]);

//   // Check if all tabs have been visited whenever activeTab changes
//   useEffect(() => {
//     const updatedVisitedTabs = { ...visitedTabs };
//     updatedVisitedTabs[activeTab] = true;
//     setVisitedTabs(updatedVisitedTabs);

//     const allVisited = Object.values(updatedVisitedTabs).every(visited => visited);
//     setAllTabsVisited(allVisited);
//   }, [activeTab]);

//   const handleRemarksChange = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const checkAllSubpointsDiscrepant = () => {
//     return mainPoints.every(mainPoint => 
//       mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
//     );
//   };

//   const isStatusCheckboxEnabled = () => {
//     return !missingDocumentStatus && checkAllSubpointsDiscrepant();
//   };

//   const handleSelection = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       let newStatus = '';
//       switch (value) {
//         case 'NO':
//           newStatus = 'clean';
//           break;
//         case 'YES':
//           newStatus = 'discripant';
//           break;
//         case 'RA':
//           newStatus = 'reassign';
//           break;
//         default:
//           newStatus = '';
//       }

//       updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const addSubPoint = (mainIndex) => {
//     if (newSubPoint.trim() !== "") {
//       const updatedMainPoints = [...mainPoints];
//       const newId = -Math.floor(Math.random() * 10000);
//       updatedMainPoints[mainIndex].subPoints.push({
//         id: newId,
//         text: newSubPoint,
//         status: 'clean',
//         remarks: ""
//       });
//       setMainPoints(updatedMainPoints);
//       setNewSubPoint("");
//     }
//   };

//   const deleteSubPoint = () => {
//     if (selectedSubPoint) {
//       const { mainIndex, subPointId } = selectedSubPoint;
//       const updatedMainPoints = [...mainPoints];
//       updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
//         sp => sp.id !== subPointId
//       );
//       setMainPoints(updatedMainPoints);
//       setSelectedSubPoint(null);
//     }
//   };

//   // Function to prepare data for API
//   const prepareDiscrepanciesData = () => {
//     return mainPoints.map(mainPoint => {
//       // Map current subpoints for updates
//       const updates = mainPoint.subPoints
//         .filter(sp => sp.id > 0) // Only include existing subpoints (positive IDs)
//         .map(sp => ({
//           id: sp.id,
//           status: sp.status,
//           remarks: sp.remarks || ""
//         }));

//       // Find any newly added subpoints (negative IDs)
//       const additions = mainPoint.subPoints
//         .filter(sp => sp.id < 0) // Only include new subpoints (negative IDs)
//         .map(sp => sp.text);

//       // Create the base object
//       const result = {
//         doc_uuid: mainPoint.doc_uuid,
//         updates: updates
//       };

//       // Only include additions if there are any
//       if (additions.length > 0) {
//         result.addition = additions;
//       }

//       // Only include deletions if there are any
//       if (selectedSubPoint && 
//           selectedSubPoint.mainIndex === mainPoints.indexOf(mainPoint) &&
//           selectedSubPoint.subPointId) {
//         result.deletion = [selectedSubPoint.subPointId];
//       }

//       return result;
//     });
//   };

//   // Save Draft handler
//   const handleSaveDraft = async () => {
//     try {
//       const discrepanciesData = prepareDiscrepanciesData();
//       await lcService.updateLCDiscrepancies(false, discrepanciesData);
//       alert("Draft saved successfully!");
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       alert("Failed to save draft: " + (error.response?.data?.message || error.message));
//     }
//   };

//   // Generate Final Report handler
//   const handleGenerateReport = async () => {
//     if (!allTabsVisited) {
//       alert("Please review all documents before generating the final report.");
//       return;
//     }

//     try {
//       const discrepanciesData = prepareDiscrepanciesData();
//       await lcService.updateLCDiscrepancies(true, discrepanciesData);
//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
//       alert("Final report generated successfully!");
//     } catch (error) {
//       console.error("Error generating report:", error);
//       alert("Failed to generate report: " + (error.response?.data?.message || error.message));
//     }
//   };
//   const saveToPDF = () => {
//     alert("PDF export functionality would go here. This requires html2canvas and jsPDF libraries.");
//   };

//   const handleBackToDashboard = () => {
//     window.close(); // Close the current tab
//     // Alternatively, navigate back to the completed page
//     // navigate('/completed');
//   };

//   const generateFinalReport = () => {
//     if (allTabsVisited) {
//       alert("Generating final report for LC #" + lcNumber);
//       // Here you would implement the API call to generate the final report
//       // After successful generation:
//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
//     } else {
//       alert("Please review all documents before generating the final report.");
//     }
//   };

//   const remainingCount = mainPoints.reduce((count, mp) => 
//     count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//             <div className="text-lg text-red-600 font-medium">
//               {error}
//             </div>
//           </div>
//           <button 
//             onClick={handleBackToDashboard}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main content
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Full width, colorful */}
//       <header className="bg-indigo-800 shadow-md sticky top-0 z-10">
//         <div className="w-full px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <button 
//                 onClick={handleBackToDashboard}
//                 className="mr-3 text-white bg-indigo-800 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Back to dashboard"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-bold text-white">
//                 Letter of Credit <span className="bg-indigo-800 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
//               </h1>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
//                 <span className="text-sm font-medium">
//                   {lcCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               </div>
//               <button
//                 onClick={saveToPDF}
//                 className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Export PDF
//               </button>

//               <button 
//                 onClick={handleGenerateReport}
//                 disabled={!allTabsVisited}
//                 className={`inline-flex items-center px-12 py-3 border border-white text-sm font-medium rounded-md shadow-md text-white ${
//                   allTabsVisited 
//                     ? 'bg-indigo-800 hover:bg-[#646cffaa]/90' 
//                     : 'bg-gray-400 cursor-not-allowed'
//                 } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors`}
//                 title={!allTabsVisited ? "Please review all documents first" : "Generate final report"}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//                 Generate final report
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Full-width layout with sidebar */}
//       <div className="flex w-full">

//         {/* Left Sidebar - Fixed width with colorful elements */}
//         <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
//           {/* Status Box */}
//           <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-800 bg-indigo-800]">

//             {!isStatusCheckboxEnabled() && (
//               <div className="text-xs text-white/90 bg-indigo-800 p-2 rounded-md">
//                 {missingDocumentStatus
//                   ? "Missing supporting documents"
//                   : `${remainingCount} issues need resolution`}
//               </div>
//             )}
//           </div>

//           {/* Document Navigation */}
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-sm font-bold text-gray-900 mb-3">Documents</h2>
//             <div className="space-y-1">
//               {mainPoints.map((point, index) => (
//                 <button
//                   key={point.doc_uuid}
//                   className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//                     activeTab === index
//                       ? 'bg-indigo-800 text-white'
//                       : visitedTabs[index]
//                         ? 'text-gray-700 bg-green-100 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
//                         : 'text-gray-700 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
//                   }`}
//                   onClick={() => setActiveTab(index)}
//                 >
//                   <span className="truncate">{point.text}</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//                     activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                     {point.subPoints.length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="p-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
//             <div className="space-y-3">

//               <div className="flex items-center p-2 bg-green-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-xs font-bold">
//                   Clean
//                 </span>
//                 <span className="text-sm text-green-700">No discrepancy</span>
//               </div>

//               <div className="flex items-center p-2 bg-red-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-xs font-bold">
//                   Issue
//                 </span>
//                 <span className="text-sm text-red-700">Discrepancy confirmed</span>
//               </div>

//               <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-xs font-bold">
//                   RA
//                 </span>
//                 <span className="text-sm text-yellow-700">Reassignment needed</span>
//               </div>
//             </div>
//           </div>

//           {/* Progress Indicator */}
//           <div className="p-4 mt-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Review Progress</h3>
//             <div className="bg-gray-200 rounded-full h-2.5 mb-1">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{ width: `${(Object.values(visitedTabs).filter(v => v).length / mainPoints.length) * 100}%` }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 text-right">
//               {Object.values(visitedTabs).filter(v => v).length} of {mainPoints.length} reviewed
//             </p>
//           </div>
//         </div>

//         {/* Right Content Area - Expands to fill remaining width */}
//         <div className="flex-1 p-6 ml-64">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#646cffaa]"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//                 <div className="text-lg text-red-600 font-medium mb-6">
//                   {error}
//                 </div>
//                 <button 
//                   onClick={handleBackToDashboard}
//                   className="bg-indigo-800 hover:bg-[#646cffaa]/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors mx-auto"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Dashboard
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {mainPoints.map((mainPoint, mainIndex) => (
//                 <div 
//                   key={mainPoint.doc_uuid} 
//                   className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
//                 >
//                   {/* Document Header Card */}
//                   <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#646cffaa]">
//                   <div className="p-5 bg-gradient-to-r from-white to-[#646cffaa] border border-gray-300 shadow-2xl rounded-lg ">

//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h2 className="text-xl font-bold text-gray-900">{mainPoint.text}</h2>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
//                           </p>
//                         </div>

//                         {/* Status Summary */}
//                         <div className="flex space-x-2">
//                           <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                             <span className="text-xs text-green-800 font-medium">Clean</span>
//                             <p className="text-lg font-bold text-green-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-red-100 rounded-md">
//                             <span className="text-xs text-red-800 font-medium">Discrepant</span>
//                             <p className="text-lg font-bold text-red-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                             <span className="text-xs text-yellow-800 font-medium">Reassign</span>
//                             <p className="text-lg font-bold text-yellow-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'reassign').length}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Issues Section */}
//                   <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
//                     <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>

//                       {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
//                         <button
//                           onClick={deleteSubPoint}
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           Delete Selected
//                         </button>
//                       )}
//                     </div>

//                     {/* Issues Table */}
//                     <div className="overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-indigo-700">
//                             <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Issue Description
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Remarks
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Clean
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                 issue
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                 RA
//                                 </span>
//                             </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {mainPoint.subPoints.length > 0 ? (
//                             mainPoint.subPoints.map((subPoint) => (
//                                 <tr
//                                 key={subPoint.id}
//                                 className={`hover:bg-[#646cffaa]/5 cursor-pointer transition-colors ${
//                                     selectedSubPoint?.mainIndex === mainIndex &&
//                                     selectedSubPoint?.subPointId === subPoint.id
//                                     ? "bg-[#646cffaa]/10"
//                                     : ""
//                                 }`}
//                                 onClick={() => setSelectedSubPoint({
//                                     mainIndex,
//                                     subPointId: subPoint.id
//                                 })}
//                                 >
//                                 <td className="px-6 py-4 text-md text-gray-900">
//                                     {subPoint.text}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="relative">
//                                         <input
//                                             type="text"
//                                             value={subPoint.remarks || ''}
//                                             onChange={(e) => handleRemarksChange(mainIndex, subPoint.id, e.target.value)}
//                                             className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
//                                             placeholder="Add remarks..."
//                                             onClick={(e) => e.stopPropagation()}
//                                         />
//                                         {subPoint.remarks && (
//                                             <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleRemarksChange(mainIndex, subPoint.id, '');
//                                             }}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                                             aria-label="Clear remarks"
//                                             >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                             </svg>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="NO"
//                                         checked={subPoint.status === 'clean'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'NO')}
//                                         className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="YES"
//                                         checked={subPoint.status === 'discripant'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'YES')}
//                                         className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="RA"
//                                         checked={subPoint.status === 'reassign'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'RA')}
//                                         className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 </tr>
//                             ))
//                             ) : (
//                             <tr>
//                                 <td colSpan="5" className="px-6 py-10 text-center">
//                                 <div className="flex flex-col items-center">
//                                     <div className="h-16 w-16 text-gray-400 mb-4">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     </div>
//                                     <p className="text-gray-500 text-lg">No issues found for this document</p>
//                                 </div>
//                                 </td>
//                             </tr>
//                             )}
//                         </tbody>
//                         </table>
//                     </div>

//                     {/* Add New Issue */}
//                     <div className="p-5 border-t border-gray-200 bg-gray-50">
//                       <div className="flex rounded-md shadow-sm">
//                         <input
//                           type="text"
//                           value={newSubPoint}
//                           onChange={(e) => setNewSubPoint(e.target.value)}
//                           placeholder="Add a new issue..."
//                           className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
//                         />
//                         <button
//                           onClick={() => addSubPoint(mainIndex)}
//                           className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                           Add Issue
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex justify-end space-x-4 mt-8">
//                    <button 
//                     onClick={handleSaveDraft}
//                     className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Save Draft
//                   </button>

//                   </div>
//                 </div>
//               ))}

//               {/* Empty State */}
//               {mainPoints.length === 0 && (
//                 <div className="bg-white rounded-lg shadow-lg p-12">
//                   <div className="flex flex-col items-center justify-center text-center">
//                     <div className="h-24 w-24 text-[#646cff] mb-6 bg-[#646cffaa]/10 rounded-full flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
//                     <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
//                       There are no documents or discrepancies recorded for this Letter of Credit.
//                     </p>
//                     <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-[#646cffaa] hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add First Document
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LCDetails;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { lcService } from "../authentication/apiAdmin";

// const LCDetails = () => {
//   const navigate = useNavigate();
//   const { lcNumber } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
//   const [newSubPoint, setNewSubPoint] = useState("");
//   const [selectedSubPoint, setSelectedSubPoint] = useState(null);
//   const [mainPoints, setMainPoints] = useState([]);
//   const [lcCompleted, setLcCompleted] = useState(false);
//   const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [allTabsVisited, setAllTabsVisited] = useState(false);
//   const [visitedTabs, setVisitedTabs] = useState({});

//   useEffect(() => {
//     // Fetch LC discrepancies from API
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Use the lcService instead of direct fetch
//         const data = await lcService.getLCSupportDocsDiscrepancies(lcNumber);

//         if (!data || data.length === 0) {
//           setHasSupportingDocs(false);
//           setError('No supporting documents available for this LC');
//           return;
//         }

//         // Initialize visited tabs object
//         const initialVisitedTabs = {};
//         data.forEach((_, index) => {
//           initialVisitedTabs[index] = false;
//         });
//         setVisitedTabs(initialVisitedTabs);

//         // Transform API data to match our component's structure
//         const initializedPoints = data.map(doc => ({
//           doc_uuid: doc.doc_uuid,
//           text: doc.doc_title || 'Untitled Document',
//           subPoints: doc.discrepancies?.map(d => ({
//             id: d.id,
//             text: d.issue,
//             status: d.status?.toLowerCase() || 'clean',
//             remarks: d.remarks || ""
//           })) || []
//         }));

//         setMainPoints(initializedPoints);

//         // Check if LC is completed in localStorage
//         const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
//         if (savedStatus) {
//           setLcCompleted(savedStatus === 'true');
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setHasSupportingDocs(false);
//         setError('Failed to load LC data: ' + (err.response?.data?.message || err.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [lcNumber]);

//   // Check if all tabs have been visited whenever activeTab changes
//   useEffect(() => {
//     const updatedVisitedTabs = { ...visitedTabs };
//     updatedVisitedTabs[activeTab] = true;
//     setVisitedTabs(updatedVisitedTabs);

//     const allVisited = Object.values(updatedVisitedTabs).every(visited => visited);
//     setAllTabsVisited(allVisited);
//   }, [activeTab]);

//   const handleRemarksChange = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const checkAllSubpointsDiscrepant = () => {
//     return mainPoints.every(mainPoint => 
//       mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
//     );
//   };

//   const isStatusCheckboxEnabled = () => {
//     return !missingDocumentStatus && checkAllSubpointsDiscrepant();
//   };

//   const handleSelection = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       let newStatus = '';
//       switch (value) {
//         case 'NO':
//           newStatus = 'clean';
//           break;
//         case 'YES':
//           newStatus = 'discripant';
//           break;
//         case 'RA':
//           newStatus = 'reassign';
//           break;
//         default:
//           newStatus = '';
//       }

//       updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const addSubPoint = (mainIndex) => {
//     if (newSubPoint.trim() !== "") {
//       const updatedMainPoints = [...mainPoints];
//       const newId = -Math.floor(Math.random() * 10000);
//       updatedMainPoints[mainIndex].subPoints.push({
//         id: newId,
//         text: newSubPoint,
//         status: 'clean',
//         remarks: ""
//       });
//       setMainPoints(updatedMainPoints);
//       setNewSubPoint("");
//     }
//   };

//   const [pendingDeletions, setPendingDeletions] = useState({});

//   // Modify the deleteSubPoint function
//   const deleteSubPoint = () => {
//     if (selectedSubPoint) {
//       const { mainIndex, subPointId } = selectedSubPoint;

//       // Update the pendingDeletions state
//       setPendingDeletions(prev => {
//         const docUuid = mainPoints[mainIndex].doc_uuid;
//         return {
//           ...prev,
//           [docUuid]: [...(prev[docUuid] || []), subPointId]
//         };
//       });

//       // Update the UI by removing the subpoint
//       const updatedMainPoints = [...mainPoints];
//       updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
//         sp => sp.id !== subPointId
//       );
//       setMainPoints(updatedMainPoints);
//       setSelectedSubPoint(null);
//     }
//   };
//   // Function to prepare data for API
//   const prepareDiscrepanciesData = () => {
//     return mainPoints.map(mainPoint => {
//       // Start with base object structure
//       const result = {
//         doc_uuid: mainPoint.doc_uuid
//       };

//       // Add updates for existing subpoints - only if they have changes
//       const existingSubPoints = mainPoint.subPoints.filter(sp => sp.id > 0);
//       if (existingSubPoints.length > 0) {
//         const updatedPoints = existingSubPoints.filter(sp => 
//           // Only include subpoints with valid remarks (if provided)
//           (sp.remarks && sp.remarks.length >= 3) || !sp.remarks
//         ).map(sp => {
//           const update = {
//             id: sp.id,
//             status: sp.status
//           };

//           // Only include remarks if it's not empty and has valid length
//           if (sp.remarks && sp.remarks.length >= 3) {
//             update.remarks = sp.remarks;
//           }

//           return update;
//         });

//         // Only add the updates field if there are updates
//         if (updatedPoints.length > 0) {
//           result.updates = updatedPoints;
//         }
//       }

//       // Add new subpoints if any
//       const newSubPoints = mainPoint.subPoints.filter(sp => sp.id < 0)
//         .map(sp => sp.text);
//       if (newSubPoints.length > 0) {
//         result.addition = newSubPoints;
//       }

//       // Add deletions from our tracked state
//       if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
//         result.deletion = pendingDeletions[mainPoint.doc_uuid];
//       }

//       return result;
//     }).filter(item => {
//       // Filter out documents that have no changes (no updates, additions, or deletions)
//       return item.updates || item.addition || item.deletion;
//     });
//   };

//   // Save Draft handler
//   const handleSaveDraft = async () => {
//     try {
//       const discrepanciesData = prepareDiscrepanciesData();

//       if (discrepanciesData.length === 0) {
//         alert("No changes to save!");
//         return;
//       }

//       console.log("Sending data:", JSON.stringify(discrepanciesData, null, 2));
//       await lcService.updateLCDiscrepancies(false, discrepanciesData);
//       alert("Draft saved successfully!");
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to save draft: " + (error.response?.data?.message || error.message));
//     }
//   };

//   // Generate Final Report handler
//   const handleGenerateReport = async () => {
//     if (!allTabsVisited) {
//       alert("Please review all documents before generating the final report.");
//       return;
//     }

//     try {
//       const discrepanciesData = prepareDiscrepanciesData();

//       if (discrepanciesData.length === 0) {
//         alert("No changes to save in the report!");
//         return;
//       }

//       console.log("Sending data:", JSON.stringify(discrepanciesData, null, 2));
//       await lcService.updateLCDiscrepancies(true, discrepanciesData);
//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
//       alert("Final report generated successfully!");
//     } catch (error) {
//       console.error("Error generating report:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to generate report: " + (error.response?.data?.message || error.message));
//     }
//   };


//   const saveToPDF = () => {
//     alert("PDF export functionality would go here. This requires html2canvas and jsPDF libraries.");
//   };

//   const handleBackToDashboard = () => {
//     window.close(); // Close the current tab
//     // Alternatively, navigate back to the completed page
//     // navigate('/completed');
//   };

//   const generateFinalReport = () => {
//     if (allTabsVisited) {
//       alert("Generating final report for LC #" + lcNumber);
//       // Here you would implement the API call to generate the final report
//       // After successful generation:
//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
//     } else {
//       alert("Please review all documents before generating the final report.");
//     }
//   };

//   const remainingCount = mainPoints.reduce((count, mp) => 
//     count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//             <div className="text-lg text-red-600 font-medium">
//               {error}
//             </div>
//           </div>
//           <button 
//             onClick={handleBackToDashboard}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main content
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Full width, colorful */}
//       <header className="bg-indigo-800 shadow-md sticky top-0 z-10">
//         <div className="w-full px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <button 
//                 onClick={handleBackToDashboard}
//                 className="mr-3 text-white bg-indigo-800 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Back to dashboard"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-bold text-white">
//                 Letter of Credit <span className="bg-indigo-800 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
//               </h1>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
//                 <span className="text-sm font-medium">
//                   {lcCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               </div>
//               <button
//                 onClick={saveToPDF}
//                 className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Export PDF
//               </button>

//               <button 
//                 onClick={handleGenerateReport}
//                 disabled={!allTabsVisited}
//                 className={`inline-flex items-center px-12 py-3 border border-white text-sm font-medium rounded-md shadow-md text-white ${
//                   allTabsVisited 
//                     ? 'bg-indigo-800 hover:bg-[#646cffaa]/90' 
//                     : 'bg-gray-400 cursor-not-allowed'
//                 } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors`}
//                 title={!allTabsVisited ? "Please review all documents first" : "Generate final report"}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//                 Generate final report
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Full-width layout with sidebar */}
//       <div className="flex w-full">

//         {/* Left Sidebar - Fixed width with colorful elements */}
//         <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
//           {/* Status Box */}
//           <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-800 bg-indigo-800]">

//             {!isStatusCheckboxEnabled() && (
//               <div className="text-xs text-white/90 bg-indigo-800 p-2 rounded-md">
//                 {missingDocumentStatus
//                   ? "Missing supporting documents"
//                   : `${remainingCount} issues need resolution`}
//               </div>
//             )}
//           </div>

//           {/* Document Navigation */}
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-sm font-bold text-gray-900 mb-3">Documents</h2>
//             <div className="space-y-1">
//               {mainPoints.map((point, index) => (
//                 <button
//                   key={point.doc_uuid}
//                   className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
//                     activeTab === index
//                       ? 'bg-indigo-800 text-white'
//                       : visitedTabs[index]
//                         ? 'text-gray-700 bg-green-100 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
//                         : 'text-gray-700 hover:bg-[#646cffaa]/10 hover:text-[#646cffaa]'
//                   }`}
//                   onClick={() => setActiveTab(index)}
//                 >
//                   <span className="truncate">{point.text}</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//                     activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                     {point.subPoints.length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="p-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
//             <div className="space-y-3">

//               <div className="flex items-center p-2 bg-green-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-xs font-bold">
//                   Clean
//                 </span>
//                 <span className="text-sm text-green-700">No discrepancy</span>
//               </div>

//               <div className="flex items-center p-2 bg-red-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-xs font-bold">
//                   Issue
//                 </span>
//                 <span className="text-sm text-red-700">Discrepancy confirmed</span>
//               </div>

//               <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-xs font-bold">
//                   RA
//                 </span>
//                 <span className="text-sm text-yellow-700">Reassignment needed</span>
//               </div>
//             </div>
//           </div>

//           {/* Progress Indicator */}
//           <div className="p-4 mt-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Review Progress</h3>
//             <div className="bg-gray-200 rounded-full h-2.5 mb-1">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{ width: `${(Object.values(visitedTabs).filter(v => v).length / mainPoints.length) * 100}%` }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 text-right">
//               {Object.values(visitedTabs).filter(v => v).length} of {mainPoints.length} reviewed
//             </p>
//           </div>
//         </div>

//         {/* Right Content Area - Expands to fill remaining width */}
//         <div className="flex-1 p-6 ml-64">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#646cffaa]"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//                 <div className="text-lg text-red-600 font-medium mb-6">
//                   {error}
//                 </div>
//                 <button 
//                   onClick={handleBackToDashboard}
//                   className="bg-indigo-800 hover:bg-[#646cffaa]/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors mx-auto"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Dashboard
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {mainPoints.map((mainPoint, mainIndex) => (
//                 <div 
//                   key={mainPoint.doc_uuid} 
//                   className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
//                 >
//                   {/* Document Header Card */}
//                   <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#646cffaa]">
//                   <div className="p-5 bg-gradient-to-r from-white to-[#646cffaa] border border-gray-300 shadow-2xl rounded-lg ">

//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h2 className="text-xl font-bold text-gray-900">{mainPoint.text}</h2>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
//                           </p>
//                         </div>

//                         {/* Status Summary */}
//                         <div className="flex space-x-2">
//                           <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                             <span className="text-xs text-green-800 font-medium">Clean</span>
//                             <p className="text-lg font-bold text-green-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-red-100 rounded-md">
//                             <span className="text-xs text-red-800 font-medium">Discrepant</span>
//                             <p className="text-lg font-bold text-red-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                             <span className="text-xs text-yellow-800 font-medium">Reassign</span>
//                             <p className="text-lg font-bold text-yellow-600">
//                               {mainPoint.subPoints.filter(sp => sp.status === 'reassign').length}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Issues Section */}
//                   <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
//                     <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>

//                       {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
//                         <button
//                           onClick={deleteSubPoint}
//                           className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           Delete Selected
//                         </button>
//                       )}
//                     </div>

//                     {/* Issues Table */}
//                     <div className="overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-indigo-700">
//                             <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Issue Description
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                 Remarks
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Clean
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                 issue
//                                 </span>
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                 RA
//                                 </span>
//                             </th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {mainPoint.subPoints.length > 0 ? (
//                             mainPoint.subPoints.map((subPoint) => (
//                                 <tr
//                                 key={subPoint.id}
//                                 className={`hover:bg-[#646cffaa]/5 cursor-pointer transition-colors ${
//                                     selectedSubPoint?.mainIndex === mainIndex &&
//                                     selectedSubPoint?.subPointId === subPoint.id
//                                     ? "bg-[#646cffaa]/10"
//                                     : ""
//                                 }`}
//                                 onClick={() => setSelectedSubPoint({
//                                     mainIndex,
//                                     subPointId: subPoint.id
//                                 })}
//                                 >
//                                 <td className="px-6 py-4 text-md text-gray-900">
//                                     {subPoint.text}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="relative">
//                                         <input
//                                             type="text"
//                                             value={subPoint.remarks || ''}
//                                             onChange={(e) => handleRemarksChange(mainIndex, subPoint.id, e.target.value)}
//                                             className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
//                                             placeholder="Add remarks..."
//                                             onClick={(e) => e.stopPropagation()}
//                                         />
//                                         {subPoint.remarks && (
//                                             <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleRemarksChange(mainIndex, subPoint.id, '');
//                                             }}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                                             aria-label="Clear remarks"
//                                             >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                             </svg>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="NO"
//                                         checked={subPoint.status === 'clean'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'NO')}
//                                         className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="YES"
//                                         checked={subPoint.status === 'discripant'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'YES')}
//                                         className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex items-center justify-center">
//                                     <input
//                                         type="radio"
//                                         name={`point-${mainIndex}-${subPoint.id}`}
//                                         value="RA"
//                                         checked={subPoint.status === 'reassign'}
//                                         onChange={() => handleSelection(mainIndex, subPoint.id, 'RA')}
//                                         className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
//                                     />
//                                     </div>
//                                 </td>
//                                 </tr>
//                             ))
//                             ) : (
//                             <tr>
//                                 <td colSpan="5" className="px-6 py-10 text-center">
//                                 <div className="flex flex-col items-center">
//                                     <div className="h-16 w-16 text-gray-400 mb-4">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     </div>
//                                     <p className="text-gray-500 text-lg">No issues found for this document</p>
//                                 </div>
//                                 </td>
//                             </tr>
//                             )}
//                         </tbody>
//                         </table>
//                     </div>

//                     {/* Add New Issue */}
//                     <div className="p-5 border-t border-gray-200 bg-gray-50">
//                       <div className="flex rounded-md shadow-sm">
//                         <input
//                           type="text"
//                           value={newSubPoint}
//                           onChange={(e) => setNewSubPoint(e.target.value)}
//                           placeholder="Add a new issue..."
//                           className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
//                         />
//                         <button
//                           onClick={() => addSubPoint(mainIndex)}
//                           className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-800 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                           Add Issue
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex justify-end space-x-4 mt-8">
//                    <button 
//                     onClick={handleSaveDraft}
//                     className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Save Draft
//                   </button>

//                   </div>
//                 </div>
//               ))}

//               {/* Empty State */}
//               {mainPoints.length === 0 && (
//                 <div className="bg-white rounded-lg shadow-lg p-12">
//                   <div className="flex flex-col items-center justify-center text-center">
//                     <div className="h-24 w-24 text-[#646cff] mb-6 bg-[#646cffaa]/10 rounded-full flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
//                     <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
//                       There are no documents or discrepancies recorded for this Letter of Credit.
//                     </p>
//                     <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-[#646cffaa] hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add First Document
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LCDetails;















// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { lcService } from "../authentication/apiAdmin";
// import { Activity } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';

// const LCDetails = () => {
//   const navigate = useNavigate();
//   const { lcNumber } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
//   const [newSubPoint, setNewSubPoint] = useState("");
//   const [selectedSubPoint, setSelectedSubPoint] = useState(null);
//   const [mainPoints, setMainPoints] = useState([]);
//   const [lcCompleted, setLcCompleted] = useState(false);
//   const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [allTabsVisited, setAllTabsVisited] = useState(false);
//   const [visitedTabs, setVisitedTabs] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   // Add these state variables after the existing useState declarations
//   const [currentView, setCurrentView] = useState('discrepancies'); // 'discrepancies', 'price-verification'
//   const [priceVerificationData, setPriceVerificationData] = useState([
//     {
//       productName: "Premium Steel Coils",
//       hsCode: "7208.10.00",
//       estimatedValue: 45000,
//       proposedValue: 47500,
//       dualUseItem: "No",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     },
//     {
//       productName: "Industrial Machinery Parts",
//       hsCode: "8431.39.90",
//       estimatedValue: 23000,
//       proposedValue: 22800,
//       dualUseItem: "Yes",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     },
//     {
//       productName: "Electronic Components",
//       hsCode: "8542.31.00",
//       estimatedValue: 18500,
//       proposedValue: 19200,
//       dualUseItem: "Yes",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     }
//   ]);


//   useEffect(() => {
//     // Fetch LC discrepancies from API
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Use the lcService instead of direct fetch
//         const data = await lcService.getLCSupportDocsDiscrepancies(lcNumber);

//         if (!data || data.length === 0) {
//           setHasSupportingDocs(false);
//           setError('No supporting documents available for this LC');
//           return;
//         }

//         // Initialize visited tabs object
//         const initialVisitedTabs = {};
//         data.forEach((_, index) => {
//           initialVisitedTabs[index] = false;
//         });
//         setVisitedTabs(initialVisitedTabs);

//         // Transform API data to match our component's structure
//         const initializedPoints = data.map(doc => ({
//           doc_uuid: doc.doc_uuid,
//           text: doc.doc_title || 'Untitled Document',
//           subPoints: doc.discrepancies?.map(d => ({
//             id: d.id,
//             text: d.issue,
//             status: d.status?.toLowerCase() || 'clean',
//             remarks: d.remarks || ""
//           })) || []
//         }));

//         setMainPoints(initializedPoints);

//         // Check if LC is completed in localStorage
//         const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
//         if (savedStatus) {
//           setLcCompleted(savedStatus === 'true');
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setHasSupportingDocs(false);
//         setError('Failed to load LC data: ' + (err.response?.data?.message || err.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [lcNumber]);

//   // Check if all tabs have been visited whenever activeTab changes
//   useEffect(() => {
//     const updatedVisitedTabs = { ...visitedTabs };
//     updatedVisitedTabs[activeTab] = true;
//     setVisitedTabs(updatedVisitedTabs);

//     const allVisited = Object.values(updatedVisitedTabs).every(visited => visited);
//     setAllTabsVisited(allVisited);
//   }, [activeTab]);

//   const handleRemarksChange = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const checkAllSubpointsDiscrepant = () => {
//     return mainPoints.every(mainPoint =>
//       mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
//     );
//   };

//   const isStatusCheckboxEnabled = () => {
//     return !missingDocumentStatus && checkAllSubpointsDiscrepant();
//   };

//   const handleSelection = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       let newStatus = '';
//       switch (value) {
//         case 'NO':
//           newStatus = 'clean';
//           break;
//         case 'YES':
//           newStatus = 'discripant';
//           break;
//         case 'RA':
//           newStatus = 'review';
//           break;
//         default:
//           newStatus = '';
//       }

//       updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const addSubPoint = (mainIndex) => {
//     if (newSubPoint.trim() !== "") {
//       const updatedMainPoints = [...mainPoints];
//       const newId = -Math.floor(Math.random() * 10000);
//       updatedMainPoints[mainIndex].subPoints.push({
//         id: newId,
//         text: newSubPoint,
//         status: 'clean',
//         remarks: ""
//       });
//       setMainPoints(updatedMainPoints);
//       setNewSubPoint("");
//     }
//   };

//   const [pendingDeletions, setPendingDeletions] = useState({});

//   // Modify the deleteSubPoint function
//   const deleteSubPoint = () => {
//     if (selectedSubPoint) {
//       const { mainIndex, subPointId } = selectedSubPoint;

//       // Update the pendingDeletions state
//       setPendingDeletions(prev => {
//         const docUuid = mainPoints[mainIndex].doc_uuid;
//         return {
//           ...prev,
//           [docUuid]: [...(prev[docUuid] || []), subPointId]
//         };
//       });

//       // Update the UI by removing the subpoint
//       const updatedMainPoints = [...mainPoints];
//       updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
//         sp => sp.id !== subPointId
//       );
//       setMainPoints(updatedMainPoints);
//       setSelectedSubPoint(null);
//     }
//   };
//   // Function to prepare data for API
//   // Function to prepare data for API for saving draft
//   const prepareDiscrepanciesData = () => {
//     return mainPoints.map(mainPoint => {
//       // Start with base object structure
//       const result = {
//         doc_uuid: mainPoint.doc_uuid
//       };

//       // Add updates for existing subpoints - only if they have changes
//       const existingSubPoints = mainPoint.subPoints.filter(sp => sp.id > 0);
//       if (existingSubPoints.length > 0) {
//         // For each subpoint, determine if it should be included in updates
//         const updatedPoints = existingSubPoints.map(sp => {
//           const update = {
//             id: sp.id,
//             status: sp.status
//           };

//           // Include remarks if they exist and are valid or empty them if they're invalid
//           if (sp.remarks) {
//             if (sp.remarks.length >= 3) {
//               update.remarks = sp.remarks;
//             } else if (sp.remarks.length > 0 && sp.remarks.length < 3) {
//               // If remarks exist but are too short, we might need to indicate they should be cleared
//               update.remarks = "";
//             }
//           }

//           return update;
//         });

//         // Only add the updates field if there are updates
//         if (updatedPoints.length > 0) {
//           result.updates = updatedPoints;
//         }
//       }

//       // Add new subpoints if any
//       const newSubPoints = mainPoint.subPoints.filter(sp => sp.id < 0)
//         .map(sp => sp.text);
//       if (newSubPoints.length > 0) {
//         result.addition = newSubPoints;
//       }

//       // Add deletions from our tracked state
//       if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
//         result.deletion = pendingDeletions[mainPoint.doc_uuid];
//       }

//       return result;
//     }).filter(item => {
//       // Filter out documents that have no changes (no updates, additions, or deletions)
//       return item.updates || item.addition || item.deletion;
//     });
//   };

//   // Save Draft handler
//   const handleSaveDraft = async () => {
//     try {
//       const discrepanciesData = prepareDiscrepanciesData();

//       // Filter out empty documents (those with no meaningful changes)
//       const filteredData = discrepanciesData.filter(doc =>
//         (doc.updates && doc.updates.length > 0) ||
//         (doc.addition && doc.addition.length > 0) ||
//         (doc.deletion && doc.deletion.length > 0)
//       );

//       if (filteredData.length === 0) {
//         alert("No changes to save!");
//         return;
//       }

//       console.log("Sending data:", JSON.stringify(filteredData, null, 2));
//       await lcService.updateLCDiscrepancies(false, filteredData);
//       alert("Draft saved successfully!");
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to save draft: " + (error.response?.data?.message || error.message));
//     }
//   };

//   // Generate Final Report handler
//   const handleGenerateReport = async () => {
//     if (!allTabsVisited) {
//       alert("Please review all documents before generating the final report.");
//       return;
//     }

//     try {
//       // For the final report, we need to ensure all issues have been reviewed
//       const allIssuesReviewed = mainPoints.every(mainPoint =>
//         mainPoint.subPoints.every(sp =>
//           sp.status === 'clean' || sp.status === 'discripant' || sp.status === 'review'
//         )
//       );

//       if (!allIssuesReviewed) {
//         alert("All issues must be classified as Clean, Discrepant, or Reassign before generating the final report.");
//         return;
//       }

//       // For report generation, include all data regardless of changes
//       const allDiscrepanciesData = mainPoints.map(mainPoint => {
//         const result = {
//           doc_uuid: mainPoint.doc_uuid,
//           updates: mainPoint.subPoints.filter(sp => sp.id > 0).map(sp => {
//             const update = {
//               id: sp.id,
//               status: sp.status
//             };

//             // Include remarks if they exist and are valid
//             if (sp.remarks && sp.remarks.length >= 3) {
//               update.remarks = sp.remarks;
//             }

//             return update;
//           })
//         };

//         // Add new subpoints if any
//         const newSubPoints = mainPoint.subPoints.filter(sp => sp.id < 0)
//           .map(sp => sp.text);
//         if (newSubPoints.length > 0) {
//           result.addition = newSubPoints;
//         }

//         // Add deletions from our tracked state
//         if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
//           result.deletion = pendingDeletions[mainPoint.doc_uuid];
//         }

//         return result;
//       });

//       console.log("Sending data for final report:", JSON.stringify(allDiscrepanciesData, null, 2));
//       await lcService.updateLCDiscrepancies(true, allDiscrepanciesData);

//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');

//       // Set success message and show it
//       setSuccessMessage("Final report generated successfully!");
//       setShowSuccess(true);

//       // Navigate after a short delay to allow the user to see the success message
//       setTimeout(() => {
//         navigate('/completed');
//       }, 2000);
//     } catch (error) {
//       console.error("Error generating report:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to generate report: " + (error.response?.data?.message || error.message));
//     }
//   };


//   const saveToPDF = () => {
//     alert("PDF export functionality would go here. This requires html2canvas and jsPDF libraries.");
//   };

//   const handleBackToDashboard = () => {
//     window.close(); // Close the current tab
//     // Alternatively, navigate back to the completed page
//     // navigate('/completed');
//   };

//   const generateFinalReport = () => {
//     if (allTabsVisited) {
//       alert("Generating final report for LC #" + lcNumber);
//       // Here you would implement the API call to generate the final report
//       // After successful generation:
//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
//     } else {
//       alert("Please review all documents before generating the final report.");
//     }
//   };

//   const remainingCount = mainPoints.reduce((count, mp) =>
//     count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//             <div className="text-lg text-red-600 font-medium">
//               {error}
//             </div>
//           </div>
//           <button
//             onClick={handleBackToDashboard}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Main content
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Full width, colorful */}
//       <header className="bg-indigo-900 shadow-md sticky top-0 z-10">
//         <div className="w-full px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <button
//                 onClick={handleBackToDashboard}
//                 className="mr-3 text-white bg-indigo-900 hover:bg-white/30 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
//                 aria-label="Back to dashboard"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//               <h1 className="text-2xl font-bold text-white">
//                 Letter of Credit <span className="bg-indigo-900 px-2 py-1 ml-2 rounded-md text-white">{lcNumber}</span>
//               </h1>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className={`flex items-center px-3 py-1 rounded-full ${lcCompleted ? 'bg-green-400 text-white' : 'bg-yellow-400 text-white'}`}>
//                 <span className="text-sm font-medium">
//                   {lcCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               </div>
//               {/* <button
//                 onClick={saveToPDF}
//                 className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Export PDF
//               </button> */}
//               <button
//                 onClick={() => navigate('/vesseltracking')}
//                 className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
//               >
//                 <Activity className="h-5 w-5 mr-2" />
//                 Track Vessel
//               </button>

//               <button
//                 onClick={handleGenerateReport}
//                 disabled={!allTabsVisited}
//                 className={`inline-flex items-center px-12 py-3 border border-white text-sm font-medium rounded-md shadow-md text-white ${allTabsVisited
//                   ? 'bg-indigo-900 hover:bg-[#646cffaa]/90'
//                   : 'bg-gray-400 cursor-not-allowed'
//                   } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors`}
//                 title={!allTabsVisited ? "Please review all documents first" : "Generate final report"}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//                 Generate final report
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Full-width layout with sidebar */}
//       <div className="flex w-full">

//         {/* Left Sidebar - Fixed width with colorful elements */}
//         <div className="w-64 fixed h-screen bg-gray-300 border-r border-gray-200 min-h-screen">
//           {/* Status Box */}
//           <div className="p-4 border-b border-gray-200 bg-gradient-to-r bg-indigo-900 bg-indigo-900]">

//             {!isStatusCheckboxEnabled() && (
//               <div className="text-xs text-white/90 bg-indigo-900 p-2 rounded-md">
//                 {missingDocumentStatus
//                   ? "Missing supporting documents"
//                   : `${remainingCount} issues need resolution`}
//               </div>
//             )}
//           </div>

//           {/* Document Navigation */}
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-sm font-bold text-gray-900 mb-3">Navigation</h2>
//             <div className="space-y-1">
//               {/* LC Discrepancies Tab */}
//               <button
//                 className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${currentView === 'discrepancies'
//                   ? 'bg-indigo-900 text-white'
//                   : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
//                   }`}
//                 onClick={() => setCurrentView('discrepancies')}
//               >
//                 <span>LC Discrepancies</span>
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentView === 'discrepancies' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                   {mainPoints.length}
//                 </span>
//               </button>

//               {/* Price Verification Tab */}
//               <button
//                 className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${currentView === 'price-verification'
//                   ? 'bg-indigo-900 text-white'
//                   : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
//                   }`}
//                 onClick={() => setCurrentView('price-verification')}
//               >
//                 <span>Price Verification</span>
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentView === 'price-verification' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                   }`}>
//                   {priceVerificationData.length}
//                 </span>
//               </button>

//               {/* Vessel Tracking Tab */}
//               <button
//                 className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
//                 onClick={() => navigate('/vesseltracking')}
//               >
//                 <Activity className="h-4 w-4 mr-2" />
//                 <span>Vessel Tracking</span>
//               </button>

//               {/* Document Tabs - Only show when in discrepancies view */}
//               {currentView === 'discrepancies' && (
//                 <>
//                   <div className="mt-4 pt-3 border-t border-gray-300">
//                     <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Documents</h3>
//                     {mainPoints.map((point, index) => (
//                       <button
//                         key={point.doc_uuid}
//                         className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${activeTab === index
//                           ? 'bg-indigo-700 text-white'
//                           : visitedTabs[index]
//                             ? 'text-gray-700 bg-green-100 hover:bg-indigo-50 hover:text-indigo-700'
//                             : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
//                           }`}
//                         onClick={() => setActiveTab(index)}
//                       >
//                         <span className="truncate">{point.text}</span>
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
//                           }`}>
//                           {point.subPoints.length}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="p-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Legend</h3>
//             <div className="space-y-3">

//               <div className="flex items-center p-2 bg-green-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-green-500 text-white mr-2 text-[11px] font-bold">
//                   C
//                 </span>
//                 <span className="text-xs text-green-700">No discrepancy</span>
//               </div>

//               <div className="flex items-center p-2 bg-red-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-red-500 text-white mr-2 text-[10px] font-bold">
//                   D
//                 </span>
//                 <span className="text-xs text-red-700">Discrepancy confirmed</span>
//               </div>

//               <div className="flex items-center p-2 bg-yellow-50 rounded-2xl">
//                 <span className="flex items-center justify-center h-6 w-12 rounded-full bg-yellow-500 text-white mr-2 text-[11px] font-bold">
//                   RA
//                 </span>
//                 <span className="text-xs text-yellow-700">Reassignment needed</span>
//               </div>
//             </div>
//           </div>

//           {/* Progress Indicator */}
//           <div className="p-4 mt-4">
//             <h3 className="text-sm font-bold text-gray-900 mb-3">Review Progress</h3>
//             <div className="bg-gray-200 rounded-full h-2.5 mb-1">
//               <div
//                 className="bg-blue-600 h-2.5 rounded-full"
//                 style={{ width: `${(Object.values(visitedTabs).filter(v => v).length / mainPoints.length) * 100}%` }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 text-right">
//               {Object.values(visitedTabs).filter(v => v).length} of {mainPoints.length} reviewed
//             </p>
//           </div>
//         </div>

//         {/* Right Content Area - Expands to fill remaining width */}
//         <div className="flex-1 p-6 ml-64">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-white rounded-lg shadow-lg p-8 border border-red-100">
//               <div className="text-center">
//                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//                 <h1 className="text-2xl font-bold text-gray-900 mb-2">LC #{lcNumber}</h1>
//                 <div className="text-lg text-red-600 font-medium mb-6">
//                   {error}
//                 </div>
//                 <button
//                   onClick={handleBackToDashboard}
//                   className="bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors mx-auto"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Dashboard
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Price Verification View */}
//               {currentView === 'price-verification' && (
//                 <div className="space-y-6">
//                   {/* Price Verification Header */}
//                   <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-green-500">
//                     <div className="p-5 bg-gradient-to-r from-white to-green-50 border border-gray-300 shadow-2xl rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h2 className="text-xl font-bold text-gray-900">Price Verification Analysis</h2>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {priceVerificationData.length} products under review for LC #{lcNumber}
//                           </p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                             <span className="text-xs text-green-800 font-medium">Verified</span>
//                             <p className="text-lg font-bold text-green-600">
//                               {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) <= item.estimatedValue * 0.05).length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                             <span className="text-xs text-yellow-800 font-medium">Under Review</span>
//                             <p className="text-lg font-bold text-yellow-600">
//                               {priceVerificationData.filter(item => Math.abs(item.estimatedValue - item.proposedValue) > item.estimatedValue * 0.05).length}
//                             </p>
//                           </div>
//                           <div className="text-center px-3 py-1 bg-blue-100 rounded-md">
//                             <span className="text-xs text-blue-800 font-medium">Total Value</span>
//                             <p className="text-lg font-bold text-blue-600">
//                               ${priceVerificationData.reduce((sum, item) => sum + item.proposedValue, 0).toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Price Verification Table */}
//                   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                     <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-bold text-gray-800">Product Price Analysis</h3>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-indigo-900">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                               Product Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                               HS Code
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
//                               Estimated Value
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
//                               Proposed Value
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                               Variance
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                               Dual Use Item
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                               Is Sanctioned
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                               Is Money Laundering
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {priceVerificationData.map((item, index) => {
//                             const variance = ((item.proposedValue - item.estimatedValue) / item.estimatedValue * 100);
//                             const isHighVariance = Math.abs(variance) > 5;

//                             return (
//                               <tr key={index} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                   {item.productName}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
//                                   {item.hsCode}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                                   ${item.estimatedValue.toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                                   ${item.proposedValue.toLocaleString()}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHighVariance
//                                     ? variance > 0
//                                       ? 'bg-red-100 text-red-800'
//                                       : 'bg-yellow-100 text-yellow-800'
//                                     : 'bg-green-100 text-green-800'
//                                     }`}>
//                                     {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.dualUseItem === 'Yes'
//                                     ? 'bg-yellow-100 text-yellow-800'
//                                     : 'bg-green-100 text-green-800'
//                                     }`}>
//                                     {item.dualUseItem}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isSanctioned === 'Yes'
//                                     ? 'bg-red-100 text-red-800'
//                                     : 'bg-green-100 text-green-800'
//                                     }`}>
//                                     {item.isSanctioned}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isMoneyLaundering === 'Yes'
//                                     ? 'bg-red-100 text-red-800'
//                                     : 'bg-green-100 text-green-800'
//                                     }`}>
//                                     {item.isMoneyLaundering}
//                                   </span>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* LC Discrepancies View - Original Content */}
//               {currentView === 'discrepancies' && (
//                 <>
//                   {mainPoints.map((mainPoint, mainIndex) => (
//                     <div
//                       key={mainPoint.doc_uuid}
//                       className={`${activeTab === mainIndex ? 'block' : 'hidden'}`}
//                     >
//                       {/* Original LC Discrepancies content remains the same */}
//                       {/* Document Header Card */}
//                       {/* Document Header Card */}
//                       <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#343de7]">
//                         <div className="p-5 bg-gradient-to-r from-white to-[#3d43a8] border border-gray-300 shadow-2xl rounded-lg ">

//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h2 className="text-xl font-bold text-gray-900">{mainPoint.text}</h2>
//                               <p className="text-sm text-gray-600 mt-1">
//                                 {mainPoint.subPoints.length} {mainPoint.subPoints.length === 1 ? 'issue' : 'issues'} identified
//                               </p>
//                             </div>

//                             {/* Status Summary */}
//                             <div className="flex space-x-2">
//                               <div className="text-center px-3 py-1 bg-green-100 rounded-md">
//                                 <span className="text-xs text-green-800 font-medium">Clean (C)</span>
//                                 <p className="text-lg font-bold text-green-600">
//                                   {mainPoint.subPoints.filter(sp => sp.status === 'clean').length}
//                                 </p>
//                               </div>
//                               <div className="text-center px-3 py-1 bg-red-100 rounded-md">
//                                 <span className="text-xs text-red-800 font-medium">Discrepant (D)</span>
//                                 <p className="text-lg font-bold text-red-600">
//                                   {mainPoint.subPoints.filter(sp => sp.status === 'discripant').length}
//                                 </p>
//                               </div>
//                               <div className="text-center px-3 py-1 bg-yellow-100 rounded-md">
//                                 <span className="text-xs text-yellow-800 font-medium">Review (RA)</span>
//                                 <p className="text-lg font-bold text-yellow-600">
//                                   {mainPoint.subPoints.filter(sp => sp.status === 'review').length}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Issues Section */}
//                       <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
//                         <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
//                           <h3 className="text-lg font-bold text-gray-800">Issues & Discrepancies</h3>

//                           {selectedSubPoint && selectedSubPoint.mainIndex === mainIndex && (
//                             <button
//                               onClick={deleteSubPoint}
//                               className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Delete Selected
//                             </button>
//                           )}
//                         </div>

//                         {/* Issues Table */}
//                         <div className="overflow-hidden">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-indigo-900">
//                               <tr>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                   Issue Description
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-2/5">
//                                   Remarks
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                     C
//                                   </span>
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                     D
//                                   </span>
//                                 </th>
//                                 <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                     RA
//                                   </span>
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {mainPoint.subPoints.length > 0 ? (
//                                 mainPoint.subPoints.map((subPoint) => (
//                                   <tr
//                                     key={subPoint.id}
//                                     className={`hover:bg-[#646cffaa]/5 cursor-pointer transition-colors ${selectedSubPoint?.mainIndex === mainIndex &&
//                                       selectedSubPoint?.subPointId === subPoint.id
//                                       ? "bg-[#646cffaa]/10"
//                                       : ""
//                                       }`}
//                                     onClick={() => setSelectedSubPoint({
//                                       mainIndex,
//                                       subPointId: subPoint.id
//                                     })}
//                                   >
//                                     <td className="px-6 py-4 text-md text-gray-900">
//                                       {subPoint.text}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                       <div className="relative">
//                                         <input
//                                           type="text"
//                                           value={subPoint.remarks || ''}
//                                           onChange={(e) => handleRemarksChange(mainIndex, subPoint.id, e.target.value)}
//                                           className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white"
//                                           placeholder="Add remarks..."
//                                           onClick={(e) => e.stopPropagation()}
//                                         />
//                                         {subPoint.remarks && (
//                                           <button
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               handleRemarksChange(mainIndex, subPoint.id, '');
//                                             }}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                                             aria-label="Clear remarks"
//                                           >
//                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                             </svg>
//                                           </button>
//                                         )}
//                                       </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                                       <div className="flex items-center justify-center">
//                                         <input
//                                           type="radio"
//                                           name={`point-${mainIndex}-${subPoint.id}`}
//                                           value="NO"
//                                           checked={subPoint.status === 'clean'}
//                                           onChange={() => handleSelection(mainIndex, subPoint.id, 'NO')}
//                                           className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
//                                         />
//                                       </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                                       <div className="flex items-center justify-center">
//                                         <input
//                                           type="radio"
//                                           name={`point-${mainIndex}-${subPoint.id}`}
//                                           value="YES"
//                                           checked={subPoint.status === 'discripant'}
//                                           onChange={() => handleSelection(mainIndex, subPoint.id, 'YES')}
//                                           className="h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
//                                         />
//                                       </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                                       <div className="flex items-center justify-center">
//                                         <input
//                                           type="radio"
//                                           name={`point-${mainIndex}-${subPoint.id}`}
//                                           value="RA"
//                                           checked={subPoint.status === 'review'}
//                                           onChange={() => handleSelection(mainIndex, subPoint.id, 'RA')}
//                                           className="h-5 w-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
//                                         />
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan="5" className="px-6 py-10 text-center">
//                                     <div className="flex flex-col items-center">
//                                       <div className="h-16 w-16 text-gray-400 mb-4">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                         </svg>
//                                       </div>
//                                       <p className="text-gray-500 text-lg">No issues found for this document</p>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>

//                         {/* Add New Issue */}
//                         <div className="p-5 border-t border-gray-200 bg-gray-50">
//                           <div className="flex rounded-md shadow-sm">
//                             <input
//                               type="text"
//                               value={newSubPoint}
//                               onChange={(e) => setNewSubPoint(e.target.value)}
//                               placeholder="Add a new issue..."
//                               className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-[#646cffaa] focus:border-[#646cffaa] sm:text-sm"
//                             />
//                             <button
//                               onClick={() => addSubPoint(mainIndex)}
//                               className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-900 hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                               </svg>
//                               Add Issue
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex justify-end space-x-4 mt-8">
//                         <button
//                           onClick={handleSaveDraft}
//                           className="inline-flex items-center px-5 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors shadow-sm"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           Save Draft
//                         </button>

//                       </div>
//                     </div>
//                   ))}

//                   {/* Empty State */}
//                   {mainPoints.length === 0 && (
//                     <div className="bg-white rounded-lg shadow-lg p-12">
//                       <div className="flex flex-col items-center justify-center text-center">
//                         <div className="h-24 w-24 text-[#646cff] mb-6 bg-[#646cffaa]/10 rounded-full flex items-center justify-center">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
//                         <p className="text-lg text-gray-500 max-w-md mx-auto mb-6">
//                           There are no documents or discrepancies recorded for this Letter of Credit.
//                         </p>
//                         <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-[#646cffaa] hover:bg-[#646cffaa]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#646cffaa] transition-colors">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                           Add First Document
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </>
//           )}

//         </div>
//       </div>
//       {showSuccess && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all animate-fade-in-up">
//             <div className="flex items-center justify-center mb-4">
//               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             </div>
//             <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Success!</h3>
//             <p className="text-center text-gray-600 mb-4">{successMessage}</p>
//             <p className="text-center text-sm text-gray-500">Redirecting to completed page...</p>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// };

// export default LCDetails;









// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { lcService } from "../authentication/apiAdmin";

// // Import components
// import Header from "./LCDeatailHeader";
// import Sidebar from "./LCDetailSidebar";
// import PriceVerificationView from "./PriceVerificationView";
// import LCDiscrepanciesView from "./LCDiscrepanciesView";
// import SuccessModal from "./SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
// import ErrorState from "./ErrorState";

// const LCDetails = () => {
//   const navigate = useNavigate();
//   const { lcNumber } = useParams();

//   // State management
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
//   const [newSubPoint, setNewSubPoint] = useState("");
//   const [selectedSubPoint, setSelectedSubPoint] = useState(null);
//   const [mainPoints, setMainPoints] = useState([]);
//   const [lcCompleted, setLcCompleted] = useState(false);
//   const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [allTabsVisited, setAllTabsVisited] = useState(false);
//   const [visitedTabs, setVisitedTabs] = useState({});
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [currentView, setCurrentView] = useState('discrepancies');
//   const [pendingDeletions, setPendingDeletions] = useState({});

//   const [priceVerificationData, setPriceVerificationData] = useState([
//     {
//       productName: "Premium Steel Coils",
//       hsCode: "7208.10.00",
//       estimatedValue: 45000,
//       proposedValue: 47500,
//       dualUseItem: "No",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     },
//     {
//       productName: "Industrial Machinery Parts",
//       hsCode: "8431.39.90",
//       estimatedValue: 23000,
//       proposedValue: 22800,
//       dualUseItem: "Yes",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     },
//     {
//       productName: "Electronic Components",
//       hsCode: "8542.31.00",
//       estimatedValue: 18500,
//       proposedValue: 19200,
//       dualUseItem: "Yes",
//       isSanctioned: "No",
//       isMoneyLaundering: "No"
//     }
//   ]);

//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await lcService.getLCSupportDocsDiscrepancies(lcNumber);

//         if (!data || data.length === 0) {
//           setHasSupportingDocs(false);
//           setError('No supporting documents available for this LC');
//           return;
//         }

//         const initialVisitedTabs = {};
//         data.forEach((_, index) => {
//           initialVisitedTabs[index] = false;
//         });
//         setVisitedTabs(initialVisitedTabs);

//         const initializedPoints = data.map(doc => ({
//           doc_uuid: doc.doc_uuid,
//           text: doc.doc_title || 'Untitled Document',
//           subPoints: doc.discrepancies?.map(d => ({
//             id: d.id,
//             text: d.issue,
//             status: d.status?.toLowerCase() || 'clean',
//             remarks: d.remarks || ""
//           })) || []
//         }));

//         setMainPoints(initializedPoints);

//         const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
//         if (savedStatus) {
//           setLcCompleted(savedStatus === 'true');
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setHasSupportingDocs(false);
//         setError('Failed to load LC data: ' + (err.response?.data?.message || err.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [lcNumber]);

//   // Track visited tabs
//   useEffect(() => {
//     const updatedVisitedTabs = { ...visitedTabs };
//     updatedVisitedTabs[activeTab] = true;
//     setVisitedTabs(updatedVisitedTabs);

//     const allVisited = Object.values(updatedVisitedTabs).every(visited => visited);
//     setAllTabsVisited(allVisited);
//   }, [activeTab]);

//   // Helper functions
//   const handleRemarksChange = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const checkAllSubpointsDiscrepant = () => {
//     return mainPoints.every(mainPoint =>
//       mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
//     );
//   };

//   const isStatusCheckboxEnabled = () => {
//     return !missingDocumentStatus && checkAllSubpointsDiscrepant();
//   };

//   const handleSelection = (mainIndex, subPointId, value) => {
//     const updatedMainPoints = [...mainPoints];
//     const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
//       sp => sp.id === subPointId
//     );

//     if (subPointIndex !== -1) {
//       let newStatus = '';
//       switch (value) {
//         case 'NO':
//           newStatus = 'clean';
//           break;
//         case 'YES':
//           newStatus = 'discripant';
//           break;
//         case 'RA':
//           newStatus = 'review';
//           break;
//         default:
//           newStatus = '';
//       }

//       updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
//       setMainPoints(updatedMainPoints);
//     }
//   };

//   const addSubPoint = (mainIndex) => {
//     if (newSubPoint.trim() !== "") {
//       const updatedMainPoints = [...mainPoints];
//       const newId = -Math.floor(Math.random() * 10000);
//       updatedMainPoints[mainIndex].subPoints.push({
//         id: newId,
//         text: newSubPoint,
//         status: 'clean',
//         remarks: ""
//       });
//       setMainPoints(updatedMainPoints);
//       setNewSubPoint("");
//     }
//   };

//   const deleteSubPoint = () => {
//     if (selectedSubPoint) {
//       const { mainIndex, subPointId } = selectedSubPoint;

//       setPendingDeletions(prev => {
//         const docUuid = mainPoints[mainIndex].doc_uuid;
//         return {
//           ...prev,
//           [docUuid]: [...(prev[docUuid] || []), subPointId]
//         };
//       });

//       const updatedMainPoints = [...mainPoints];
//       updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
//         sp => sp.id !== subPointId
//       );
//       setMainPoints(updatedMainPoints);
//       setSelectedSubPoint(null);
//     }
//   };

//   const prepareDiscrepanciesData = () => {
//     return mainPoints.map(mainPoint => {
//       const result = {
//         doc_uuid: mainPoint.doc_uuid
//       };

//       const existingSubPoints = mainPoint.subPoints.filter(sp => sp.id > 0);
//       if (existingSubPoints.length > 0) {
//         const updatedPoints = existingSubPoints.map(sp => {
//           const update = {
//             id: sp.id,
//             status: sp.status
//           };

//           if (sp.remarks) {
//             if (sp.remarks.length >= 3) {
//               update.remarks = sp.remarks;
//             } else if (sp.remarks.length > 0 && sp.remarks.length < 3) {
//               update.remarks = "";
//             }
//           }

//           return update;
//         });

//         if (updatedPoints.length > 0) {
//           result.updates = updatedPoints;
//         }
//       }

//       const newSubPoints = mainPoint.subPoints.filter(sp => sp.id < 0)
//         .map(sp => sp.text);
//       if (newSubPoints.length > 0) {
//         result.addition = newSubPoints;
//       }

//       if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
//         result.deletion = pendingDeletions[mainPoint.doc_uuid];
//       }

//       return result;
//     }).filter(item => {
//       return item.updates || item.addition || item.deletion;
//     });
//   };

//   const handleSaveDraft = async () => {
//     try {
//       const discrepanciesData = prepareDiscrepanciesData();
//       const filteredData = discrepanciesData.filter(doc =>
//         (doc.updates && doc.updates.length > 0) ||
//         (doc.addition && doc.addition.length > 0) ||
//         (doc.deletion && doc.deletion.length > 0)
//       );

//       if (filteredData.length === 0) {
//         alert("No changes to save!");
//         return;
//       }

//       console.log("Sending data:", JSON.stringify(filteredData, null, 2));
//       await lcService.updateLCDiscrepancies(false, filteredData);
//       alert("Draft saved successfully!");
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to save draft: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!allTabsVisited) {
//       alert("Please review all documents before generating the final report.");
//       return;
//     }

//     try {
//       const allIssuesReviewed = mainPoints.every(mainPoint =>
//         mainPoint.subPoints.every(sp =>
//           sp.status === 'clean' || sp.status === 'discripant' || sp.status === 'review'
//         )
//       );

//       if (!allIssuesReviewed) {
//         alert("All issues must be classified as Clean, Discrepant, or Reassign before generating the final report.");
//         return;
//       }

//       const allDiscrepanciesData = mainPoints.map(mainPoint => {
//         const result = {
//           doc_uuid: mainPoint.doc_uuid,
//           updates: mainPoint.subPoints.filter(sp => sp.id > 0).map(sp => {
//             const update = {
//               id: sp.id,
//               status: sp.status
//             };

//             if (sp.remarks && sp.remarks.length >= 3) {
//               update.remarks = sp.remarks;
//             }

//             return update;
//           })
//         };

//         const newSubPoints = mainPoint.subPoints.filter(sp => sp.id < 0)
//           .map(sp => sp.text);
//         if (newSubPoints.length > 0) {
//           result.addition = newSubPoints;
//         }

//         if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
//           result.deletion = pendingDeletions[mainPoint.doc_uuid];
//         }

//         return result;
//       });

//       console.log("Sending data for final report:", JSON.stringify(allDiscrepanciesData, null, 2));
//       await lcService.updateLCDiscrepancies(true, allDiscrepanciesData);

//       setLcCompleted(true);
//       localStorage.setItem(`lc-${lcNumber}-completed`, 'true');

//       setSuccessMessage("Final report generated successfully!");
//       setShowSuccess(true);

//       setTimeout(() => {
//         navigate('/completed');
//       }, 2000);
//     } catch (error) {
//       console.error("Error generating report:", error);
//       console.error("Request data was:", JSON.stringify(prepareDiscrepanciesData(), null, 2));
//       alert("Failed to generate report: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleBackToDashboard = () => {
//     window.close();
//   };

//   const remainingCount = mainPoints.reduce((count, mp) =>
//     count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

//   // Render loading state
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Render error state
//   if (error) {
//     return (
//       <ErrorState 
//         lcNumber={lcNumber}
//         error={error}
//         onBackToDashboard={handleBackToDashboard}
//       />
//     );
//   }

//   // Main render
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         lcNumber={lcNumber}
//         lcCompleted={lcCompleted}
//         allTabsVisited={allTabsVisited}
//         navigate={navigate}
//         onBackToDashboard={handleBackToDashboard}
//         onGenerateReport={handleGenerateReport}
//       />

//       <div className="flex w-full">
//         <Sidebar
//           mainPoints={mainPoints}
//           currentView={currentView}
//           activeTab={activeTab}
//           visitedTabs={visitedTabs}
//           priceVerificationData={priceVerificationData}
//           isStatusCheckboxEnabled={isStatusCheckboxEnabled}
//           missingDocumentStatus={missingDocumentStatus}
//           remainingCount={remainingCount}
//           onViewChange={setCurrentView}
//           onTabChange={setActiveTab}
//           navigate={navigate}
//         />

//         <div className="flex-1 p-6 ml-64">
//           {currentView === 'price-verification' ? (
//             <PriceVerificationView
//               lcNumber={lcNumber}
//               priceVerificationData={priceVerificationData}
//             />
//           ) : (
//             <LCDiscrepanciesView
//               mainPoints={mainPoints}
//               activeTab={activeTab}
//               newSubPoint={newSubPoint}
//               selectedSubPoint={selectedSubPoint}
//               onRemarksChange={handleRemarksChange}
//               onSelection={handleSelection}
//               onAddSubPoint={addSubPoint}
//               onDeleteSubPoint={deleteSubPoint}
//               onNewSubPointChange={setNewSubPoint}
//               onSubPointSelect={setSelectedSubPoint}
//               onSaveDraft={handleSaveDraft}
//             />
//           )}
//         </div>
//       </div>

//       {showSuccess && (
//         <SuccessModal
//           message={successMessage}
//           onClose={() => setShowSuccess(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default LCDetails;





import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lcService } from "../authentication/apiAdmin";

// Import components
import Header from "./LCDeatailHeader";
import Sidebar from "./LCDetailSidebar";
import PriceVerificationView from "./PriceVerificationView";
import LCDiscrepanciesView from "./LCDiscrepanciesView";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import SignatureVerificationView from "./SignatureVerificationView";  
import { useAuth } from "../../context/AuthContext";

const LCDetails = () => {
  const navigate = useNavigate();
  const { lcNumber } = useParams();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSupportingDocs, setHasSupportingDocs] = useState(true);
  const [newSubPoint, setNewSubPoint] = useState("");
  const [selectedSubPoint, setSelectedSubPoint] = useState(null);
  const [mainPoints, setMainPoints] = useState([]);
  const [lcCompleted, setLcCompleted] = useState(false);
  const [missingDocumentStatus, setMissingDocumentStatus] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [allTabsVisited, setAllTabsVisited] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentView, setCurrentView] = useState('discrepancies');
  const [pendingDeletions, setPendingDeletions] = useState({});
  const [signatureData, setSignatureData] = useState([]);
  const [showSignatureVerification, setShowSignatureVerification] = useState(false);
const [currentDocumentSignatures, setCurrentDocumentSignatures] = useState([]);
const [originalMainPoints, setOriginalMainPoints] = useState([]);
const { userRole: contextUserRole, isAuthenticated, checkAuthStatus } = useAuth();
// const [userRole, setUserRole] = useState('');


  const [priceVerificationData, setPriceVerificationData] = useState([
    {
      productName: "Premium Steel Coils",
      hsCode: "7208.10.00",
      estimatedValue: 45000,
      proposedValue: 47500,
      dualUseItem: "No",
      isSanctioned: "No",
      isMoneyLaundering: "No"
    },
    {
      productName: "Industrial Machinery Parts",
      hsCode: "8431.39.90",
      estimatedValue: 23000,
      proposedValue: 22800,
      dualUseItem: "Yes",
      isSanctioned: "No",
      isMoneyLaundering: "No"
    },
    {
      productName: "Electronic Components",
      hsCode: "8542.31.00",
      estimatedValue: 18500,
      proposedValue: 19200,
      dualUseItem: "Yes",
      isSanctioned: "No",
      isMoneyLaundering: "No"
    }
  ]);

  // const [priceVerificationData, setPriceVerificationData] = useState([]);


  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const data = await lcService.getLCSupportDocsDiscrepancies(lcNumber);
  
        if (!data || data.length === 0) {
          setHasSupportingDocs(false);
          setError('No supporting documents available for this LC');
          return;
        }
  
        const initialVisitedTabs = {};
        data.forEach((_, index) => {
          initialVisitedTabs[index] = false;
        });
        setVisitedTabs(initialVisitedTabs);
  
        const initializedPoints = data.map(doc => ({
          doc_uuid: doc.doc_uuid,
          text: doc.doc_title || 'Untitled Document',
          signatures: doc.discrepancies?.Sign?.map(sig => ({
            id: sig.id,
            signatory: sig.point,
            designation: sig.value,
            document: doc.doc_title,
            status: sig.status?.toLowerCase() === 'discripant' ? 'invalid' : 'valid',
            remarks: sig.remarks
          })) || [],
          subPoints: doc.discrepancies?.Condition?.map(d => ({
            id: d.id,
            text: d.point,
            status: d.status?.toLowerCase() === 'discripant' ? 'discripant' : 'clean',
            remarks: d.remarks || ""
          })) || []
        }));
  
        setMainPoints(initializedPoints);
        // Store original data for comparison
        setOriginalMainPoints(JSON.parse(JSON.stringify(initializedPoints)));
  
        const savedStatus = localStorage.getItem(`lc-${lcNumber}-completed`);
        if (savedStatus) {
          setLcCompleted(savedStatus === 'true');
        }
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setHasSupportingDocs(false);
        setError('Failed to load LC data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [lcNumber]);


  // Track visited tabs
  useEffect(() => {
    const updatedVisitedTabs = { ...visitedTabs };
    updatedVisitedTabs[activeTab] = true;
    setVisitedTabs(updatedVisitedTabs);

    const allVisited = Object.values(updatedVisitedTabs).every(visited => visited);
    setAllTabsVisited(allVisited);
  }, [activeTab]);

  useEffect(() => {
    const initializeUserRole = async () => {
      console.log('=== INITIALIZING USER ROLE ===');
      console.log('Context user role:', contextUserRole);
      console.log('Is authenticated:', isAuthenticated);
      
      // If we don't have a role from context, try to refresh auth status
      if (!contextUserRole && isAuthenticated) {
        console.log('No role in context, checking auth status...');
        await checkAuthStatus();
      }
      
      // Use context role or fallback
      const finalRole = contextUserRole || localStorage.getItem('userRole') || 'admin';
      console.log('Final role being used:', finalRole);
    };

    initializeUserRole();
  }, [contextUserRole, isAuthenticated, checkAuthStatus]);


  // Helper functions
  const handleRemarksChange = (mainIndex, subPointId, value) => {
    const updatedMainPoints = [...mainPoints];
    const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
      sp => sp.id === subPointId
    );

    if (subPointIndex !== -1) {
      updatedMainPoints[mainIndex].subPoints[subPointIndex].remarks = value;
      setMainPoints(updatedMainPoints);
    }
  };

  const checkAllSubpointsDiscrepant = () => {
    return mainPoints.every(mainPoint =>
      mainPoint.subPoints.every(subPoint => subPoint.status === 'discripant')
    );
  };

  const isStatusCheckboxEnabled = () => {
    return !missingDocumentStatus && checkAllSubpointsDiscrepant();
  };

  const handleSelection = (mainIndex, subPointId, value) => {
    const updatedMainPoints = [...mainPoints];
    const subPointIndex = updatedMainPoints[mainIndex].subPoints.findIndex(
      sp => sp.id === subPointId
    );

    if (subPointIndex !== -1) {
      let newStatus = '';
      switch (value) {
        case 'NO':
          newStatus = 'clean';
          break;
        case 'YES':
          newStatus = 'discripant';
          break;
        case 'RA':
          newStatus = 'review';
          break;
        default:
          newStatus = '';
      }

      updatedMainPoints[mainIndex].subPoints[subPointIndex].status = newStatus;
      setMainPoints(updatedMainPoints);
    }
  };

  const addSubPoint = (mainIndex) => {
    if (newSubPoint.trim() !== "") {
      const updatedMainPoints = [...mainPoints];
      const newId = -Math.floor(Math.random() * 10000);
      updatedMainPoints[mainIndex].subPoints.push({
        id: newId,
        text: newSubPoint,
        status: 'discripant', // CHANGED: from 'clean' to 'discripant'
        remarks: ""
      });
      setMainPoints(updatedMainPoints);
      setNewSubPoint("");
    }
  };

  const deleteSubPoint = () => {
    if (selectedSubPoint) {
      const { mainIndex, subPointId } = selectedSubPoint;

      setPendingDeletions(prev => {
        const docUuid = mainPoints[mainIndex].doc_uuid;
        return {
          ...prev,
          [docUuid]: [...(prev[docUuid] || []), subPointId]
        };
      });

      const updatedMainPoints = [...mainPoints];
      updatedMainPoints[mainIndex].subPoints = updatedMainPoints[mainIndex].subPoints.filter(
        sp => sp.id !== subPointId
      );
      setMainPoints(updatedMainPoints);
      setSelectedSubPoint(null);
    }
  };

  const prepareDiscrepanciesData = () => {
    return mainPoints.map(mainPoint => {
      const originalMainPoint = originalMainPoints.find(orig => orig.doc_uuid === mainPoint.doc_uuid);
      const result = {
        doc_uuid: mainPoint.doc_uuid
      };
  
      // Handle existing subpoints that have been modified
      const existingSubPoints = mainPoint.subPoints.filter(sp => sp.id > 0);
      if (existingSubPoints.length > 0 && originalMainPoint) {
        const updatedPoints = [];
        
        existingSubPoints.forEach(sp => {
          const originalSubPoint = originalMainPoint.subPoints.find(orig => orig.id === sp.id);
          
          if (originalSubPoint) {
            const hasStatusChanged = sp.status !== originalSubPoint.status;
            const hasRemarksChanged = (sp.remarks || '') !== (originalSubPoint.remarks || '');
            
            // Only include if there are actual changes
            if (hasStatusChanged || hasRemarksChanged) {
              const update = {
                id: sp.id,
                status: sp.status
              };
  
              // Only include remarks if they have changed and meet length requirement
              if (hasRemarksChanged) {
                if (sp.remarks && sp.remarks.length >= 3) {
                  update.remarks = sp.remarks;
                } else if (sp.remarks !== undefined && sp.remarks.length < 3) {
                  update.remarks = "";
                }
              }
  
              updatedPoints.push(update);
            }
          }
        });
  
        if (updatedPoints.length > 0) {
          result.updates = updatedPoints;
        }
      }
  
      // Handle new subpoints (negative IDs)
      const newSubPoints = mainPoint.subPoints
        .filter(sp => sp.id < 0)
        .map(sp => sp.text)
        .filter(text => text && text.trim() !== ''); // Only include non-empty texts
      
      if (newSubPoints.length > 0) {
        result.addition = newSubPoints;
      }
  
      // Handle deletions
      if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
        result.deletion = pendingDeletions[mainPoint.doc_uuid];
      }
  
      return result;
    }).filter(item => {
      // Only include documents that have actual changes
      const hasUpdates = item.updates && item.updates.length > 0;
      const hasAdditions = item.addition && item.addition.length > 0;
      const hasDeletions = item.deletion && item.deletion.length > 0;
      
      return hasUpdates || hasAdditions || hasDeletions;
    });
  };

  const handleSaveDraft = async () => {
    try {
      const discrepanciesData = prepareDiscrepanciesData();
      
      if (discrepanciesData.length === 0) {
        alert("No changes to save!");
        return;
      }
  
      console.log("Sending only changed data:", JSON.stringify(discrepanciesData, null, 2));
      await lcService.updateLCDiscrepancies(false, discrepanciesData);
      
      // Update original data after successful save
      setOriginalMainPoints(JSON.parse(JSON.stringify(mainPoints)));
      // Clear pending deletions after successful save
      setPendingDeletions({});
      
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      console.error("Request data was:", JSON.stringify(discrepanciesData, null, 2));
      alert("Failed to save draft: " + (error.response?.data?.message || error.message));
    }
  };
  
  // Updated handleGenerateReport function
  const handleGenerateReport = async () => {
    if (!allTabsVisited) {
      alert("Please review all documents before generating the final report.");
      return;
    }
  
    try {
      const allIssuesReviewed = mainPoints.every(mainPoint =>
        mainPoint.subPoints.every(sp =>
          sp.status === 'clean' || sp.status === 'discripant' || sp.status === 'review'
        )
      );
  
      if (!allIssuesReviewed) {
        alert("All issues must be classified as Clean, Discrepant, or Reassign before generating the final report.");
        return;
      }
  
      // For final report, we need to send all current state, not just changes
      const allDiscrepanciesData = mainPoints.map(mainPoint => {
        const result = {
          doc_uuid: mainPoint.doc_uuid,
          updates: mainPoint.subPoints.filter(sp => sp.id > 0).map(sp => {
            const update = {
              id: sp.id,
              status: sp.status
            };
  
            if (sp.remarks && sp.remarks.length >= 3) {
              update.remarks = sp.remarks;
            }
  
            return update;
          })
        };
  
        const newSubPoints = mainPoint.subPoints
          .filter(sp => sp.id < 0)
          .map(sp => sp.text)
          .filter(text => text && text.trim() !== '');
        
        if (newSubPoints.length > 0) {
          result.addition = newSubPoints;
        }
  
        if (pendingDeletions[mainPoint.doc_uuid] && pendingDeletions[mainPoint.doc_uuid].length > 0) {
          result.deletion = pendingDeletions[mainPoint.doc_uuid];
        }
  
        return result;
      });
  
      console.log("Sending data for final report:", JSON.stringify(allDiscrepanciesData, null, 2));
      await lcService.updateLCDiscrepancies(true, allDiscrepanciesData);
  
      setLcCompleted(true);
      localStorage.setItem(`lc-${lcNumber}-completed`, 'true');
  
      setSuccessMessage("Final report generated successfully!");
      setShowSuccess(true);
  
      setTimeout(() => {
        if (currentUserRole === 'admin') {
          console.log('Navigating admin to /completed');
          navigate('/completed');
        } else if (currentUserRole === 'complyce_manager') {
          console.log('Navigating compliance manager to /complete');
          navigate('/complete');
        } else {
          // Fallback navigation for unknown roles
          console.log('Unknown role, defaulting to /complete');
          navigate('/complete');
        }
      }, 2000);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report: " + (error.response?.data?.message || error.message));
    }
  };

  const handleBackToDashboard = () => {
    window.close();
  };

  const handleSignatureValidityUpdate = (mainIndex, signatureId, isValid) => {
    const updatedMainPoints = [...mainPoints];
    const signatureIndex = updatedMainPoints[mainIndex].signatures.findIndex(
      sig => sig.id === signatureId
    );
  
    if (signatureIndex !== -1) {
      updatedMainPoints[mainIndex].signatures[signatureIndex].status = isValid ? 'valid' : 'invalid';
      setMainPoints(updatedMainPoints);
    }
  };

  const remainingCount = mainPoints.reduce((count, mp) =>
    count + mp.subPoints.filter(sp => sp.status !== 'clean').length, 0);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        lcNumber={lcNumber}
        error={error}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Main render
  return (
  <div className="min-h-screen bg-gray-50">
    <Header
      lcNumber={lcNumber}
      lcCompleted={lcCompleted}
      allTabsVisited={allTabsVisited}
      navigate={navigate}
      onBackToDashboard={handleBackToDashboard}
      onGenerateReport={handleGenerateReport}
      userRole={contextUserRole || 'complyce_manager'} // Use context role with fallback
    />

    <div className="flex w-full">
      <Sidebar
        mainPoints={mainPoints}
        currentView={currentView}
        activeTab={activeTab}
        visitedTabs={visitedTabs}
        priceVerificationData={priceVerificationData}
        signatureData={signatureData}
        isStatusCheckboxEnabled={isStatusCheckboxEnabled}
        missingDocumentStatus={missingDocumentStatus}
        remainingCount={remainingCount}
        onViewChange={setCurrentView}
        onTabChange={setActiveTab}
        navigate={navigate}
      />

      <div className={`flex-1 p-6 ml-64 ${showSignatureVerification ? 'pr-80' : ''} transition-all duration-300`}>
        {currentView === 'price-verification' ? (
          <PriceVerificationView
            lcNumber={lcNumber}
            priceVerificationData={priceVerificationData}
          />
        ) : currentView === 'signature-verification' ? (
          <SignatureVerificationView
            lcNumber={lcNumber}
            signatureData={signatureData}
          />
        ) : (
          
<LCDiscrepanciesView
  mainPoints={mainPoints}
  activeTab={activeTab}
  newSubPoint={newSubPoint}
  selectedSubPoint={selectedSubPoint}
  showSignatureVerification={showSignatureVerification}
  onRemarksChange={handleRemarksChange}
  onSelection={handleSelection}
  onAddSubPoint={addSubPoint}
  onDeleteSubPoint={deleteSubPoint}
  onNewSubPointChange={setNewSubPoint}
  onSubPointSelect={setSelectedSubPoint}
  onSaveDraft={handleSaveDraft}
  onSignatureValidityUpdate={handleSignatureValidityUpdate} // Add this line
/>
        )}
      </div>

     
    </div>

    {showSuccess && (
      <SuccessModal
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    )}
  </div>
);
};

export default LCDetails;