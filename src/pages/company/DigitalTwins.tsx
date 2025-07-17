import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
<<<<<<< HEAD
import { DigitalTwinUploader } from '../../components/digital-twins/DigitalTwinUploader';
=======
import DigitalTwinUploader from '../../components/digital-twins/DigitalTwinUploader';
>>>>>>> 3b800f1 (Initial commit (local merge with cloud))
import { DigitalTwinsList } from '../../components/digital-twins/DigitalTwinsList';

export const DigitalTwins: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Digital Twins</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Create and manage AI-powered digital twins for your marketing campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DigitalTwinUploader />
          </div>
          <div className="lg:col-span-2">
            <DigitalTwinsList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};