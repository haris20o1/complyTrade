// File: src/pages/admin/UploadedLCPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import DataTable from '../../components/tables/DataTable';
import UserDropdown from '../../components/forms/UserDropdown';
import Button from '../../components/buttons/Button';
import FilterDropdown from '../../components/filters/FilterDropdown';
import { DocumentMagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const UploadedLCPage = () => {
  // Sample data with an additional assignedTo field
  const [uploadedLCs, setUploadedLCs] = useState([
    {
      id: 1,
      lcNumber: 'LC-2023-001',
      documentStatus: 'uploaded',
      swiftFileName: 'SWIFT_MSG_001.txt',
      uploadedBy: 'swift_user1',
      uploadDate: '2023-03-10',
      supportingDocs: ['Invoice_001.pdf', 'Packing_List_001.pdf'],
      status: 'Pending Assignment',
      assignedTo: null
    },
    {
      id: 2,
      documentStatus: 'uploaded',
      lcNumber: 'LC-2023-002',
      swiftFileName: 'SWIFT_MSG_002.txt',
      uploadedBy: 'swift_user1',
      uploadDate: '2023-03-11',
      supportingDocs: ['Invoice_002.pdf', 'Packing_List_002.pdf', 'Certificate_Origin_002.pdf'],
      status: 'Pending Assignment',
      assignedTo: null
    },
    {
      id: 3,
      lcNumber: 'LC-2023-003',
      documentStatus: 'missing',
      swiftFileName: 'SWIFT_MSG_003.txt',
      uploadedBy: 'swift_user2',
      uploadDate: '2023-03-12',
      supportingDocs: ['Invoice_003.pdf'],
      status: 'Pending Assignment',
      assignedTo: null
    },
    {
      id: 4,
      lcNumber: 'LC-2023-004',
      documentStatus: 'missing',
      swiftFileName: 'SWIFT_MSG_003.txt',
      uploadedBy: 'swift_user2',
      uploadDate: '2023-03-12',
      supportingDocs: ['Invoice_003.pdf','Packing_List_002.pdf'],
      status: 'Pending Assignment',
      assignedTo: null
    },
    {
      id: 5,
      lcNumber: 'LC-2023-005',
      documentStatus: 'not uploaded',
      swiftFileName: 'SWIFT_MSG_003.txt',
      uploadedBy: 'swift_user2',
      uploadDate: '2023-03-12',
      supportingDocs: ['Invoice_003.pdf','Packing_List_002.pdf','Packing_List_002.pdf','Packing_List_002.pdf'],
      status: 'Pending Assignment',
      assignedTo: null
    }
  ]);

  // Sample users for dropdown
  const users = [
    { id: 1, name: 'Haris Ahmad', role: 'user' },
    { id: 2, name: 'Ahmad Romman', role: 'user' },
    { id: 3, name: 'Zoraiz', role: 'user' },
    { id: 4, name: 'Wasie', role: 'user' }
  ];

  // State to track selected users for each LC
  const [selectedUsers, setSelectedUsers] = useState({});
  
  // State to track filters
  const [tableFilters, setTableFilters] = useState({});

  // Filter configuration
  const filterOptions = [
    {
      key: 'documentStatus',
      label: 'Document Status',
      type: 'select',
      options: [
        { value: 'uploaded', label: 'Uploaded' },
        { value: 'missing', label: 'Missing' },
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
  const handleAssign = (lcId) => {
    // Update the LC status and assignedTo instead of removing it
    setUploadedLCs(uploadedLCs.map(lc => {
      if (lc.id === lcId) {
        return {
          ...lc,
          status: 'Assigned',
          assignedTo: selectedUsers[lcId]
        };
      }
      return lc;
    }));
    
    // In a real app, you would make an API call here to update the backend
    console.log(`Assigned LC ${lcId} to user ${selectedUsers[lcId]?.name}`);
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
  const handleConfirmReassign = (lcId) => {
    // Update the LC with the new assignment
    setUploadedLCs(uploadedLCs.map(lc => {
      if (lc.id === lcId) {
        return {
          ...lc,
          status: 'Assigned',
          assignedTo: selectedUsers[lcId]
        };
      }
      return lc;
    }));
    
    console.log(`Reassigned LC ${lcId} to user ${selectedUsers[lcId]?.name}`);
  };

  // Handle viewing LC details
  const handleViewDetails = (lc) => {
    console.log('View details for LC:', lc);
    // In a real app, you would navigate to a details page or open a modal
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
        <div className="font-medium text-gray-900">{row.lcNumber}</div>
      )
    },
    {
      key: 'documentStatus',
      header: 'Document Status',
      render: (row) => {
        const status = row.documentStatus?.toLowerCase().trim();
        let textColor = 'text-yellow-500'; // default: yellow for "Missing" or anything else
    
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
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {row.supportingDocs.length} documents
          </span>
        </div>
      )
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      render: (row) => (
        <div className="text-sm text-gray-500">{row.uploadDate}</div>
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
      render: (row) => (
        row.status === 'Assigned' ? (
          <div className="text-sm text-gray-500">
            Already assigned to {row.assignedTo.name}
          </div>
        ) : (
          <UserDropdown 
            users={users} 
            onSelect={(user) => handleUserSelect(row.id, user)}
            placeholder="Select user"
          />
        )
      )
    }
  ];

  // Define action column for table
  const actionColumn = (row) => (
    <div className="flex space-x-2">
      {row.status === 'Assigned' ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleReassign(row.id)}
        >
          Reassign
        </Button>
      ) : row.status === 'Pending Reassignment' ? (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => handleConfirmReassign(row.id)}
          disabled={!selectedUsers[row.id]}
        >
          Confirm Reassign
        </Button>
      ) : (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => handleAssign(row.id)}
          disabled={!selectedUsers[row.id]}
        >
          Assign
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        icon={DocumentMagnifyingGlassIcon}
        onClick={() => handleViewDetails(row)}
      >
        View
      </Button>
    </div>
  );

  // Filter data based on tableFilters
  const filteredData = uploadedLCs.filter(lc => {
    // Check document status filter
    if (tableFilters.documentStatus && lc.documentStatus !== tableFilters.documentStatus) {
      return false;
    }
    
    // Check date range filter
    if (tableFilters.uploadDateFrom) {
      const uploadDate = new Date(lc.uploadDate);
      const fromDate = new Date(tableFilters.uploadDateFrom);
      if (uploadDate < fromDate) return false;
    }
    
    if (tableFilters.uploadDateTo) {
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
        
        <DataTable 
          columns={columns} 
          data={filteredData} 
          actionColumn={actionColumn}
        />
      </Card>
    </DashboardLayout>
  );
};

export default UploadedLCPage;