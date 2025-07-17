import json
import boto3
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Calls Bedrock Claude 3.7 to generate a digital twin output using a system prompt and training data URL.
    """
    try:
        logger.info(f"Starting digital twin LLM job: {json.dumps(event)}")
        digital_twin_id = event['digital_twin_id']
        training_data_url = event['training_data_url']
        name = event.get('name', 'Digital Twin')
        description = event.get('description', '')

        # Compose system prompt for Claude
        system_prompt = f"""
        You are a digital twin for a marketing campaign. Your job is to analyze the data at {training_data_url} and generate a summary or insights for the campaign named '{name}'. Description: {description}
        """

        response = bedrock.invoke_model(
            modelId='anthropic.claude-v3',
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                "prompt": system_prompt,
                "max_tokens_to_sample": 1024,
                "temperature": 0.7
            })
        )
        result = json.loads(response['body'].read())
        model_output = result.get('completion', '')

        logger.info(f"Bedrock LLM output: {model_output}")

        return {
            'statusCode': 200,
            'digital_twin_id': digital_twin_id,
            'model_output': model_output,
            'training_status': 'COMPLETED',
            'estimated_completion_time': None
        }

    except Exception as e:
        logger.error(f"Error running Bedrock LLM: {str(e)}")
        raise Exception(f"Bedrock LLM job failed: {str(e)}")