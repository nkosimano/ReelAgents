import json
import boto3
import logging
import random
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sagemaker = boto3.client('sagemaker')

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Checks the status of the AI training job
    """
    try:
        logger.info(f"Checking training status: {json.dumps(event)}")
        
        training_job_name = event['training_job_name']
        digital_twin_id = event['digital_twin_id']
        
        # Mock training status check
        # In production: response = sagemaker.describe_training_job(TrainingJobName=training_job_name)
        
        # Simulate random completion for demo
        completion_chance = random.random()
        
        if completion_chance > 0.7:  # 30% chance of completion each check
            training_status = 'COMPLETED'
            model_endpoint = f"https://api.reelagents.com/models/{digital_twin_id}"
        elif completion_chance < 0.1:  # 10% chance of failure
            training_status = 'FAILED'
            model_endpoint = None
        else:
            training_status = 'IN_PROGRESS'
            model_endpoint = None
        
        logger.info(f"Training status for {training_job_name}: {training_status}")
        
        return {
            'statusCode': 200,
            'digital_twin_id': digital_twin_id,
            'training_job_name': training_job_name,
            'training_status': training_status,
            'model_endpoint': model_endpoint,
            'progress_percentage': 85 if training_status == 'IN_PROGRESS' else 100
        }
        
    except Exception as e:
        logger.error(f"Error checking training status: {str(e)}")
        raise Exception(f"Failed to check training status: {str(e)}")