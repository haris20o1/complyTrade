// // File: src/pages/admin/AdminDashboard.jsx
// import React from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import Card from '../../components/common/Card';
// import { 
//   DocumentTextIcon, 
//   ClipboardDocumentCheckIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationCircleIcon,
//   ChevronRightIcon
// } from '@heroicons/react/24/outline';

// const Admin1 = () => {
//   // Sample stats
//   const stats = [
//     {
//       id: 1,
//       name: 'Total LC Documents',
//       value: '143',
//       icon: DocumentTextIcon,
//       color: 'bg-blue-500',
//       change: '+12% from last month'
//     },
//     {
//       id: 2,
//       name: 'Assigned',
//       value: '32',
//       icon: ClipboardDocumentCheckIcon,
//       color: 'bg-indigo-500',
//       change: '+5% from last month'
//     },
//     {
//       id: 3,
//       name: 'Completed',
//       value: '98',
//       icon: CheckCircleIcon,
//       color: 'bg-green-500',
//       change: '+15% from last month'
//     },
//     {
//       id: 4,
//       name: 'Pending',
//       value: '13',
//       icon: ClockIcon,
//       color: 'bg-yellow-500',
//       change: '-8% from last month'
//     }
//   ];

//   // Sample recent activity
//   const recentActivity = [
//     {
//       id: 1,
//       action: 'LC-2023-006 assigned to Mike Johnson',
//       timestamp: '2 hours ago',
//       user: 'Admin User'
//     },
//     {
//       id: 2,
//       action: 'LC-2023-005 assigned to Jane Smith',
//       timestamp: '4 hours ago',
//       user: 'Admin User'
//     },
//     {
//       id: 3,
//       action: 'LC-2023-004 completed by John Doe',
//       timestamp: '1 day ago',
//       user: 'John Doe'
//     },
//     {
//       id: 4,
//       action: 'New LC document uploaded: LC-2023-007',
//       timestamp: '1 day ago',
//       user: 'Swift User'
//     },
//     {
//       id: 5,
//       action: 'Supporting documents added to LC-2023-003',
//       timestamp: '2 days ago',
//       user: 'Docs User'
//     }
//   ];

//   // Sample alerts
//   const alerts = [
//     {
//       id: 1,
//       message: 'LC-2023-002 is approaching due date (Tomorrow)',
//       severity: 'warning',
//       timestamp: '12 min ago'
//     },
//     {
//       id: 2,
//       message: 'LC-2023-005 requires additional documentation',
//       severity: 'error',
//       timestamp: '3 hours ago'
//     },
//     {
//       id: 3,
//       message: 'System maintenance scheduled for Sunday, 2 AM - 4 AM',
//       severity: 'info',
//       timestamp: '1 day ago'
//     }
//   ];

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Overview of LC processing activity and key metrics.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.id} className="flex flex-col">
//               <div className="flex items-center">
//                 <div className={`p-3 rounded-lg ${stat.color}`}>
//                   <Icon className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-5">
//                   <p className="text-sm font-medium text-gray-500">{stat.name}</p>
//                   <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">{stat.change}</div>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Two-column layout for smaller sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <Card title="Recent Activity">
//           <div className="flow-root">
//             <ul className="-mb-8">
//               {recentActivity.map((activity, activityIdx) => (
//                 <li key={activity.id}>
//                   <div className="relative pb-8">
//                     {activityIdx !== recentActivity.length - 1 ? (
//                       <span
//                         className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
//                         aria-hidden="true"
//                       />
//                     ) : null}
//                     <div className="relative flex space-x-3">
//                       <div>
//                         <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                           <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600" />
//                         </span>
//                       </div>
//                       <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                         <div>
//                           <p className="text-sm text-gray-800">{activity.action}</p>
//                           <p className="text-xs text-gray-500">{activity.user}</p>
//                         </div>
//                         <div className="text-sm text-gray-500 whitespace-nowrap">
//                           <span>{activity.timestamp}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="mt-4">
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               View all activity
//               <ChevronRightIcon className="ml-1 h-5 w-5" />
//             </a>
//           </div>
//         </Card>

//         {/* Alerts */}
//         <Card title="Alerts & Notifications">
//           <div className="space-y-4">
//             {alerts.map((alert) => {
//               let Icon, bgColor, textColor;

