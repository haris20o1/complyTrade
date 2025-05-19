// // File: src/pages/admin/LCTimelinePage.jsx
// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import Button from '../../components/buttons/Button';
// import DataTable from '../../components/tables/DataTable';
// import UserDropdown from '../../components/forms/UserDropdown';
// import { 
//   CalendarIcon, 
//   DocumentIcon, 
//   DocumentMagnifyingGlassIcon, 
//   ClockIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   UserCircleIcon,
//   DocumentTextIcon
// } from '@heroicons/react/24/outline';

// const LCTimelinePage = () => {
//   // Sample data with multiple LC records
//   const [lcRecords, setLcRecords] = useState([
    
//     {
//       id: 2,
//       lcNumber: 'LC002',
//       initialDate: '3/20/2025',
//       endDate: '10/20/2025',
//       assignedUser: 'Ahmad Romman',
//       assignDate: '3/25/2025',
//       documentStatus: 'Completed',
//       userCompleteStatus: 'Completed',
//       adminCompleteStatus: 'Not Started',
//       mt799Documents: [
//         { id: 7, name: 'Document 1', date: '3/20/2025' },
//         { id: 8, name: 'Document 2', date: '3/21/2025' },
//         { id: 9, name: 'Document 3', date: '3/22/2025' }
//       ],
//       supportDocuments: [
//         { id: 3, name: 'Invoice Document', uuid: '14ae2c67-9e2d-4f32', date: '3/25/2025' },
//         { id: 4, name: 'Shipping Document', uuid: 'b8291da1-c502-4a37', date: '3/26/2025' }
//       ],
//       usersTimeline: [
//         { userId: 2, assignedAt: '3/25/2025, 09:30:22 AM', status: 'assign' },
//         { userId: 2, assignedAt: '4/01/2025, 14:45:10 PM', status: 'review' }
//       ]
//     },
//     {
//       id: 1,
//       lcNumber: 'LC001',
//       initialDate: '3/15/2025',
//       endDate: '9/15/2025',
//       assignedUser: null,
//       assignDate: null,
//       documentStatus: 'In Progress',
//       userCompleteStatus: 'Not Completed',
//       adminCompleteStatus: 'Not Completed',
//       mt799Documents: [
//         { id: 5, name: 'Document 1', date: '3/15/2025' },
//         { id: 6, name: 'Document 2', date: '3/15/2025' }
//       ],
//       supportDocuments: [
//         { id: 1, name: 'Invoice Document', uuid: '078e3d84-7e9a-4b21', date: '3/20/2025' },
//         { id: 2, name: 'Shipping Document', uuid: '3f329d88-088a-4b21', date: '3/21/2025' }
//       ],
//       usersTimeline: [
//         { userId: 3, assignedAt: '4/9/2025, 10:14:39 AM', status: 'assign' }
//       ]
//     },
//     {
//       id: 3,
//       lcNumber: 'LC003',
//       initialDate: '4/05/2025',
//       endDate: '11/05/2025',
//       assignedUser: 'Zoraiz',
//       assignDate: '4/10/2025',
//       documentStatus: 'On Hold',
//       userCompleteStatus: 'Not Completed',
//       adminCompleteStatus: 'Not Started',
//       mt799Documents: [
//         { id: 10, name: 'Document 1', date: '4/05/2025' }
//       ],
//       supportDocuments: [
//         { id: 5, name: 'Invoice Document', uuid: '5f6e9ca3-1b42-48f9', date: '4/07/2025' }
//       ],
//       usersTimeline: [
//         { userId: 3, assignedAt: '4/10/2025, 11:22:05 AM', status: 'assign' }
//       ]
//     }
//   ]);

//   // Sample users for dropdown
//   const users = [
//     { id: 1, name: 'Haris Ahmad', role: 'user' },
//     { id: 2, name: 'Ahmad Romman', role: 'user' },
//     { id: 3, name: 'Zoraiz', role: 'user' },
//     { id: 4, name: 'Wasie', role: 'user' }
//   ];

//   // State to track which LCs are expanded in the view
//   const [expandedLCs, setExpandedLCs] = useState({});
  
//   // State to track selected LC for detailed view
//   const [selectedLC, setSelectedLC] = useState(null);
  
//   // State to track selected users for assignment
//   const [selectedUsers, setSelectedUsers] = useState({});

//   // Toggle expanded state for an LC
//   const toggleExpand = (lcId) => {
//     setExpandedLCs(prev => ({
//       ...prev,
//       [lcId]: !prev[lcId]
//     }));
//   };

//   // Handle viewing LC details
//   const handleViewDetails = (lc) => {
//     setSelectedLC(lc.id === selectedLC ? null : lc.id);
//   };

//   // Handle user selection for assignment
//   const handleUserSelect = (lcId, user) => {
//     setSelectedUsers({
//       ...selectedUsers,
//       [lcId]: user
//     });
//   };

//   // Handle assigning a user to an LC
//   const handleAssignUser = (lcId) => {
//     setLcRecords(lcRecords.map(lc => {
//       if (lc.id === lcId && selectedUsers[lcId]) {
//         return {
//           ...lc,
//           assignedUser: selectedUsers[lcId].name,
//           assignDate: new Date().toLocaleDateString()
//         };
//       }
//       return lc;
//     }));
    
//     console.log(`Assigned LC ${lcId} to user ${selectedUsers[lcId]?.name}`);
//   };

//   // Handle downloading a document
//   const handleDownloadDocument = (docType, doc) => {
//     console.log(`Downloading ${docType} document:`, doc);
//   };

//   // Get status color based on status text
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Completed':
//         return 'text-green-600';
//       case 'In Progress':
//         return 'text-blue-600';
//       case 'On Hold':
//         return 'text-amber-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   // Table columns configuration for LC list view
//   const columns = [
//     {
//       key: 'expand',
//       header: '',
//       width: '40px',
//       render: (row) => (
//         <button 
//           onClick={() => toggleExpand(row.id)}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           {expandedLCs[row.id] ? 
//             <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
//             <ChevronRightIcon className="h-5 w-5 text-gray-500" />
//           }
//         </button>
//       )
//     },
//     {
//       key: 'lcNumber',
//       header: 'LC Number',
//       render: (row) => (
//         <div className="font-medium text-blue-700">{row.lcNumber}</div>
//       )
//     },
//     {
//       key: 'dates',
//       header: 'Dates',
//       render: (row) => (
//         <div className="text-sm">
//           <div className="flex items-center space-x-1">
//             <CalendarIcon className="h-4 w-4 text-gray-400" />
//             <span>Initial: {row.initialDate}</span>
//           </div>
//           <div className="flex items-center space-x-1 mt-1">
//             <ClockIcon className="h-4 w-4 text-gray-400" />
//             <span>End: {row.endDate}</span>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'documents',
//       header: 'Documents',
//       render: (row) => (
//         <div className="flex space-x-3">
//           <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//             MT799: {row.mt799Documents.length}
//           </div>
//           <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
//             Support: {row.supportDocuments.length}
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'assignment',
//       header: 'Assignment',
//       render: (row) => (
//         <div className="text-sm">
//           {row.assignedUser ? (
//             <div>
//               <div className="font-medium">{row.assignedUser}</div>
//               <div className="text-xs text-gray-500">Since: {row.assignDate}</div>
//             </div>
//           ) : (
//             <span className="text-amber-600">Not Assigned</span>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className={`text-sm font-medium ${getStatusColor(row.documentStatus)}`}>
//           {row.documentStatus}
//         </div>
//       )
//     },
   
