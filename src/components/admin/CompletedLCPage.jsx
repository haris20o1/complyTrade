// // File: src/pages/admin/CompletedLCPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import DataTable from '../../components/tables/DataTable';
// import Button from '../../components/buttons/Button';
// import { EyeIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// const CompletedLCPage = () => {
//   const navigate = useNavigate();

//   // Sample data for completed LCs
//   const [completedLCs, setCompletedLCs] = useState([
//     {
//       id: 7,
//       lcNumber: 'LC-2023-007',
//       swiftFileName: 'SWIFT_MSG_007.txt',
//       assignedTo: 'Huzaifa Doe',
//       completedDate: '2023-03-08',
//       processingTime: '2.5 days',
//       status: 'Completed'
//     },
//     {
//       id: 8,
//       lcNumber: 'LC-2023-008',
//       swiftFileName: 'SWIFT_MSG_008.txt',
//       assignedTo: 'Jane Smith',
//       completedDate: '2023-03-07',
//       processingTime: '1.8 days',
//       status: 'Completed'
//     },
//     {
//       id: 9,
//       lcNumber: 'LC-2023-009',
//       swiftFileName: 'SWIFT_MSG_009.txt',
//       assignedTo: 'Mike Johnson',
//       completedDate: '2023-03-06',
//       processingTime: '3.2 days',
//       status: 'Completed'
//     },
//     {
//       id: 10,
//       lcNumber: 'LC-2023-010',
//       swiftFileName: 'SWIFT_MSG_010.txt',
//       assignedTo: 'Sarah Williams',
//       completedDate: '2023-03-05',
//       processingTime: '2.1 days',
//       status: 'Completed'
//     }
//   ]);

//   // Handle viewing LC details - using path parameter instead of query parameter
//   const handleViewDetails = (lc) => {
//     console.log('View details for LC:', lc);
//     // Use path parameter instead of query parameter
//     navigate(`/discrepencies/${lc.lcNumber}`);
//   };
  

//   // Handle downloading LC documents
//   const handleDownload = (lc) => {
//     console.log('Download documents for LC:', lc);
//     // In a real app, you would initiate a download
//   };

