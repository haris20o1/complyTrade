// // File: src/pages/admin/UploadedLCPage.jsx
// import React, { useState } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import DataTable from '../../components/tables/DataTable';
// import UserDropdown from '../../components/forms/UserDropdown';
// import Button from '../../components/buttons/Button';
// import FilterDropdown from '../../components/filters/FilterDropdown';
// import { DocumentMagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// const UploadedLCPage = () => {
//   // Sample data with an additional assignedTo field
//   const [uploadedLCs, setUploadedLCs] = useState([
//     {
//       id: 1,
//       lcNumber: 'LC-2023-001',
//       documentStatus: 'uploaded',
//       swiftFileName: 'SWIFT_MSG_001.txt',
//       uploadedBy: 'swift_user1',
//       uploadDate: '2023-03-10',
//       supportingDocs: ['Invoice_001.pdf', 'Packing_List_001.pdf'],
//       status: 'Pending Assignment',
//       assignedTo: null
//     },
//     {
//       id: 2,
//       documentStatus: 'uploaded',
//       lcNumber: 'LC-2023-002',
//       swiftFileName: 'SWIFT_MSG_002.txt',
//       uploadedBy: 'swift_user1',
//       uploadDate: '2023-03-11',
//       supportingDocs: ['Invoice_002.pdf', 'Packing_List_002.pdf', 'Certificate_Origin_002.pdf'],
//       status: 'Pending Assignment',
//       assignedTo: null
//     },
//     {
//       id: 3,
//       lcNumber: 'LC-2023-003',
//       documentStatus: 'mismatch',
//       swiftFileName: 'SWIFT_MSG_003.txt',
//       uploadedBy: 'swift_user2',
//       uploadDate: '2023-03-12',
//       supportingDocs: ['Invoice_003.pdf'],
//       status: 'Pending Assignment',
//       assignedTo: null
//     },
//     {
//       id: 4,
//       lcNumber: 'LC-2023-004',
//       documentStatus: 'mismatch',
//       swiftFileName: 'SWIFT_MSG_003.txt',
//       uploadedBy: 'swift_user2',
//       uploadDate: '2023-03-12',
//       supportingDocs: ['Invoice_003.pdf','Packing_List_002.pdf'],
//       status: 'Pending Assignment',
//       assignedTo: null
//     },
//     {
//       id: 5,
//       lcNumber: 'LC-2023-005',
//       documentStatus: 'not uploaded',
//       swiftFileName: 'SWIFT_MSG_003.txt',
//       uploadedBy: 'swift_user2',
//       uploadDate: '2023-03-12',
//       supportingDocs: ['Invoice_003.pdf','Packing_List_002.pdf','Packing_List_002.pdf','Packing_List_002.pdf'],
//       status: 'Pending Assignment',
//       assignedTo: null
//     }
//   ]);

//   // Sample users for dropdown
//   const users = [
//     { id: 1, name: 'Haris Ahmad', role: 'user' },
//     { id: 2, name: 'Ahmad Romman', role: 'user' },
//     { id: 3, name: 'Zoraiz', role: 'user' },
//     { id: 4, name: 'Wasie', role: 'user' }
//   ];

//   // State to track selected users for each LC
//   const [selectedUsers, setSelectedUsers] = useState({});
  
//   // State to track filters
//   const [tableFilters, setTableFilters] = useState({});

//   // Filter configuration
//   const filterOptions = [
//     {
//       key: 'documentStatus',
//       label: 'Document Status',
//       type: 'select',
//       options: [
//         { value: 'uploaded', label: 'Uploaded' },
//         { value: 'mismatch', label: 'Mismatch' },
//         { value: 'not uploaded', label: 'Not Uploaded' }
//       ]
//     },
//     {
//       key: 'uploadDate',
//       label: 'Upload Date',
//       type: 'date'
//     },
//     {
//       key: 'assignedTo',
//       label: 'Assigned To',
//       type: 'select',
//       options: [
//         ...users.map(user => ({ value: user.name, label: user.name })),
//         { value: 'unassigned', label: 'Unassigned' }
//       ]
//     }
//   ];

//   // Handle user selection for a specific LC
//   const handleUserSelect = (lcId, user) => {
//     setSelectedUsers({
//       ...selectedUsers,
//       [lcId]: user
//     });
//   };

//   // Handle assigning an LC to a user
//   const handleAssign = (lcId) => {
//     // Update the LC status and assignedTo instead of removing it
//     setUploadedLCs(uploadedLCs.map(lc => {
//       if (lc.id === lcId) {
//         return {
//           ...lc,
//           status: 'Assigned',
//           assignedTo: selectedUsers[lcId]
//         };
//       }
//       return lc;
//     }));
    
//     // In a real app, you would make an API call here to update the backend
//     console.log(`Assigned LC ${lcId} to user ${selectedUsers[lcId]?.name}`);
//   };

