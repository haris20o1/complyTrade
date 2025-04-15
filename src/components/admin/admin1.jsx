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

const Admin1 = () => {
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

export default Admin1;