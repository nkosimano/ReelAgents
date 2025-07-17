/*
  # Add Stripe Connect Integration Fields

  1. Schema Updates
    - Add `stripe_account_id` to companies table for Stripe Connect accounts
    - Add `stripe_account_id` to agents table for payout accounts
    - Add `stripe_customer_id` to companies table for billing
    - Add `onboarding_completed` fields for tracking setup status

  2. Security
    - Maintain existing RLS policies
    - Add indexes for performance
*/

-- Add Stripe fields to companies table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE companies ADD COLUMN stripe_customer_id text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE companies ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Add Stripe fields to agents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE agents ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'hourly_rate'
  ) THEN
    ALTER TABLE agents ADD COLUMN hourly_rate numeric(10,2) DEFAULT 75.00;
  END IF;
END $$;

-- Create campaign_invitations table for agent invitations
CREATE TABLE IF NOT EXISTS campaign_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  hourly_rate numeric(10,2) NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, agent_id)
);

ALTER TABLE campaign_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaign_invitations
CREATE POLICY "Companies can manage their campaign invitations"
  ON campaign_invitations
  FOR ALL
  TO authenticated
  USING (
    campaign_id IN (
      SELECT id FROM campaigns 
      WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Agents can view and respond to their invitations"
  ON campaign_invitations
  FOR ALL
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_campaign_invitations_campaign_id ON campaign_invitations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_invitations_agent_id ON campaign_invitations(agent_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id ON companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_agents_stripe_account_id ON agents(stripe_account_id);

-- Add trigger for updated_at
CREATE TRIGGER update_campaign_invitations_updated_at
  BEFORE UPDATE ON campaign_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();