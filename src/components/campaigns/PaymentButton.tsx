import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { getStripe } from '../../lib/stripe';

interface PaymentButtonProps {
  campaignId: string;
  agentId: string;
  amount: number; // Amount in dollars
  agentName: string;
  disabled?: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  campaignId,
  agentId,
  amount,
  agentName,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          agent_id: agentId,
          amount: Math.round(amount * 100), // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkout_url;

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      loading={loading}
      disabled={disabled}
      className="w-full"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      Pay ${amount.toLocaleString()} to {agentName}
    </Button>
  );
};