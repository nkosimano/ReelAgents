import json
import boto3
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Validates input for digital twin creation
    """
    try:
        logger.info(f"Validating input: {json.dumps(event)}")
        
        # Extract required fields
        required_fields = ['name', 'company_id', 'training_data_url']
        
        for field in required_fields:
            if field not in event or not event[field]:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate training data URL format
        training_url = event['training_data_url']
        if not training_url.startswith(('http://', 'https://', 's3://')):
            raise ValueError("Invalid training data URL format")
        
        # Validate name length
        if len(event['name']) < 3 or len(event['name']) > 100:
            raise ValueError("Name must be between 3 and 100 characters")
        
        logger.info("Input validation successful")
        
        return {
            'statusCode': 200,
            'digital_twin_id': event.get('digital_twin_id'),
            'name': event['name'],
            'company_id': event['company_id'],
            'training_data_url': event['training_data_url'],
            'description': event.get('description', ''),
            'validation_status': 'PASSED'
        }
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise Exception(f"Validation failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise Exception(f"Validation failed: {str(e)}")