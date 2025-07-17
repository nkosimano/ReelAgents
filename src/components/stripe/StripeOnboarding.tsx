import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface StripeOnboardingProps {
  userType: 'agent' | 'company';
  onComplete?: () => void;
}

export const StripeOnboarding: React.FC<StripeOnboardingProps> = ({ 
  userType, 
  onComplete 
}) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create Stripe Connect account
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          type: userType,
          email: profile?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe account');
      }

      const data = await response.json();
      setAccountId(data.account_id);

      // Create account link for onboarding
      const linkResponse = await fetch('/api/stripe/create-account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: data.account_id,
          refresh_url: window.location.href,
          return_url: window.location.href + '?onboarding=complete',
        }),
      });

      if (!linkResponse.ok) {
        throw new Error('Failed to create onboarding link');
      }

      const linkData = await linkResponse.json();
      
      // Redirect to Stripe onboarding
      window.location.href = linkData.url;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = async () => {
    // Get JWT token from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const getOnboardingContent = () => {
    if (userType === 'agent') {
      return {
        title: 'Set Up Payouts',
        description: 'Connect your bank account to receive payments from campaigns.',
        benefits: [
          'Receive payments directly to your bank account',
          'Weekly automatic payouts',
          'Track your earnings in real-time',
          'Secure and compliant payment processing'
        ]
      };
    } else {
      return {
        title: 'Set Up Payments',
        description: 'Connect your payment method to pay agents for campaigns.',
        benefits: [
          'Pay agents securely through the platform',
          'Automatic invoicing and receipts',
          'Track campaign expenses',
          'Secure payment processing'
        ]
      };
    }
  };

  const content = getOnboardingContent();

  // Check if onboarding was completed (from URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const onboardingComplete = urlParams.get('onboarding') === 'complete';

  if (onboardingComplete) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stripe Setup Complete!
          </h3>
          <p className="text-gray-600 mb-4">
            Your {userType === 'agent' ? 'payout' : 'payment'} account has been successfully configured.
          </p>
          <Button onClick={onComplete}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">{content.description}</p>
        
        <div className="space-y-3 mb-6">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              {benefit}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          onClick={handleCreateAccount}
          loading={loading}
          className="w-full"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Set Up with Stripe
        </Button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You'll be redirected to Stripe to complete the setup process securely.
        </p>
      </CardContent>
    </Card>
  );
};