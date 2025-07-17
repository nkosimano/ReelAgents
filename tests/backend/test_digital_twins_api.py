import pytest
import json
from unittest.mock import Mock, patch
from api.digital_twins.create import handler

class MockRequest:
    def __init__(self, method='POST', headers=None, body=None):
        self.method = method
        self.headers = headers or {}
        self.body = body or b''
        self.path = '/api/digital-twins/create'
    
    def read(self, size):
        return self.body

class MockHandler(handler):
    def __init__(self):
        self.response_status = None
        self.response_headers = {}
        self.response_body = b''
    
    def send_response(self, status):
        self.response_status = status
    
    def send_header(self, key, value):
        self.response_headers[key] = value
    
    def end_headers(self):
        pass
    
    def wfile_write(self, data):
        self.response_body = data

@pytest.fixture
def mock_boto3():
    with patch('boto3.client') as mock_client:
        mock_step_functions = Mock()
        mock_client.return_value = mock_step_functions
        yield mock_step_functions

@pytest.fixture
def valid_request_data():
    return {
        'name': 'Test Digital Twin',
        'company_id': 'company-123',
        'training_data_url': 'https://example.com/data.mp4',
        'description': 'Test description'
    }

def test_create_digital_twin_success(mock_boto3, valid_request_data):
    """Test successful digital twin creation"""
    # Mock Step Functions response
    mock_boto3.start_execution.return_value = {
        'executionArn': 'arn:aws:states:us-east-1:123456789012:execution:test'
    }
    
    # Create mock request
    request_body = json.dumps(valid_request_data).encode('utf-8')
    mock_request = MockRequest(
        headers={
            'Content-Length': str(len(request_body)),
            'Authorization': 'Bearer mock-token'
        },
        body=request_body
    )
    
    # Create handler instance
    handler_instance = MockHandler()
    handler_instance.headers = mock_request.headers
    handler_instance.rfile = Mock()
    handler_instance.rfile.read.return_value = request_body
    
    # Execute request
    handler_instance.do_POST()
    
    # Verify response
    assert handler_instance.response_status == 200
    response_data = json.loads(handler_instance.response_body.decode('utf-8'))
    assert 'job_id' in response_data
    assert 'digital_twin_id' in response_data
    assert response_data['status'] == 'started'

def test_create_digital_twin_missing_fields():
    """Test validation with missing required fields"""
    invalid_data = {
        'name': 'Test Twin'
        # Missing company_id and training_data_url
    }
    
    request_body = json.dumps(invalid_data).encode('utf-8')
    mock_request = MockRequest(
        headers={
            'Content-Length': str(len(request_body)),
            'Authorization': 'Bearer mock-token'
        },
        body=request_body
    )
    
    handler_instance = MockHandler()
    handler_instance.headers = mock_request.headers
    handler_instance.rfile = Mock()
    handler_instance.rfile.read.return_value = request_body
    
    handler_instance.do_POST()
    
    # Should return 400 error
    assert handler_instance.response_status == 400
    response_data = json.loads(handler_instance.response_body.decode('utf-8'))
    assert 'error' in response_data

def test_create_digital_twin_invalid_auth():
    """Test request with invalid authorization"""
    valid_data = {
        'name': 'Test Twin',
        'company_id': 'company-123',
        'training_data_url': 'https://example.com/data.mp4'
    }
    
    request_body = json.dumps(valid_data).encode('utf-8')
    mock_request = MockRequest(
        headers={
            'Content-Length': str(len(request_body)),
            # Missing Authorization header
        },
        body=request_body
    )
    
    handler_instance = MockHandler()
    handler_instance.headers = mock_request.headers
    handler_instance.rfile = Mock()
    handler_instance.rfile.read.return_value = request_body
    
    handler_instance.do_POST()
    
    # Should return 401 error
    assert handler_instance.response_status == 401

def test_cors_preflight():
    """Test CORS preflight request handling"""
    mock_request = MockRequest(method='OPTIONS')
    
    handler_instance = MockHandler()
    handler_instance.do_OPTIONS()
    
    # Should return 200 with CORS headers
    assert handler_instance.response_status == 200
    assert 'Access-Control-Allow-Origin' in handler_instance.response_headers
    assert 'Access-Control-Allow-Methods' in handler_instance.response_headers

@patch('boto3.client')
def test_step_function_failure(mock_boto3_client, valid_request_data):
    """Test handling of Step Function execution failure"""
    # Mock Step Functions to raise exception
    mock_step_functions = Mock()
    mock_step_functions.start_execution.side_effect = Exception('AWS Error')
    mock_boto3_client.return_value = mock_step_functions
    
    request_body = json.dumps(valid_request_data).encode('utf-8')
    mock_request = MockRequest(
        headers={
            'Content-Length': str(len(request_body)),
            'Authorization': 'Bearer mock-token'
        },
        body=request_body
    )
    
    handler_instance = MockHandler()
    handler_instance.headers = mock_request.headers
    handler_instance.rfile = Mock()
    handler_instance.rfile.read.return_value = request_body
    
    handler_instance.do_POST()
    
    # Should return 500 error
    assert handler_instance.response_status == 500
    response_data = json.loads(handler_instance.response_body.decode('utf-8'))
    assert 'error' in response_data