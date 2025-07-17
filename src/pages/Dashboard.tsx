import React from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Users, Bot, Building2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { isCompany, isAgent, isAdmin } = useAuth();

  const getWelcomeMessage = () => {
    if (isCompany) return 'Welcome to your company dashboard';
    if (isAgent) return 'Welcome to your agent dashboard';
    if (isAdmin) return 'Welcome to the admin dashboard';
    return 'Welcome to ReelAgents';
  };

  const getQuickStats = () => {
    if (isCompany) {
      return [
        { name: 'Active Campaigns', value: '3', icon: BarChart3, color: 'bg-primary-500' },
        { name: 'Digital Twins', value: '2', icon: Bot, color: 'bg-green-500' },
        { name: 'Connected Agents', value: '5', icon: Users, color: 'bg-purple-500' },
      ];
    }

    if (isAgent) {
      return [
        { name: 'Available Campaigns', value: '12', icon: BarChart3, color: 'bg-primary-500' },
        { name: 'Active Projects', value: '3', icon: Bot, color: 'bg-green-500' },
        { name: 'Earnings This Month', value: '$2,450', icon: Users, color: 'bg-purple-500' },
      ];
    }

    if (isAdmin) {
      return [
        { name: 'Total Companies', value: '48', icon: Building2, color: 'bg-primary-500' },
        { name: 'Active Agents', value: '127', icon: Users, color: 'bg-green-500' },
        { name: 'Platform Revenue', value: '$45,230', icon: BarChart3, color: 'bg-purple-500' },
      ];
    }

    return [];
  };

  const stats = getQuickStats();

  return (
    <DashboardLayout>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-5xl space-y-10">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-1">Dashboard</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">{getWelcomeMessage()}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                <div className={`${stat.color} rounded-xl p-4 flex items-center justify-center`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-base font-medium text-neutral-600 dark:text-neutral-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow border border-neutral-200 dark:border-neutral-700 mt-8">
            <div className="px-8 py-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
            </div>
            <div className="p-8">
              <div className="text-center py-16">
                <BarChart3 className="w-14 h-14 text-neutral-300 mx-auto mb-6" />
                <p className="text-neutral-500 dark:text-neutral-400 text-lg">No recent activity to display</p>
                <p className="text-sm text-neutral-400 mt-2">
                  Activity will appear here as you use the platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};