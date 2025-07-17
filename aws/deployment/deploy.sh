#!/bin/bash

# ReelAgents AWS Deployment Script
set -e

# Configuration
STACK_NAME="reelagents-backend"
REGION="us-east-1"
ENVIRONMENT=${1:-dev}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying ReelAgents AWS Backend...${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}❌ SAM CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    echo -e "${RED}   - SUPABASE_URL${NC}"
    echo -e "${RED}   - SUPABASE_SERVICE_KEY${NC}"
    exit 1
fi

# Build and deploy
echo -e "${GREEN}📦 Building SAM application...${NC}"
sam build

echo -e "${GREEN}🚀 Deploying to AWS...${NC}"
sam deploy \
    --stack-name "${STACK_NAME}-${ENVIRONMENT}" \
    --region "${REGION}" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment="${ENVIRONMENT}" \
        SupabaseUrl="${SUPABASE_URL}" \
        SupabaseServiceKey="${SUPABASE_SERVICE_KEY}" \
    --confirm-changeset

# Get outputs
echo -e "${GREEN}📋 Deployment outputs:${NC}"
aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}-${ENVIRONMENT}" \
    --region "${REGION}" \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"