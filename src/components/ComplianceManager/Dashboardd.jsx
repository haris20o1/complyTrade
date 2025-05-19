// import React, { useState, useEffect } from 'react';
// import { lcService } from '../authentication/apiManagerCompliance';
// import DashboardLayout from '../../components/layouts/DashboardLayout';

// import { 
//   ChevronRightIcon,
//   DocumentIcon,
//   ClockIcon,
//   ExclamationCircleIcon,
//   DocumentTextIcon
// } from '@heroicons/react/24/outline';
// import { format } from 'date-fns';

// const ManagerDashboard = () => {
//   const [priorityLCs, setPriorityLCs] = useState([]);
//   const [inProgressLCs, setInProgressLCs] = useState([]);
//   const [assignedLCs, setAssignedLCs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch data from APIs
//         const [priorityData, assignedData] = await Promise.all([
//           lcService.getPriorityLCs(),
//           lcService.getAssignedLCs()
//         ]);
        
//         // Set priority LCs
//         setPriorityLCs(priorityData);
        
//         // Filter assigned LCs to separate in-progress from others
//         const inProgress = assignedData.filter(lc => lc.inprogress);
//         const assigned = assignedData.filter(lc => !lc.inprogress);
        
//         setInProgressLCs(inProgress);
//         setAssignedLCs(assigned);
        
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError('Failed to load dashboard data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleStartProcessing = async (lcNo) => {
//     try {
//       await lcService.startProcessingLC(lcNo);
      
//       // Update local state to reflect the change
//       const updatedLC = assignedLCs.find(lc => lc.lc_no === lcNo);
//       if (updatedLC) {
//         updatedLC.inprogress = true;
//         setInProgressLCs([...inProgressLCs, updatedLC]);
//         setAssignedLCs(assignedLCs.filter(lc => lc.lc_no !== lcNo));
//       }
//     } catch (err) {
//       console.error('Error starting LC processing:', err);
//       setError('Failed to start processing. Please try again.');
//     }
//   };

//   const handleViewLC = (lcNo) => {
//     // Navigate to LC details page
//     console.log('Viewing LC:', lcNo);
//     // Add navigation logic here
//   };

//   const formatDate = (dateString) => {
//     try {
//       return format(new Date(dateString), 'yyyy-MM-dd');
//     } catch (err) {
//       return dateString;
//     }
//   };

//   // Calculate days until expiry
//   const getDaysUntilExpiry = (endDate) => {
//     const today = new Date();
//     const expiryDate = new Date(endDate);
//     const diffTime = expiryDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   // Get status badge class based on days until expiry
//   const getStatusBadgeClass = (endDate) => {
//     const daysLeft = getDaysUntilExpiry(endDate);
//     if (daysLeft <= 7) return 'bg-red-100 text-red-800'; // Critical
//     if (daysLeft <= 30) return 'bg-yellow-100 text-yellow-800'; // Warning
//     return 'bg-green-100 text-green-800'; // Good
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
//           <div className="flex items-center">
//             <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
//             <p className="text-red-700">{error}</p>
//           </div>
//           <button 
//             className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//         <div className="p-6 w-full">
//         <div className="mb-8 text-left">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Compliance Manager Dashboard</h1>
//             <p className="text-gray-600">Monitor and process Letters of Credit assigned to you</p>
//         </div>

//         {/* Key metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
//             <div className="flex items-center justify-between">
//                 <div>
//                 <p className="text-sm font-medium text-gray-500">Priority LCs</p>
//                 <p className="text-2xl font-bold text-gray-900">{priorityLCs.length}</p>
//                 </div>
//                 <div className="bg-red-100 p-3 rounded-full">
//                 <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
//                 </div>
//             </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
//             <div className="flex items-center justify-between">
//                 <div>
//                 <p className="text-sm font-medium text-gray-500">In Progress</p>
//                 <p className="text-2xl font-bold text-gray-900">{inProgressLCs.length}</p>
//                 </div>
//                 <div className="bg-yellow-100 p-3 rounded-full">
//                 <ClockIcon className="h-6 w-6 text-yellow-600" />
//                 </div>
//             </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//                 <div>
//                 <p className="text-sm font-medium text-gray-500">Assigned</p>
//                 <p className="text-2xl font-bold text-gray-900">{assignedLCs.length}</p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-full">
//                 <DocumentIcon className="h-6 w-6 text-blue-600" />
//                 </div>
//             </div>
//             </div>
//         </div>

//         {/* Priority LCs */}
//         <div className="bg-white rounded-lg shadow-md mb-8">
//             <div className="border-b border-gray-200 px-6 py-4 flex items-center">
//             <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
//             <h2 className="text-lg font-medium text-gray-900">Priority</h2>
//             </div>
            
//             {priorityLCs.length === 0 ? (
//             <div className="p-6 text-left text-gray-500">
//                 No priority Letters of Credit at this time
//             </div>
//             ) : (
//             <div className="divide-y divide-gray-200">
//                 {priorityLCs.map(lc => (
//                 <div key={lc.lc_no} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <div className="bg-red-100 p-2 rounded mr-4">
//                         <DocumentTextIcon className="h-6 w-6 text-red-600" />
//                         </div>
//                         <div>
//                         <h3 className="font-medium text-gray-900 flex items-center">
//                             <span className="mr-2">LC{lc.lc_no}</span>
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(lc.end_date)}`}>
//                             {getDaysUntilExpiry(lc.end_date)} days left
//                             </span>
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Amount: ${Number(lc.lc_amount).toLocaleString()} | Issued: {formatDate(lc.init_date)} | Expires: {formatDate(lc.end_date)}
//                         </p>
//                         </div>
//                     </div>
//                     <div className="flex space-x-2">
//                         <button 
//                         onClick={() => handleViewLC(lc.lc_no)}
//                         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded text-sm flex items-center"
//                         >
//                         View Details
//                         <ChevronRightIcon className="h-4 w-4 ml-1" />
//                         </button>
//                         <button 
//                         onClick={() => handleStartProcessing(lc.lc_no)}
//                         className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm"
//                         >
//                         Start Processing
//                         </button>
//                     </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//             )}
//         </div>

//         {/* In Progress */}
//         <div className="bg-white rounded-lg shadow-md mb-8">
//             <div className="border-b border-gray-200 px-6 py-4 flex items-center">
//             <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
//             <h2 className="text-lg font-medium text-gray-900">In Progress</h2>
//             </div>
            
//             {inProgressLCs.length === 0 ? (
//             <div className="p-6 text-left text-gray-500">
//                 No Letters of Credit in progress
//             </div>
//             ) : (
//             <div className="divide-y divide-gray-200">
//                 {inProgressLCs.map(lc => (
//                 <div key={lc.lc_no} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <div className="bg-yellow-100 p-2 rounded mr-4">
//                         <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
//                         </div>
//                         <div>
//                         <h3 className="font-medium text-gray-900 flex items-center">
//                             <span className="mr-2">LC{lc.lc_no}</span>
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(lc.end_date)}`}>
//                             {getDaysUntilExpiry(lc.end_date)} days left
//                             </span>
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Amount: ${Number(lc.lc_amount).toLocaleString()} | Issued: {formatDate(lc.init_date)} | Expires: {formatDate(lc.end_date)}
//                         </p>
//                         </div>
//                     </div>
//                     <div>
//                         <button 
//                         onClick={() => handleViewLC(lc.lc_no)}
//                         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded text-sm flex items-center"
//                         >
//                         Continue Processing
//                         <ChevronRightIcon className="h-4 w-4 ml-1" />
//                         </button>
//                     </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//             )}
//         </div>

