import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, DollarSign, Calendar, Building2, Star } from 'lucide-react';

// Mock data for available campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Fashion Campaign',
    company: 'StyleCorp',
    budget: 15000,
    description: 'Promote our new summer collection through social media content',
    requirements: ['Social Media Marketing', 'Content Creation'],
    duration: '4 weeks',
    rate: '$85/hour',
    applications: 12,
  },
  {
    id: '2',
    name: 'Tech Product Launch',
    company: 'InnovateTech',
    budget: 25000,
    description: 'Launch campaign for our new AI-powered productivity app',
    requirements: ['Tech Marketing', 'Video Production'],
    duration: '6 weeks',
    rate: '$95/hour',
    applications: 8,
  },
];

export const AgentCampaigns: React.FC = () => {
  const handleApplyToCampaign = (campaignId: string) => {
    console.log('Applying to campaign:', campaignId);
    // TODO: Implement application logic
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Available Campaigns</h1>
          <p className="text-neutral-600">
            Browse and apply to campaigns that match your expertise
          </p>
        </div>

        {/* Filter Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                <option>All Specializations</option>
                <option>Social Media Marketing</option>
                <option>Content Creation</option>
                <option>Tech Marketing</option>
                <option>Video Production</option>
              </select>
              <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                <option>All Budgets</option>
                <option>$5,000 - $15,000</option>
                <option>$15,000 - $30,000</option>
                <option>$30,000+</option>
              </select>
              <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                <option>All Durations</option>
                <option>1-2 weeks</option>
                <option>3-4 weeks</option>
                <option>1-2 months</option>
                <option>3+ months</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div className="space-y-4">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900">{campaign.name}</h3>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Building2 className="w-4 h-4 mr-1" />
                        {campaign.company}
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-4">{campaign.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-neutral-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${campaign.budget.toLocaleString()} budget
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {campaign.duration}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Star className="w-4 h-4 mr-1" />
                        {campaign.rate}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        {campaign.applications} applications
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {campaign.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Button onClick={() => handleApplyToCampaign(campaign.id)}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockCampaigns.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Campaigns Available</h3>
              <p className="text-neutral-600">
                Check back later for new campaign opportunities that match your skills.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};