import json
import boto3
import uuid
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """
        Vercel-native Python function to trigger AWS Step Function
        """
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['name', 'company_id', 'training_data_url']
            for field in required_fields:
                if field not in data:
                    self.send_error_response(400, f"Missing required field: {field}")
                    return
            
            # Generate unique job ID
            job_id = str(uuid.uuid4())
            digital_twin_id = str(uuid.uuid4())
            
            # Prepare Step Function input
            step_function_input = {
                'digital_twin_id': digital_twin_id,
                'name': data['name'],
                'company_id': data['company_id'],
                'training_data_url': data['training_data_url'],
                'description': data.get('description', ''),
                'job_id': job_id
            }
            
            # Initialize AWS Step Functions client
            step_functions = boto3.client('stepfunctions', region_name='us-east-1')
            
            # Start Step Function execution
            response = step_functions.start_execution(
                stateMachineArn=os.environ.get('STEP_FUNCTION_ARN', 'arn:aws:states:us-east-1:ACCOUNT_ID:stateMachine:CreateDigitalTwin'),
                name=f"digital-twin-{job_id}",
                input=json.dumps(step_function_input)
            )
            
            # Return job ID for tracking
            self.send_json_response(200, {
                'job_id': job_id,
                'digital_twin_id': digital_twin_id,
                'execution_arn': response['executionArn'],
                'status': 'started',
                'message': 'Digital twin creation started successfully'
            })
            
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