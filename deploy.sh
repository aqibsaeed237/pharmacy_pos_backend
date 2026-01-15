#!/bin/bash

# Quick Deployment Script - Prompts for EC2 IP and runs deployment

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🚀 Pharmacy POS Backend - Quick Deploy"
echo "==========================================${NC}"
echo ""

# Check if key file exists
KEY_FILE="./pharmacy-key.pem"
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}❌ Key file not found: $KEY_FILE${NC}"
    echo "Please ensure pharmacy-key.pem is in the project directory"
    exit 1
fi

echo -e "${GREEN}✅ Key file found: $KEY_FILE${NC}"
echo ""

# Get EC2 IP
if [ -z "$EC2_IP" ]; then
    echo -e "${YELLOW}📝 Enter your EC2 IP address:${NC}"
    echo "   (Find it in AWS Console → EC2 → Instances → IPv4 Public IP)"
    read -p "   EC2 IP: " EC2_IP
    
    if [ -z "$EC2_IP" ]; then
        echo -e "${RED}❌ EC2 IP is required!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Using EC2 IP from environment: $EC2_IP${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Starting deployment...${NC}"
echo -e "   EC2 IP: ${GREEN}$EC2_IP${NC}"
echo -e "   Key File: ${GREEN}$KEY_FILE${NC}"
echo ""

# Run deployment
cd "$(dirname "$0")"
./scripts/deploy-now.sh "$EC2_IP" "$KEY_FILE"