import json
import boto3
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Handles training job failures and updates status accordingly
    """
    try:
        logger.info(f"Handling training failure: {json.dumps(event)}")
        
        digital_twin_id = event.get('digital_twin_id')
        error_message = event.get('Error', 'Unknown training error')
        
        # In production, this would update the Supabase database
        update_data = {
            'status': 'failed',
            'error_message': error_message,
            'updated_at': 'now()'
        }
        
        logger.error(f"Training failed for digital twin {digital_twin_id}: {error_message}")
        
        # Send failure notification
        # This could trigger an email or in-app notification
        
        return {
            'statusCode': 200,
            'digital_twin_id': digital_twin_id,
            'status': 'failed',
            'error_message': error_message,
            'message': 'Training failure handled'
        }
        
    except Exception as e:
        logger.error(f"Error handling failure: {str(e)}")
        raise Exception(f"Failed to handle training failure: {str(e)}")