//   // Handle reassigning an LC
//   const handleReassign = (lcId) => {
//     // Update the UI to show LC is up for reassignment
//     setUploadedLCs(uploadedLCs.map(lc => {
//       if (lc.id === lcId) {
//         return {
//           ...lc,
//           status: 'Pending Reassignment',
//           // Keep the assignedTo value so we know who it was previously assigned to
//         };
//       }
//       return lc;
//     }));
    
//     // Clear the selected user for this LC to force selecting a new one
//     const updatedSelectedUsers = { ...selectedUsers };
//     delete updatedSelectedUsers[lcId];
//     setSelectedUsers(updatedSelectedUsers);
    
//     console.log(`Preparing to reassign LC ${lcId}`);
//   };

//   // Handle confirming a reassignment
//   const handleConfirmReassign = (lcId) => {
//     // Update the LC with the new assignment
//     setUploadedLCs(uploadedLCs.map(lc => {
//       if (lc.id === lcId) {
//         return {
//           ...lc,
//           status: 'Assigned',
//           assignedTo: selectedUsers[lcId]
//         };
//       }
//       return lc;
//     }));
    
//     console.log(`Reassigned LC ${lcId} to user ${selectedUsers[lcId]?.name}`);
//   };

//   // Handle viewing LC details
//   const handleViewDetails = (lc) => {
//     console.log('View details for LC:', lc);
//     // In a real app, you would navigate to a details page or open a modal
//   };

//   // Handle filter application
//   const handleApplyFilters = (filters) => {
//     // Handle special case for 'unassigned'
//     const processedFilters = { ...filters };
//     if (processedFilters.assignedTo === 'unassigned') {
//       delete processedFilters.assignedTo;
//       processedFilters.unassigned = true;
//     }
    
//     setTableFilters(processedFilters);
//   };

//   // Handle clearing filters
//   const handleClearFilters = () => {
//     setTableFilters({});
//   };

//   // Table columns configuration
//   const columns = [
//     {
//       key: 'lcNumber',
//       header: 'LC Number',
//       render: (row) => (
//         <div className="font-medium text-gray-900">{row.lcNumber}</div>
//       )
//     },
//     {
//       key: 'documentStatus',
//       header: 'Document Status',
//       render: (row) => {
//         const status = row.documentStatus?.toLowerCase().trim();
//         let textColor = 'text-yellow-500'; // default: yellow for "mismatch" or anything else
    
//         if (status === 'uploaded') {
//           textColor = 'text-green-500';
//         } else if (status === 'not uploaded') {
//           textColor = 'text-red-500';
//         }
    
//         return (
//           <div className={`text-sm ${textColor}`}>
//             {row.documentStatus}
//           </div>
//         );
//       }
//     },
   
//     {
//       key: 'supportingDocs',
//       header: 'Supporting Documents',
//       render: (row) => (
//         <div className="text-sm">
//           <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//             {row.supportingDocs.length} documents
//           </span>
//         </div>
//       )
//     },
//     {
//       key: 'uploadDate',
//       header: 'Upload Date',
//       render: (row) => (
//         <div className="text-sm text-gray-500">{row.uploadDate}</div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className={`text-sm ${row.status === 'Assigned' ? 'text-green-600' : 'text-blue-600'}`}>
//           {row.status}
//           {row.assignedTo && row.status === 'Assigned' && (
//             <div className="text-xs text-gray-500 mt-1">
//               Assigned to: {row.assignedTo.name}
//             </div>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'userAssignment',
//       header: 'Assign To',
//       render: (row) => (
//         row.status === 'Assigned' ? (
//           <div className="text-sm text-gray-500">
//             Already assigned to {row.assignedTo.name}
//           </div>
//         ) : (
//           <UserDropdown 
//             users={users} 
//             onSelect={(user) => handleUserSelect(row.id, user)}
//             placeholder="Select user"
//           />
//         )
//       )
//     }
//   ];

