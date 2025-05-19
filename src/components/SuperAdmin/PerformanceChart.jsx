// import React from 'react';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const PerformanceCharts = ({ performanceData }) => {
//   if (!performanceData) return null;

//   // Task Status Distribution data for Pie chart
//   const taskStatusData = [
//     { name: 'Completed', value: performanceData.stats.completed },
//     { name: 'In Progress', value: performanceData.stats.in_progress },
//     { name: 'Pending', value: performanceData.stats.pending }
//   ].filter(item => item.value > 0); // Only include non-zero values

//   // Time Metrics data for Bar chart
//   const timeMetricsData = [
//     { 
//       name: 'Last 7 Days', 
//       Assigned: performanceData.time_metrics.last_7_days.assigned,
//       Completed: performanceData.time_metrics.last_7_days.completed
//     },
//     { 
//       name: 'Last 30 Days', 
//       Assigned: performanceData.time_metrics.last_30_days.assigned,
//       Completed: performanceData.time_metrics.last_30_days.completed
//     }
//   ];

//   // Completion time data
//   const hasCompletionTimes = performanceData.stats.completion_times && 
//                           performanceData.stats.completion_times.average > 0;

//   const completionTimeData = hasCompletionTimes ? [
//     { name: 'Average', hours: performanceData.stats.completion_times.average },
//     { name: 'Fastest', hours: performanceData.stats.completion_times.fastest },
//     { name: 'Slowest', hours: performanceData.stats.completion_times.slowest }
//   ] : [];

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Task Status Distribution Chart */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status Distribution</h3>
//           {taskStatusData.length > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={taskStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {taskStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-64 text-gray-500">
//               No task data available
//             </div>
//           )}
//         </div>

//         {/* Tasks Over Time Chart */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks Over Time</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={timeMetricsData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="Assigned" fill="#8884d8" />
//                 <Bar dataKey="Completed" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Completion Time Chart */}
//       {hasCompletionTimes && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Time Metrics (Hours)</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={completionTimeData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => [`${value} hours`, 'Time']} />
//                 <Bar dataKey="hours" fill="#FF8042" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}

//       {/* Completion Rate Gauge */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-sm font-medium text-gray-500 mb-1">Completion Rate</div>
//             <div className="text-2xl font-bold text-blue-600">{performanceData.stats.completion_rate}%</div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{ width: `${performanceData.stats.completion_rate}%` }}
//               ></div>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-sm font-medium text-gray-500 mb-1">Total Assigned</div>
//             <div className="text-2xl font-bold text-indigo-600">{performanceData.stats.total_assigned}</div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-sm font-medium text-gray-500 mb-1">Completed Tasks</div>
//             <div className="text-2xl font-bold text-green-600">{performanceData.stats.completed}</div>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-sm font-medium text-gray-500 mb-1">Pending Tasks</div>
//             <div className="text-2xl font-bold text-amber-600">{performanceData.stats.pending}</div>
//           </div>
//         </div>
//       </div>

//       {/* Activity Timeline */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
//         <div className="space-y-4">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="ml-4">
//               <h4 className="text-sm font-medium text-gray-900">Last Assigned Task</h4>
//               <p className="text-sm text-gray-500">
//                 {performanceData.last_activity.last_assigned ? 
//                   new Date(performanceData.last_activity.last_assigned).toLocaleString() : 
//                   'No assigned tasks yet'}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             </div>
//             <div className="ml-4">
//               <h4 className="text-sm font-medium text-gray-900">Last Completed Task</h4>
//               <p className="text-sm text-gray-500">
//                 {performanceData.last_activity.last_completed ? 
//                   new Date(performanceData.last_activity.last_completed).toLocaleString() : 
//                   'No completed tasks yet'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PerformanceCharts;

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Clock, CheckCircle, AlertCircle, Calendar, Activity, ChevronUp } from 'lucide-react';

