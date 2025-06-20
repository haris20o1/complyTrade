// import { useState, useEffect } from "react";
// import { auditService, userService } from "../authentication/apiITManager";
// import { 
//   AlertTriangle, 
//   CheckCircle, 
//   Clock, 
//   FileText, 
//   Shield, 
//   Activity, 
//   User,
//   RefreshCw,
//   Eye,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import DashboardLayout from "../layouts/DashboardLayout";

// const RequestAuditPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [auditExists, setAuditExists] = useState(false);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [users, setUsers] = useState([]);
  
//   const [auditStatus, setAuditStatus] = useState({
//     lastAuditDate: "March 15, 2025",
//     status: "completed", // pending, in-progress, completed
//     auditType: "System Security",
//     auditedBy: "External Auditor Inc.",
//     completionDate: "March 30, 2025",
//     findings: 3,
//     criticalIssues: 1
//   });
  
//   const [auditRequests, setAuditRequests] = useState([]);
//   const [loadingRequests, setLoadingRequests] = useState(false);
  
//   const [auditLogs, setAuditLogs] = useState([]);
//   const [loadingLogs, setLoadingLogs] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [showLogs, setShowLogs] = useState(false);

//   // Function to request an audit
//   const handleRequestAudit = async () => {
//     if (!selectedUser) {
//       setError("Please select a user to request audit for");
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
    
//     try {
//       const response = await auditService.requestAudit(selectedUser);
//       setSuccess(true);
//       // Refresh audit requests after requesting a new audit
//       fetchAuditRequests();
//     } catch (err) {
//       // Check if error is because audit already exists
//       if (err.response && err.response.data && err.response.data.detail === "Audit request already exists for this user") {
//         setAuditExists(true);
//         setError("An audit request is already pending for this user. Please wait for it to be processed.");
//       } else {
//         setError("Failed to request audit. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to get current audit status
//   const getAuditStatus = async () => {
//     try {
//       // This is a mock function - in a real application you'd call your API
//       // const status = await auditService.getAuditStatus();
//       // setAuditStatus(status);
      
//       // For demo purposes, we're using the hardcoded status
//     } catch (err) {
//       console.error("Failed to fetch audit status:", err);
//     }
//   };

//   // Function to fetch users
//   const fetchUsers = async () => {
//     try {
//       const usersList = await userService.getAllUsers();
//       setUsers(usersList);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     }
//   };

//   // Function to fetch audit requests from the API
//   const fetchAuditRequests = async () => {
//     setLoadingRequests(true);
//     try {
//       const requests = await auditService.getAuditRequests();
//       setAuditRequests(requests);
//     } catch (err) {
//       console.error("Failed to fetch audit requests:", err);
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   // Function to fetch audit logs for a specific user
//   const fetchAuditLogs = async (userId) => {
//     // Clear previous logs immediately to avoid showing stale data
//     setAuditLogs([]);
//     setLoadingLogs(true);
//     setSelectedUserId(userId);
//     setShowLogs(true);
    
//     try {
//       const logs = await auditService.getAuditLogs(userId);
//       setAuditLogs(logs);
//     } catch (err) {
//       console.error("Failed to fetch audit logs:", err);
//       // Ensure logs are empty on error
//       setAuditLogs([]);
//     } finally {
//       setLoadingLogs(false);
//     }
//   };
  
//   // Get audit status, users, and requests on component mount
//   useEffect(() => {
//     getAuditStatus();
//     fetchUsers();
//     fetchAuditRequests();
    
//     // Clear audit logs when component mounts
//     setAuditLogs([]);
//     setShowLogs(false);
//   }, []);
  
//   // Determine what message/color to show based on status
//   const getStatusDetails = () => {
//     switch(auditStatus.status) {
//       case "pending":
//         return {
//           icon: <Clock className="h-5 w-5 text-yellow-500" />,
//           color: "yellow",
//           message: "Your audit request is pending approval"
//         };
//       case "in-progress":
//         return {
//           icon: <Activity className="h-5 w-5 text-blue-500" />,
//           color: "blue",
//           message: "Audit is currently in progress"
//         };
//       case "completed":
//         return {
//           icon: <CheckCircle className="h-5 w-5 text-green-500" />,
//           color: "green",
//           message: "Last audit was completed successfully"
//         };
//       default:
//         return {
//           icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
//           color: "gray",
//           message: "No audit information available"
//         };
//     }
//   };
  
//   // Format date to more readable format
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };
  
//   const statusDetails = getStatusDetails();

//     // Add this to your existing state variables at the top level of your component
//   const [sortDirection, setSortDirection] = useState('desc'); // 'desc' for most recent first