//   ];

//   // Action column for LC records
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       {/* {!row.assignedUser && selectedUsers[row.id] && (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleAssignUser(row.id)}
//         >
//           Assign
//         </Button>
//       )} */}
//       <Button 
//         variant="outline" 
//         size="sm" 
//         icon={DocumentMagnifyingGlassIcon}
//         onClick={() => handleViewDetails(row)}
//       >
//         {selectedLC === row.id ? 'Hide Details' : 'Timeline View'}
//       </Button>
//     </div>
//   );

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">LC Timeline</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           View and manage Letter of Credit processing timelines, documents and assignments.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {lcRecords.length} Letters of Credit
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm">
//               Export
//             </Button>
//             <Button variant="outline" size="sm">
//               Filter
//             </Button>
//           </div>
//         </div>
        
//         <DataTable 
//           columns={columns} 
//           data={lcRecords} 
//           actionColumn={actionColumn}
//           expandableRows
          
//         />
        
//         {/* Detailed Timeline View when an LC is selected */}
//         {selectedLC && (
//           <div className="mt-8 border-t pt-6">
//             <h2 className="text-lg font-semibold mb-4">
//               Timeline Details for {lcRecords.find(lc => lc.id === selectedLC)?.lcNumber}
//             </h2>
            
//             <div className="grid grid-cols-3 gap-6">
//               {/* MT799 Documents Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">MT799 Documents</h3>
//                 <div className="space-y-4">
//                   {lcRecords.find(lc => lc.id === selectedLC)?.mt799Documents.map(doc => (
//                     <div key={doc.id} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm font-medium">{doc.name}</div>
//                       {/* <div className="text-xs text-gray-500 mt-1">ID: {doc.id}</div> */}
//                       <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="mt-2"
//                         onClick={() => handleDownloadDocument('mt799', doc)}
//                       >
//                         View Document
//                       </Button>
//                     </div>
//                   ))}
                  
//                   {lcRecords.find(lc => lc.id === selectedLC)?.mt799Documents.length === 0 && (
//                     <div className="text-sm text-gray-500">No MT799 documents available</div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Support Documents Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">Support Documents</h3>
//                 <div className="space-y-4">
//                   {lcRecords.find(lc => lc.id === selectedLC)?.supportDocuments.map(doc => (
//                     <div key={doc.id} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm font-medium">{doc.name}</div>
//                       {/* <div className="text-xs text-gray-500 mt-1 truncate">UUID: {doc.uuid}</div> */}
//                       <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="mt-2"
//                         onClick={() => handleDownloadDocument('support', doc)}
//                       >
//                         View Document
//                       </Button>
//                     </div>
//                   ))}
                  
//                   {lcRecords.find(lc => lc.id === selectedLC)?.supportDocuments.length === 0 && (
//                     <div className="text-sm text-gray-500">No support documents available</div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Users Timeline Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">Users Timeline</h3>
//                 <div className="space-y-4">
//                   {lcRecords.find(lc => lc.id === selectedLC)?.usersTimeline.map((entry, index) => (
//                     <div key={index} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm">User ID: {entry.userId}</div>
//                       <div className="text-xs text-gray-500 mt-1">Assigned At: {entry.assignedAt}</div>
//                       <div className="text-xs text-green-600 mt-1">Status: {entry.status}</div>
//                     </div>
//                   ))}
                  
//                   {lcRecords.find(lc => lc.id === selectedLC)?.usersTimeline.length === 0 && (
//                     <div className="text-sm text-gray-500">No user assignments yet</div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-end mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setSelectedLC(null)}
//               >
//                 Close Timeline View
//               </Button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default LCTimelinePage;




// // File: src/pages/admin/LCTimelinePage.jsx
// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import Button from '../../components/buttons/Button';
// import DataTable from '../../components/tables/DataTable';
// import UserDropdown from '../../components/forms/UserDropdown';
// import { 
//   CalendarIcon, 
//   DocumentIcon, 
//   DocumentMagnifyingGlassIcon, 
//   ClockIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   UserCircleIcon,
//   DocumentTextIcon
// } from '@heroicons/react/24/outline';
// import { lcService } from '../authentication/apiAdmin'; // Fixed import path

// const LCTimelinePage = () => {
//   // State for LC records
//   const [lcRecords, setLcRecords] = useState([]);
//   // State for loading indicator
//   const [loading, setLoading] = useState(true);
//   // State for error
//   const [error, setError] = useState(null);
//   // State for users
//   const [users, setUsers] = useState([]);

//   // State to track which LCs are expanded in the view
//   const [expandedLCs, setExpandedLCs] = useState({});
  
//   // State to track selected LC for detailed view
//   const [selectedLC, setSelectedLC] = useState(null);
  
//   // State to track selected users for assignment
//   const [selectedUsers, setSelectedUsers] = useState({});

//   // Fetch LC data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch LCs timeline using the timeline-specific endpoint
//         const response = await lcService.getLCTimeline();
        
//         // Transform the API data to match component state structure
//         const transformedData = response.map((lc, index) => {
//           // Parse JSON strings if they're strings
//           const mt799Docs = Array.isArray(lc.mt799) ? lc.mt799 : 
//                           (typeof lc.mt799 === 'string' ? JSON.parse(lc.mt799) : []);
//           const mt707Docs = Array.isArray(lc.mt707) ? lc.mt707 : 
//                           (typeof lc.mt707 === 'string' ? JSON.parse(lc.mt707) : []);
//           const supportDocs = Array.isArray(lc.support_docs) ? lc.support_docs : 
//                             (typeof lc.support_docs === 'string' ? JSON.parse(lc.support_docs) : []);
//           const usersTimeline = Array.isArray(lc.users_timeline) ? lc.users_timeline : 
//                               (typeof lc.users_timeline === 'string' ? JSON.parse(lc.users_timeline) : []);
          
//           // Find currently assigned user
//           let assignedUser = null;
//           let assignDate = null;
          
//           if (usersTimeline && usersTimeline.length > 0) {
//             // Get the latest assignment (assuming the timeline is ordered chronologically)
//             const latestAssignments = usersTimeline.filter(entry => entry.status === 'assign');
//             if (latestAssignments.length > 0) {
//               const latestAssignment = latestAssignments[latestAssignments.length - 1];
//               assignedUser = { id: latestAssignment.user_id }; // We'll update with actual names when we get users
//               assignDate = latestAssignment.assign_at ? new Date(latestAssignment.assign_at).toLocaleDateString() : 'Unknown';
//             }
//           }
          
//           // Determine document status
//           let documentStatus = 'In Progress';
//           if (lc.user_complete_at && lc.admin_complete_at) {
//             documentStatus = 'Completed';
//           } else if (lc.user_complete_at) {
//             documentStatus = 'User Completed';
//           } else if (!usersTimeline || usersTimeline.length === 0) {
//             documentStatus = 'Not Started';
//           } else {
//             documentStatus = 'In Progress';
//           }
          
