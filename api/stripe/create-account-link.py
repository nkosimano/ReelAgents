import json
import os
import stripe
from http.server import BaseHTTPRequestHandler

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """
        Create a Stripe Connect account link for onboarding
        """
        try:
            if not stripe.api_key:
                self.send_error_response(500, "Stripe configuration missing")
                return
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            account_id = data.get('account_id')
            refresh_url = data.get('refresh_url')
            return_url = data.get('return_url')
            
            if not all([account_id, refresh_url, return_url]):
                self.send_error_response(400, "Missing required fields")
                return
            
            # Create account link
            account_link = stripe.AccountLink.create(
                account=account_id,
                refresh_url=refresh_url,
                return_url=return_url,
                type='account_onboarding',
            )
            
            self.send_json_response(200, {
                'url': account_link.url,
                'expires_at': account_link.expires_at
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