//               switch (alert.severity) {
//                 case 'error':
//                   Icon = ExclamationCircleIcon;
//                   bgColor = 'bg-red-50';
//                   textColor = 'text-red-800';
//                   break;
//                 case 'warning':
//                   Icon = ExclamationCircleIcon;
//                   bgColor = 'bg-yellow-50';
//                   textColor = 'text-yellow-800';
//                   break;
//                 case 'info':
//                 default:
//                   Icon = ClockIcon;
//                   bgColor = 'bg-blue-50';
//                   textColor = 'text-blue-800';
//                   break;
//               }

//               return (
//                 <div
//                   key={alert.id}
//                   className={`${bgColor} ${textColor} p-4 rounded-md flex items-start`}
//                 >
//                   <div className="flex-shrink-0">
//                     <Icon className="h-5 w-5" aria-hidden="true" />
//                   </div>
//                   <div className="ml-3 flex-1">
//                     <p className="text-sm font-medium">{alert.message}</p>
//                     <p className="mt-1 text-xs opacity-70">{alert.timestamp}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="mt-4">
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               View all alerts
//               <ChevronRightIcon className="ml-1 h-5 w-5" />
//             </a>
//           </div>
//         </Card>
//       </div>

//       {/* Performance Metrics */}
//       {/* <div className="mt-6">
//         <Card title="Processing Performance">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
//               <div className="text-3xl font-bold text-indigo-600">98%</div>
//               <div className="text-sm text-gray-500 mt-1">On-Time Completion</div>
//             </div>
//             <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
//               <div className="text-3xl font-bold text-green-600">2.4</div>
//               <div className="text-sm text-gray-500 mt-1">Avg. Processing Days</div>
//             </div>
//             <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
//               <div className="text-3xl font-bold text-blue-600">4.8/5</div>
//               <div className="text-sm text-gray-500 mt-1">Quality Score</div>
//             </div>
//           </div>
//         </Card>
//       </div> */}
//     </DashboardLayout>
//   );
// };

// export default Admin1;
// import React, { useEffect, useState } from 'react';
// import DashboardLayout from '../../components/layouts/DashboardLayout';
// import axiosInstance from '../authentication/axios';
// import { 
//   ClipboardDocumentCheckIcon,
//   ChevronRightIcon,
//   DocumentTextIcon,
//   ClipboardDocumentListIcon,
//   CheckCircleIcon,
//   ClockIcon
// } from '@heroicons/react/24/outline';
// import { Bar } from 'react-chartjs-2';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   PointElement, 
//   LineElement,
//   BarElement,
//   Title, 
//   Tooltip, 
//   Legend
// } from 'chart.js';
// // import { fetch_lcs_stats, fetch_recent_activities } from "../../apis/admin";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const fetch_lcs_stats= async () => {
//   const response = await axiosInstance.get("/admin/lcs_stats");
//   console.log(response.data)
//   return response.data;

// };

// const fetch_recent_activities= async () => {
//   const response = await axiosInstance.get("/admin/recent_activities");
//   console.log(response.data)
//   return response.data;

// };

// const formatActionText = (activity) => {
//   switch(activity.status) {
//     case 'completed':
//       return `LC-${activity.lc_no} completed by ${activity.user_name}`;
//     case 'assign':
//       return `LC-${activity.lc_no} assign to ${activity.user_name}`;
//     case 'remove':
//       return `LC-${activity.lc_no} remove by ${activity.user_name}`;
//     default:
//       return `LC-${activity.lc_no} updated by ${activity.user_name}`;
//   }
// };
// const AdminDashboard = () => {
//   const [lcStats, setLcStats] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const colors = {
//     total: {
//       base: 'rgba(178, 171, 171, 0.366)',      
//       light: 'rgba(174, 213, 249, 0.781)'      
//     },
//     assigned: {
//       base: 'rgba(245, 158, 11, 0.85)',     
//       light: 'rgba(241, 187, 92, 0.3)'       
//     },
//     completed: {
//       base: 'rgba(74, 107, 174, 0.85)',    
//       light: 'rgba(98, 157, 83, 0.3)'       
//     },
//     pending: {
//       base: 'rgba(239, 68, 68, 0.85)',       
//       light: 'rgba(228, 70, 70, 0.3)'       
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch both LC stats and recent activities in parallel
//         const [statsData, activitiesData] = await Promise.all([
//           fetch_lcs_stats(),
//           fetch_recent_activities()
//         ]);

