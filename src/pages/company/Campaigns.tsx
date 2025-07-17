<<<<<<< HEAD
{"code":"rate-limited","message":"You have hit the rate limit. Please upgrade to keep chatting.","providerLimitHit":false,"isRetryable":true}
=======
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampaignWizard } from '../../components/campaigns/CampaignWizard';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/apiClient';

const CompanyCampaigns: React.FC = () => {
  const { user, profile } = useAuth();
  const fetchCampaigns = async () => {
    const { data } = await apiClient.getCampaigns(profile?.company_id || '');
    return data || [];
  };
  const { data: campaigns = [], isLoading, isError } = useQuery({
    queryKey: ['company-campaigns'],
    queryFn: fetchCampaigns,
  });

  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Card>
          <CardContent>
            <p className="text-neutral-700 dark:text-neutral-200">You do not have access to this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-8">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">Campaigns</span>
              <CampaignWizard />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-neutral-600">Loading campaigns...</p>
            ) : isError ? (
              <p className="text-danger">Failed to load campaigns.</p>
            ) : campaigns.length === 0 ? (
              <p className="text-neutral-600">No campaigns found. Click "New Campaign" to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {(campaigns as any[]).map((campaign: any) => (
                  <Card key={campaign.id} className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {campaign.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 dark:text-neutral-300 mb-2">{campaign.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        <span>Budget: <span className="font-medium text-primary">${campaign.budget}</span></span>
                        <span>Status: <span className="font-medium text-info">{campaign.status}</span></span>
                        <span>Start: {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <Button variant="secondary" className="mt-2">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyCampaigns;
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
