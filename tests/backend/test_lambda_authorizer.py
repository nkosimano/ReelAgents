import pytest
import json
import jwt
from unittest.mock import Mock, patch
from aws.lambda.authorizer import lambda_handler

@pytest.fixture
def mock_event():
    return {
        'type': 'REQUEST',
        'methodArn': 'arn:aws:execute-api:us-east-1:123456789012:abcdef123/test/GET/request',
        'resource': '/request',
        'path': '/request',
        'httpMethod': 'GET',
        'headers': {
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        'requestContext': {
            'accountId': '123456789012',
            'apiId': 'abcdef123',
            'stage': 'test'
        }
    }

@pytest.fixture
def mock_context():
    context = Mock()
    context.aws_request_id = 'test-request-id'
    return context

@pytest.fixture
def valid_jwt_payload():
    return {
        'sub': 'user-123',
        'email': 'test@example.com',
        'user_metadata': {
            'role': 'company'
        },
        'aud': 'authenticated',
        'iss': 'https://test.supabase.co',
        'exp': 9999999999,  # Far future
        'iat': 1000000000
    }

@patch('requests.get')
@patch('jwt.decode')
@patch('jwt.get_unverified_header')
def test_valid_jwt_authorization(mock_get_header, mock_jwt_decode, mock_requests, mock_event, mock_context, valid_jwt_payload):
    """Test successful JWT validation"""
    # Mock JWKS response
    mock_response = Mock()
    mock_response.json.return_value = {
        'keys': [{
            'kid': 'test-key-id',
            'kty': 'RSA',
            'n': 'test-n',
            'e': 'AQAB'
        }]
    }
    mock_response.raise_for_status.return_value = None
    mock_requests.return_value = mock_response
    
    # Mock JWT header and decode
    mock_get_header.return_value = {'kid': 'test-key-id'}
    mock_jwt_decode.return_value = valid_jwt_payload
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Allow policy
    assert result['principalId'] == 'user-123'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Allow'
    assert result['context']['userId'] == 'user-123'
    assert result['context']['userRole'] == 'company'

def test_missing_authorization_header(mock_event, mock_context):
    """Test request without Authorization header"""
    # Remove Authorization header
    del mock_event['headers']['Authorization']
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Deny policy
    assert result['principalId'] == 'user'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Deny'

def test_invalid_authorization_format(mock_event, mock_context):
    """Test request with invalid Authorization header format"""
    mock_event['headers']['Authorization'] = 'InvalidFormat token'
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Deny policy
    assert result['principalId'] == 'user'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Deny'

@patch('requests.get')
def test_jwks_fetch_failure(mock_requests, mock_event, mock_context):
    """Test JWKS endpoint failure"""
    # Mock JWKS request failure
    mock_requests.side_effect = Exception('Network error')
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Deny policy
    assert result['principalId'] == 'user'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Deny'

@patch('requests.get')
@patch('jwt.decode')
@patch('jwt.get_unverified_header')
def test_expired_jwt(mock_get_header, mock_jwt_decode, mock_requests, mock_event, mock_context):
    """Test expired JWT token"""
    # Mock JWKS response
    mock_response = Mock()
    mock_response.json.return_value = {
        'keys': [{
            'kid': 'test-key-id',
            'kty': 'RSA',
            'n': 'test-n',
            'e': 'AQAB'
        }]
    }
    mock_response.raise_for_status.return_value = None
    mock_requests.return_value = mock_response
    
    # Mock JWT header
    mock_get_header.return_value = {'kid': 'test-key-id'}
    
    # Mock JWT decode to raise ExpiredSignatureError
    mock_jwt_decode.side_effect = jwt.ExpiredSignatureError('Token expired')
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Deny policy
    assert result['principalId'] == 'user'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Deny'

@patch('requests.get')
@patch('jwt.decode')
@patch('jwt.get_unverified_header')
def test_invalid_jwt_signature(mock_get_header, mock_jwt_decode, mock_requests, mock_event, mock_context):
    """Test JWT with invalid signature"""
    # Mock JWKS response
    mock_response = Mock()
    mock_response.json.return_value = {
        'keys': [{
            'kid': 'test-key-id',
            'kty': 'RSA',
            'n': 'test-n',
            'e': 'AQAB'
        }]
    }
    mock_response.raise_for_status.return_value = None
    mock_requests.return_value = mock_response
    
    # Mock JWT header
    mock_get_header.return_value = {'kid': 'test-key-id'}
    
    # Mock JWT decode to raise InvalidTokenError
    mock_jwt_decode.side_effect = jwt.InvalidTokenError('Invalid signature')
    
    result = lambda_handler(mock_event, mock_context)
    
    # Should return Deny policy
    assert result['principalId'] == 'user'
    assert result['policyDocument']['Statement'][0]['Effect'] == 'Deny'