//         {/* Assigned */}
//         <div className="bg-white rounded-lg shadow-md">
//             <div className="border-b border-gray-200 px-6 py-4 flex items-center">
//             <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
//             <h2 className="text-lg font-medium text-gray-900">Assigned</h2>
//             </div>
            
//             {assignedLCs.length === 0 ? (
//             <div className="p-6 text-left text-gray-500">
//                 No Letters of Credit assigned
//             </div>
//             ) : (
//             <div className="divide-y divide-gray-200">
//                 {assignedLCs.map(lc => (
//                 <div key={lc.lc_no} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <div className="bg-blue-100 p-2 rounded mr-4">
//                         <DocumentTextIcon className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div>
//                         <h3 className="font-medium text-gray-900 flex items-center">
//                             <span className="mr-2">LC{lc.lc_no}</span>
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(lc.end_date)}`}>
//                             {getDaysUntilExpiry(lc.end_date)} days left
//                             </span>
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                             Amount: ${Number(lc.lc_amount).toLocaleString()} | Issued: {formatDate(lc.init_date)} | Expires: {formatDate(lc.end_date)}
//                         </p>
//                         </div>
//                     </div>
//                     <div className="flex space-x-2">
//                         <button 
//                         onClick={() => handleViewLC(lc.lc_no)}
//                         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded text-sm flex items-center"
//                         >
//                         View Details
//                         <ChevronRightIcon className="h-4 w-4 ml-1" />
//                         </button>
//                         <button 
//                         onClick={() => handleStartProcessing(lc.lc_no)}
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm"
//                         >
//                         Start Processing
//                         </button>
//                     </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//             )}
//         </div>
//         </div>
//     </DashboardLayout>  
//   );
// };

// export default ManagerDashboard;

import React, { useState, useEffect } from 'react';
import { lcService } from '../authentication/apiManagerCompliance';
import DashboardLayout from '../../components/layouts/DashboardLayout';

import { 
  ChevronRightIcon,
  DocumentIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const [priorityLCs, setPriorityLCs] = useState([]);
  const [inProgressLCs, setInProgressLCs] = useState([]);
  const [assignedLCs, setAssignedLCs] = useState([]);
  
  // Separate loading and error states for each section
  const [loadingStates, setLoadingStates] = useState({
    priority: true,
    inProgress: true,
    assigned: true
  });
  
  const [errorStates, setErrorStates] = useState({
    priority: null,
    inProgress: null,
    assigned: null
  });

  // Function to update a specific loading state
  const updateLoadingState = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  // Function to update a specific error state
  const updateErrorState = (key, value) => {
    setErrorStates(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Fetch priority LCs
    const fetchPriorityLCs = async () => {
      try {
        updateLoadingState('priority', true);
        const data = await lcService.getPriorityLCs();
        setPriorityLCs(data);
        updateErrorState('priority', null);
      } catch (err) {
        console.error('Error fetching priority LCs:', err);
        updateErrorState('priority', 'Failed to load priority LCs.');
      } finally {
        updateLoadingState('priority', false);
      }
    };

    // Fetch in-progress LCs
    const fetchInProgressLCs = async () => {
      try {
        updateLoadingState('inProgress', true);
        const data = await lcService.getInProgressLCs();
        setInProgressLCs(data);
        updateErrorState('inProgress', null);
      } catch (err) {
        console.error('Error fetching in-progress LCs:', err);
        updateErrorState('inProgress', 'No LC inprogress');
      } finally {
        updateLoadingState('inProgress', false);
      }
    };

    // Fetch assigned LCs
    const fetchAssignedLCs = async () => {
      try {
        updateLoadingState('assigned', true);
        const data = await lcService.getAssignedLCs();
        // Only include LCs that are not in progress
        const actualAssigned = data.filter(lc => !lc.inprogress);
        setAssignedLCs(actualAssigned);
        updateErrorState('assigned', null);
      } catch (err) {
        console.error('Error fetching assigned LCs:', err);
        updateErrorState('assigned', 'Failed to load assigned LCs.');
      } finally {
        updateLoadingState('assigned', false);
      }
    };
    
    // Execute all fetch functions independently
    fetchPriorityLCs();
    fetchInProgressLCs();
    fetchAssignedLCs();
  }, []);

  const handleViewLC = (lcNo) => {
    // Navigate to LC details page
    console.log('Viewing LC:', lcNo);
    // Add navigation logic here
    window.open(`/discrepency/${lcNo}`, '_blank');
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (err) {
      return dateString;
    }
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (endDate) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge class based on days until expiry
  const getStatusBadgeClass = (endDate) => {
    const daysLeft = getDaysUntilExpiry(endDate);
    if (daysLeft <= 7) return 'bg-red-100 text-red-800'; // Critical
    if (daysLeft <= 30) return 'bg-yellow-100 text-yellow-800'; // Warning
    return 'bg-green-100 text-green-800'; // Good
  };

  // Section rendering function with loading and error handling
  const renderSection = (title, icon, data, loading, error, emptyMessage, iconBgColor, iconColor, borderColor, onView, onAction, actionText, actionBtnClass) => {
    return (
      <div className={`bg-white rounded-lg shadow-md mb-8 ${borderColor ? `border-l-4 ${borderColor}` : ''}`}>
        <div className="border-b border-gray-200 px-6 py-4 flex items-center">
          {icon && React.cloneElement(icon, { className: `h-5 w-5 ${iconColor} mr-2` })}
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 p-4 mx-6 my-4 rounded">
            <div className="flex items-center">
              {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" /> */}
              <p className="text-yellow-700">{error}</p>
            </div>
            {/* <button 
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button> */}
          </div>
        ) : data.length === 0 ? (
          <div className="p-6 text-left text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map(lc => (
              <div key={lc.lc_no} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`${iconBgColor} p-2 rounded mr-4`}>
                      <DocumentTextIcon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <span className="mr-2">LC{lc.lc_no}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(lc.end_date)}`}>
                          {getDaysUntilExpiry(lc.end_date)} days left
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Amount: ${Number(lc.lc_amount).toLocaleString()} | Issued: {formatDate(lc.init_date)} | Expires: {formatDate(lc.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onView(lc.lc_no)}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded text-sm flex items-center"
                    >
                      View Details
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                    {onAction && (
                      <button 
                        onClick={() => onAction(lc.lc_no)}
                        className={`${actionBtnClass} font-medium py-2 px-4 rounded text-sm`}
                      >
                        {actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 w-full">
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Compliance Manager Dashboard</h1>
          <p className="text-gray-600">Monitor and process Letters of Credit assigned to you</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Priority LCs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStates.priority ? "-" : priorityLCs.length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStates.inProgress ? "-" : inProgressLCs.length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingStates.assigned ? "-" : assignedLCs.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DocumentIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Priority LCs Section */}
        {renderSection(
          "Priority", 
          <ExclamationCircleIcon />, 
          priorityLCs, 
          loadingStates.priority, 
          errorStates.priority,
          "No priority Letters of Credit at this time",
          "bg-red-100",
          "text-red-600",
          null,
          handleViewLC,
    
        )}

        {/* In Progress Section */}
        {renderSection(
          "In Progress", 
          <ClockIcon />, 
          inProgressLCs, 
          loadingStates.inProgress, 
          errorStates.inProgress,
          "No Letters of Credit in progress",
          "bg-yellow-100",
          "text-yellow-600",
          null,
          handleViewLC,
          null,
          null,
          null
        )}

        {/* Assigned Section */}
        {renderSection(
          "Assigned", 
          <DocumentIcon />, 
          assignedLCs, 
          loadingStates.assigned, 
          errorStates.assigned,
          "No Letters of Credit assigned",
          "bg-blue-100",
          "text-blue-600",
          null,
          handleViewLC,
        )}
      </div>
    </DashboardLayout>  
  );
};

export default ManagerDashboard;