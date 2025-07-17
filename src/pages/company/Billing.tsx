import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreditCard, Download, DollarSign, TrendingUp, Calendar, Receipt } from 'lucide-react';
import { StripeOnboarding } from '../../components/stripe/StripeOnboarding';

// Mock billing data
const mockBilling = {
  currentBalance: 2450,
  monthlySpend: 5200,
  totalSpent: 45000,
  nextBilling: '2024-02-01',
};

const mockInvoices = [
  {
    id: 'inv_001',
    date: '2024-01-01',
    amount: 5200,
    status: 'paid',
    campaigns: 3,
    agents: 8,
  },
  {
    id: 'inv_002',
    date: '2023-12-01',
    amount: 4800,
    status: 'paid',
    campaigns: 2,
    agents: 6,
  },
  {
    id: 'inv_003',
    date: '2023-11-01',
    amount: 6100,
    status: 'paid',
    campaigns: 4,
    agents: 10,
  },
];

export const CompanyBilling: React.FC = () => {
  const [stripeOnboarded, setStripeOnboarded] = React.useState(false);

  // Check if company has completed Stripe onboarding
  React.useEffect(() => {
    // In production, check company's stripe_customer_id from database
    const checkOnboardingStatus = async () => {
      // Mock check - replace with actual API call
      setStripeOnboarded(true);
    };
    
    checkOnboardingStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (!stripeOnboarded) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Billing Setup</h1>
            <p className="text-neutral-600">
              Set up your payment method to start paying agents
            </p>
          </div>

          <div className="max-w-2xl">
            <StripeOnboarding 
              userType="company" 
              onComplete={() => setStripeOnboarded(true)}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Billing & Payments</h1>
            <p className="text-neutral-600">
              Manage your payment methods and view billing history
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Statements
          </Button>
        </div>

        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Current Balance</p>
                  <p className="text-2xl font-bold text-neutral-900">${mockBilling.currentBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">This Month</p>
                  <p className="text-2xl font-bold text-neutral-900">${mockBilling.monthlySpend.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-tertiary-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-tertiary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Spent</p>
                  <p className="text-2xl font-bold text-neutral-900">${mockBilling.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-neutral-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Next Billing</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {new Date(mockBilling.nextBilling).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Method</CardTitle>
              <Button variant="outline" size="sm">
                Update Payment Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-neutral-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Visa ending in 4242</p>
                <p className="text-sm text-neutral-600">Expires 12/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Campaigns</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Agents</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-neutral-100 hover:bg-neutral-100">
                      <td className="py-4 px-4 font-medium text-neutral-900">{invoice.id}</td>
                      <td className="py-4 px-4 text-neutral-600">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-medium text-neutral-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-neutral-600">{invoice.campaigns}</td>
                      <td className="py-4 px-4 text-neutral-600">{invoice.agents}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
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