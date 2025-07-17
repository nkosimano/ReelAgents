import json
import boto3
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Updates digital twin status to active after successful training
    """
    try:
        logger.info(f"Updating digital twin status: {json.dumps(event)}")
        
        digital_twin_id = event['digital_twin_id']
        model_endpoint = event['model_endpoint']
        
        # In production, this would update the Supabase database
        # using the Supabase client or direct PostgreSQL connection
        
        update_data = {
            'status': 'active',
            'model_endpoint': model_endpoint,
            'updated_at': 'now()'
        }
        
        logger.info(f"Mock: Updated digital twin {digital_twin_id} to active status")
        
        # Send notification or trigger webhook
        # This could notify the frontend via Supabase Realtime
        
        return {
            'statusCode': 200,
            'digital_twin_id': digital_twin_id,
            'status': 'active',
            'model_endpoint': model_endpoint,
            'message': 'Digital twin successfully activated'
        }
        
    except Exception as e:
        logger.error(f"Error updating status: {str(e)}")
        raise Exception(f"Failed to update digital twin status: {str(e)}")