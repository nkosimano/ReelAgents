import React from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Users, Bot, Building2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, isCompany, isAgent, isAdmin } = useAuth();

  const getWelcomeMessage = () => {
    if (isCompany) return 'Welcome to your company dashboard';
    if (isAgent) return 'Welcome to your agent dashboard';
    if (isAdmin) return 'Welcome to the admin dashboard';
    return 'Welcome to ReelAgents';
  };

  const getQuickStats = () => {
    if (isCompany) {
      return [
        { name: 'Active Campaigns', value: '3', icon: BarChart3, color: 'bg-blue-500' },
        { name: 'Digital Twins', value: '2', icon: Bot, color: 'bg-green-500' },
        { name: 'Connected Agents', value: '5', icon: Users, color: 'bg-purple-500' },
      ];
    }

    if (isAgent) {
      return [
        { name: 'Available Campaigns', value: '12', icon: BarChart3, color: 'bg-blue-500' },
        { name: 'Active Projects', value: '3', icon: Bot, color: 'bg-green-500' },
        { name: 'Earnings This Month', value: '$2,450', icon: Users, color: 'bg-purple-500' },
      ];
    }

    if (isAdmin) {
      return [
        { name: 'Total Companies', value: '48', icon: Building2, color: 'bg-blue-500' },
        { name: 'Active Agents', value: '127', icon: Users, color: 'bg-green-500' },
        { name: 'Platform Revenue', value: '$45,230', icon: BarChart3, color: 'bg-purple-500' },
      ];
    }

    return [];
  };

  const stats = getQuickStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400">{getWelcomeMessage()}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">No recent activity to display</p>
              <p className="text-sm text-neutral-400 mt-2">
                Activity will appear here as you use the platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};