//           // Create the transformed record
//           return {
//             id: lc.id || index + 1, // Use LC's ID if available, otherwise use index
//             lcNumber: lc.lc_no,
//             initialDate: lc.init_date ? new Date(lc.init_date).toLocaleDateString() : 'N/A',
//             endDate: lc.end_date ? new Date(lc.end_date).toLocaleDateString() : 'N/A',
//             assignedUser: assignedUser,
//             assignDate: assignDate,
//             documentStatus: documentStatus,
//             userCompleteStatus: lc.user_complete_at ? 'Completed' : 'Not Completed',
//             adminCompleteStatus: lc.admin_complete_at ? 'Completed' : 'Not Completed',
//             mt799Documents: Array.isArray(mt799Docs) ? mt799Docs.map(doc => ({
//               id: doc.id,
//               name: `MT799 Document ${doc.id}`,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             mt707Documents: Array.isArray(mt707Docs) ? mt707Docs.map(doc => ({
//               id: doc.id,
//               name: `MT707 Document ${doc.id}`,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             supportDocuments: Array.isArray(supportDocs) ? supportDocs.map(doc => ({
//               id: doc.doc_uuid,
//               name: doc.title || 'Support Document',
//               uuid: doc.doc_uuid,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             usersTimeline: usersTimeline || [],
//             originalData: lc // Keep the original data for reference
//           };
//         });
        
//         setLcRecords(transformedData);
        
//         // Fetch users for dropdown
//         const usersResponse = await lcService.getComplyceManagers();
//         setUsers(usersResponse.map(user => ({
//           id: user.id,
//           name: user.name || `User ${user.id}`,
//           role: user.role || 'user'
//         })));
        
//         // Update assigned user names
//         if (transformedData.length > 0 && usersResponse.length > 0) {
//           const updatedRecords = transformedData.map(record => {
//             if (record.assignedUser) {
//               const user = usersResponse.find(u => u.id === record.assignedUser.id);
//               if (user) {
//                 return {
//                   ...record,
//                   assignedUser: user.name
//                 };
//               }
//             }
//             return record;
//           });
          
//           setLcRecords(updatedRecords);
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error loading LC data:', err);
//         setError('Failed to load LC data. Please try again later.');
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Toggle expanded state for an LC
//   const toggleExpand = (lcId) => {
//     setExpandedLCs(prev => ({
//       ...prev,
//       [lcId]: !prev[lcId]
//     }));
//   };

//   // Handle viewing LC details
//   const handleViewDetails = (lc) => {
//     setSelectedLC(lc.id === selectedLC ? null : lc.id);
//   };

//   // Handle user selection for assignment
//   const handleUserSelect = (lcId, user) => {
//     setSelectedUsers({
//       ...selectedUsers,
//       [lcId]: user
//     });
//   };

//   // Handle assigning a user to an LC
//   const handleAssignUser = async (lcId) => {
//     try {
//       const lc = lcRecords.find(r => r.id === lcId);
//       if (!lc || !selectedUsers[lcId]) return;
      
//       await lcService.assignLC(lc.lcNumber, selectedUsers[lcId].id);
      
//       // Update local state
//       setLcRecords(lcRecords.map(record => {
//         if (record.id === lcId) {
//           return {
//             ...record,
//             assignedUser: selectedUsers[lcId].name,
//             assignDate: new Date().toLocaleDateString(),
//             usersTimeline: [
//               ...record.usersTimeline,
//               {
//                 user_id: selectedUsers[lcId].id,
//                 assign_at: new Date().toISOString(),
//                 status: 'assign'
//               }
//             ]
//           };
//         }
//         return record;
//       }));
      
//       // Clear the selection
//       const newSelectedUsers = { ...selectedUsers };
//       delete newSelectedUsers[lcId];
//       setSelectedUsers(newSelectedUsers);
      
//     } catch (err) {
//       console.error(`Error assigning user to LC ${lcId}:`, err);
//       alert('Failed to assign user. Please try again.');
//     }
//   };

//   // Handle downloading a document
//   const handleDownloadDocument = async (docType, doc, lcId) => {
//     try {
//       const lc = lcRecords.find(r => r.id === lcId);
//       if (!lc) return;
      
//       // For MT799 or MT707 documents
//       if (docType === 'mt799' || docType === 'mt707') {
//         alert(`Downloading ${docType.toUpperCase()} document ${doc.id}`);
//         // Implement document download logic
//         await lcService.downloadMTDocument(lc.lcNumber, docType, doc.id);
//       } 
//       // For support documents
//       else if (docType === 'support') {
//         // Use the service to download the document
//         try {
//           const result = await lcService.downloadLCDocument(lc.lcNumber, doc.uuid);
          
//           // Open the document in a new tab
//           if (result && result.url) {
//             window.open(result.url, '_blank');
//           } else {
//             throw new Error('Download URL not available');
//           }
//         } catch (error) {
//           throw new Error(`Failed to download support document: ${error.message}`);
//         }
//       }
//     } catch (err) {
//       console.error(`Error downloading ${docType} document:`, err);
//       alert(`Failed to download document. ${err.message}`);
//     }
//   };

//   // Get status color based on status text
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Completed':
//         return 'text-green-600';
//       case 'User Completed':
//         return 'text-blue-600';
//       case 'In Progress':
//         return 'text-blue-600';
//       case 'Not Started':
//         return 'text-amber-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   // Table columns configuration for LC list view
//   const columns = [
//     {
//       key: 'expand',
//       header: '',
//       width: '40px',
//       render: (row) => (
//         <button 
//           onClick={() => toggleExpand(row.id)}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           {expandedLCs[row.id] ? 
//             <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
//             <ChevronRightIcon className="h-5 w-5 text-gray-500" />
//           }
//         </button>
//       )
//     },
//     {
//       key: 'lcNumber',
//       header: 'LC Number',
//       render: (row) => (
//         <div className="font-medium text-blue-700">{row.lcNumber}</div>
//       )
//     },
//     {
//       key: 'dates',
//       header: 'Dates',
//       render: (row) => (
//         <div className="text-sm">
//           <div className="flex items-center space-x-1">
//             <CalendarIcon className="h-4 w-4 text-gray-400" />
//             <span>Initial: {row.initialDate}</span>
//           </div>
//           <div className="flex items-center space-x-1 mt-1">
//             <ClockIcon className="h-4 w-4 text-gray-400" />
//             <span>End: {row.endDate}</span>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'documents',
//       header: 'Documents',
//       render: (row) => (
//         <div className="flex space-x-3">
//           {row.mt707Documents && row.mt707Documents.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//               MT707: {row.mt707Documents.length}
//             </div>
//           )}
//           {row.mt799Documents && row.mt799Documents.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//               MT799: {row.mt799Documents.length}
//             </div>
//           )}
//           {row.supportDocuments && row.supportDocuments.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
//               Support: {row.supportDocuments.length}
//             </div>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'assignment',
//       header: 'Assignment',
//       render: (row) => (
//         <div className="text-sm">
//           {row.assignedUser ? (
//             <div>
//               <div className="font-medium">{row.assignedUser}</div>
//               <div className="text-xs text-gray-500">Since: {row.assignDate}</div>
//             </div>
//           ) : (
//             <span className="text-amber-600">Not Assigned</span>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className={`text-sm font-medium ${getStatusColor(row.documentStatus)}`}>
//           {row.documentStatus}
//         </div>
//       )
//     },
//     {
//       key: 'userAssignment',
//       header: 'Assign To',
//       render: (row) => (
//         !row.assignedUser ? (
//           <UserDropdown 
//             users={users} 
//             onSelect={(user) => handleUserSelect(row.id, user)}
//             placeholder="Select user"
//           />
//         ) : (
//           <div className="text-xs text-gray-500">
//             Already assigned
//           </div>
//         )
//       )
//     }
//   ];