//         setLcStats(statsData);
//         setRecentActivities(activitiesData);

//         // Calculate totals for the status metrics
//         const totals = statsData.reduce((acc, curr) => {
//           return {
//             total_lcs: acc.total_lcs + curr.total_lcs,
//             completed_lcs: acc.completed_lcs + curr.completed_lcs
//           };
//         }, { total_lcs: 0, completed_lcs: 0 });

//         setStatusMetrics(prev => prev.map(metric => {
//           if (metric.title === 'Total LC Documents') {
//             return { ...metric, count: totals.total_lcs };
//           } else if (metric.title === 'Completed') {
//             return { ...metric, count: totals.completed_lcs };
//           } else if (metric.title === 'Pending') {
//             return { ...metric, count: totals.total_lcs - totals.completed_lcs };
//           }
//           return metric;
//         }));

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//    const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const seconds = Math.floor((now - date) / 1000);

//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;

//     if (minutes < 1) {
//       return 'less than a minute ago';
//     } else if (hours < 1) {
//       return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
//     } else {
//       return `${hours} hour${hours === 1 ? '' : 's'}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}` : ''} ago`;
//     }
//   };

//    const [statusMetrics, setStatusMetrics] = useState([
//     {
//       title: 'Total LC Documents',
//       count: 0,
//       icon: <DocumentTextIcon className="h-6 w-6" style={{ color: colors.total.base }} />,
//       color: 'rgba(17, 18, 17, 0.592)',
//       bgColor: colors.total.light
//     },
//     {
//       title: 'Assigned',
//       count: 0,
//       icon: <ClipboardDocumentListIcon className="h-6 w-6" style={{ color: colors.assigned.base }} />,
//       color: 'rgba(17, 18, 17, 0.592)',
//       bgColor: colors.assigned.light
//     },
//     {
//       title: 'Completed',
//       count: 0,
//       icon: <CheckCircleIcon className="h-6 w-6" style={{ color: colors.completed.base }} />,
//       color: 'rgba(17, 18, 17, 0.592)',
//       bgColor: colors.completed.light
//     },
//     {
//       title: 'Pending',
//       count: 0,
//       icon: <ClockIcon className="h-6 w-6" style={{ color: colors.pending.base }} />,
//       color: 'rgba(17, 18, 17, 0.592)',
//       bgColor: colors.pending.light
//     }
//   ]);

//    const prepareChartData = () => {
//     if (!lcStats || lcStats.length === 0) {
//       return {
//         labels: [],
//         datasets: [
//           {
//             label: 'Completed',
//             data: [],
//             backgroundColor: colors.completed.base,
//             borderColor: colors.completed.base,
//             borderWidth: 1,
//           },
//           {
//             label: 'Remaining',
//             data: [],
//             backgroundColor: colors.total.base,
//             borderColor: colors.total.base,
//             borderWidth: 1,
//           }
//         ]
//       };
//     }

//     // Sort data by month
//     const sortedData = [...lcStats].sort((a, b) => {
//       return new Date(a.month) - new Date(b.month);
//     });

//     // Extract month labels (short format like 'Jan', 'Feb')
//     const labels = sortedData.map(item => {
//       const date = new Date(item.month);
//       return date.toLocaleString('default', { month: 'short' });
//     });

//     // Extract completed and remaining data
//     const completedData = sortedData.map(item => item.completed_lcs);
//     const remainingData = sortedData.map(item => item.total_lcs - item.completed_lcs);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Completed',
//           data: completedData,
//           backgroundColor: colors.completed.base,
//           borderColor: colors.completed.base,
//           borderWidth: 1,
//         },
//         {
//           label: 'Remaining',
//           data: remainingData,
//           backgroundColor: colors.total.base,
//           borderColor: colors.total.base,
//           borderWidth: 1,
//         }
//       ]
//     };
//   };

//   const lcData = prepareChartData();

