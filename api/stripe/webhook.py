import json
import os
import stripe
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """
        Handle Stripe webhooks for payment processing
        """
        try:
            # Initialize Supabase client
            supabase_url = os.environ.get('VITE_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not supabase_key:
                self.send_error_response(500, "Supabase configuration missing")
                return
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Get request body and signature
            content_length = int(self.headers['Content-Length'])
            payload = self.rfile.read(content_length)
            sig_header = self.headers.get('Stripe-Signature')
            
            if not webhook_secret:
                self.send_error_response(500, "Webhook secret not configured")
                return
            
            # Verify webhook signature
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
            except ValueError:
                self.send_error_response(400, "Invalid payload")
                return
            except stripe.error.SignatureVerificationError:
                self.send_error_response(400, "Invalid signature")
                return
            
            # Handle the event
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                
                # Extract metadata
                campaign_id = session['metadata']['campaign_id']
                agent_id = session['metadata']['agent_id']
                company_id = session['metadata']['company_id']
                
                # Update campaign invitation status to 'paid'
                supabase.table('campaign_invitations').update({
                    'status': 'paid',
                    'payment_session_id': session['id'],
                    'amount_paid': session['amount_total']
                }).eq('campaign_id', campaign_id).eq('agent_id', agent_id).execute()
                
                # Log the successful payment
                print(f"Payment completed for campaign {campaign_id}, agent {agent_id}")
                
            elif event['type'] == 'account.updated':
                account = event['data']['object']
                
                # Update agent onboarding status if charges are enabled
                if account['charges_enabled']:
                    supabase.table('agents').update({
                        'onboarding_completed': True
                    }).eq('stripe_account_id', account['id']).execute()
                    
                    print(f"Agent onboarding completed for account {account['id']}")
            
            self.send_json_response(200, {'received': True})
            
        except Exception as e:
            print(f"Webhook error: {str(e)}")
            self.send_error_response(500, f"Webhook error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Stripe-Signature')
        self.end_headers()
    
    def send_json_response(self, status_code: int, data: dict):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, status_code: int, message: str):
        """Send error response"""
        self.send_json_response(status_code, {
            'error': message,
            'status': 'error'
        })