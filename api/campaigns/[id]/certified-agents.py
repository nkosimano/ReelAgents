import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """
        Vercel-native Python function to get certified agents for a campaign
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
            
            # Extract campaign_id from path
            from urllib.parse import urlparse
            path_parts = urlparse(self.path).path.split('/')
            campaign_id = None
            
            # Find campaign ID in path (format: /api/campaigns/{id}/certified-agents)
            for i, part in enumerate(path_parts):
                if part == 'campaigns' and i + 1 < len(path_parts):
                    campaign_id = path_parts[i + 1]
                    break
            
            if not campaign_id:
                self.send_error_response(400, "Missing campaign ID in path")
                return
            
            # First, verify the campaign exists and get company_id
            campaign_result = supabase.table('campaigns').select('company_id').eq('id', campaign_id).single().execute()
            
            if not campaign_result.data:
                self.send_error_response(404, "Campaign not found")
                return
            
            company_id = campaign_result.data['company_id']
            
            # Get certified agents (not assigned to this company)
            # In a real marketplace, this would be more sophisticated
            agents_result = supabase.table('agents').select('''
                id,
                name,
                specialization,
                certification_status,
                user_id,
                users!inner(email)
            ''').eq('certification_status', 'certified').neq('company_id', company_id).execute()
            
            agents = agents_result.data or []
            
            # Format the response
            formatted_agents = []
            for agent in agents:
                formatted_agents.append({
                    'id': agent['id'],
                    'name': agent['name'],
                    'specialization': agent['specialization'],
                    'email': agent['users']['email'],
                    'certification_status': agent['certification_status'],
                    'rating': 4.8,  # Mock rating
                    'completed_campaigns': 12,  # Mock data
                    'hourly_rate': 75  # Mock rate
                })
            
            self.send_json_response(200, {
                'agents': formatted_agents,
                'campaign_id': campaign_id,
                'count': len(formatted_agents)
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