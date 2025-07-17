import React from 'react';
import { Bot, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useDigitalTwins } from '../../hooks/queries/useDigitalTwins';

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'training':
      return <Loader2 className="w-5 h-5 text-info animate-spin" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-danger" />;
    default:
      return <Clock className="w-5 h-5 text-warning" />;
  }
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    active: 'bg-success/10 text-success',
    training: 'bg-info/10 text-info',
    pending: 'bg-warning/10 text-warning',
    failed: 'bg-danger/10 text-danger',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.pending}`}>
      <StatusIcon status={status} />
      <span className="ml-1 capitalize">{status}</span>
    </span>
  );
};

export const DigitalTwinsList: React.FC = () => {
  const { data: digitalTwins, isLoading, error } = useDigitalTwins();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <span className="ml-3 text-neutral-600 dark:text-neutral-400">Loading digital twins...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <XCircle className="w-8 h-8 text-danger" />
          <span className="ml-3 text-danger">Failed to load digital twins</span>
        </CardContent>
      </Card>
    );
  }

  if (!digitalTwins?.length) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bot className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No Digital Twins Yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Create your first digital twin to get started with AI-powered marketing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {digitalTwins.map((twin) => (
        <Card key={twin.id}>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{twin.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{twin.description}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Created {new Date(twin.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={twin.status} />
              {twin.status === 'active' && twin.model_endpoint && (
                <button className="text-sm text-secondary hover:text-secondary/80 font-medium">
                  View Details
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};