//   const lcOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           boxWidth: 16,
//           padding: 20,
//           font: {
//             size: 13,
//             family: 'Inter, sans-serif',
//             weight: '500'
//           },
//           usePointStyle: true,
//           pointStyle: 'circle'
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(17, 24, 39, 0.9)',
//         titleFont: {
//           size: 14,
//           weight: 'bold',
//           family: 'Inter, sans-serif'
//         },
//         bodyFont: {
//           size: 13,
//           family: 'Inter, sans-serif'
//         },
//         callbacks: {
//           label: function(context) {
//             const label = context.dataset.label || '';
//             return `${label}: ${context.raw}`;
//           }
//         }
//       },
//       title: {
//         display: true,
//         text: 'LC DOCUMENTS',
//         font: {
//           size: 16,
//           weight: 'bold',
//           family: 'Inter, sans-serif'
//         },
//         padding: {
//           top: 10,
//           bottom: 20
//         }
//       }
//     },
//     scales: {
//       y: {
//         stacked: true,
//         beginAtZero: true,
//         min: 0,
//         ticks: {
//           font: {
//             size: 12,
//             family: 'Inter, sans-serif'
//           }
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       },
//       x: {
//         stacked: true,
//         grid: {
//           display: false
//         },
//         ticks: {
//           font: {
//             size: 12,
//             family: 'Inter, sans-serif'
//           }
//         }
//       }
//     },
//     interaction: {
//       intersect: false,
//       mode: 'index',
//     },
//     barPercentage: 0.6,
//     categoryPercentage: 0.5
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <p>Loading data...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <p className="text-red-500">Error: {error}</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         <p className="mt-2 text-sm text-gray-500">
//           Overview of LC processing activity and key metrics.
//         </p>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//         {statusMetrics.map((metric, index) => (
//           <div 
//             key={index} 
//             className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
//           >
//             <div className="flex items-start space-x-4">
//               <div className="p-2 rounded-lg" style={{ backgroundColor: metric.bgColor }}>
//                 {metric.icon}
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
//                 <p className="text-3xl font-bold mt-1" style={{ color: metric.color }}>
//                   {metric.count}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content Section - 50/50 split */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Recent Activity Panel */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
//           <div className="flow-root max-h-96 overflow-y-auto pr-2">
//             <ul className="-mb-8">
//               {recentActivities.map((activity, activityIdx) => (
//                 <li key={activity.id}>
//                   <div className="relative pb-8">
//                     {activityIdx !== recentActivities.length - 1 ? (
//                       <span
//                         className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
//                         aria-hidden="true"
//                       />
//                     ) : null}
//                     <div className="relative flex space-x-3">
//                       <div>
//                         <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                           <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600" />
//                         </span>
//                       </div>
//                       <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                         <div>
//                         <p className="text-sm text-gray-800 font-medium">
//   {formatActionText(activity)}
// </p>
//                           <p className="text-xs text-gray-500">
//                                Assigned by {activity.admin_name}
//                           </p>
//                         </div>
//                         <div className="text-xs text-gray-500 whitespace-nowrap">
//                           <span>{formatTimeAgo(activity.log_date)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="mt-4">
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               View all activity
//               <ChevronRightIcon className="ml-1 h-5 w-5" />
//             </a>
//           </div>
//         </div>

//         {/* LC Documents Stacked Bar Chart */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">LC Documents Overview</h2>
//           <div className="h-64">
//             {lcStats.length > 0 ? (
//               <Bar data={lcData} options={lcOptions} />
//             ) : (
//               <div className="flex justify-center items-center h-full">
//                 <p>No data available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../authentication/axios';
import { useAuth } from '../../context/AuthContext';

import {
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// AUTHENTICATION HELPER FUNCTIONS
const validateUserAuth = (userId, userInfo) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!userInfo) {
    throw new Error('User information is required');
  }
  return true;
};

const logUserInfo = (userId, userInfo, operation) => {
  console.log(`[${operation}] Current user ID:`, userId);
  console.log(`[${operation}] Current user info:`, userInfo);
};

const createAuthenticatedRequest = (userId, userInfo) => {
  validateUserAuth(userId, userInfo);
  return {
    params: { userId },
    // Add any additional auth headers if needed
    headers: {
      'User-Context': JSON.stringify({ userId, userInfo })
    }
  };
};

// LC STATS FUNCTIONS
const fetch_lcs_stats = async (requestConfig) => {
  try {
    const response = await axiosInstance.get("/admin/lcs_stats", requestConfig);
    console.log("LC Stats response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching LC stats:", error);
    // Return empty data instead of throwing to avoid breaking the UI
    return [];
  }
};

