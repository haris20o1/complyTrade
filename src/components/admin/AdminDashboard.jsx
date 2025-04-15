// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChartBarIcon, DocumentTextIcon, CheckCircleIcon, UserGroupIcon, LogoutIcon, BellIcon, SearchIcon } from '@heroicons/react/outline';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('uploaded');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [notifications, setNotifications] = useState(3);
  
//   // Mock data for demonstration
//   const [uploadedLCs, setUploadedLCs] = useState([
//     { id: 'LC001', name: 'LC_SWIFT_123456', supportingDocs: ['Invoice.pdf', 'Packing_List.pdf'], date: '2025-03-10' },
//     { id: 'LC002', name: 'LC_SWIFT_789012', supportingDocs: ['Shipping_Doc.pdf'], date: '2025-03-11' },
//     { id: 'LC003', name: 'LC_SWIFT_345678', supportingDocs: ['Contract.pdf', 'Insurance.pdf', 'Bill_of_Lading.pdf'], date: '2025-03-12' },
//     { id: 'LC004', name: 'LC_SWIFT_901234', supportingDocs: ['Invoice.pdf'], date: '2025-03-13' },
//   ]);
  
//   const [assignedLCs, setAssignedLCs] = useState([
//     { id: 'LC005', name: 'LC_SWIFT_567890', assignedTo: 'user1@example.com', assignedDate: '2025-03-09' },
//     { id: 'LC006', name: 'LC_SWIFT_123789', assignedTo: 'user2@example.com', assignedDate: '2025-03-10' },
//   ]);
  
//   const [completedLCs, setCompletedLCs] = useState([
//     { id: 'LC007', name: 'LC_SWIFT_456123', assignedTo: 'user1@example.com', completedDate: '2025-03-08' },
//   ]);
  
//   const [users, setUsers] = useState([
//     { id: 1, email: 'user1@example.com', name: 'John Doe' },
//     { id: 2, email: 'user2@example.com', name: 'Jane Smith' },
//     { id: 3, email: 'user3@example.com', name: 'Robert Johnson' },
//   ]);

//   // Function to handle assignment
//   const handleAssign = (lcId, userId) => {
//     // Find the LC to assign
//     const lcToAssign = uploadedLCs.find(lc => lc.id === lcId);
    
//     if (!lcToAssign) return;
    
//     // Find the user
//     const user = users.find(u => u.id === userId);
    
//     if (!user) return;
    
//     // Create a new assigned LC object
//     const newAssignedLC = {
//       ...lcToAssign,
//       assignedTo: user.email,
//       assignedDate: new Date().toISOString().split('T')[0]
//     };
    
//     // Update state
//     setAssignedLCs([...assignedLCs, newAssignedLC]);
//     setUploadedLCs(uploadedLCs.filter(lc => lc.id !== lcId));
//   };

//   // Filter uploaded LCs based on search term
//   const filteredUploadedLCs = uploadedLCs.filter(lc => 
//     lc.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Filter assigned LCs based on search term
//   const filteredAssignedLCs = assignedLCs.filter(lc => 
//     lc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     lc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Filter completed LCs based on search term
//   const filteredCompletedLCs = completedLCs.filter(lc => 
//     lc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     lc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold">LC Compliance</h1>
//           <p className="text-blue-200 text-sm">Admin Panel</p>
//         </div>
        
//         <div className="mt-8">
//         <div 
//             className={`flex items-center p-4 ${activeTab === 'uploaded' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer transition-all`}
//             onClick={() => setActiveTab('uploaded')}
//             >
//             <DocumentTextIcon className="h-5 w-5 mr-3" />
//             <span>Uploaded LCs</span>
//             <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">{uploadedLCs.length}</span>
//           </div>
          
//           <div 
//             className={`flex items-center p-4 ${activeTab === 'assigned' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer transition-all`}
//             onClick={() => setActiveTab('assigned')}
//           >
//             <UserGroupIcon className="h-5 w-5 mr-3" />
//             <span>Assigned LCs</span>
//             <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">{assignedLCs.length}</span>
//           </div>
          
