import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import DigitalTwinUploader from '../../components/digital-twins/DigitalTwinUploader';
import { DigitalTwinsList } from '../../components/digital-twins/DigitalTwinsList';
import styles from './DigitalTwins.module.css';

export const DigitalTwins: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Digital Twins</h1>
          <p className={styles.pageDescription}>
            Create and manage AI-powered digital twins for your marketing campaigns.
          </p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.uploaderSection}>
            <DigitalTwinUploader />
          </div>
          <div className={styles.listSection}>
            <DigitalTwinsList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};