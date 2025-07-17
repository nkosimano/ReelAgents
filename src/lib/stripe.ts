import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Stripe features will be disabled.');
}

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Stripe Connect onboarding URL helper
export const createConnectAccountLink = async (accountId: string, refreshUrl: string, returnUrl: string) => {
  const response = await fetch('/api/stripe/create-account-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_id: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create account link');
  }

  return response.json();
};

// Create checkout session for campaign payments
export const createCheckoutSession = async (campaignId: string, agentId: string, amount: number) => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      campaign_id: campaignId,
      agent_id: agentId,
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
};