//   // Add this function to your component
//   const toggleSortDirection = () => {
//     setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
//   };

//   // Add this before the return statement
//   // Create sorted version of audit requests
//   const sortedAuditRequests = [...auditRequests].sort((a, b) => {
//     const dateA = new Date(a.created_at);
//     const dateB = new Date(b.created_at);
//     return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
//   });


//   return (
//     <DashboardLayout>
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Audit Management</h2>
//         <p className="text-gray-600">Request and monitor security audits for your banking system</p>
//       </div>
      
//       {/* Request Audit Card */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center mb-4">
//             <Shield className="h-5 w-5 text-blue-500" />
//             <h3 className="ml-2 text-lg font-medium text-gray-900">Request New Audit</h3>
//           </div>
          
//           <p className="text-gray-600 mb-6">
//             Initiate a new security audit for a specific user. This will request our security team to perform a comprehensive assessment of all security controls.
//           </p>
          
//           {/* User Selection Dropdown */}
//           <div className="mb-4">
//             <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
//               Select User for Audit
//             </label>
//             <div className="relative">
//               <select
//                 id="user-select"
//                 value={selectedUser}
//                 onChange={(e) => setSelectedUser(e.target.value)}
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//               >
//                 <option value="">Select a user</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {user.fullname} ({user.role})
//                   </option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <User className="h-4 w-4" />
//               </div>
//             </div>
//           </div>
          
//           {error && (
//             <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertTriangle className="h-5 w-5 text-red-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {success && (
//             <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <CheckCircle className="h-5 w-5 text-green-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-green-700">Your audit request has been submitted successfully. The security team will review your request shortly.</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="flex items-center justify-between mt-4">
//             <button 
//               onClick={handleRequestAudit}
//               disabled={loading || auditExists || !selectedUser}
//               className={`px-4 py-2 rounded flex items-center ${
//                 loading || auditExists || !selectedUser
//                   ? 'bg-gray-300 cursor-not-allowed' 
//                   : 'bg-blue-600 text-white hover:bg-blue-700'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Shield className="h-4 w-4 mr-2" />
//                   Request Security Audit
//                 </>
//               )}
//             </button>
            
//             <button 
//               onClick={() => {
//                 fetchAuditRequests();
//                 setError(null);
//                 setSuccess(false);
//               }}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh Status
//             </button>
//           </div>
//         </div>
        
//         {/* Audit Information */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center mb-4">
//             <FileText className="h-5 w-5 text-blue-500" />
//             <h3 className="ml-2 text-lg font-medium text-gray-900">Audit Information</h3>
//           </div>
          