//   // Action column for LC records
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       {!row.assignedUser && selectedUsers[row.id] && (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleAssignUser(row.id)}
//         >
//           Assign
//         </Button>
//       )}
//       <Button 
//         variant="outline" 
//         size="sm" 
//         icon={DocumentMagnifyingGlassIcon}
//         onClick={() => handleViewDetails(row)}
//       >
//         {selectedLC === row.id ? 'Hide Details' : 'Timeline View'}
//       </Button>
//     </div>
//   );

//   // Find the selected LC record if any
//   const selectedLCRecord = selectedLC ? lcRecords.find(lc => lc.id === selectedLC) : null;

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">LC Timeline</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           View and manage Letter of Credit processing timelines, documents and assignments.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {loading ? 'Loading...' : `${lcRecords.length} Letters of Credit`}
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm">
//               Export
//             </Button>
//             <Button variant="outline" size="sm">
//               Filter
//             </Button>
//           </div>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 p-4 rounded-md text-red-600">
//             {error}
//           </div>
//         ) : (
//           <DataTable 
//             columns={columns} 
//             data={lcRecords} 
//             actionColumn={actionColumn}
//             expandableRows
//             expandedRows={expandedLCs}
//             onRowExpand={toggleExpand}
//           />
//         )}
        
//         {/* Detailed Timeline View when an LC is selected */}
//         {selectedLCRecord && !loading && (
//           <div className="mt-8 border-t pt-6">
//             <h2 className="text-lg font-semibold mb-4">
//               Timeline Details for {selectedLCRecord.lcNumber}
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* MT707 Documents Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">MT707 Documents</h3>
//                 <div className="space-y-4">
//                   {selectedLCRecord.mt707Documents && selectedLCRecord.mt707Documents.map(doc => (
//                     <div key={doc.id} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm font-medium">{doc.name}</div>
//                       <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="mt-2"
//                         onClick={() => handleDownloadDocument('mt707', doc, selectedLC)}
//                       >
//                         View Document
//                       </Button>
//                     </div>
//                   ))}
                  
//                   {(!selectedLCRecord.mt707Documents || selectedLCRecord.mt707Documents.length === 0) && (
//                     <div className="text-sm text-gray-500">No MT707 documents available</div>
//                   )}
//                 </div>
//               </div>

//               {/* MT799 Documents Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">MT799 Documents</h3>
//                 <div className="space-y-4">
//                   {selectedLCRecord.mt799Documents && selectedLCRecord.mt799Documents.map(doc => (
//                     <div key={doc.id} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm font-medium">{doc.name}</div>
//                       <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="mt-2"
//                         onClick={() => handleDownloadDocument('mt799', doc, selectedLC)}
//                       >
//                         View Document
//                       </Button>
//                     </div>
//                   ))}
                  
//                   {(!selectedLCRecord.mt799Documents || selectedLCRecord.mt799Documents.length === 0) && (
//                     <div className="text-sm text-gray-500">No MT799 documents available</div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Support Documents Section */}
//               <div className="bg-gray-50 rounded-md p-4">
//                 <h3 className="font-medium text-gray-800 mb-3">Support Documents</h3>
//                 <div className="space-y-4">
//                   {selectedLCRecord.supportDocuments && selectedLCRecord.supportDocuments.map(doc => (
//                     <div key={doc.id || doc.uuid} className="bg-white p-3 rounded shadow-sm">
//                       <div className="text-sm font-medium">{doc.name}</div>
//                       <div className="text-xs text-gray-500 mt-1 truncate">UUID: {doc.uuid}</div>
//                       <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="mt-2"
//                         onClick={() => handleDownloadDocument('support', doc, selectedLC)}
//                       >
//                         View Document
//                       </Button>
//                     </div>
//                   ))}
                  
//                   {(!selectedLCRecord.supportDocuments || selectedLCRecord.supportDocuments.length === 0) && (
//                     <div className="text-sm text-gray-500">No support documents available</div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Users Timeline Section */}
//               <div className="bg-gray-50 rounded-md p-4 md:col-span-3">
//                 <h3 className="font-medium text-gray-800 mb-3">Users Timeline</h3>
//                 <div className="space-y-4">
//                   {selectedLCRecord.usersTimeline && selectedLCRecord.usersTimeline.map((entry, index) => {
//                     const user = users.find(u => u.id === entry.user_id);
//                     const userName = user ? user.name : `User ID: ${entry.user_id}`;
//                     const formattedDate = entry.assign_at ? new Date(entry.assign_at).toLocaleString() : 'Unknown date';
                    
//                     return (
//                       <div key={index} className="bg-white p-3 rounded shadow-sm">
//                         <div className="text-sm font-medium">{userName}</div>
//                         <div className="text-xs text-gray-500 mt-1">Time: {formattedDate}</div>
//                         <div className={`text-xs mt-1 ${entry.status === 'assign' ? 'text-green-600' : 'text-red-600'}`}>
//                           Status: {entry.status === 'assign' ? 'Assigned' : 'Removed'}
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {(!selectedLCRecord.usersTimeline || selectedLCRecord.usersTimeline.length === 0) && (
//                     <div className="text-sm text-gray-500">No user assignments yet</div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-end mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setSelectedLC(null)}
//               >
//                 Close Timeline View
//               </Button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default LCTimelinePage;


// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import Button from '../../components/buttons/Button';
// import DataTable from '../../components/tables/DataTable';
// import { 
//   CalendarIcon, 
//   DocumentIcon, 
//   DocumentMagnifyingGlassIcon, 
//   ClockIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   UserCircleIcon,
//   DocumentTextIcon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';
// import { lcService } from '../authentication/apiAdmin';

// const LCTimelinePage = () => {
//   // State for LC records
//   const [lcRecords, setLcRecords] = useState([]);
//   // State for loading indicator
//   const [loading, setLoading] = useState(true);
//   // State for error
//   const [error, setError] = useState(null);
//   // State for users
//   const [users, setUsers] = useState([]);
//   // State to track which LCs are expanded in the view
//   const [expandedLCs, setExpandedLCs] = useState({});
//   // State to track selected LC for detailed view
//   const [selectedLC, setSelectedLC] = useState(null);
//   // State for modal view of timeline
//   const [showTimelineModal, setShowTimelineModal] = useState(false);

//   // Fetch LC data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch LCs timeline using the timeline-specific endpoint
//         const response = await lcService.getLCTimeline();
        
//         // Transform the API data to match component state structure
//         const transformedData = response.map((lc, index) => {
//           // Parse JSON strings if they're strings
//           const mt799Docs = Array.isArray(lc.mt799) ? lc.mt799 : 
//                           (typeof lc.mt799 === 'string' ? JSON.parse(lc.mt799) : []);
//           const mt707Docs = Array.isArray(lc.mt707) ? lc.mt707 : 
//                           (typeof lc.mt707 === 'string' ? JSON.parse(lc.mt707) : []);
//           const supportDocs = Array.isArray(lc.support_docs) ? lc.support_docs : 
//                             (typeof lc.support_docs === 'string' ? JSON.parse(lc.support_docs) : []);
//           const usersTimeline = Array.isArray(lc.users_timeline) ? lc.users_timeline : 
//                               (typeof lc.users_timeline === 'string' ? JSON.parse(lc.users_timeline) : []);
          
//           // Find currently assigned user
//           let assignedUser = null;
//           let assignDate = null;
          
//           if (usersTimeline && usersTimeline.length > 0) {
//             // Get the latest assignment (assuming the timeline is ordered chronologically)
//             const latestAssignments = usersTimeline.filter(entry => entry.status === 'assign');
//             if (latestAssignments.length > 0) {
//               const latestAssignment = latestAssignments[latestAssignments.length - 1];
//               assignedUser = latestAssignment.full_name || `User ID: ${latestAssignment.user_id}`;
//               assignDate = latestAssignment.assign_at ? new Date(latestAssignment.assign_at).toLocaleDateString() : 'Unknown';
//             }
//           }
          
//           // Determine document status
//           let documentStatus = 'In Progress';
//           if (lc.user_complete_at && lc.admin_complete_at) {
//             documentStatus = 'Completed';
//           } else if (lc.user_complete_at) {
//             documentStatus = 'User Completed';
//           } else if (!usersTimeline || usersTimeline.length === 0) {
//             documentStatus = 'Not Started';
//           } else {
//             documentStatus = 'In Progress';
//           }
          
//           // Create the transformed record
//           return {
//             id: lc.id || index + 1, // Use LC's ID if available, otherwise use index
//             lcNumber: lc.lc_no,
//             initialDate: lc.init_date ? new Date(lc.init_date).toLocaleDateString() : 'N/A',
//             endDate: lc.end_date ? new Date(lc.end_date).toLocaleDateString() : 'N/A',
//             assignedUser: assignedUser,
//             assignDate: assignDate,
//             documentStatus: documentStatus,
//             userCompleteStatus: lc.user_complete_at ? 'Completed' : 'Not Completed',
//             adminCompleteStatus: lc.admin_complete_at ? 'Completed' : 'Not Completed',
//             mt799Documents: Array.isArray(mt799Docs) ? mt799Docs.map(doc => ({
//               id: doc.id,
//               name: `MT799 Document ${doc.id}`,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             mt707Documents: Array.isArray(mt707Docs) ? mt707Docs.map(doc => ({
//               id: doc.id,
//               name: `MT707 Document ${doc.id}`,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             supportDocuments: Array.isArray(supportDocs) ? supportDocs.map(doc => ({
//               id: doc.doc_uuid,
//               name: doc.title || 'Support Document',
//               uuid: doc.doc_uuid,
//               date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
//             })) : [],
//             usersTimeline: usersTimeline || [],
//             originalData: lc // Keep the original data for reference
//           };
//         });
        
//         setLcRecords(transformedData);
        
//         // Fetch users for dropdown (still needed for display purposes)
//         const usersResponse = await lcService.getComplyceManagers();
//         setUsers(usersResponse.map(user => ({
//           id: user.id,
//           name: user.name || `User ${user.id}`,
//           role: user.role || 'user'
//         })));
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error loading LC data:', err);
//         setError('Failed to load LC data. Please try again later.');
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Toggle expanded state for an LC
//   const toggleExpand = (lcId) => {
//     setExpandedLCs(prev => ({
//       ...prev,
//       [lcId]: !prev[lcId]
//     }));
//   };

//   // Handle viewing LC details
//   const handleViewDetails = (lc) => {
//     setSelectedLC(lc.id);
//     setShowTimelineModal(true);
//   };

//   // Handle downloading a document
//   const handleDownloadDocument = async (docType, doc, lcId) => {
//     try {
//       const lc = lcRecords.find(r => r.id === lcId);
//       if (!lc) return;
      
//       // For MT799 or MT707 documents
//       if (docType === 'mt799' || docType === 'mt707') {
//         alert(`Downloading ${docType.toUpperCase()} document ${doc.id}`);
//         // Implement document download logic
//         await lcService.downloadMTDocument(lc.lcNumber, docType, doc.id);
//       } 
//       // For support documents
//       else if (docType === 'support') {
//         // Use the service to download the document
//         try {
//           const result = await lcService.downloadLCDocument(lc.lcNumber, doc.uuid);
          
//           // Open the document in a new tab
//           if (result && result.url) {
//             window.open(result.url, '_blank');
//           } else {
//             throw new Error('Download URL not available');
//           }
//         } catch (error) {
//           throw new Error(`Failed to download support document: ${error.message}`);
//         }
//       }
//     } catch (err) {
//       console.error(`Error downloading ${docType} document:`, err);
//       alert(`Failed to download document. ${err.message}`);
//     }
//   };

//   // Get status color based on status text
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Completed':
//         return 'text-green-600';
//       case 'User Completed':
//         return 'text-blue-600';
//       case 'In Progress':
//         return 'text-blue-600';
//       case 'Not Started':
//         return 'text-amber-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   // Group user timeline by user to show a cleaner history
//   const groupUserTimeline = (timeline) => {
//     const userGroups = {};
    
//     if (!timeline || timeline.length === 0) return [];
    
//     // Sort timeline by date (newest first)
//     const sortedTimeline = [...timeline].sort((a, b) => {
//       return new Date(b.assign_at) - new Date(a.assign_at);
//     });
    
//     // Get only the most recent status for each user
//     sortedTimeline.forEach(entry => {
//       const userId = entry.user_id;
//       if (!userGroups[userId] || new Date(entry.assign_at) > new Date(userGroups[userId].assign_at)) {
//         userGroups[userId] = entry;
//       }
//     });
    
//     return Object.values(userGroups);
//   };

//   // Table columns configuration for LC list view
//   const columns = [
//     {
//       key: 'expand',
//       header: '',
//       width: '40px',
//       render: (row) => (
//         <button 
//           onClick={() => toggleExpand(row.id)}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           {expandedLCs[row.id] ? 
//             <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
//             <ChevronRightIcon className="h-5 w-5 text-gray-500" />
//           }
//         </button>
//       )
//     },
//     {
//       key: 'lcNumber',
//       header: 'LC Number',
//       render: (row) => (
//         <div className="font-medium text-blue-700">{row.lcNumber}</div>
//       )
//     },
//     {
//       key: 'dates',
//       header: 'Dates',
//       render: (row) => (
//         <div className="text-sm">
//           <div className="flex items-center space-x-1">
//             <CalendarIcon className="h-4 w-4 text-gray-400" />
//             <span>Initial: {row.initialDate}</span>
//           </div>
//           <div className="flex items-center space-x-1 mt-1">
//             <ClockIcon className="h-4 w-4 text-gray-400" />
//             <span>End: {row.endDate}</span>
//           </div>
//         </div>
//       )
//     },
//     {
//       key: 'documents',
//       header: 'Documents',
//       render: (row) => (
//         <div className="flex space-x-3">
//           {row.mt707Documents && row.mt707Documents.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//               MT707: {row.mt707Documents.length}
//             </div>
//           )}
//           {row.mt799Documents && row.mt799Documents.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//               MT799: {row.mt799Documents.length}
//             </div>
//           )}
//           {row.supportDocuments && row.supportDocuments.length > 0 && (
//             <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
//               Support: {row.supportDocuments.length}
//             </div>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'assignment',
//       header: 'Assignment',
//       render: (row) => (
//         <div className="text-sm">
//           {row.assignedUser ? (
//             <div>
//               <div className="font-medium">{row.assignedUser}</div>
//               <div className="text-xs text-gray-500">Since: {row.assignDate}</div>
//             </div>
//           ) : (
//             <span className="text-amber-600">Not Assigned</span>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className={`text-sm font-medium ${getStatusColor(row.documentStatus)}`}>
//           {row.documentStatus}
//         </div>
//       )
//     }
//   ];

//   // Action column for LC records
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       <Button 
//         variant="outline" 
//         size="sm" 
//         icon={DocumentMagnifyingGlassIcon}
//         onClick={() => handleViewDetails(row)}
//       >
//         Timeline View
//       </Button>
//     </div>
//   );

//   // Find the selected LC record if any
//   const selectedLCRecord = selectedLC ? lcRecords.find(lc => lc.id === selectedLC) : null;

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">LC Timeline</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           View and monitor Letter of Credit processing timelines and documents.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {loading ? 'Loading...' : `${lcRecords.length} Letters of Credit`}
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm">
//               Export
//             </Button>
//             <Button variant="outline" size="sm">
//               Filter
//             </Button>
//           </div>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 p-4 rounded-md text-red-600">
//             {error}
//           </div>
//         ) : (
//           <DataTable 
//             columns={columns} 
//             data={lcRecords} 
//             actionColumn={actionColumn}
//             expandableRows
//             expandedRows={expandedLCs}
//             onRowExpand={toggleExpand}
//           />
//         )}
        
//         {/* Timeline Modal - Slide-in from right */}
//         {showTimelineModal && selectedLCRecord && (
//           <div className="fixed inset-0 z-50 overflow-hidden">
//             <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTimelineModal(false)}></div>
            
//             <div className="absolute inset-y-0 right-0 max-w-full flex">
//               <div className="relative w-screen max-w-2xl">
//                 <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-auto">
//                   {/* Header */}
//                   <div className="px-4 sm:px-6 border-b pb-4 flex items-center justify-between">
//                     <h2 className="text-lg font-medium text-gray-900">
//                       Timeline for LC {selectedLCRecord.lcNumber}
//                     </h2>
//                     <button 
//                       onClick={() => setShowTimelineModal(false)}
//                       className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
//                     >
//                       <XMarkIcon className="h-6 w-6" />
//                     </button>
//                   </div>
                  
//                   {/* Body */}
//                   <div className="mt-6 relative flex-1 px-4 sm:px-6 overflow-auto">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       {/* LC Details */}
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h3 className="font-medium text-gray-800 mb-2">LC Details</h3>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">LC Number:</span>
//                             <span className="font-medium">{selectedLCRecord.lcNumber}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Initial Date:</span>
//                             <span>{selectedLCRecord.initialDate}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">End Date:</span>
//                             <span>{selectedLCRecord.endDate}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-600">Status:</span>
//                             <span className={getStatusColor(selectedLCRecord.documentStatus)}>
//                               {selectedLCRecord.documentStatus}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Current Assignment */}
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h3 className="font-medium text-gray-800 mb-2">Current Assignment</h3>
//                         {selectedLCRecord.assignedUser ? (
//                           <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                               <span className="text-gray-600">Assigned To:</span>
//                               <span className="font-medium">{selectedLCRecord.assignedUser}</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="text-gray-600">Since:</span>
//                               <span>{selectedLCRecord.assignDate}</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="text-gray-600">User Complete:</span>
//                               <span className={selectedLCRecord.userCompleteStatus === 'Completed' ? 'text-green-600' : 'text-amber-600'}>
//                                 {selectedLCRecord.userCompleteStatus}
//                               </span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span className="text-gray-600">Admin Complete:</span>
//                               <span className={selectedLCRecord.adminCompleteStatus === 'Completed' ? 'text-green-600' : 'text-amber-600'}>
//                                 {selectedLCRecord.adminCompleteStatus}
//                               </span>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-center h-16">
//                             <span className="text-amber-600">Not Currently Assigned</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Documents Section - Horizontally Scrollable Cards */}
//                     <h3 className="font-medium text-gray-800 mb-3">Documents</h3>
//                     <div className="grid grid-cols-1 gap-4 mb-6">
//                       {/* MT707 Documents */}
//                       {selectedLCRecord.mt707Documents && selectedLCRecord.mt707Documents.length > 0 && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium text-gray-700 mb-2">MT707 Documents</h4>
//                           <div className="flex overflow-x-auto pb-2 space-x-4">
//                             {selectedLCRecord.mt707Documents.map(doc => (
//                               <div key={doc.id} className="bg-white p-3 rounded shadow-sm min-w-[200px] flex-shrink-0">
//                                 <div className="text-sm font-medium">{doc.name}</div>
//                                 <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                                 <Button
//                                   variant="outline"
//                                   size="xs"
//                                   className="mt-2 w-full"
//                                   onClick={() => handleDownloadDocument('mt707', doc, selectedLC)}
//                                 >
//                                   View Document
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
                    
//                       {/* MT799 Documents */}
//                       {selectedLCRecord.mt799Documents && selectedLCRecord.mt799Documents.length > 0 && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium text-gray-700 mb-2">MT799 Documents</h4>
//                           <div className="flex overflow-x-auto pb-2 space-x-4">
//                             {selectedLCRecord.mt799Documents.map(doc => (
//                               <div key={doc.id} className="bg-white p-3 rounded shadow-sm min-w-[200px] flex-shrink-0">
//                                 <div className="text-sm font-medium">{doc.name}</div>
//                                 <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                                 <Button
//                                   variant="outline"
//                                   size="xs"
//                                   className="mt-2 w-full"
//                                   onClick={() => handleDownloadDocument('mt799', doc, selectedLC)}
//                                 >
//                                   View Document
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
                    
//                       {/* Support Documents */}
//                       {selectedLCRecord.supportDocuments && selectedLCRecord.supportDocuments.length > 0 && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h4 className="font-medium text-gray-700 mb-2">Support Documents</h4>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                             {selectedLCRecord.supportDocuments.map(doc => (
//                               <div key={doc.id || doc.uuid} className="bg-white p-3 rounded shadow-sm">
//                                 <div className="text-sm font-medium truncate">{doc.name}</div>
//                                 <div className="text-xs text-gray-500 mt-1">Date: {doc.date}</div>
//                                 <Button
//                                   variant="outline"
//                                   size="xs"
//                                   className="mt-2 w-full"
//                                   onClick={() => handleDownloadDocument('support', doc, selectedLC)}
//                                 >
//                                   View Document
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Assignment History - Timeline Format */}
//                     <h3 className="font-medium text-gray-800 mb-3">Assignment History</h3>
//                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                       {selectedLCRecord.usersTimeline && selectedLCRecord.usersTimeline.length > 0 ? (
//                         <div className="relative">
//                           {/* Timeline connector */}
//                           <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                          
//                           <div className="space-y-6">
//                             {selectedLCRecord.usersTimeline.map((entry, index) => {
//                               const user = users.find(u => u.id === entry.user_id);
//                               const userName = entry.full_name || (user ? user.name : `User ID: ${entry.user_id}`);
//                               const formattedDate = entry.assign_at ? new Date(entry.assign_at).toLocaleString() : 'Unknown date';
                              
//                               return (
//                                 <div key={index} className="ml-8 relative">
//                                   {/* Timeline dot */}
//                                   <div className={`absolute -left-6 mt-1.5 w-4 h-4 rounded-full border-2 border-white ${entry.status === 'assign' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  
//                                   <div className="bg-white p-3 rounded shadow-sm">
//                                     <div className="text-sm font-medium">{userName}</div>
//                                     <div className="text-xs text-gray-500 mt-1">{formattedDate}</div>
//                                     <div className={`text-xs font-medium mt-1 ${entry.status === 'assign' ? 'text-green-600' : 'text-red-600'}`}>
//                                       {entry.status === 'assign' ? 'Assigned' : 'Removed'}
//                                     </div>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-4 text-gray-500">
//                           No assignment history available
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default LCTimelinePage;

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/buttons/Button';
import DataTable from '../../components/tables/DataTable';
import { 
  CalendarIcon, 
  DocumentIcon, 
  DocumentMagnifyingGlassIcon, 
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { lcService } from '../authentication/apiAdmin';

const LCTimelinePage = () => {
  // State for LC records
  const [lcRecords, setLcRecords] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState(null);
  // State for users
  const [users, setUsers] = useState([]);
  // State to track which LCs are expanded in the view
  const [expandedLCs, setExpandedLCs] = useState({});
  // State to track selected LC for detailed view
  const [selectedLC, setSelectedLC] = useState(null);
  // State for modal view of timeline
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  // Fetch LC data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch LCs timeline using the timeline-specific endpoint
        const response = await lcService.getLCTimeline();
        
        // Transform the API data to match component state structure
        const transformedData = response.map((lc, index) => {
          // Parse JSON strings if they're strings
          const mt799Docs = Array.isArray(lc.mt799) ? lc.mt799 : 
                          (typeof lc.mt799 === 'string' ? JSON.parse(lc.mt799) : []);
          const mt707Docs = Array.isArray(lc.mt707) ? lc.mt707 : 
                          (typeof lc.mt707 === 'string' ? JSON.parse(lc.mt707) : []);
          const supportDocs = Array.isArray(lc.support_docs) ? lc.support_docs : 
                            (typeof lc.support_docs === 'string' ? JSON.parse(lc.support_docs) : []);
          const usersTimeline = Array.isArray(lc.users_timeline) ? lc.users_timeline : 
                              (typeof lc.users_timeline === 'string' ? JSON.parse(lc.users_timeline) : []);
          
          // Find currently assigned user
          let assignedUser = null;
          let assignDate = null;
          
          if (usersTimeline && usersTimeline.length > 0) {
            // Get the latest assignment (assuming the timeline is ordered chronologically)
            const latestAssignments = usersTimeline.filter(entry => entry.status === 'assign');
            if (latestAssignments.length > 0) {
              const latestAssignment = latestAssignments[latestAssignments.length - 1];
              assignedUser = latestAssignment.full_name || `User ID: ${latestAssignment.user_id}`;
              assignDate = latestAssignment.assign_at ? new Date(latestAssignment.assign_at).toLocaleDateString() : 'Unknown';
            }
          }
          
          // Determine document status
          let documentStatus = 'In Progress';
          if (lc.user_complete_at && lc.admin_complete_at) {
            documentStatus = 'Completed';
          } else if (lc.user_complete_at) {
            documentStatus = 'User Completed';
          } else if (!usersTimeline || usersTimeline.length === 0) {
            documentStatus = 'Not Started';
          } else {
            documentStatus = 'In Progress';
          }
          
          // Create the transformed record
          return {
            id: lc.id || index + 1, // Use LC's ID if available, otherwise use index
            lcNumber: lc.lc_no,
            initialDate: lc.init_date ? new Date(lc.init_date).toLocaleDateString() : 'N/A',
            endDate: lc.end_date ? new Date(lc.end_date).toLocaleDateString() : 'N/A',
            assignedUser: assignedUser,
            assignDate: assignDate,
            documentStatus: documentStatus,
            userCompleteStatus: lc.user_complete_at ? 'Completed' : 'Not Completed',
            adminCompleteStatus: lc.admin_complete_at ? 'Completed' : 'Not Completed',
            mt799Documents: Array.isArray(mt799Docs) ? mt799Docs.map(doc => ({
              id: doc.id,
              name: `MT799 Document ${doc.id}`,
              date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
            })) : [],
            mt707Documents: Array.isArray(mt707Docs) ? mt707Docs.map(doc => ({
              id: doc.id,
              name: `MT707 Document ${doc.id}`,
              date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
            })) : [],
            supportDocuments: Array.isArray(supportDocs) ? supportDocs.map(doc => ({
              id: doc.doc_uuid,
              name: doc.title || 'Support Document',
              uuid: doc.doc_uuid,
              date: doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'
            })) : [],
            usersTimeline: usersTimeline || [],
            originalData: lc // Keep the original data for reference
          };
        });
        
        setLcRecords(transformedData);
        
        // Fetch users for dropdown (still needed for display purposes)
        const usersResponse = await lcService.getComplyceManagers();
        setUsers(usersResponse.map(user => ({
          id: user.id,
          name: user.name || `User ${user.id}`,
          role: user.role || 'user'
        })));
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading LC data:', err);
        setError('Failed to load LC data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Toggle expanded state for an LC
  const toggleExpand = (lcId) => {
    setExpandedLCs(prev => ({
      ...prev,
      [lcId]: !prev[lcId]
    }));
  };

  // Handle viewing LC details
  const handleViewDetails = (lc) => {
    setSelectedLC(lc.id);
    setShowTimelineModal(true);
  };

  // Handle downloading a document
  const handleDownloadDocument = async (docType, doc, lcId) => {
    try {
      const lc = lcRecords.find(r => r.id === lcId);
      if (!lc) return;
      
      // For MT799 or MT707 documents
      if (docType === 'mt799' || docType === 'mt707') {
        alert(`Downloading ${docType.toUpperCase()} document ${doc.id}`);
        // Implement document download logic
        await lcService.downloadMTDocument(lc.lcNumber, docType, doc.id);
      } 
      // For support documents
      else if (docType === 'support') {
        // Use the service to download the document
        try {
          const result = await lcService.downloadLCDocument(lc.lcNumber, doc.uuid);
          
          // Open the document in a new tab
          if (result && result.url) {
            window.open(result.url, '_blank');
          } else {
            throw new Error('Download URL not available');
          }
        } catch (error) {
          throw new Error(`Failed to download support document: ${error.message}`);
        }
      }
    } catch (err) {
      console.error(`Error downloading ${docType} document:`, err);
      alert(`Failed to download document. ${err.message}`);
    }
  };

  // Get status color based on status text
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'text-green-600';
      case 'User Completed':
        return 'text-blue-600';
      case 'In Progress':
        return 'text-blue-600';
      case 'Not Started':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get status badge class based on status text
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'User Completed':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group user timeline by user to show a cleaner history
  const groupUserTimeline = (timeline) => {
    const userGroups = {};
    
    if (!timeline || timeline.length === 0) return [];
    
    // Sort timeline by date (newest first)
    const sortedTimeline = [...timeline].sort((a, b) => {
      return new Date(b.assign_at) - new Date(a.assign_at);
    });
    
    // Get only the most recent status for each user
    sortedTimeline.forEach(entry => {
      const userId = entry.user_id;
      if (!userGroups[userId] || new Date(entry.assign_at) > new Date(userGroups[userId].assign_at)) {
        userGroups[userId] = entry;
      }
    });
    
    return Object.values(userGroups);
  };

  // Format date to include time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table columns configuration for LC list view
  const columns = [
    {
      key: 'expand',
      header: '',
      width: '40px',
      render: (row) => (
        <button 
          onClick={() => toggleExpand(row.id)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {expandedLCs[row.id] ? 
            <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : 
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          }
        </button>
      )
    },
    {
      key: 'lcNumber',
      header: 'LC Number',
      render: (row) => (
        <div className="font-medium text-blue-700">{row.lcNumber}</div>
      )
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span>Initial: {row.initialDate}</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>End: {row.endDate}</span>
          </div>
        </div>
      )
    },
    {
      key: 'documents',
      header: 'Documents',
      render: (row) => (
        <div className="flex space-x-3">
          {row.mt707Documents && row.mt707Documents.length > 0 && (
            <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              MT707: {row.mt707Documents.length}
            </div>
          )}
          {row.mt799Documents && row.mt799Documents.length > 0 && (
            <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              MT799: {row.mt799Documents.length}
            </div>
          )}
          {row.supportDocuments && row.supportDocuments.length > 0 && (
            <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              Support: {row.supportDocuments.length}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'assignment',
      header: 'Assignment',
      render: (row) => (
        <div className="text-sm">
          {row.assignedUser ? (
            <div>
              <div className="font-medium">{row.assignedUser}</div>
              <div className="text-xs text-gray-500">Since: {row.assignDate}</div>
            </div>
          ) : (
            <span className="text-amber-600">Not Assigned</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className={`text-sm font-medium ${getStatusColor(row.documentStatus)}`}>
          {row.documentStatus}
        </div>
      )
    }
  ];

  // Action column for LC records
  const actionColumn = (row) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        icon={DocumentMagnifyingGlassIcon}
        onClick={() => handleViewDetails(row)}
      >
        Timeline View
      </Button>
    </div>
  );

  // Find the selected LC record if any
  const selectedLCRecord = selectedLC ? lcRecords.find(lc => lc.id === selectedLC) : null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">LC Timeline</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and monitor Letter of Credit processing timelines and documents.
        </p>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${lcRecords.length} Letters of Credit`}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={lcRecords} 
            actionColumn={actionColumn}
            expandableRows
            expandedRows={expandedLCs}
            onRowExpand={toggleExpand}
          />
        )}
        
        {/* Improved Timeline Modal - Slide-in from right */}
        {showTimelineModal && selectedLCRecord && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTimelineModal(false)}></div>
            
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-4xl">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-auto">
                  {/* Header */}
                  <div className="px-4 sm:px-6 border-b pb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        LC {selectedLCRecord.lcNumber}
                      </h2>
                      <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedLCRecord.documentStatus)}`}>
                        {selectedLCRecord.documentStatus}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowTimelineModal(false)}
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Body */}
                  <div className="mt-6 relative flex-1 px-4 sm:px-6 overflow-auto">
                    {/* LC Summary Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* LC Info */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">LC Details</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">Initial Date</div>
                                <div className="font-medium">{selectedLCRecord.initialDate}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 text-blue-500 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">End Date</div>
                                <div className="font-medium">{selectedLCRecord.endDate}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Current Assignment */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Current Assignment</h3>
                          {selectedLCRecord.assignedUser ? (
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <UserCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                                <div>
                                  <div className="text-xs text-gray-500">Assigned To</div>
                                  <div className="font-medium">{selectedLCRecord.assignedUser}</div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
                                <div>
                                  <div className="text-xs text-gray-500">Since</div>
                                  <div className="font-medium">{selectedLCRecord.assignDate}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-amber-600 flex items-center">
                              <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                              Not Currently Assigned
                            </div>
                          )}
                        </div>
                        
                        {/* Completion Status */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Status</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              {selectedLCRecord.userCompleteStatus === 'Completed' ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-amber-500 mr-2"></div>
                              )}
                              <div>
                                <div className="text-xs text-gray-500">User Review</div>
                                <div className={`font-medium ${selectedLCRecord.userCompleteStatus === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                  {selectedLCRecord.userCompleteStatus}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {selectedLCRecord.adminCompleteStatus === 'Completed' ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-amber-500 mr-2"></div>
                              )}
                              <div>
                                <div className="text-xs text-gray-500">Admin Review</div>
                                <div className={`font-medium ${selectedLCRecord.adminCompleteStatus === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                  {selectedLCRecord.adminCompleteStatus}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline and Documents in a two-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Timeline */}
                      <div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">Assignment Timeline</h3>
                          
                          {selectedLCRecord.usersTimeline && selectedLCRecord.usersTimeline.length > 0 ? (
                            <div className="relative">
                              {/* Timeline connector */}
                              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                              
                              <div className="space-y-6">
                                {selectedLCRecord.usersTimeline.map((entry, index) => {
                                  const user = users.find(u => u.id === entry.user_id);
                                  const userName = entry.full_name || (user ? user.name : `User ID: ${entry.user_id}`);
                                  const formattedDate = entry.assign_at ? formatDateTime(entry.assign_at) : 'Unknown date';
                                  
                                  return (
                                    <div key={index} className="relative">
                                      {/* Timeline dot */}
                                      <div className={`absolute left-3 mt-1.5 w-5 h-5 rounded-full border-2 border-white ${entry.status === 'assign' ? 'bg-green-500' : 'bg-red-500'} z-10`}></div>
                                      
                                      <div className="ml-12">
                                        <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.status === 'assign' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} mb-1`}>
                                          {entry.status === 'assign' ? 'Assigned' : 'Removed'}
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-900">{userName}</h4>
                                        <p className="text-xs text-gray-500">{formattedDate}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <UserCircleIcon className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                              No assignment history available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right Column - Document Cards */}
                      <div>
                        {/* MT707 Documents */}
                        {selectedLCRecord.mt707Documents && selectedLCRecord.mt707Documents.length > 0 && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
                            <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">MT707 Documents</h3>
                            <div className="grid grid-cols-1 gap-3">
                              {selectedLCRecord.mt707Documents.map(doc => (
                                <div key={doc.id} className="bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="text-sm font-medium text-blue-800">{doc.name}</h4>
                                      <p className="text-xs text-gray-600">Date: {doc.date}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleDownloadDocument('mt707', doc, selectedLC)}
                                      className="bg-white"
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      
                        {/* MT799 Documents */}
                        {selectedLCRecord.mt799Documents && selectedLCRecord.mt799Documents.length > 0 && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
                            <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">MT799 Documents</h3>
                            <div className="grid grid-cols-1 gap-3">
                              {selectedLCRecord.mt799Documents.map(doc => (
                                <div key={doc.id} className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="text-sm font-medium text-indigo-800">{doc.name}</h4>
                                      <p className="text-xs text-gray-600">Date: {doc.date}</p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleDownloadDocument('mt799', doc, selectedLC)}
                                      className="bg-white"
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Support Documents - Full Width Section */}
                    {selectedLCRecord.supportDocuments && selectedLCRecord.supportDocuments.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mt-6">
                        <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">Supporting Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedLCRecord.supportDocuments.map(doc => (
                            <div key={doc.id || doc.uuid} className="bg-purple-50 p-3 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                              <div className="flex flex-col h-full">
                                <div className="flex-grow">
                                  <div className="flex items-start">
                                    <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                                    <h4 className="text-sm font-medium text-purple-800 line-clamp-2">{doc.name}</h4>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">Date: {doc.date}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  className="mt-3 w-full bg-white"
                                  onClick={() => handleDownloadDocument('support', doc, selectedLC)}
                                >
                                  View Document
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default LCTimelinePage;