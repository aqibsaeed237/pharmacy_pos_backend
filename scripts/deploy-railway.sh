#!/bin/bash

# Railway Deployment Script for Pharmacy POS Backend
# This script guides you through deploying to Railway

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Railway Deployment for Pharmacy POS Backend"
echo "==========================================${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Railway CLI is not installed.${NC}"
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo -e "${GREEN}✓ Railway CLI is installed${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}Step 1: Login to Railway${NC}"
echo "This will open your browser for authentication..."
echo ""
railway login

if [ $? -ne 0 ]; then
    echo -e "${RED}Login failed. Please try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Logged in successfully${NC}"
echo ""

# Step 2: Initialize project
echo -e "${YELLOW}Step 2: Initialize Railway project${NC}"
echo "Creating new Railway project..."
echo ""
railway init

if [ $? -ne 0 ]; then
    echo -e "${RED}Project initialization failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project initialized${NC}"
echo ""

# Step 3: Add MySQL database
echo -e "${YELLOW}Step 3: Adding MySQL database${NC}"
echo "This will create a MySQL database service..."
echo ""
railway add mysql

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Database add failed or already exists. Continuing...${NC}"
fi

echo -e "${GREEN}✓ MySQL database added${NC}"
echo ""

# Step 4: Generate JWT secrets
echo -e "${YELLOW}Step 4: Generating JWT secrets${NC}"
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

echo "Generated secrets (saving to environment variables)..."
echo ""

# Step 5: Set environment variables
echo -e "${YELLOW}Step 5: Setting environment variables${NC}"

# Database variables (will use Railway's MySQL service)
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_SYNCHRONIZE='false'
railway variables set DB_LOGGING='false'

# JWT secrets
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_EXPIRES_IN='15m'
railway variables set JWT_REFRESH_EXPIRES_IN='7d'

# App configuration
railway variables set NODE_ENV='production'
railway variables set PORT='3000'
railway variables set APP_NAME='Pharmacy POS Backend'
railway variables set CORS_ORIGIN='*'

echo -e "${GREEN}✓ Environment variables set${NC}"
echo ""

# Step 6: Deploy
echo -e "${YELLOW}Step 6: Deploying to Railway${NC}"
echo "This may take a few minutes..."
echo ""
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "✅ Deployment Successful!"
    echo "==========================================${NC}"
    echo ""
    echo "Your backend is now live on Railway!"
    echo ""
    echo "Next steps:"
    echo "1. Get your URL: ${BLUE}railway domain${NC}"
    echo "2. Setup database: Connect to MySQL and run schema.sql"
    echo "3. Test API: Visit your Railway URL + /api/v1/health"
    echo ""
    echo "To view logs: ${BLUE}railway logs${NC}"
    echo "To open dashboard: ${BLUE}railway open${NC}"
else
    echo -e "${RED}Deployment failed. Check logs with: railway logs${NC}"
    exit 1
fi