//           <div 
//             className={`flex items-center p-4 ${activeTab === 'completed' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer transition-all`}
//             onClick={() => setActiveTab('completed')}
//           >
//             <CheckCircleIcon className="h-5 w-5 mr-3" />
//             <span>Completed LCs</span>
//             <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">{completedLCs.length}</span>
//           </div>
          
//           <div 
//             className={`flex items-center p-4 ${activeTab === 'analytics' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer transition-all`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             <ChartBarIcon className="h-5 w-5 mr-3" />
//             <span>Analytics</span>
//           </div>
//         </div>
        
//         <div className="absolute bottom-0 left-0 w-64 p-4">
//           <div 
//             className="flex items-center p-2 hover:bg-blue-700 rounded cursor-pointer"
//             onClick={() => navigate('/')}
//           >
//             <LogoutIcon className="h-5 w-5 mr-3" />
//             <span>Logout</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <div className="bg-white p-4 shadow flex justify-between items-center">
//           <div className="relative w-64">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="absolute left-3 top-3 text-gray-400">
//               <SearchIcon className="h-4 w-4" />
//             </div>
//           </div>
          
//           <div className="flex items-center">
//             <div className="relative mr-4">
//               <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
//               {notifications > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   {notifications}
//                 </span>
//               )}
//             </div>
            
//             <div className="flex items-center">
//               <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
//                 A
//               </div>
//               <span className="text-gray-700">Admin</span>
//             </div>
//           </div>
//         </div>
        
