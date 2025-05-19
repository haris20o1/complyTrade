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