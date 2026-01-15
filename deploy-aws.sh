#!/bin/bash

# AWS Elastic Beanstalk Deployment Script
# Usage: ./deploy-aws.sh [environment-name]

set -e

ENV_NAME=${1:-pharmacy-pos-backend-env}

echo "🚀 Starting AWS Deployment..."
echo "Environment: $ENV_NAME"
echo ""

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Installing..."
    pip install awsebcli --upgrade --user
    echo "✅ EB CLI installed. Please add to PATH: ~/.local/bin"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Run: aws configure"
    exit 1
fi

echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if environment exists
if eb list | grep -q "$ENV_NAME"; then
    echo "🔄 Updating existing environment: $ENV_NAME"
    eb deploy "$ENV_NAME"
else
    echo "🆕 Creating new environment: $ENV_NAME"
    echo "⚠️  This will take 5-10 minutes..."
    eb create "$ENV_NAME"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    
    # Get the URL
    CNAME=$(eb status "$ENV_NAME" | grep "CNAME" | awk '{print $2}')
    
    if [ ! -z "$CNAME" ]; then
        echo "🌐 Your API is live at:"
        echo "   API Base: https://$CNAME/api/v1"
        echo "   Swagger:  https://$CNAME/api/docs"
        echo ""
        echo "📋 Quick Links:"
        echo "   View logs:  eb logs $ENV_NAME"
        echo "   SSH access: eb ssh $ENV_NAME"
        echo "   Status:     eb status $ENV_NAME"
    fi
else
    echo "❌ Deployment failed! Check logs: eb logs $ENV_NAME"
    exit 1
fi