//         {/* Content Area */}
//         <div className="p-6">
//           {activeTab === 'uploaded' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Uploaded LCs</h2>
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LC Number</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporting Docs</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign To</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUploadedLCs.map((lc) => (
//                       <tr key={lc.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{lc.name}</div>
//                           <div className="text-sm text-gray-500">{lc.id}</div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">
//                             {lc.supportingDocs.length} documents
//                           </div>
//                           <div className="text-xs text-gray-500 truncate max-w-xs">
//                             {lc.supportingDocs.join(', ')}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {lc.date}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <select 
//                             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                             defaultValue=""
//                             id={`user-select-${lc.id}`}
//                           >
//                             <option value="" disabled>Select user</option>
//                             {users.map(user => (
//                               <option key={user.id} value={user.id}>
//                                 {user.name} ({user.email})
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button 
//                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                             onClick={() => {
//                               const selectElement = document.getElementById(`user-select-${lc.id}`);
//                               const userId = parseInt(selectElement.value);
//                               if (userId) handleAssign(lc.id, userId);
//                             }}
//                           >
//                             Assign
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                     {filteredUploadedLCs.length === 0 && (
//                       <tr>
//                         <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                           No uploaded LCs found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'assigned' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Assigned LCs</h2>
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LC Number</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredAssignedLCs.map((lc) => (
//                       <tr key={lc.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{lc.name}</div>
//                           <div className="text-sm text-gray-500">{lc.id}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {lc.assignedTo}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {lc.assignedDate}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             In Progress
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                     {filteredAssignedLCs.length === 0 && (
//                       <tr>
//                         <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
//                           No assigned LCs found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'completed' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Completed LCs</h2>
//               <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LC Number</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed By</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredCompletedLCs.map((lc) => (
//                       <tr key={lc.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{lc.name}</div>
//                           <div className="text-sm text-gray-500">{lc.id}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {lc.assignedTo}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {lc.completedDate}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Completed
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                     {filteredCompletedLCs.length === 0 && (
//                       <tr>
//                         <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
//                           No completed LCs found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
          
//           {activeTab === 'analytics' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
//                   <div className="flex flex-col space-y-4">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Total LCs</span>
//                       <span className="font-semibold">{uploadedLCs.length + assignedLCs.length + completedLCs.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Pending Assignment</span>
//                       <span className="font-semibold">{uploadedLCs.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">In Progress</span>
//                       <span className="font-semibold">{assignedLCs.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Completed</span>
//                       <span className="font-semibold">{completedLCs.length}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-lg shadow col-span-2">
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
//                   <div className="space-y-4">
//                     <div className="border-l-4 border-blue-500 pl-4 py-2">
//                       <div className="text-sm font-medium">LC_SWIFT_901234 uploaded</div>
//                       <div className="text-xs text-gray-500">Today at 10:23 AM</div>
//                     </div>
//                     <div className="border-l-4 border-green-500 pl-4 py-2">
//                       <div className="text-sm font-medium">LC_SWIFT_123789 assigned to Jane Smith</div>
//                       <div className="text-xs text-gray-500">Today at 9:45 AM</div>
//                     </div>
//                     <div className="border-l-4 border-yellow-500 pl-4 py-2">
//                       <div className="text-sm font-medium">LC_SWIFT_567890 processing started by John Doe</div>
//                       <div className="text-xs text-gray-500">Yesterday at 3:12 PM</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// File: src/pages/admin/AdminDashboard.jsx
import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import { 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  // Sample stats
  const stats = [
    {
      id: 1,
      name: 'Total LC Documents',
      value: '143',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      change: '+12% from last month'
    },
    {
      id: 2,
      name: 'Assigned',
      value: '32',
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-indigo-500',
      change: '+5% from last month'
    },
    {
      id: 3,
      name: 'Completed',
      value: '98',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+15% from last month'
    },
    {
      id: 4,
      name: 'Pending',
      value: '13',
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '-8% from last month'
    }
  ];

  // Sample recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'LC-2023-006 assigned to Mike Johnson',
      timestamp: '2 hours ago',
      user: 'Admin User'
    },
    {
      id: 2,
      action: 'LC-2023-005 assigned to Jane Smith',
      timestamp: '4 hours ago',
      user: 'Admin User'
    },
    {
      id: 3,
      action: 'LC-2023-004 completed by John Doe',
      timestamp: '1 day ago',
      user: 'John Doe'
    },
    {
      id: 4,
      action: 'New LC document uploaded: LC-2023-007',
      timestamp: '1 day ago',
      user: 'Swift User'
    },
    {
      id: 5,
      action: 'Supporting documents added to LC-2023-003',
      timestamp: '2 days ago',
      user: 'Docs User'
    }
  ];

  // Sample alerts
  const alerts = [
    {
      id: 1,
      message: 'LC-2023-002 is approaching due date (Tomorrow)',
      severity: 'warning',
      timestamp: '12 min ago'
    },
    {
      id: 2,
      message: 'LC-2023-005 requires additional documentation',
      severity: 'error',
      timestamp: '3 hours ago'
    },
    {
      id: 3,
      message: 'System maintenance scheduled for Sunday, 2 AM - 4 AM',
      severity: 'info',
      timestamp: '1 day ago'
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of LC processing activity and key metrics.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id} className="flex flex-col">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{stat.change}</div>
            </Card>
          );
        })}
      </div>
      
      {/* Two-column layout for smaller sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.user}</p>
                        </div>
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <a
              href="#"
              className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all activity
              <ChevronRightIcon className="ml-1 h-5 w-5" />
            </a>
          </div>
        </Card>
        
        {/* Alerts */}
        <Card title="Alerts & Notifications">
          <div className="space-y-4">
            {alerts.map((alert) => {
              let Icon, bgColor, textColor;
              
              switch (alert.severity) {
                case 'error':
                  Icon = ExclamationCircleIcon;
                  bgColor = 'bg-red-50';
                  textColor = 'text-red-800';
                  break;
                case 'warning':
                  Icon = ExclamationCircleIcon;
                  bgColor = 'bg-yellow-50';
                  textColor = 'text-yellow-800';
                  break;
                case 'info':
                default:
                  Icon = ClockIcon;
                  bgColor = 'bg-blue-50';
                  textColor = 'text-blue-800';
                  break;
              }
              
              return (
                <div
                  key={alert.id}
                  className={`${bgColor} ${textColor} p-4 rounded-md flex items-start`}
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="mt-1 text-xs opacity-70">{alert.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <a
              href="#"
              className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all alerts
              <ChevronRightIcon className="ml-1 h-5 w-5" />
            </a>
          </div>
        </Card>
      </div>
      
      {/* Performance Metrics */}
      <div className="mt-6">
        <Card title="Processing Performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">98%</div>
              <div className="text-sm text-gray-500 mt-1">On-Time Completion</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600">2.4</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Processing Days</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">4.8/5</div>
              <div className="text-sm text-gray-500 mt-1">Quality Score</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;