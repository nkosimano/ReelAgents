import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Building2, Users, BarChart3, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';

// Mock data for companies
const mockCompanies = [
  {
    id: '1',
    name: 'StyleCorp',
    email: 'admin@stylecorp.com',
    created_at: '2024-01-15',
    active_campaigns: 3,
    total_agents: 8,
    total_spent: 45000,
    status: 'active',
  },
  {
    id: '2',
    name: 'InnovateTech',
    email: 'contact@innovatetech.com',
    created_at: '2024-02-03',
    active_campaigns: 2,
    total_agents: 5,
    total_spent: 32000,
    status: 'active',
  },
  {
    id: '3',
    name: 'GreenEarth Co',
    email: 'hello@greenearth.co',
    created_at: '2024-01-28',
    active_campaigns: 1,
    total_agents: 3,
    total_spent: 18000,
    status: 'suspended',
  },
];

export const AdminCompanies: React.FC = () => {
  const handleViewCompany = (companyId: string) => {
    console.log('Viewing company:', companyId);
  };

  const handleEditCompany = (companyId: string) => {
    console.log('Editing company:', companyId);
  };

  const handleSuspendCompany = (companyId: string) => {
    console.log('Suspending company:', companyId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'suspended':
        return 'bg-danger-100 text-danger-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Company Management</h1>
            <p className="text-neutral-600">
              Monitor and manage all companies on the platform
            </p>
          </div>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Companies</p>
                  <p className="text-2xl font-bold text-neutral-900">{mockCompanies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {mockCompanies.reduce((sum, company) => sum + company.active_campaigns, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Agents</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {mockCompanies.reduce((sum, company) => sum + company.total_agents, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Platform Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ${mockCompanies.reduce((sum, company) => sum + company.total_spent, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Campaigns</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Agents</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCompanies.map((company) => (
                    <tr key={company.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-neutral-900">{company.name}</p>
                          <p className="text-sm text-neutral-600">{company.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-900">{company.active_campaigns}</td>
                      <td className="py-4 px-4 text-neutral-900">{company.total_agents}</td>
                      <td className="py-4 px-4 text-neutral-900">${company.total_spent.toLocaleString()}</td>
                      <td className="py-4 px-4 text-neutral-600">
                        {new Date(company.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCompany(company.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCompany(company.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspendCompany(company.id)}
                          >
                            <Trash2 className="w-4 h-4 text-danger-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};