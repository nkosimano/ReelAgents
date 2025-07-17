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
        Create a Stripe Connect account for agents
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
            
            # Validate authorization
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                self.send_error_response(401, "Missing or invalid authorization header")
                return
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user_type = data.get('type', 'agent')  # 'agent' or 'company'
            email = data.get('email')
            
            if not email:
                self.send_error_response(400, "Email is required")
                return
            
            # Create Stripe Connect account
            if user_type == 'agent':
                # Express account for agents (for receiving payouts)
                account = stripe.Account.create(
                    type='express',
                    email=email,
                    capabilities={
                        'transfers': {'requested': True},
                    },
                    settings={
                        'payouts': {
                            'schedule': {
                                'interval': 'weekly',
                                'weekly_anchor': 'friday'
                            }
                        }
                    }
                )
            else:
                # Standard account for companies (for making payments)
                account = stripe.Account.create(
                    type='standard',
                    email=email,
                    capabilities={
                        'card_payments': {'requested': True},
                        'transfers': {'requested': True},
                    }
                )
            
            # Update database with Stripe account ID
            table_name = 'agents' if user_type == 'agent' else 'companies'
            
            # For agents, find by user_id; for companies, find by user's company_id
            if user_type == 'agent':
                # Get user ID from JWT (simplified - in production, decode JWT properly)
                result = supabase.table(table_name).update({
                    'stripe_account_id': account.id
                }).eq('user_id', 'USER_ID_FROM_JWT').execute()  # Replace with actual JWT parsing
            else:
                result = supabase.table(table_name).update({
                    'stripe_account_id': account.id
                }).eq('id', 'COMPANY_ID_FROM_JWT').execute()  # Replace with actual JWT parsing
            
            self.send_json_response(201, {
                'account_id': account.id,
                'type': user_type,
                'message': 'Stripe Connect account created successfully'
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