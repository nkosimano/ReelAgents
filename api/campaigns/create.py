import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """
        Vercel-native Python function for synchronous campaign creation
        """
        try:
            # Initialize Supabase client
            supabase_url = os.environ.get('VITE_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not supabase_key:
                self.send_error_response(500, "Supabase configuration missing")
                return
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['name', 'company_id', 'budget']
            for field in required_fields:
                if field not in data:
                    self.send_error_response(400, f"Missing required field: {field}")
                    return
            
            # Validate authorization (in production, extract from JWT)
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                self.send_error_response(401, "Missing or invalid authorization header")
                return
            
            # Prepare campaign data
            campaign_data = {
                'name': data['name'],
                'company_id': data['company_id'],
                'description': data.get('description', ''),
                'budget': float(data['budget']),
                'target_audience': data.get('target_audience', ''),
                'status': 'draft',
                'start_date': data.get('start_date'),
                'end_date': data.get('end_date')
            }
            
            # Insert campaign into Supabase
            result = supabase.table('campaigns').insert(campaign_data).execute()
            
            if result.data:
                campaign = result.data[0]
                self.send_json_response(201, {
                    'campaign': campaign,
                    'message': 'Campaign created successfully'
                })
            else:
                self.send_error_response(500, "Failed to create campaign")
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON in request body")
        except ValueError as e:
            self.send_error_response(400, f"Invalid data: {str(e)}")
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