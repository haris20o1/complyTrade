// File: src/pages/admin/CompletedLCPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/buttons/Button';
import { EyeIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const CompletedLCPage = () => {
  // Sample data for completed LCs
  const [completedLCs, setCompletedLCs] = useState([
    {
      id: 7,
      lcNumber: 'LC-2023-007',
      swiftFileName: 'SWIFT_MSG_007.txt',
      assignedTo: 'Huzaifa Doe',
      completedDate: '2023-03-08',
      processingTime: '2.5 days',
      status: 'Completed'
    },
    {
      id: 8,
      lcNumber: 'LC-2023-008',
      swiftFileName: 'SWIFT_MSG_008.txt',
      assignedTo: 'Jane Smith',
      completedDate: '2023-03-07',
      processingTime: '1.8 days',
      status: 'Completed'
    },
    {
      id: 9,
      lcNumber: 'LC-2023-009',
      swiftFileName: 'SWIFT_MSG_009.txt',
      assignedTo: 'Mike Johnson',
      completedDate: '2023-03-06',
      processingTime: '3.2 days',
      status: 'Completed'
    },
    {
      id: 10,
      lcNumber: 'LC-2023-010',
      swiftFileName: 'SWIFT_MSG_010.txt',
      assignedTo: 'Sarah Williams',
      completedDate: '2023-03-05',
      processingTime: '2.1 days',
      status: 'Completed'
    }
  ]);

  // Handle viewing LC details
  const handleViewDetails = (lc) => {
    console.log('View details for LC:', lc);
    // In a real app, you would navigate to a details page or open a modal
  };

  // Handle downloading LC documents
  const handleDownload = (lc) => {
    console.log('Download documents for LC:', lc);
    // In a real app, you would initiate a download
  };

  // Handle reprocessing an LC
  const handleReprocess = (lc) => {
    console.log('Reprocess LC:', lc);
    // In a real app, you would initiate a reprocessing workflow
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
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
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
      >
        Files
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        icon={ArrowPathIcon}
        onClick={() => handleReprocess(row)}
      >
        Reprocess
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
      </Card>
    </DashboardLayout>
  );
};

export default CompletedLCPage;