import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """
        Vercel-native Python function to get campaigns for a company
        """
        try:
            # Initialize Supabase client
            supabase_url = os.environ.get('VITE_SUPABASE_URL')
            supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if not supabase_url or not supabase_key:
                self.send_error_response(500, "Supabase configuration missing")
                return
            
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Validate authorization
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                self.send_error_response(401, "Missing or invalid authorization header")
                return
            
            # Extract company_id from query parameters
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            
            company_id = query_params.get('company_id', [None])[0]
            if not company_id:
                self.send_error_response(400, "Missing company_id parameter")
                return
            
            # Fetch campaigns from Supabase
            result = supabase.table('campaigns').select('*').eq('company_id', company_id).order('created_at', desc=True).execute()
            
            campaigns = result.data or []
            
            self.send_json_response(200, {
                'campaigns': campaigns,
                'count': len(campaigns)
            })
            
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
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