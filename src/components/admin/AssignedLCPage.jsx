// File: src/pages/admin/AssignedLCPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/buttons/Button';
import { EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const AssignedLCPage = () => {
  // Sample data for assigned LCs
  const [assignedLCs, setAssignedLCs] = useState([
    {
      id: 4,
      lcNumber: 'LC-2023-004',
      swiftFileName: 'SWIFT_MSG_004.txt',
      assignedTo: 'John Doe',
      assignedDate: '2023-03-09',
      dueDate: '2023-03-16',
      status: 'In Progress',
      progress: 45
    },
    {
      id: 5,
      lcNumber: 'LC-2023-005',
      swiftFileName: 'SWIFT_MSG_005.txt',
      assignedTo: 'Jane Smith',
      assignedDate: '2023-03-10',
      dueDate: '2023-03-17',
      status: 'In Progress',
      progress: 70
    },
    {
      id: 6,
      lcNumber: 'LC-2023-006',
      swiftFileName: 'SWIFT_MSG_006.txt',
      assignedTo: 'Mike Johnson',
      assignedDate: '2023-03-11',
      dueDate: '2023-03-18',
      status: 'Needs Review',
      progress: 90
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
      header: 'Assigned To',
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
      key: 'assignedDate',
      header: 'Assigned Date',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.assignedDate}</div>
      )
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.dueDate}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const statusStyles = {
          'In Progress': 'bg-blue-100 text-blue-800',
          'Needs Review': 'bg-yellow-100 text-yellow-800',
          'Completed': 'bg-green-100 text-green-800',
          'Delayed': 'bg-red-100 text-red-800'
        };
        
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[row.status]}`}>
              {row.status}
            </span>
          </div>
        );
      }
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (row) => (
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full rounded-full bg-indigo-600" 
            style={{ width: `${row.progress}%` }}
          ></div>
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
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assigned Letters of Credit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage LC documents currently being processed by users.
        </p>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {assignedLCs.length} {assignedLCs.length === 1 ? 'document' : 'documents'} currently assigned
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
          data={assignedLCs} 
          actionColumn={actionColumn}
        />
      </Card>
    </DashboardLayout>
  );
};

export default AssignedLCPage;