//   // Handle reprocessing an LC
//   const handleReprocess = (lc) => {
//     console.log('Reprocess LC:', lc);
//     // In a real app, you would initiate a reprocessing workflow
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
//       key: 'assignedTo',
//       header: 'Processed By',
//       render: (row) => (
//         <div className="flex items-center">
//           <img
//             src={`https://ui-avatars.com/api/?name=${row.assignedTo.replace(' ', '+')}`}
//             alt={row.assignedTo}
//             className="h-6 w-6 rounded-full mr-2"
//           />
//           <span className="text-sm text-gray-800">{row.assignedTo}</span>
//         </div>
//       )
//     },
//     {
//       key: 'completedDate',
//       header: 'Completed Date',
//       render: (row) => (
//         <div className="text-sm text-gray-500">{row.completedDate}</div>
//       )
//     },
//     {
//       key: 'processingTime',
//       header: 'Processing Time',
//       render: (row) => (
//         <div className="text-sm text-gray-500">{row.processingTime}</div>
//       )
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (row) => (
//         <div className="text-sm">
//           <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//             {row.status}
//           </span>
//         </div>
//       )
//     }
//   ];

//   // Define action column for table
//   const actionColumn = (row) => (
//     <div className="flex space-x-2">
//       <Button 
//         variant="outline" 
//         size="sm" 
//         icon={EyeIcon}
//         onClick={() => handleViewDetails(row)}
//       >
//         View
//       </Button>
//       <Button 
//         variant="outline" 
//         size="sm" 
//         icon={DocumentArrowDownIcon}
//         onClick={() => handleDownload(row)}
//       >
//         Files
//       </Button>
//       {/* <Button 
//         variant="outline" 
//         size="sm" 
//         icon={ArrowPathIcon}
//         onClick={() => handleReprocess(row)}
//       >
//         Reprocess
//       </Button> */}
//     </div>
//   );

//   // // If we're viewing an LC, show the LC details component
//   // if (viewingLC) {
//   //   return <LCDetails lcNumber={viewingLC.lcNumber} onBackClick={handleBackFromDetails} />;
//   // }

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Completed Letters of Credit</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           View history of completed LC processing and access archived documents.
//         </p>
//       </div>
      
//       <Card>
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-500">
//             {completedLCs.length} {completedLCs.length === 1 ? 'document' : 'documents'} completed
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
//           data={completedLCs} 
//           actionColumn={actionColumn}
//         />
        
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-sm text-gray-500">
//             Showing 1-{completedLCs.length} of {completedLCs.length}
//           </div>
//           <div className="flex justify-center mt-4">
//             <nav className="flex items-center">
//               <button className="px-2 py-1 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
//                 Previous
//               </button>
//               <button className="px-3 py-1 text-white bg-indigo-600 rounded">
//                 1
//               </button>
//               <button className="px-3 py-1 text-gray-700 rounded hover:bg-gray-100">
//                 2
//               </button>
//               <button className="px-3 py-1 text-gray-700 rounded hover:bg-gray-100">
//                 3
//               </button>
//               <button className="px-2 py-1 text-gray-700 rounded hover:bg-gray-100">
//                 Next
//               </button>
//             </nav>
//           </div>
//         </div>
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default CompletedLCPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/buttons/Button';
import { EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { lcService } from '../authentication/apiAdmin';

const CompletedLCPage = () => {
  const navigate = useNavigate();
  const [completedLCs, setCompletedLCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Fetch completed LCs from API
  useEffect(() => {
    const fetchCompletedLCs = async () => {
      try {
        setLoading(true);
        const data = await lcService.getCompletedLCs();
        
        // Transform API data to match our component's expected structure
        const transformedData = data.map((lc, index) => {
          // Calculate processing time (difference between assign_date and complete_date)
          const assignDate = lc.assign_date ? new Date(lc.assign_date) : null;
          const completeDate = lc.complete_date ? new Date(lc.complete_date) : new Date(); // Use current date if complete_date is null
          
          let processingTime = 'N/A';
          if (assignDate) {
            const diffTime = Math.abs(completeDate - assignDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            processingTime = `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
          }
          
          return {
            id: index + 1,
            lcNumber: lc.lc_no,
            swiftFileName: `SWIFT_${lc.lc_no}.txt`, // Generate a consistent file name
            assignedTo: lc.username,
            assignDate: assignDate ? assignDate.toLocaleDateString() : 'N/A',
            completedDate: lc.complete_date ? new Date(lc.complete_date).toLocaleDateString() : 'In Progress',
            processingTime: processingTime,
            status: lc.complete_date ? 'Completed' : 'In Progress',
            // Keep original data for reference
            rawData: lc
          };
        });
        
        setCompletedLCs(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch completed LCs:', err);
        setError('No LC completed document found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedLCs();
  }, []);

  // Handle viewing LC details
  const handleViewDetails = (lc) => {
    console.log('View details for LC:', lc);
    // Open in a new tab using window.open
    window.open(`/discrepencies/${lc.lcNumber}`, '_blank');
  };

  // Handle downloading LC documents
  const handleDownload = async (lc) => {
    try {
      setDownloading(true);
      
      // Call the API to download the document
      const { url } = await lcService.downloadLCDocument(lc.lcNumber);
      
      // Open the PDF in a new tab
      window.open(url, '_blank');
      
      console.log(`Downloaded document for ${lc.lcNumber}`);
    } catch (err) {
      console.error(`Failed to download document for ${lc.lcNumber}:`, err);
      alert('Failed to download document. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'lcNumber',
      header: 'LC Number',
      render: (row) => (
        <div className="font-medium text-gray-900">{row.lcNumber}</div>
      )
    },
    {
      key: 'assignedTo',
      header: 'Processed By',
      render: (row) => (
        <div className="flex items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${row.assignedTo.replace(' ', '+')}`}
            alt={row.assignedTo}
            className="h-6 w-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-800">{row.assignedTo}</span>
        </div>
      )
    },
    {
      key: 'completedDate',
      header: 'Completed Date',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.completedDate}</div>
      )
    },
    {
      key: 'processingTime',
      header: 'Processing Time',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.processingTime}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="text-sm">
          <span className={`px-2 py-1 text-xs rounded-full ${
            row.status === 'Completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {row.status}
          </span>
        </div>
      )
    }
  ];

  // Define action column for table
  const actionColumn = (row) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        icon={EyeIcon}
        onClick={() => handleViewDetails(row)}
      >
        View
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={DocumentArrowDownIcon}
        onClick={() => handleDownload(row)}
        disabled={downloading}
      >
        Files
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completed Letters of Credit</h1>
        <p className="mt-1 text-sm text-gray-500">
          View history of completed LC processing and access archived documents.
        </p>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {completedLCs.length} {completedLCs.length === 1 ? 'document' : 'documents'} completed
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
          <div className="flex justify-center items-center p-8">
            <div className="text-gray-500">Loading data...</div>
          </div>
        ) : error ? (
          <div className="bg-gray-50 border border-gray-300 text-gray-600 text-sm px-4 py-3 rounded-md text-center shadow-sm">
            {error}
          </div>
        ) : (
          <>
            <DataTable 
              columns={columns} 
              data={completedLCs} 
              actionColumn={actionColumn}
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1-{completedLCs.length} of {completedLCs.length}
              </div>
              <div className="flex justify-center mt-4">
                <nav className="flex items-center">
                  <button className="px-2 py-1 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 text-white bg-indigo-600 rounded">
                    1
                  </button>
                  <button className="px-3 py-1 text-gray-700 rounded hover:bg-gray-100">
                    2
                  </button>
                  <button className="px-3 py-1 text-gray-700 rounded hover:bg-gray-100">
                    3
                  </button>
                  <button className="px-2 py-1 text-gray-700 rounded hover:bg-gray-100">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default CompletedLCPage;