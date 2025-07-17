import React, { useState } from 'react';
import { BarChart3, DollarSign, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useCreateCampaign } from '../../hooks/queries/useCampaigns';
import { useUIStore } from '../../store/uiStore';

export const CampaignWizard: React.FC = () => {
  const { isCreateCampaignModalOpen, setCreateCampaignModalOpen } = useUIStore();
  const createCampaignMutation = useCreateCampaign();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    target_audience: '',
    start_date: '',
    end_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCampaignMutation.mutateAsync({
        ...formData,
        budget: parseFloat(formData.budget),
      });
      setFormData({
        name: '',
        description: '',
        budget: '',
        target_audience: '',
        start_date: '',
        end_date: '',
      });
      setCreateCampaignModalOpen(false);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Create Campaign
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Launch a new marketing campaign with AI-powered digital twins.
          </p>
          <Button onClick={() => setCreateCampaignModalOpen(true)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setCreateCampaignModalOpen(false)}
        title="Create New Campaign"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Campaign Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Summer Product Launch"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your campaign goals and strategy..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Budget ($)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="5000"
              min="0"
              step="0.01"
              required
            />

            <Input
              label="Target Audience"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="e.g., Young professionals 25-35"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            />

            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateCampaignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createCampaignMutation.isPending}
              disabled={!formData.name || !formData.budget}
            >
              Create Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};