//   // Define action column for table
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       {row.status === 'Assigned' ? (
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => handleReassign(row.id)}
//         >
//           Reassign
//         </Button>
//       ) : row.status === 'Pending Reassignment' ? (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleConfirmReassign(row.id)}
//           disabled={!selectedUsers[row.id]}
//         >
//           Confirm Reassign
//         </Button>
//       ) : (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleAssign(row.id)}
//           disabled={!selectedUsers[row.id]}
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
//         View
//       </Button>
//     </div>
//   );

//   // Filter data based on tableFilters
//   const filteredData = uploadedLCs.filter(lc => {
//     // Check document status filter
//     if (tableFilters.documentStatus && lc.documentStatus !== tableFilters.documentStatus) {
//       return false;
//     }
    
//     // Check date range filter
//     if (tableFilters.uploadDateFrom) {
//       const uploadDate = new Date(lc.uploadDate);
//       const fromDate = new Date(tableFilters.uploadDateFrom);
//       if (uploadDate < fromDate) return false;
//     }
    
//     if (tableFilters.uploadDateTo) {
//       const uploadDate = new Date(lc.uploadDate);
//       const toDate = new Date(tableFilters.uploadDateTo);
//       toDate.setHours(23, 59, 59); // Include the entire day
//       if (uploadDate > toDate) return false;
//     }
    
//     // Check assigned user filter
//     if (tableFilters.assignedTo && (!lc.assignedTo || lc.assignedTo.name !== tableFilters.assignedTo)) {
//       return false;
//     }
    
//     // Special case: unassigned filter
//     if (tableFilters.unassigned && lc.assignedTo) {
//       return false;
//     }
    
//     return true;
//   });

//   // Count of pending assignments
//   const pendingCount = filteredData.filter(lc => 
//     lc.status === 'Pending Assignment' || lc.status === 'Pending Reassignment'
//   ).length;

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Uploaded Letters of Credit</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage and assign uploaded LC documents to users for processing.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {pendingCount} {pendingCount === 1 ? 'document' : 'documents'} waiting for assignment
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm" icon={ArrowDownTrayIcon}>
//               Export
//             </Button>
//             <FilterDropdown 
//               filters={filterOptions}
//               onApply={handleApplyFilters}
//               onClear={handleClearFilters}
//             />
//           </div>
//         </div>
        
//         <DataTable 
//           columns={columns} 
//           data={filteredData} 
//           actionColumn={actionColumn}
//         />
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default UploadedLCPage;

// // File: src/pages/admin/UploadedLCPage.jsx
// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import DataTable from '../../components/tables/DataTable';
// import UserDropdown from '../../components/forms/UserDropdown';
// import Button from '../../components/buttons/Button';
// import FilterDropdown from '../../components/filters/FilterDropdown';
// import { DocumentMagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import { lcService } from '../authentication/apiAdmin';

// const UploadedLCPage = () => {
//   const [uploadedLCs, setUploadedLCs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userLoading, setUserLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloading, setDownloading] = useState(false);

//   // State to track selected users for each LC
//   const [selectedUsers, setSelectedUsers] = useState({});
  
//   // State to track filters
//   const [tableFilters, setTableFilters] = useState({});

//   // Fetch users from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setUserLoading(true);
//         const data = await lcService.getComplyceManagers();
        
//         // Transform API response to match our component's expected structure
//         const transformedUsers = data.map(user => ({
//           id: user.id,
//           name: user.username,
//           role: 'user'
//         }));
        
//         setUsers(transformedUsers);
//       } catch (err) {
//         console.error('Failed to fetch users:', err);
//         // Set default users in case of API failure
//         setUsers([
//           { id: 2, name: 'ali', role: 'user' },
//           { id: 44, name: 'noor', role: 'user' },
//           { id: 45, name: 'fazal', role: 'user' }
//         ]);
//       } finally {
//         setUserLoading(false);
//       }
//     };
    
//     fetchUsers();
//   }, []);

//   // Fetch LC data from API
//   useEffect(() => {
//     const fetchLCs = async () => {
//       try {
//         setLoading(true);
//         const data = await lcService.getAllLCs();
        
//         // Transform API data to match our component's expected structure
//         const transformedData = data.map((lc, index) => ({
//           id: index + 1,
//           lcNumber: lc.lc_no,
//           documentStatus: getDocumentStatus(lc.doc_count, lc.mismatch_status),
//           uploadedBy: `User ${lc.user_id}`,
//           uploadDate: lc.upload_date || 'Not Uploaded',
//           supportingDocs: new Array(lc.doc_count || 0).fill('document'),
//           status: 'Pending Assignment',
//           assignedTo: null,
//           // Keep original data for reference, including any doc_url property
//           rawData: lc
//         }));
        
//         setUploadedLCs(transformedData);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch LCs:', err);
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchLCs();
//   }, []);
  

  

//   // Helper function to determine document status
//   const getDocumentStatus = (docCount, isMismatch) => {
//     if (docCount === 0) return 'not uploaded';
//     if (isMismatch) return 'mismatch';
//     return 'uploaded';
//   };

//   // Handle downloading LC document
//   const handleOpenLCDocument = async (lcNumber) => {
//     try {
//       setDownloading(true);
      
//       // Get the document URL from the API
//       const response = await lcService.downloadLCDocument(lcNumber);
      
//       if (!response || !response.url) {
//         console.warn('No document URL returned from API');
//         alert('Document not available');
//         setDownloading(false);
//         return;
//       }
      
//       // Open the PDF in a new tab
//       window.open(response.url, '_blank');
//       console.log(`Opened document for ${lcNumber} in new tab`);
//     } catch (err) {
//       console.error(`Failed to open document for ${lcNumber}:`, err);
//       alert('Failed to open document. Please try again later.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // Filter configuration
//   const filterOptions = [
//     {
//       key: 'documentStatus',
//       label: 'Document Status',
//       type: 'select',
//       options: [
//         { value: 'uploaded', label: 'Uploaded' },
//         { value: 'mismatch', label: 'Mismatch' },
//         { value: 'not uploaded', label: 'Not Uploaded' }
//       ]
//     },
//     {
//       key: 'uploadDate',
//       label: 'Upload Date',
//       type: 'date'
//     },
//     {
//       key: 'assignedTo',
//       label: 'Assigned To',
//       type: 'select',
//       options: [
//         ...users.map(user => ({ value: user.name, label: user.name })),
//         { value: 'unassigned', label: 'Unassigned' }
//       ]
//     }
//   ];

//   // Handle user selection for a specific LC
//   const handleUserSelect = (lcId, user) => {
//     setSelectedUsers({
//       ...selectedUsers,
//       [lcId]: user
//     });
//   };

//   // Handle assigning an LC to a user
//   const handleAssign = async (lcId) => {
//     try {
//       const lc = uploadedLCs.find(lc => lc.id === lcId);
//       const user = selectedUsers[lcId];
      
//       if (!lc || !user) return;
      
//       // Call API to assign LC
//       await lcService.assignLC(lc.lcNumber, user.id);
      
//       // Update local state to reflect assignment
//       setUploadedLCs(uploadedLCs.map(item => {
//         if (item.id === lcId) {
//           return {
//             ...item,
//             status: 'Assigned',
//             assignedTo: user
//           };
//         }
//         return item;
//       }));
      
//       console.log(`Assigned LC ${lc.lcNumber} to user ${user.name}`);
//     } catch (err) {
//       console.error('Failed to assign LC:', err);
//       // Show error notification or handle error appropriately
//       alert('Failed to assign LC. Please try again.');
//     }
//   };

//   // Handle reassigning an LC
//   const handleReassign = (lcId) => {
//     // Update the UI to show LC is up for reassignment
//     setUploadedLCs(uploadedLCs.map(lc => {
//       if (lc.id === lcId) {
//         return {
//           ...lc,
//           status: 'Pending Reassignment',
//           // Keep the assignedTo value so we know who it was previously assigned to
//         };
//       }
//       return lc;
//     }));
    
//     // Clear the selected user for this LC to force selecting a new one
//     const updatedSelectedUsers = { ...selectedUsers };
//     delete updatedSelectedUsers[lcId];
//     setSelectedUsers(updatedSelectedUsers);
    
//     console.log(`Preparing to reassign LC ${lcId}`);
//   };

//   // Handle confirming a reassignment
//   const handleConfirmReassign = async (lcId) => {
//     try {
//       const lc = uploadedLCs.find(lc => lc.id === lcId);
//       const user = selectedUsers[lcId];
      
//       if (!lc || !user) return;
      
//       // Call API to reassign LC
//       await lcService.assignLC(lc.lcNumber, user.id);
      
//       // Update local state to reflect reassignment
//       setUploadedLCs(uploadedLCs.map(item => {
//         if (item.id === lcId) {
//           return {
//             ...item,
//             status: 'Assigned',
//             assignedTo: user
//           };
//         }
//         return item;
//       }));
      
//       console.log(`Reassigned LC ${lc.lcNumber} to user ${user.name}`);
//     } catch (err) {
//       console.error('Failed to reassign LC:', err);
//       // Show error notification or handle error appropriately
//       alert('Failed to reassign LC. Please try again.');
//     }
//   };

//   // Handle viewing LC details
//   const handleViewDetails = async (lc) => {
//     try {
//       // Fetch detailed information for this LC
//       const details = await lcService.getLCDetails(lc.lcNumber);
//       console.log('LC Details:', details);
      
//       // In a real app, you would navigate to a details page or open a modal
//       // For now, just log the details
//     } catch (err) {
//       console.error(`Failed to fetch details for LC ${lc.lcNumber}:`, err);
//       // Show error notification or handle error appropriately
//       alert('Failed to load LC details. Please try again.');
//     }
//   };

//   // Handle filter application
//   const handleApplyFilters = (filters) => {
//     // Handle special case for 'unassigned'
//     const processedFilters = { ...filters };
//     if (processedFilters.assignedTo === 'unassigned') {
//       delete processedFilters.assignedTo;
//       processedFilters.unassigned = true;
//     }
    
//     setTableFilters(processedFilters);
//   };

//   // Handle clearing filters
//   const handleClearFilters = () => {
//     setTableFilters({});
//   };

//   // Table columns configuration
//   const columns = [
//   {
//     key: 'lcNumber',
//     header: 'LC Number',
//     render: (row) => (
//       <div className="font-medium text-gray-900">
//         {row.documentStatus === 'uploaded' || row.documentStatus === 'mismatch' ? (
//           <button 
//             className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
//             onClick={() => handleOpenLCDocument(row.lcNumber)}
//             disabled={downloading}
//           >
//             {row.lcNumber}
//           </button>
//         ) : (
//           // If no documents available, just show as text
//           <span>{row.lcNumber}</span>
//         )}
//       </div>
//     )
//   },
//     {
//       key: 'documentStatus',
//       header: 'Document Status',
//       render: (row) => {
//         const status = row.documentStatus?.toLowerCase().trim();
//         let textColor = 'text-yellow-500'; // default: yellow for "mismatch"
    
//         if (status === 'uploaded') {
//           textColor = 'text-green-500';
//         } else if (status === 'not uploaded') {
//           textColor = 'text-red-500';
//         }
    
//         return (
//           <div className={`text-sm ${textColor}`}>
//             {row.documentStatus}
//           </div>
//         );
//       }
//     },
   
//     {
//       key: 'supportingDocs',
//       header: 'Supporting Documents',
//       render: (row) => (
//         <div className="text-sm">
//           {row.supportingDocs.length > 0 ? (
//             <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//               {row.supportingDocs.length} documents
//             </span>
//           ) : (
//             <span className="text-gray-400">No documents</span>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'uploadDate',
//       header: 'Upload Date',
//       render: (row) => (
//         <div className="text-sm text-gray-500">
//           {row.uploadDate !== 'Not Uploaded' ? row.uploadDate : 
//             <span className="text-gray-400">Not uploaded</span>}
//         </div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className={`text-sm ${row.status === 'Assigned' ? 'text-green-600' : 'text-blue-600'}`}>
//           {row.status}
//           {row.assignedTo && row.status === 'Assigned' && (
//             <div className="text-xs text-gray-500 mt-1">
//               Assigned to: {row.assignedTo.name}
//             </div>
//           )}
//         </div>
//       )
//     },
//     {
//       key: 'userAssignment',
//       header: 'Assign To',
//       render: (row) => {
//         // Hide assignment UI for documents that are not uploaded
//         if (row.documentStatus === 'not uploaded') {
//           return <div className="text-sm text-gray-400">Not available</div>;
//         }
        
//         // Show assignment UI for documents that are uploaded or have a mismatch
//         return row.status === 'Assigned' ? (
//           <div className="text-sm text-gray-500">
//             Already assigned to {row.assignedTo.name}
//           </div>
//         ) : (
//           <UserDropdown 
//             users={users} 
//             onSelect={(user) => handleUserSelect(row.id, user)}
//             placeholder="Select user"
//             isLoading={userLoading}
//           />
//         );
//       }
//     }
//   ];
  
//   // Define action column for table
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       {row.status === 'Assigned' ? (
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={() => handleReassign(row.id)}
//         >
//           Reassign
//         </Button>
//       ) : row.status === 'Pending Reassignment' ? (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleConfirmReassign(row.id)}
//           disabled={!selectedUsers[row.id]}
//         >
//           Confirm Reassign
//         </Button>
//       ) : (
//         <Button 
//           variant="primary" 
//           size="sm" 
//           onClick={() => handleAssign(row.id)}
//           disabled={!selectedUsers[row.id]}
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
//         View
//       </Button>
//     </div>
//   );

//   // Filter data based on tableFilters
//   const filteredData = uploadedLCs.filter(lc => {
//     // Check document status filter
//     if (tableFilters.documentStatus && lc.documentStatus !== tableFilters.documentStatus) {
//       return false;
//     }
    
//     // Check date range filter
//     if (tableFilters.uploadDateFrom && lc.uploadDate !== 'Not Uploaded') {
//       const uploadDate = new Date(lc.uploadDate);
//       const fromDate = new Date(tableFilters.uploadDateFrom);
//       if (uploadDate < fromDate) return false;
//     }
    
//     if (tableFilters.uploadDateTo && lc.uploadDate !== 'Not Uploaded') {
//       const uploadDate = new Date(lc.uploadDate);
//       const toDate = new Date(tableFilters.uploadDateTo);
//       toDate.setHours(23, 59, 59); // Include the entire day
//       if (uploadDate > toDate) return false;
//     }
    
//     // Check assigned user filter
//     if (tableFilters.assignedTo && (!lc.assignedTo || lc.assignedTo.name !== tableFilters.assignedTo)) {
//       return false;
//     }
    
//     // Special case: unassigned filter
//     if (tableFilters.unassigned && lc.assignedTo) {
//       return false;
//     }
    
//     return true;
//   });

//   // Count of pending assignments
//   const pendingCount = filteredData.filter(lc => 
//     lc.status === 'Pending Assignment' || lc.status === 'Pending Reassignment'
//   ).length;

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Uploaded Letters of Credit</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage and assign uploaded LC documents to users for processing.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {pendingCount} {pendingCount === 1 ? 'document' : 'documents'} waiting for assignment
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm" icon={ArrowDownTrayIcon}>
//               Export
//             </Button>
//             <FilterDropdown 
//               filters={filterOptions}
//               onApply={handleApplyFilters}
//               onClear={handleClearFilters}
//             />
//           </div>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center p-8">
//             <div className="text-gray-500">Loading data...</div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 p-4 text-center">{error}</div>
//         ) : (
//           <DataTable 
//             columns={columns} 
//             data={filteredData} 
//             actionColumn={actionColumn}
//           />
//         )}
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default UploadedLCPage;


// File: src/pages/admin/UploadedLCPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import DataTable from '../../components/tables/DataTable';
import UserDropdown from '../../components/forms/UserDropdown';
import Button from '../../components/buttons/Button';
import FilterDropdown from '../../components/filters/FilterDropdown';
import { DocumentMagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { lcService } from '../authentication/apiAdmin';

const UploadedLCPage = () => {
  const [uploadedLCs, setUploadedLCs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // State to track selected users for each LC
  const [selectedUsers, setSelectedUsers] = useState({});
  
  // State to track filters
  const [tableFilters, setTableFilters] = useState({});

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUserLoading(true);
        const data = await lcService.getComplyceManagers();
        
        // Transform API response to match our component's expected structure
        const transformedUsers = data.map(user => ({
          id: user.id,
          name: user.username,
          role: 'user'
        }));
        
        setUsers(transformedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        // Set default users in case of API failure
        setUsers([
          { id: 2, name: 'ali', role: 'user' },
          { id: 44, name: 'noor', role: 'user' },
          { id: 45, name: 'fazal', role: 'user' }
        ]);
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Fetch LC data from API
  useEffect(() => {
    const fetchLCs = async () => {
      try {
        setLoading(true);
        const data = await lcService.getAllLCs();
        
        // Transform API data to match our component's expected structure
        const transformedData = data.map((lc, index) => {
          // Check if the LC has an assigned user
          const isAssigned = lc.user_id !== null && lc.user !== null;
          let assignedUser = null;
          
          if (isAssigned) {
            assignedUser = {
              id: lc.user_id,
              name: lc.user.fullname,
              role: 'user'
            };
          }
          
          return {
            id: index + 1,
            lcNumber: lc.lc_no,
            documentStatus: getDocumentStatus(lc.doc_count, lc.mismatch_status),
            uploadedBy: lc.user_id ? `User ${lc.user_id}` : 'Not assigned',
            uploadDate: lc.upload_date || 'Not Uploaded',
            supportingDocs: new Array(lc.doc_count || 0).fill('document'),
            // Change status based on assignment
            status: isAssigned ? 'Assigned' : 'Pending Assignment',
            assignedTo: assignedUser,
            // Keep original data for reference
            rawData: lc
          };
        });
        
        setUploadedLCs(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch LCs:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLCs();
  }, []);
  

  // Helper function to determine document status
  const getDocumentStatus = (docCount, isMismatch) => {
    if (docCount === 0) return 'not uploaded';
    if (isMismatch) return 'mismatch';
    return 'uploaded';
  };

  // Handle downloading LC document
  const handleOpenLCDocument = async (lcNumber) => {
    try {
      setDownloading(true);
      
      // Get the document URL from the API
      const response = await lcService.downloadLCDocument(lcNumber);
      
      if (!response || !response.url) {
        console.warn('No document URL returned from API');
        alert('Document not available');
        setDownloading(false);
        return;
      }
      
      // Open the PDF in a new tab
      window.open(response.url, '_blank');
      console.log(`Opened document for ${lcNumber} in new tab`);
    } catch (err) {
      console.error(`Failed to open document for ${lcNumber}:`, err);
      alert('Failed to open document. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };
  
  // Filter configuration
  const filterOptions = [
    {
      key: 'documentStatus',
      label: 'Document Status',
      type: 'select',
      options: [
        { value: 'uploaded', label: 'Uploaded' },
        { value: 'mismatch', label: 'Mismatch' },
        { value: 'not uploaded', label: 'Not Uploaded' }
      ]
    },
    {
      key: 'uploadDate',
      label: 'Upload Date',
      type: 'date'
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select',
      options: [
        ...users.map(user => ({ value: user.name, label: user.name })),
        { value: 'unassigned', label: 'Unassigned' }
      ]
    }
  ];

  // Handle user selection for a specific LC
  const handleUserSelect = (lcId, user) => {
    setSelectedUsers({
      ...selectedUsers,
      [lcId]: user
    });
  };

  // Handle assigning an LC to a user
  const handleAssign = async (lcId) => {
    try {
      const lc = uploadedLCs.find(lc => lc.id === lcId);
      const user = selectedUsers[lcId];
      
      if (!lc || !user) return;
      
      // Call API to assign LC
      await lcService.assignLC(lc.lcNumber, user.id);
      
      // Update local state to reflect assignment
      setUploadedLCs(uploadedLCs.map(item => {
        if (item.id === lcId) {
          return {
            ...item,
            status: 'Assigned',
            assignedTo: user
          };
        }
        return item;
      }));
      
      console.log(`Assigned LC ${lc.lcNumber} to user ${user.name}`);
      
      // Refresh data after assignment to ensure consistency
      refreshData();
    } catch (err) {
      console.error('Failed to assign LC:', err);
      // Show error notification or handle error appropriately
      alert('Failed to assign LC. Please try again.');
    }
  };

  // Handle reassigning an LC
  const handleReassign = (lcId) => {
    // Update the UI to show LC is up for reassignment
    setUploadedLCs(uploadedLCs.map(lc => {
      if (lc.id === lcId) {
        return {
          ...lc,
          status: 'Pending Reassignment',
          // Keep the assignedTo value so we know who it was previously assigned to
        };
      }
      return lc;
    }));
    
    // Clear the selected user for this LC to force selecting a new one
    const updatedSelectedUsers = { ...selectedUsers };
    delete updatedSelectedUsers[lcId];
    setSelectedUsers(updatedSelectedUsers);
    
    console.log(`Preparing to reassign LC ${lcId}`);
  };

  // Handle confirming a reassignment
  const handleConfirmReassign = async (lcId) => {
    try {
      const lc = uploadedLCs.find(lc => lc.id === lcId);
      const user = selectedUsers[lcId];
      
      if (!lc || !user) return;
      
      // Call API to reassign LC
      await lcService.assignLC(lc.lcNumber, user.id);
      
      // Update local state to reflect reassignment
      setUploadedLCs(uploadedLCs.map(item => {
        if (item.id === lcId) {
          return {
            ...item,
            status: 'Assigned',
            assignedTo: user
          };
        }
        return item;
      }));
      
      console.log(`Reassigned LC ${lc.lcNumber} to user ${user.name}`);
      
      // Refresh data after reassignment to ensure consistency
      refreshData();
    } catch (err) {
      console.error('Failed to reassign LC:', err);
      // Show error notification or handle error appropriately
      alert('Failed to reassign LC. Please try again.');
    }
  };

  // Function to refresh data from API
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await lcService.getAllLCs();
      
      // Transform API data to match our component's expected structure
      const transformedData = data.map((lc, index) => {
        // Check if the LC has an assigned user
        const isAssigned = lc.user_id !== null && lc.user !== null;
        let assignedUser = null;
        
        if (isAssigned) {
          assignedUser = {
            id: lc.user_id,
            name: lc.user.fullname,
            role: 'user'
          };
        }
        
        return {
          id: index + 1,
          lcNumber: lc.lc_no,
          documentStatus: getDocumentStatus(lc.doc_count, lc.mismatch_status),
          uploadedBy: lc.user_id ? `User ${lc.user_id}` : 'Not assigned',
          uploadDate: lc.upload_date || 'Not Uploaded',
          supportingDocs: new Array(lc.doc_count || 0).fill('document'),
          // Change status based on assignment
          status: isAssigned ? 'Assigned' : 'Pending Assignment',
          assignedTo: assignedUser,
          // Keep original data for reference
          rawData: lc
        };
      });
      
      setUploadedLCs(transformedData);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh LCs:', err);
      setError('Failed to reload data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing LC details
  const handleViewDetails = async (lc) => {
    try {
      // Fetch detailed information for this LC
      const details = await lcService.getLCDetails(lc.lcNumber);
      console.log('LC Details:', details);
      
      // In a real app, you would navigate to a details page or open a modal
      // For now, just log the details
    } catch (err) {
      console.error(`Failed to fetch details for LC ${lc.lcNumber}:`, err);
      // Show error notification or handle error appropriately
      alert('Failed to load LC details. Please try again.');
    }
  };

  // Handle filter application
  const handleApplyFilters = (filters) => {
    // Handle special case for 'unassigned'
    const processedFilters = { ...filters };
    if (processedFilters.assignedTo === 'unassigned') {
      delete processedFilters.assignedTo;
      processedFilters.unassigned = true;
    }
    
    setTableFilters(processedFilters);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setTableFilters({});
  };

  // Table columns configuration
  const columns = [
  {
    key: 'lcNumber',
    header: 'LC Number',
    render: (row) => (
      <div className="font-medium text-gray-900">
        {/* Make all LC numbers clickable regardless of document status */}
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
          onClick={() => handleOpenLCDocument(row.lcNumber)}
          disabled={downloading}
        >
          {row.lcNumber}
        </button>
      </div>
    )
  },
    {
      key: 'documentStatus',
      header: 'Document Status',
      render: (row) => {
        const status = row.documentStatus?.toLowerCase().trim();
        let textColor = 'text-yellow-500'; // default: yellow for "mismatch"
    
        if (status === 'uploaded') {
          textColor = 'text-green-500';
        } else if (status === 'not uploaded') {
          textColor = 'text-red-500';
        }
    
        return (
          <div className={`text-sm ${textColor}`}>
            {row.documentStatus}
          </div>
        );
      }
    },
   
    {
      key: 'supportingDocs',
      header: 'Supporting Documents',
      render: (row) => (
        <div className="text-sm">
          {row.supportingDocs.length > 0 ? (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {row.supportingDocs.length} documents
            </span>
          ) : (
            <span className="text-gray-400">No documents</span>
          )}
        </div>
      )
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      render: (row) => (
        <div className="text-sm text-gray-500">
          {row.uploadDate !== 'Not Uploaded' ? row.uploadDate : 
            <span className="text-gray-400">Not uploaded</span>}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className={`text-sm ${row.status === 'Assigned' ? 'text-green-600' : 'text-blue-600'}`}>
          {row.status}
          {row.assignedTo && row.status === 'Assigned' && (
            <div className="text-xs text-gray-500 mt-1">
              Assigned to: {row.assignedTo.name}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'userAssignment',
      header: 'Assign To',
      render: (row) => {
        // Don't allow assignment if document is not uploaded
        if (row.documentStatus === 'not uploaded') {
          return (
            <div className="text-sm text-gray-500">
              Upload document first
            </div>
          );
        }
        
        // Handle regular assignment flow for uploaded documents
        return row.status === 'Assigned' ? (
          <div className="text-sm text-gray-500">
            Already assigned to {row.assignedTo.name}
          </div>
        ) : (
          <UserDropdown 
            users={users} 
            onSelect={(user) => handleUserSelect(row.id, user)}
            placeholder="Select user"
            isLoading={userLoading}
          />
        );
      }
    }
  ];
  
  // Define action column for table
  const actionColumn = (row) => (
    <div className="flex space-x-2">
      {/* Don't show assignment buttons for documents that are not uploaded */}
      {row.documentStatus === 'not uploaded' ? (
        <Button 
          variant="outline" 
          size="sm" 
          icon={DocumentMagnifyingGlassIcon}
          onClick={() => handleViewDetails(row)}
        >
          View
        </Button>
      ) : row.status === 'Assigned' ? (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleReassign(row.id)}
          >
            Reassign
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={DocumentMagnifyingGlassIcon}
            onClick={() => handleViewDetails(row)}
          >
            View
          </Button>
        </>
      ) : row.status === 'Pending Reassignment' ? (
        <>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleConfirmReassign(row.id)}
            disabled={!selectedUsers[row.id]}
          >
            Confirm Reassign
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={DocumentMagnifyingGlassIcon}
            onClick={() => handleViewDetails(row)}
          >
            View
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleAssign(row.id)}
            disabled={!selectedUsers[row.id]}
          >
            Assign
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={DocumentMagnifyingGlassIcon}
            onClick={() => handleViewDetails(row)}
          >
            View
          </Button>
        </>
      )}
    </div>
  );

  // Filter data based on tableFilters
  const filteredData = uploadedLCs.filter(lc => {
    // Check document status filter
    if (tableFilters.documentStatus && lc.documentStatus !== tableFilters.documentStatus) {
      return false;
    }
    
    // Check date range filter
    if (tableFilters.uploadDateFrom && lc.uploadDate !== 'Not Uploaded') {
      const uploadDate = new Date(lc.uploadDate);
      const fromDate = new Date(tableFilters.uploadDateFrom);
      if (uploadDate < fromDate) return false;
    }
    
    if (tableFilters.uploadDateTo && lc.uploadDate !== 'Not Uploaded') {
      const uploadDate = new Date(lc.uploadDate);
      const toDate = new Date(tableFilters.uploadDateTo);
      toDate.setHours(23, 59, 59); // Include the entire day
      if (uploadDate > toDate) return false;
    }
    
    // Check assigned user filter
    if (tableFilters.assignedTo && (!lc.assignedTo || lc.assignedTo.name !== tableFilters.assignedTo)) {
      return false;
    }
    
    // Special case: unassigned filter
    if (tableFilters.unassigned && lc.assignedTo) {
      return false;
    }
    
    return true;
  });

  // Count of pending assignments
  const pendingCount = filteredData.filter(lc => 
    lc.status === 'Pending Assignment' || lc.status === 'Pending Reassignment'
  ).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Uploaded Letters of Credit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and assign uploaded LC documents to users for processing.
        </p>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {pendingCount} {pendingCount === 1 ? 'document' : 'documents'} waiting for assignment
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" icon={ArrowDownTrayIcon}>
              Export
            </Button>
            <FilterDropdown 
              filters={filterOptions}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-gray-500">Loading data...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredData} 
            actionColumn={actionColumn}
          />
        )}
      </Card>
    </DashboardLayout>
  );
};

export default UploadedLCPage;