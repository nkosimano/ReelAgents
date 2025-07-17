import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, DollarSign, Percent, Shield, Bell } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    platformFee: 10,
    minCampaignBudget: 1000,
    maxCampaignBudget: 100000,
    agentApprovalRequired: true,
    emailNotifications: true,
    webhookUrl: '',
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">
=======
          <h1 className="text-2xl font-bold text-neutral-900">Platform Settings</h1>
          <p className="text-neutral-600">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            Configure platform-wide settings and policies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    label="Platform Fee (%)"
                    type="number"
                    value={settings.platformFee}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      platformFee: parseFloat(e.target.value) 
                    }))}
                    min="0"
                    max="50"
                    step="0.1"
                  />
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mt-6">
                  <Percent className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <Input
                label="Minimum Campaign Budget ($)"
                type="number"
                value={settings.minCampaignBudget}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  minCampaignBudget: parseFloat(e.target.value) 
                }))}
                min="0"
              />

              <Input
                label="Maximum Campaign Budget ($)"
                type="number"
                value={settings.maxCampaignBudget}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  maxCampaignBudget: parseFloat(e.target.value) 
                }))}
                min="0"
              />
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
<<<<<<< HEAD
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
=======
                <Shield className="w-5 h-5 mr-2 text-primary-600" />
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                Security & Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
<<<<<<< HEAD
                  <label className="text-sm font-medium text-gray-700">
                    Agent Approval Required
                  </label>
                  <p className="text-sm text-gray-500">
=======
                  <label className="text-sm font-medium text-neutral-700">
                    Agent Approval Required
                  </label>
                  <p className="text-sm text-neutral-500">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    Require admin approval for new agents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.agentApprovalRequired}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      agentApprovalRequired: e.target.checked 
                    }))}
                    className="sr-only peer"
                  />
<<<<<<< HEAD
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
=======
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
<<<<<<< HEAD
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500">
=======
                  <label className="text-sm font-medium text-neutral-700">
                    Email Notifications
                  </label>
                  <p className="text-sm text-neutral-500">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    Send email notifications for platform events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      emailNotifications: e.target.checked 
                    }))}
                    className="sr-only peer"
                  />
<<<<<<< HEAD
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
=======
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                </label>
              </div>

              <Input
                label="Webhook URL"
                value={settings.webhookUrl}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  webhookUrl: e.target.value 
                }))}
                placeholder="https://your-app.com/webhooks/reelagents"
                helperText="Receive notifications about platform events"
              />
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
<<<<<<< HEAD
                <p className="text-2xl font-bold text-gray-900">48</p>
                <p className="text-sm text-gray-600">Total Companies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Active Campaigns</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">$245K</p>
                <p className="text-sm text-gray-600">Monthly Volume</p>
=======
                <p className="text-2xl font-bold text-neutral-900">48</p>
                <p className="text-sm text-neutral-600">Total Companies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">127</p>
                <p className="text-sm text-neutral-600">Active Agents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">89</p>
                <p className="text-sm text-neutral-600">Active Campaigns</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">$245K</p>
                <p className="text-sm text-neutral-600">Monthly Volume</p>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};