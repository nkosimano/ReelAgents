import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { UserCheck, Award, Star, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AgentProfile: React.FC = () => {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    specialization: '',
    bio: '',
    hourly_rate: '',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-gray-900">Agent Profile</h1>
          <p className="text-gray-600">
=======
          <h1 className="text-2xl font-bold text-neutral-900">Agent Profile</h1>
          <p className="text-neutral-600">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
            Manage your profile and certification status
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                  Certification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
<<<<<<< HEAD
                  <p className="font-medium text-gray-900 mb-2">Pending Review</p>
                  <p className="text-sm text-gray-600 mb-4">
=======
                  <p className="font-medium text-neutral-900 mb-2">Pending Review</p>
                  <p className="text-sm text-neutral-600 mb-4">
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    Your certification is being reviewed by our team
                  </p>
                  <Button variant="outline" size="sm">
                    View Requirements
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
<<<<<<< HEAD
                      <span className="text-sm text-gray-600">Rating</span>
=======
                      <span className="text-sm text-neutral-600">Rating</span>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    </div>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
<<<<<<< HEAD
                      <Award className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Campaigns</span>
=======
                      <Award className="w-4 h-4 text-primary-500 mr-2" />
                      <span className="text-sm text-neutral-600">Campaigns</span>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    </div>
                    <span className="font-medium">12 completed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-500 mr-2" />
<<<<<<< HEAD
                      <span className="text-sm text-gray-600">Earnings</span>
=======
                      <span className="text-sm text-neutral-600">Earnings</span>
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
                    </div>
                    <span className="font-medium">$8,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      disabled={!isEditing}
                    />
                    <Input
                      label="Email"
                      value={profile?.email || ''}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </div>

                  <Input
                    label="Specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    placeholder="e.g., Social Media Marketing, Content Creation"
                    disabled={!isEditing}
                  />

                  <Textarea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell companies about your experience and expertise..."
                    rows={4}
                    disabled={!isEditing}
                  />

                  <Input
                    label="Hourly Rate ($)"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    placeholder="75"
                    disabled={!isEditing}
                  />

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};