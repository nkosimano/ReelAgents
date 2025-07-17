import React from 'react';
import { Users, Star, DollarSign, Award, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentButton } from './PaymentButton';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';

interface Agent {
  id: string;
  name: string;
  specialization: string;
  email: string;
  certification_status: string;
  rating: number;
  completed_campaigns: number;
  hourly_rate: number;
}

interface AgentMarketplaceProps {
  campaignId: string;
}

export const AgentMarketplace: React.FC<AgentMarketplaceProps> = ({ campaignId }) => {
  const { data: agentsData, isLoading, error } = useQuery({
    queryKey: ['certified-agents', campaignId],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns/${campaignId}/certified-agents`, {
        headers: await getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch certified agents');
      }
      
      return response.json();
    },
    enabled: !!campaignId,
  });

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleInviteAgent = (agentId: string) => {
    // TODO: Implement agent invitation logic
    console.log('Inviting agent:', agentId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
<<<<<<< HEAD
          <span className="ml-3 text-gray-600">Loading certified agents...</span>
=======
          <span className="ml-3 text-neutral-600">Loading certified agents...</span>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Failed to load agents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const agents = agentsData?.agents || [];

  if (!agents.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
<<<<<<< HEAD
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
=======
            <Users className="w-5 h-5 mr-2 text-secondary" />
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            Agent Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
<<<<<<< HEAD
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Certified Agents Available</h3>
          <p className="text-gray-600">
=======
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Certified Agents Available</h3>
          <p className="text-neutral-600">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            There are currently no certified agents available for this campaign.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
<<<<<<< HEAD
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            Agent Marketplace
          </div>
          <span className="text-sm text-gray-500">{agents.length} certified agents</span>
=======
            <Users className="w-5 h-5 mr-2 text-secondary" />
            Agent Marketplace
          </div>
          <span className="text-sm text-neutral-500">{agents.length} certified agents</span>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent: Agent) => (
<<<<<<< HEAD
            <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
=======
            <div key={agent.id} className="border border-neutral-200 rounded-lg p-4 hover:border-secondary-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <span className="text-secondary font-medium">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
<<<<<<< HEAD
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600">{agent.specialization}</p>
=======
                      <h4 className="font-medium text-neutral-900">{agent.name}</h4>
                      <p className="text-sm text-neutral-600">{agent.specialization}</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600 font-medium">Certified</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
<<<<<<< HEAD
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {agent.rating}/5.0
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="w-4 h-4 mr-1" />
                      {agent.completed_campaigns} campaigns
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${agent.hourly_rate}/hr
                    </div>
                    <div className="flex items-center text-gray-600">
=======
                    <div className="flex items-center text-neutral-600">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {agent.rating}/5.0
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Award className="w-4 h-4 mr-1" />
                      {agent.completed_campaigns} campaigns
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${agent.hourly_rate}/hr
                    </div>
                    <div className="flex items-center text-neutral-600">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                      <Mail className="w-4 h-4 mr-1" />
                      {agent.email}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInviteAgent(agent.id)}
                  >
                    Invite to Campaign
                  </Button>
                  <div className="mt-2">
                    <PaymentButton
                      campaignId={campaignId}
                      agentId={agent.id}
                      amount={agent.hourly_rate * 40} // 40 hours example
                      agentName={agent.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};