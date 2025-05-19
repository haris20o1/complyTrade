import { useState, useEffect } from "react";
import { auditService } from "../authentication/apiITManager";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Activity, 
  Calendar, 
  RefreshCw 
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const RequestAuditPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [auditExists, setAuditExists] = useState(false);
  const [auditStatus, setAuditStatus] = useState({
    lastAuditDate: "March 15, 2025",
    status: "completed", // pending, in-progress, completed
    auditType: "System Security",
    auditedBy: "External Auditor Inc.",
    completionDate: "March 30, 2025",
    findings: 3,
    criticalIssues: 1
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Function to request an audit
  const handleRequestAudit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await auditService.requestAudit();
      setSuccess(true);
      // Check the response after successful audit request
      getAuditStatus();
      // Refresh audit logs after requesting a new audit
      fetchAuditLogs();
    } catch (err) {
      // Check if error is because audit already exists
      if (err.response && err.response.data && err.response.data.detail === "Audit request already exists for this user") {
        setAuditExists(true);
        setError("An audit request is already pending. Please wait for it to be processed.");
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

  // Function to fetch audit logs from the API
  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await auditService.getAuditLogs();
      // Set all logs without filtering
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };
  
  // Get audit status and logs on component mount
  useEffect(() => {
    getAuditStatus();
    fetchAuditLogs();
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

  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Audit Management</h2>
        <p className="text-gray-600">Request and monitor security audits for your banking system</p>
      </div>
      
      {/* Audit Status Card */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${statusDetails.color}-500 col-span-3`}>
          <div className="flex items-center mb-4">
            {statusDetails.icon}
            <h3 className="ml-2 text-lg font-medium text-gray-900">Audit Status</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <div className={`flex items-center text-${statusDetails.color}-600`}>
                {statusDetails.icon}
                <span className="ml-1 font-medium capitalize">{auditStatus.status}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{statusDetails.message}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Last Audit</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span className="font-medium">{auditStatus.lastAuditDate}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Type: {auditStatus.auditType}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completion</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span className="font-medium">{auditStatus.completionDate}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">By: {auditStatus.auditedBy}</p>
            </div>
          </div>
          
          {auditStatus.status === "completed" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Total Findings</p>
                    <p className="text-lg font-bold text-yellow-600">{auditStatus.findings} issues</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Critical Issues</p>
                    <p className="text-lg font-bold text-red-600">{auditStatus.criticalIssues} found</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> */}
      
      {/* Request Audit Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-500" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Request New Audit</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Initiate a new security audit of your banking system. This will request our security team to perform a comprehensive assessment of all security controls.
          </p>
          
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
              disabled={loading || auditExists}
              className={`px-4 py-2 rounded flex items-center ${
                loading || auditExists 
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
                getAuditStatus();
                fetchAuditLogs();
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Audit History</h3>
          </div>
          {loadingLogs && (
            <div className="flex items-center text-gray-500">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading audit logs...
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View Report</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loadingLogs ? "Loading audit logs..." : "No audit logs found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {auditLogs.length === 0 && !loadingLogs && (
          <div className="flex flex-col items-center justify-center p-6 text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No audit logs available</p>
            <p className="text-sm mt-2">You may not have permission to view logs yet, or no audit activity has been recorded.</p>
            <button 
              onClick={fetchAuditLogs}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        )}
      </div>
    
    </div>
    </DashboardLayout>
  );
};

export default RequestAuditPage;