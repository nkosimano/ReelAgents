import React from 'react';
import { BarChart3, DollarSign, Users, Calendar, Play, Pause, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Campaign } from '../../lib/supabaseClient';
import { AgentMarketplace } from './AgentMarketplace';

interface CampaignDetailsProps {
  campaign: Campaign;
  onEdit?: () => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
<<<<<<< HEAD
        return 'bg-gray-100 text-gray-800';
=======
        return 'bg-neutral-100 text-neutral-800';
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
    }
  };

  const handleStatusToggle = () => {
    // TODO: Implement status toggle logic
    console.log('Toggling campaign status');
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center">
<<<<<<< HEAD
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                {campaign.name}
              </CardTitle>
              <p className="text-gray-600 mt-2">{campaign.description}</p>
=======
                <BarChart3 className="w-5 h-5 mr-2 text-secondary" />
                {campaign.name}
              </CardTitle>
              <p className="text-neutral-600 mt-2">{campaign.description}</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status === 'active' && <Play className="w-4 h-4 mr-1" />}
                {campaign.status === 'paused' && <Pause className="w-4 h-4 mr-1" />}
                <span className="capitalize">{campaign.status}</span>
              </span>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-gray-900">${campaign.budget.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Budget</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Assigned Agents</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}
              </p>
              <p className="text-sm text-gray-600">Start Date</p>
=======
              <p className="text-2xl font-bold text-neutral-900">${campaign.budget.toLocaleString()}</p>
              <p className="text-sm text-neutral-600">Total Budget</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-2">
                <Users className="w-6 h-6 text-primary-800" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">0</p>
              <p className="text-sm text-neutral-600">Assigned Agents</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}
              </p>
              <p className="text-sm text-neutral-600">Start Date</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
<<<<<<< HEAD
              <p className="text-2xl font-bold text-gray-900">$0</p>
              <p className="text-sm text-gray-600">Spent</p>
=======
              <p className="text-2xl font-bold text-neutral-900">$0</p>
              <p className="text-sm text-neutral-600">Spent</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              variant={campaign.status === 'active' ? 'secondary' : 'primary'}
              onClick={handleStatusToggle}
            >
              {campaign.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Campaign
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Campaign
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      {campaign.target_audience && (
        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <p className="text-gray-700">{campaign.target_audience}</p>
=======
            <p className="text-neutral-700">{campaign.target_audience}</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
          </CardContent>
        </Card>
      )}

      {/* Agent Marketplace */}
      <AgentMarketplace campaignId={campaign.id} />
    </div>
  );
};