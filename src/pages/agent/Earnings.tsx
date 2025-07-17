import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard } from 'lucide-react';
import { StripeOnboarding } from '../../components/stripe/StripeOnboarding';

// Mock earnings data
const mockEarnings = {
  total: 8450,
  thisMonth: 2450,
  pending: 350,
  lastPayout: '2024-01-15',
  nextPayout: '2024-01-22',
};

const mockTransactions = [
  {
    id: '1',
    campaign: 'Summer Fashion Campaign',
    company: 'StyleCorp',
    amount: 850,
    status: 'paid',
    date: '2024-01-15',
    type: 'campaign_payment'
  },
  {
    id: '2',
    campaign: 'Tech Product Launch',
    company: 'InnovateTech',
    amount: 1200,
    status: 'pending',
    date: '2024-01-18',
    type: 'campaign_payment'
  },
  {
    id: '3',
    campaign: 'Holiday Marketing',
    company: 'RetailPlus',
    amount: 650,
    status: 'paid',
    date: '2024-01-10',
    type: 'campaign_payment'
  },
];

export const AgentEarnings: React.FC = () => {
  const [stripeOnboarded, setStripeOnboarded] = React.useState(false);

  // Check if agent has completed Stripe onboarding
  React.useEffect(() => {
    // In production, check agent's onboarding_completed status from database
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
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!stripeOnboarded) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings Setup</h1>
            <p className="text-gray-600">
              Complete your payout setup to start receiving payments
            </p>
          </div>

          <div className="max-w-2xl">
            <StripeOnboarding 
              userType="agent" 
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
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">
              Track your campaign earnings and payout history
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${mockEarnings.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">${mockEarnings.thisMonth.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">${mockEarnings.pending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Next Payout</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(mockEarnings.nextPayout).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Payout Schedule</h4>
                <p className="text-gray-600 text-sm mb-1">Weekly payouts every Friday</p>
                <p className="text-gray-600 text-sm">Last payout: {new Date(mockEarnings.lastPayout).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bank account ending in ****1234
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{transaction.campaign}</td>
                      <td className="py-4 px-4 text-gray-600">{transaction.company}</td>
                      <td className="py-4 px-4 font-medium text-gray-900">${transaction.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
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