//           <div className="space-y-4">
//             <div>
//               <h4 className="font-medium text-gray-900">What is a security audit?</h4>
//               <p className="text-gray-600 mt-1">
//                 A comprehensive review of your banking system's security controls, configurations, and vulnerabilities. Our team will assess your system against industry standards and best practices.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-900">Audit process</h4>
//               <ol className="mt-1 text-gray-600 list-decimal list-inside space-y-1">
//                 <li>Submit an audit request (requires IT Manager approval)</li>
//                 <li>Super Admin reviews and approves the request</li>
//                 <li>Security team schedules and performs the audit</li>
//                 <li>Findings and recommendations are documented</li>
//                 <li>Results are shared with stakeholders</li>
//                 <li>Remediation plan is developed and implemented</li>
//               </ol>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-900">Typical timeline</h4>
//               <p className="text-gray-600 mt-1">
//                 Most audits are completed within 2-3 weeks of approval, depending on system complexity and resource availability.
//               </p>
//             </div>
//           </div>
          
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <p className="text-sm text-gray-500">
//               For immediate security concerns, please contact the security team directly at <span className="font-medium">security@bankingsystem.com</span>
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Audit Requests Table */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <Activity className="h-5 w-5 text-blue-500" />
//             <h3 className="ml-2 text-lg font-medium text-gray-900">Audit Requests</h3>
//           </div>
//           {loadingRequests && (
//             <div className="flex items-center text-gray-500">
//               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//               Loading audit requests...
//             </div>
//           )}
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested For</th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <button 
//                     onClick={toggleSortDirection}
//                     className="flex items-center focus:outline-none text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Date
//                     {sortDirection === 'desc' ? 
//                       <ChevronDown className="h-4 w-4 ml-1" /> : 
//                       <ChevronUp className="h-4 w-4 ml-1" />
//                     }
//                   </button>
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th> */}
                
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {auditRequests.length > 0 ? (
//                 sortedAuditRequests.map((request) => (
//                   <tr key={request.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {request.request_for_name}
//                     </td>
//                     {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       #{request.id}
//                     </td> */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDate(request.created_at)}
//                     </td>
//                     {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {request.requested_by_name}
//                     </td> */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {request.request_for_role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         request.status === 'approved' 
//                           ? 'bg-green-100 text-green-800'
//                           : request.status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button 
//                         onClick={() => fetchAuditLogs(request.request_for_id)}
//                         className="text-blue-600 hover:text-blue-900 flex items-center"
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         View Logs
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
//                     {loadingRequests ? "Loading audit requests..." : "No audit requests found."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {auditRequests.length === 0 && !loadingRequests && (
//           <div className="flex flex-col items-center justify-center p-6 text-gray-500">
//             <AlertTriangle className="h-12 w-12 mb-4 text-gray-400" />
//             <p className="text-lg font-medium">No audit requests available</p>
//             <p className="text-sm mt-2">You haven't made any audit requests yet, or no audit activity has been recorded.</p>
//             <button 
//               onClick={fetchAuditRequests}
//               className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Try Again
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Audit Logs Section - Visible only when logs are requested */}
//       {showLogs && (
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center">
//               <Clock className="h-5 w-5 text-blue-500" />
//               <h3 className="ml-2 text-lg font-medium text-gray-900">
//                 Audit Logs for User ID: {selectedUserId}
//               </h3>
//             </div>
//             <button 
//               onClick={() => {
//                 setShowLogs(false);
//                 setAuditLogs([]);  // Clear logs when closing
//               }}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//           </div>
          
//           {loadingLogs ? (
//             <div className="flex justify-center items-center p-8">
//               <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target LC</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target User</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {auditLogs.length > 0 ? (
//                     auditLogs.map((log) => (
//                       <tr key={log.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           #{log.id}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {formatDate(log.timestamp)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {log.action.replace(/_/g, ' ').toUpperCase()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {log.target_lc_no}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {log.target_user_id}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {log.comment}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                         No audit logs found for this user.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     </DashboardLayout>
//   );
// };

// export default RequestAuditPage;

import { useState, useEffect } from "react";
import { auditService, userService } from "../authentication/apiITManager";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Activity, 
  User,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const RequestAuditPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [auditExists, setAuditExists] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  
  const [auditStatus, setAuditStatus] = useState({
    lastAuditDate: "March 15, 2025",
    status: "completed", // pending, in-progress, completed
    auditType: "System Security",
    auditedBy: "External Auditor Inc.",
    completionDate: "March 30, 2025",
    findings: 3,
    criticalIssues: 1
  });
  
  const [auditRequests, setAuditRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(''); // Added to store user name
  const [showLogs, setShowLogs] = useState(false);

  // Function to request an audit
  const handleRequestAudit = async () => {
    if (!selectedUser) {
      setError("Please select a user to request audit for");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await auditService.requestAudit(selectedUser);
      setSuccess(true);
      // Refresh audit requests after requesting a new audit
      fetchAuditRequests();
    } catch (err) {
      // Check if error is because audit already exists
      if (err.response && err.response.data && err.response.data.detail === "Audit request already exists for this user") {
        setAuditExists(true);
        setError("An audit request is already pending for this user. Please wait for it to be processed.");
      } else {
        setError("Failed to request audit. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get current audit status
  const getAuditStatus = async () => {
    try {
      // This is a mock function - in a real application you'd call your API
      // const status = await auditService.getAuditStatus();
      // setAuditStatus(status);
      
      // For demo purposes, we're using the hardcoded status
    } catch (err) {
      console.error("Failed to fetch audit status:", err);
    }
  };

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const usersList = await userService.getAllUsers();
      setUsers(usersList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Function to fetch audit requests from the API
  const fetchAuditRequests = async () => {
    setLoadingRequests(true);
    try {
      const requests = await auditService.getAuditRequests();
      setAuditRequests(requests);
    } catch (err) {
      console.error("Failed to fetch audit requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Helper function to get user name by ID
  const getUserNameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.fullname : `User ID: ${userId}`;
  };

  // Function to fetch audit logs for a specific user
  const fetchAuditLogs = async (userId, userName) => {
    // Clear previous logs immediately to avoid showing stale data
    setAuditLogs([]);
    setLoadingLogs(true);
    setSelectedUserId(userId);
    setSelectedUserName(userName); // Store the user name
    setShowLogs(true);
    
    try {
      const logs = await auditService.getAuditLogs(userId);
      // Process logs to include user names for target_user_id
      const processedLogs = logs.map(log => ({
        ...log,
        target_user_name: getUserNameById(log.target_user_id)
      }));
      setAuditLogs(processedLogs);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      // Ensure logs are empty on error
      setAuditLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };
  
  // Get audit status, users, and requests on component mount
  useEffect(() => {
    getAuditStatus();
    fetchUsers();
    fetchAuditRequests();
    
    // Clear audit logs when component mounts
    setAuditLogs([]);
    setShowLogs(false);
  }, []);
  
  // Determine what message/color to show based on status
  const getStatusDetails = () => {
    switch(auditStatus.status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          color: "yellow",
          message: "Your audit request is pending approval"
        };
      case "in-progress":
        return {
          icon: <Activity className="h-5 w-5 text-blue-500" />,
          color: "blue",
          message: "Audit is currently in progress"
        };
      case "completed":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: "green",
          message: "Last audit was completed successfully"
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
          color: "gray",
          message: "No audit information available"
        };
    }
  };
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const statusDetails = getStatusDetails();

  // Add this to your existing state variables at the top level of your component
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' for most recent first

  // Add this function to your component
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  // Add this before the return statement
  // Create sorted version of audit requests
  const sortedAuditRequests = [...auditRequests].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Audit Management</h2>
        <p className="text-gray-600">Request and monitor security audits for your banking system</p>
      </div>
      
      {/* Request Audit Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-500" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Request New Audit</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Initiate a new security audit for a specific user. This will request our security team to perform a comprehensive assessment of all security controls.
          </p>
          
          {/* User Selection Dropdown */}
          <div className="mb-4">
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select User for Audit
            </label>
            <div className="relative">
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname} ({user.role})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Your audit request has been submitted successfully. The security team will review your request shortly.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={handleRequestAudit}
              disabled={loading || auditExists || !selectedUser}
              className={`px-4 py-2 rounded flex items-center ${
                loading || auditExists || !selectedUser
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Request Security Audit
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                fetchAuditRequests();
                setError(null);
                setSuccess(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </button>
          </div>
        </div>
        
        {/* Audit Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Audit Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">What is a security audit?</h4>
              <p className="text-gray-600 mt-1">
                A comprehensive review of your banking system's security controls, configurations, and vulnerabilities. Our team will assess your system against industry standards and best practices.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Audit process</h4>
              <ol className="mt-1 text-gray-600 list-decimal list-inside space-y-1">
                <li>Submit an audit request (requires IT Manager approval)</li>
                <li>Super Admin reviews and approves the request</li>
                <li>Security team schedules and performs the audit</li>
                <li>Findings and recommendations are documented</li>
                <li>Results are shared with stakeholders</li>
                <li>Remediation plan is developed and implemented</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Typical timeline</h4>
              <p className="text-gray-600 mt-1">
                Most audits are completed within 2-3 weeks of approval, depending on system complexity and resource availability.
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              For immediate security concerns, please contact the security team directly at <span className="font-medium">security@bankingsystem.com</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Audit Requests Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Audit Requests</h3>
          </div>
          {loadingRequests && (
            <div className="flex items-center text-gray-500">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading audit requests...
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested For</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={toggleSortDirection}
                    className="flex items-center focus:outline-none text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                    {sortDirection === 'desc' ? 
                      <ChevronDown className="h-4 w-4 ml-1" /> : 
                      <ChevronUp className="h-4 w-4 ml-1" />
                    }
                  </button>
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th> */}
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditRequests.length > 0 ? (
                sortedAuditRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.request_for_name}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{request.id}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.created_at)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.requested_by_name}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.request_for_role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => fetchAuditLogs(request.request_for_id, request.request_for_name)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loadingRequests ? "Loading audit requests..." : "No audit requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {auditRequests.length === 0 && !loadingRequests && (
          <div className="flex flex-col items-center justify-center p-6 text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No audit requests available</p>
            <p className="text-sm mt-2">You haven't made any audit requests yet, or no audit activity has been recorded.</p>
            <button 
              onClick={fetchAuditRequests}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        )}
      </div>
      
      {/* Audit Logs Section - Visible only when logs are requested */}
      {showLogs && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                Audit Logs for User: {selectedUserName}
              </h3>
            </div>
            <button 
              onClick={() => {
                setShowLogs(false);
                setAuditLogs([]);  // Clear logs when closing
                setSelectedUserName(''); // Clear user name
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          
          {loadingLogs ? (
            <div className="flex justify-center items-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target LC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{log.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.action.replace(/_/g, ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.target_lc_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.target_user_name || `User ID: ${log.target_user_id}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.comment}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No audit logs found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default RequestAuditPage;