// Refined, professional color palette with fewer colors
const COLORS = {
  primary: '#3b82f6',      // Blue - primary
  primaryLight: '#bfdbfe', // Light blue for backgrounds
  secondary: '#64748b',    // Slate - secondary elements
  secondaryLight: '#f1f5f9', // Light slate for backgrounds
  accent: '#10b981',       // Green - success/accent
  accentLight: '#d1fae5',  // Light green for backgrounds
};

const PerformanceCharts = ({ performanceData }) => {
  if (!performanceData) return null;

  // Task Status Distribution data for Pie chart
  const LcStatusData = [
    { name: 'Completed', value: performanceData.stats.completed, color: COLORS.accent },
    { name: 'In Progress', value: performanceData.stats.in_progress, color: COLORS.primary },
    { name: 'Pending', value: performanceData.stats.pending, color: COLORS.secondary }
  ].filter(item => item.value > 0); // Only include non-zero values

  // Time Metrics data for Line chart
  const timeMetricsData = [
    { 
      name: 'Last 7 Days', 
      Assigned: performanceData.time_metrics.last_7_days.assigned,
      Completed: performanceData.time_metrics.last_7_days.completed
    },
    { 
      name: 'Last 30 Days', 
      Assigned: performanceData.time_metrics.last_30_days.assigned,
      Completed: performanceData.time_metrics.last_30_days.completed
    }
  ];

  // Completion time data
  const hasCompletionTimes = performanceData.stats.completion_times && 
                          performanceData.stats.completion_times.average > 0;

  const completionTimeData = hasCompletionTimes ? [
    { name: 'Average', hours: performanceData.stats.completion_times.average },
    { name: 'Fastest', hours: performanceData.stats.completion_times.fastest },
    { name: 'Slowest', hours: performanceData.stats.completion_times.slowest }
  ] : [];

  // Calculate whether the user has any activity
  const hasAnyActivity = performanceData.stats.total_assigned > 0;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-blue-50">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Total LC Assigned</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">{performanceData.stats.total_assigned}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">{performanceData.stats.completed}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-slate-50">
                <AlertCircle className="h-5 w-5 text-slate-600" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">{performanceData.stats.pending}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-blue-50">
                <ChevronUp className="h-5 w-5 text-blue-600" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Completion Rate</span>
            </div>
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-gray-800">{performanceData.stats.completion_rate}%</p>
              <div className="ml-auto w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${performanceData.stats.completion_rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">LC Status Distribution</h3>
          {LcStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LcStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {LcStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} LCs`, 'Count']} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-lg">
              <div className="text-center">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No LC data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Over Time Chart - Changed to Line Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">LC Activity Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeMetricsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Assigned" 
                  stroke={COLORS.primary} 
                  strokeWidth={2}
                  dot={{ stroke: COLORS.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Completed" 
                  stroke={COLORS.accent} 
                  strokeWidth={2}
                  dot={{ stroke: COLORS.accent, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Activity Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Last Assigned LC</h4>
              <p className="text-base font-medium text-gray-800">
                {formatDate(performanceData.last_activity.last_assigned)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Last Completed LC</h4>
              <p className="text-base font-medium text-gray-800">
                {performanceData.last_activity.last_completed ? 
                  formatDate(performanceData.last_activity.last_completed) : 
                  'No completed tasks yet'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Last 7 Days Activity</h4>
              <p className="text-base font-medium text-gray-800">
                {performanceData.time_metrics.last_7_days.assigned} assigned / {performanceData.time_metrics.last_7_days.completed} completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Last 30 Days Activity</h4>
              <p className="text-base font-medium text-gray-800">
                {performanceData.time_metrics.last_30_days.assigned} assigned / {performanceData.time_metrics.last_30_days.completed} completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Time Chart - Only show if available */}
      {hasCompletionTimes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Completion Time Metrics (Hours)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completionTimeData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`${value} hours`, 'Time']} />
                <Bar 
                  dataKey="hours" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* No Data State - Show this when there's no activity */}
      {!hasAnyActivity && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Performance Data Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Once you start receiving and completing tasks, your performance metrics will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;
//asasas