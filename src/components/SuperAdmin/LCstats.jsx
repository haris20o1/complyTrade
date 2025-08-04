import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';

const ICStatusOverview = () => {
  // Realistic data for the bar chart (weekly data with max 100 total LCs)
  const barData = [
    { name: 'W1', complete: 6, pending: 2, 'not assigned': 1 },
    { name: 'W2', complete: 8, pending: 3, 'not assigned': 1 },
    { name: 'W3', complete: 5, pending: 4, 'not assigned': 2 },
    { name: 'W4', complete: 7, pending: 2, 'not assigned': 1 },
    { name: 'W5', complete: 9, pending: 1, 'not assigned': 0 },
    { name: 'W6', complete: 4, pending: 5, 'not assigned': 1 },
    { name: 'W7', complete: 8, pending: 2, 'not assigned': 1 },
    { name: 'W8', complete: 6, pending: 3, 'not assigned': 2 },
    { name: 'W9', complete: 7, pending: 2, 'not assigned': 1 },
    { name: 'W10', complete: 5, pending: 4, 'not assigned': 1 },
    { name: 'W11', complete: 9, pending: 1, 'not assigned': 0 },
    { name: 'W12', complete: 8, pending: 3, 'not assigned': 1 }
  ];

  // Calculate totals from bar data
  const totalComplete = barData.reduce((sum, week) => sum + week.complete, 0);
  const totalPending = barData.reduce((sum, week) => sum + week.pending, 0);
  const totalNotAssigned = barData.reduce((sum, week) => sum + week['not assigned'], 0);
  const totalAssigned = totalComplete + totalPending + totalNotAssigned;
  const completionRate = ((totalComplete / totalAssigned) * 100).toFixed(1);

  // Logical line chart data showing cumulative progress over time
  const trendData = [
    { name: 'Jan', assigned: 15, completed: 12 },
    { name: 'Feb', assigned: 23, completed: 20 },
    { name: 'Mar', assigned: 35, completed: 31 },
    { name: 'Apr', assigned: 52, completed: 45 },
    { name: 'May', assigned: 68, completed: 58 },
    { name: 'Jun', assigned: 82, completed: 72 }
  ];

  // Logical dashboard metrics
  const dashboardMetrics = {
    pendingEquity: totalPending + 5, // Some additional pending items
    outstandingIssues: Math.floor(totalNotAssigned * 1.5), // Issues typically related to not assigned
    recentTransactions: Math.floor(totalAssigned * 0.8) // Most LCs involve transactions
  };

  // Data for pie charts with realistic percentages - Updated for completed/not completed
  const totalNotCompleted = totalPending + totalNotAssigned;
  const statusData = [
    { name: 'Completed', value: totalComplete, color: '#10B981' },
    { name: 'Not Completed', value: totalNotCompleted, color: '#EF4444' }
  ];

  const errorRate = Math.round((totalNotAssigned / totalAssigned) * 100);
  const errorRateData = [
    { name: 'Success', value: 100 - errorRate, color: '#3B82F6' },
    { name: 'Error', value: errorRate, color: '#EF4444' }
  ];

  const approvalRate = Math.round((totalComplete / totalAssigned) * 100);
  const approvalData = [
    { name: 'Approved', value: approvalRate, color: '#10B981' },
    { name: 'Others', value: 100 - approvalRate, color: '#E5E7EB' }
  ];

  const complianceRate = Math.max(85, approvalRate); // Compliance usually higher than approval
  const complianceData = [
    { name: 'Compliant', value: complianceRate, color: '#06B6D4' },
    { name: 'Non-compliant', value: 100 - complianceRate, color: '#E5E7EB' }
  ];

  const StatCard = ({ icon, title, value, subtitle, color = 'blue', trend }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            color === 'blue' ? 'bg-blue-100 text-blue-600' : 
            color === 'green' ? 'bg-green-100 text-green-600' : 
            color === 'orange' ? 'bg-orange-100 text-orange-600' : 
            color === 'red' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const PieChartComponent = ({ data, centerText, label, size = 120 }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            cx={size/2}
            cy={size/2}
            innerRadius={size/3}
            outerRadius={size/2.2}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{centerText}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center max-w-20">{label}</p>
    </div>
  );

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">IC Status Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor IC compliance metrics and activity for compliance managers in the system.</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* <span className="text-sm text-gray-500">01 - 31 May, 2024</span> */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              📊 Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            title="Total LC Assigned"
            value={totalAssigned}
            color="blue"
            // trend={5}
          />
          <StatCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            title="Completed"
            value={totalComplete}
            color="green"
            // trend={8}
          />
          <StatCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>}
            title="Pending"
            value={totalPending}
            color="orange"
            // trend={-3}
          />
          <StatCard
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/></svg>}
            title="Completion Rate"
            value={`${completionRate}%`}
            color="blue"
            // trend={2}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weekly LC Status</h3>
                  <p className="text-sm text-gray-600">Last 12 weeks performance</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Not Assigned</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="complete" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="not assigned" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Dashboard Metrics</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">ICs Pending Review</span>
                    <p className="text-xs text-gray-500 mt-1">Awaiting compliance check</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{dashboardMetrics.pendingEquity}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Outstanding Issues</span>
                    <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{dashboardMetrics.outstandingIssues}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Recent Transactions</span>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{dashboardMetrics.recentTransactions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Overview Summary */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <PieChartComponent 
                  data={statusData} 
                  centerText={`${totalAssigned}`}
                  label="Total LCs"
                  size={140}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{totalComplete}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Not Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{totalNotCompleted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LC Activity Trends */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">LC Activity Trends</h3>
              <p className="text-sm text-gray-600">Cumulative progress over 6 months</p>
            </div>
            <div className="p-6">
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="assigned" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 4 }}
                      name="Assigned"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4 }}
                      name="Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Assigned</p>
                  <p className="text-xl font-bold text-blue-600">{trendData[trendData.length - 1].assigned}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Completed</p>
                  <p className="text-xl font-bold text-green-600">{trendData[trendData.length - 1].completed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <PieChartComponent 
                    data={approvalData} 
                    centerText={`${approvalRate}%`}
                    label="Approval Rate"
                    size={100}
                  />
                </div>
                <div className="text-center">
                  <PieChartComponent 
                    data={errorRateData} 
                    centerText={`${100 - errorRate}%`}
                    label="Success Rate"
                    size={100}
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Compliance Rate</span>
                  <span className="text-sm font-bold text-cyan-600">{complianceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${complianceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ICStatusOverview;