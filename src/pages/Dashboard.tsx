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
      <div className="container-center">
        <div className="container-max space-section">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-heading-1 mb-1">Dashboard</h1>
            <p className="text-lg text-body">{getWelcomeMessage()}</p>
          </div>

          {/* Quick Stats */}
          <div className="responsive-grid mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="stats-card">
                <div className={`stats-icon ${stat.color}`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="stats-content">
                  <p className="stats-label">{stat.name}</p>
                  <p className="stats-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="card card-padding-none mt-8">
            <div className="px-8 py-6 border-default border-b">
              <h2 className="text-heading-3">Recent Activity</h2>
            </div>
            <div className="p-8">
              <div className="text-center py-16">
                <BarChart3 className="w-14 h-14 text-muted mx-auto mb-6" />
                <p className="text-body text-lg">No recent activity to display</p>
                <p className="text-sm text-body-secondary mt-2">
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