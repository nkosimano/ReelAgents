import json
import jwt
import requests
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cache for JWKS keys
JWKS_CACHE = {}

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    AWS Lambda Authorizer for API Gateway
    Validates JWT tokens using Supabase JWKS endpoint
    """
    try:
        # Extract token from Authorization header
        token = extract_token(event)
        if not token:
            return generate_policy('user', 'Deny', event['methodArn'])
        
        # Validate JWT token
        payload = validate_jwt_token(token)
        if not payload:
            return generate_policy('user', 'Deny', event['methodArn'])
        
        # Extract user information
        user_id = payload.get('sub')
        user_role = payload.get('user_metadata', {}).get('role', 'user')
        
        logger.info(f"Authorized user: {user_id} with role: {user_role}")
        
        # Generate allow policy with user context
        policy = generate_policy(user_id, 'Allow', event['methodArn'])
        policy['context'] = {
            'userId': user_id,
            'userRole': user_role,
            'email': payload.get('email', '')
        }
        
        return policy
        
    except Exception as e:
        logger.error(f"Authorization error: {str(e)}")
        return generate_policy('user', 'Deny', event['methodArn'])

def extract_token(event: Dict[str, Any]) -> Optional[str]:
    """Extract JWT token from Authorization header"""
    try:
        auth_header = event.get('headers', {}).get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:]  # Remove 'Bearer ' prefix
        return None
    except Exception:
        return None

def validate_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Validate JWT token using Supabase JWKS"""
    try:
        # Get JWKS from Supabase
        supabase_url = "YOUR_SUPABASE_URL"  # Replace with actual URL
        jwks_url = f"{supabase_url}/.well-known/jwks.json"
        
        # Fetch JWKS (with caching in production)
        if jwks_url not in JWKS_CACHE:
            response = requests.get(jwks_url, timeout=10)
            response.raise_for_status()
            JWKS_CACHE[jwks_url] = response.json()
        
        jwks = JWKS_CACHE[jwks_url]
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        
        # Find the correct key
        key = None
        for jwk in jwks['keys']:
            if jwk['kid'] == kid:
                key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
                break
        
        if not key:
            logger.error("Unable to find appropriate key")
            return None
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            key,
            algorithms=['RS256'],
            audience='authenticated',
            issuer=supabase_url
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Token validation error: {str(e)}")
        return None

def generate_policy(principal_id: str, effect: str, resource: str) -> Dict[str, Any]:
    """Generate IAM policy for API Gateway"""
    return {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': resource
                }
            ]
        }
    }