const fetch_recent_activities = async (requestConfig) => {
  try {
    const response = await axiosInstance.get("/admin/recent_activities", requestConfig);
    console.log("Activities response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    // Return empty data instead of throwing to avoid breaking the UI
    return [];
  }
};

// DATA PROCESSING FUNCTIONS
const processLcStatsData = (statsData) => {
  if (!Array.isArray(statsData) || statsData.length === 0) {
    return {
      totals: { total_lcs: 0, completed_lcs: 0, assigned_lcs: 0 },
      hasData: false
    };
  }

  const totals = statsData.reduce((acc, curr) => {
    return {
      total_lcs: acc.total_lcs + curr.total_lcs,
      completed_lcs: acc.completed_lcs + curr.completed_lcs,
      assigned_lcs: acc.assigned_lcs + (curr.assigned_lcs || 0)
    };
  }, { total_lcs: 0, completed_lcs: 0, assigned_lcs: 0 });

  return { totals, hasData: true };
};

const updateStatusMetrics = (statusMetrics, totals) => {
  return statusMetrics.map(metric => {
    switch (metric.title) {
      case 'Total LC Documents':
        return { ...metric, count: totals.total_lcs };
      case 'Completed':
        return { ...metric, count: totals.completed_lcs };
      case 'Assigned':
        return { ...metric, count: totals.assigned_lcs || 0 };
      case 'Pending':
        return { ...metric, count: totals.total_lcs - totals.completed_lcs };
      default:
        return metric;
    }
  });
};

// MAIN DATA FETCHING ORCHESTRATOR
const fetchDashboardData = async (userId, userInfo) => {
  try {
    logUserInfo(userId, userInfo, 'Dashboard Data Fetch');
    
    // Create authenticated request configuration
    const requestConfig = createAuthenticatedRequest(userId, userInfo);
    
    // Fetch all data concurrently
    const [statsData, activitiesData] = await Promise.all([
      fetch_lcs_stats(requestConfig),
      fetch_recent_activities(requestConfig)
    ]);

    return {
      success: true,
      data: {
        statsData,
        activitiesData
      }
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    
    if (error.response && error.response.status === 403) {
      return {
        success: false,
        error: "You don't have permission to access admin data.",
        permissionDenied: true
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || "An error occurred while fetching data",
      permissionDenied: false
    };
  }
};

// Replace the existing formatActionText function with this:
const formatActionText = (activity) => {
  // Return the comment directly from the new API response format
  return activity.comment;
};

const AdminDashboard = () => {
  const { userId, userInfo } = useAuth();
  
  const [lcStats, setLcStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(true);

  const colors = {
    total: {
      base: 'rgba(178, 171, 171, 0.366)',
      light: 'rgba(174, 213, 249, 0.781)'
    },
    assigned: {
      base: 'rgba(245, 158, 11, 0.85)',
      light: 'rgba(241, 187, 92, 0.3)'
    },
    completed: {
      base: 'rgba(74, 107, 174, 0.85)',
      light: 'rgba(98, 157, 83, 0.3)'
    },
    pending: {
      base: 'rgba(239, 68, 68, 0.85)',
      light: 'rgba(228, 70, 70, 0.3)'
    }
  };

  const [statusMetrics, setStatusMetrics] = useState([
    {
      title: 'Total LC Documents',
      count: 0,
      icon: <DocumentTextIcon className="h-6 w-6" style={{ color: colors.total.base }} />,
      color: 'rgba(17, 18, 17, 0.592)',
      bgColor: colors.total.light
    },
    {
      title: 'Assigned',
      count: 0,
      icon: <ClipboardDocumentListIcon className="h-6 w-6" style={{ color: colors.assigned.base }} />,
      color: 'rgba(17, 18, 17, 0.592)',
      bgColor: colors.assigned.light
    },
    {
      title: 'Completed',
      count: 0,
      icon: <CheckCircleIcon className="h-6 w-6" style={{ color: colors.completed.base }} />,
      color: 'rgba(17, 18, 17, 0.592)',
      bgColor: colors.completed.light
    },
    {
      title: 'Pending',
      count: 0,
      icon: <ClockIcon className="h-6 w-6" style={{ color: colors.pending.base }} />,
      color: 'rgba(17, 18, 17, 0.592)',
      bgColor: colors.pending.light
    }
  ]);

  useEffect(() => {
    const initializeDashboard = async () => {
      // Wait for user authentication to be available
      if (!userId || !userInfo) {
        console.log('User authentication not available yet, skipping data fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard data using the orchestrator function
        const result = await fetchDashboardData(userId, userInfo);
        
        if (result.success) {
          const { statsData, activitiesData } = result.data;
          
          // Process LC stats data
          const { totals, hasData } = processLcStatsData(statsData);
          
          if (hasData) {
            setLcStats(statsData);
            setStatusMetrics(prev => updateStatusMetrics(prev, totals));
          }
          
          // Set activities data
          if (Array.isArray(activitiesData)) {
            setRecentActivities(activitiesData);
          }
          
          setHasPermission(true);
        } else {
          setError(result.error);
          setHasPermission(!result.permissionDenied);
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        setError("An unexpected error occurred while initializing the dashboard");
        setHasPermission(true);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [userId, userInfo]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (minutes < 1) {
      return 'less than a minute ago';
    } else if (hours < 1) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return `${hours} hour${hours === 1 ? '' : 's'}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}` : ''} ago`;
    }
  };

  const prepareChartData = () => {
    if (!lcStats || lcStats.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Completed',
            data: [],
            backgroundColor: colors.completed.base,
            borderColor: colors.completed.base,
            borderWidth: 1,
          },
          {
            label: 'Remaining',
            data: [],
            backgroundColor: colors.total.base,
            borderColor: colors.total.base,
            borderWidth: 1,
          }
        ]
      };
    }

    // Sort data by month
    const sortedData = [...lcStats].sort((a, b) => {
      return new Date(a.month) - new Date(b.month);
    });

    // Extract month labels (short format like 'Jan', 'Feb')
    const labels = sortedData.map(item => {
      const date = new Date(item.month);
      return date.toLocaleString('default', { month: 'short' });
    });

    // Extract completed and remaining data
    const completedData = sortedData.map(item => item.completed_lcs);
    const remainingData = sortedData.map(item => item.total_lcs - item.completed_lcs);

    return {
      labels,
      datasets: [
        {
          label: 'Completed',
          data: completedData,
          backgroundColor: colors.completed.base,
          borderColor: colors.completed.base,
          borderWidth: 1,
        },
        {
          label: 'Remaining',
          data: remainingData,
          backgroundColor: colors.total.base,
          borderColor: colors.total.base,
          borderWidth: 1,
        }
      ]
    };
  };

  const lcData = prepareChartData();

  const lcOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 16,
          padding: 20,
          font: {
            size: 13,
            family: 'Inter, sans-serif',
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 13,
          family: 'Inter, sans-serif'
        },
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.raw}`;
          }
        }
      },
      title: {
        display: true,
        text: 'LC DOCUMENTS',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        min: 0,
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    barPercentage: 0.6,
    categoryPercentage: 0.5
  };

  // Loading state while waiting for user authentication
  // if (!userId || !userInfo) {
  //   return (
  //     <DashboardLayout>
  //       <div className="flex justify-center items-center h-64">
  //         <div className="animate-pulse flex flex-col items-center">
  //           <div className="h-8 w-8 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  //           <p>Loading user authentication...</p>
  //         </div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p>Loading admin dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasPermission) {
    return (
      <DashboardLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Access Denied</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You don't have permission to access the admin dashboard. Please contact your system administrator for assistance.</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <a href="/" className="px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600">
                    Return to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Overview of LC processing activity and key metrics.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statusMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: metric.bgColor }}>
                {metric.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <p className="text-3xl font-bold mt-1" style={{ color: metric.color }}>
                  {metric.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Section - 50/50 split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activity Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivities.length > 0 ? (
            <div className="flow-root max-h-96 overflow-y-auto pr-2">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id || activityIdx}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
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
                            <p className="text-sm text-gray-800 font-medium">
                              {formatActionText(activity)}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500">No recent activities found.</p>
            </div>
          )}
          {recentActivities.length > 0 && (
            <div className="mt-4">
              <a
                href="/admin/activity"
                className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all activity
                <ChevronRightIcon className="ml-1 h-5 w-5" />
              </a>
            </div>
          )}
        </div>

        {/* LC Documents Stacked Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">LC Documents Overview</h2>
          <div className="h-64">
            {lcStats.length > 0 ? (
              <Bar data={lcData} options={lcOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;