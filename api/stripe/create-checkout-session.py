import json
import os
import stripe
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """
        Create a Stripe Checkout session for campaign payments
        """
        try:
            # Initialize Supabase client
            supabase_url = os.environ.get('VITE_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not supabase_key:
                self.send_error_response(500, "Supabase configuration missing")
                return
            
            if not stripe.api_key:
                self.send_error_response(500, "Stripe configuration missing")
                return
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            campaign_id = data.get('campaign_id')
            agent_id = data.get('agent_id')
            amount = data.get('amount')  # Amount in cents
            
            if not all([campaign_id, agent_id, amount]):
                self.send_error_response(400, "Missing required fields")
                return
            
            # Get campaign and agent details
            campaign_result = supabase.table('campaigns').select('name, company_id').eq('id', campaign_id).single().execute()
            agent_result = supabase.table('agents').select('name, stripe_account_id').eq('id', agent_id).single().execute()
            
            if not campaign_result.data or not agent_result.data:
                self.send_error_response(404, "Campaign or agent not found")
                return
            
            campaign = campaign_result.data
            agent = agent_result.data
            
            if not agent['stripe_account_id']:
                self.send_error_response(400, "Agent has not completed Stripe onboarding")
                return
            
            # Calculate platform fee (10% of total)
            platform_fee = int(amount * 0.10)
            
            # Create Checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'Campaign: {campaign["name"]}',
                            'description': f'Payment to agent: {agent["name"]}',
                        },
                        'unit_amount': amount,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{os.environ.get("FRONTEND_URL", "http://localhost:5173")}/company/campaigns/{campaign_id}?payment=success',
                cancel_url=f'{os.environ.get("FRONTEND_URL", "http://localhost:5173")}/company/campaigns/{campaign_id}?payment=cancelled',
                payment_intent_data={
                    'application_fee_amount': platform_fee,
                    'transfer_data': {
                        'destination': agent['stripe_account_id'],
                    },
                },
                metadata={
                    'campaign_id': campaign_id,
                    'agent_id': agent_id,
                    'company_id': campaign['company_id'],
                }
            )
            
            self.send_json_response(200, {
                'checkout_url': session.url,
                'session_id': session.id
            })
            
        except stripe.error.StripeError as e:
            self.send_error_response(400, f"Stripe error: {str(e)}")
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON in request body")
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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