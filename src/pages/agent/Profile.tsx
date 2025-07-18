import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { UserCheck, Award, Star, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

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
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Agent Profile</h1>
          <p className={styles.pageDescription}>
            Manage your profile and certification status
          </p>
        </div>

        <div className={styles.contentGrid}>
          {/* Profile Stats */}
          <div className={styles.sidebarSection}>
            <div className={styles.certificationCard}>
              <div className={styles.certificationHeader}>
                <h3 className={styles.certificationTitle}>
                  <UserCheck className={styles.certificationIcon} />
                  Certification Status
                </h3>
              </div>
              <div className={styles.certificationContent}>
                <div className={styles.certificationBadge}>
                  <Award className={styles.certificationBadgeIcon} />
                </div>
                <p className={styles.certificationStatus}>Pending Review</p>
                <p className={styles.certificationDescription}>
                  Your certification is being reviewed by our team
                </p>
                <Button variant="outline" size="sm" className={styles.certificationButton}>
                  View Requirements
                </Button>
              </div>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <h3 className={styles.statsTitle}>Performance Stats</h3>
              </div>
              <div className={styles.statsContent}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <Star className={`${styles.statIcon} ${styles['statIcon--rating']}`} />
                    <span className={styles.statText}>Rating</span>
                  </div>
                  <span className={styles.statValue}>4.8/5.0</span>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <Award className={`${styles.statIcon} ${styles['statIcon--campaigns']}`} />
                    <span className={styles.statText}>Campaigns</span>
                  </div>
                  <span className={styles.statValue}>12 completed</span>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <DollarSign className={`${styles.statIcon} ${styles['statIcon--earnings']}`} />
                    <span className={styles.statText}>Earnings</span>
                  </div>
                  <span className={styles.statValue}>$8,450</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className={styles.mainSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <h3 className={styles.profileTitle}>Profile Information</h3>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className={styles.editButton}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              <form className={styles.profileForm}>
                <div className={styles.formGrid}>
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
                    className={styles.disabledInput}
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
                  <div className={styles.formActions}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className={styles.saveButton}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};