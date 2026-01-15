#!/bin/bash

# Complete Railway Deployment Script
# Run this script to deploy your backend

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🚀 Railway Deployment Script"
echo "==========================================${NC}"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

echo -e "${GREEN}✓ Railway CLI ready${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}Step 1: Login to Railway${NC}"
echo "This will open your browser..."
echo ""

if railway whoami &>/dev/null; then
    echo -e "${GREEN}✓ Already logged in${NC}"
    railway whoami
else
    echo "Please login in the browser that opens..."
    railway login
    if [ $? -ne 0 ]; then
        echo -e "${RED}Login failed. Please run 'railway login' manually.${NC}"
        exit 1
    fi
fi

echo ""

# Step 2: Initialize Project
echo -e "${YELLOW}Step 2: Initialize Railway Project${NC}"
echo ""

if railway status &>/dev/null; then
    echo -e "${GREEN}✓ Project already linked${NC}"
    railway status
else
    echo "Creating new project..."
    railway init
    if [ $? -ne 0 ]; then
        echo -e "${RED}Project initialization failed.${NC}"
        exit 1
    fi
fi

echo ""

# Step 3: Add MySQL
echo -e "${YELLOW}Step 3: Adding MySQL Database${NC}"
echo ""

# Check if MySQL service exists
if railway service list 2>/dev/null | grep -q mysql; then
    echo -e "${GREEN}✓ MySQL service already exists${NC}"
else
    echo "Adding MySQL service..."
    railway add mysql
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  MySQL add failed or already exists. Continuing...${NC}"
    fi
fi

echo ""

# Step 4: Set Environment Variables
echo -e "${YELLOW}Step 4: Setting Environment Variables${NC}"
echo ""

# Load or generate JWT secrets
if [ -f ".railway-secrets.txt" ]; then
    source .railway-secrets.txt
    echo "Using existing JWT secrets"
else
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET" > .railway-secrets.txt
    echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .railway-secrets.txt
    echo "Generated new JWT secrets"
fi

# Set variables
echo "Setting database variables..."
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}' 2>/dev/null || true
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}' 2>/dev/null || true
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}' 2>/dev/null || true
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}' 2>/dev/null || true
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}' 2>/dev/null || true
railway variables set DB_SYNCHRONIZE='false' 2>/dev/null || true
railway variables set DB_LOGGING='false' 2>/dev/null || true

echo "Setting JWT variables..."
railway variables set JWT_SECRET="$JWT_SECRET" 2>/dev/null || true
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" 2>/dev/null || true
railway variables set JWT_EXPIRES_IN='15m' 2>/dev/null || true
railway variables set JWT_REFRESH_EXPIRES_IN='7d' 2>/dev/null || true

echo "Setting app variables..."
railway variables set NODE_ENV='production' 2>/dev/null || true
railway variables set PORT='3000' 2>/dev/null || true
railway variables set APP_NAME='Pharmacy POS Backend' 2>/dev/null || true
railway variables set CORS_ORIGIN='*' 2>/dev/null || true

echo -e "${GREEN}✓ Environment variables set${NC}"
echo ""

# Step 5: Deploy
echo -e "${YELLOW}Step 5: Deploying to Railway${NC}"
echo "This may take 3-5 minutes..."
echo ""

railway up

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "✅ Deployment Successful!"
    echo "==========================================${NC}"
    echo ""
    
    # Get URL
    echo "Getting your deployment URL..."
    URL=$(railway domain 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || echo "")
    
    if [ -n "$URL" ]; then
        echo ""
        echo -e "${BLUE}🌐 Your backend is live at:${NC}"
        echo -e "${GREEN}$URL${NC}"
        echo ""
        echo "📚 Swagger Docs: $URL/api/docs"
        echo "🏥 Health Check: $URL/api/v1/health"
        echo ""
    else
        echo "Run 'railway domain' to get your URL"
    fi
    
    echo ""
    echo "Next steps:"
    echo "1. Setup database: Connect to MySQL and import schema.sql"
    echo "2. Test API: Visit your URL + /api/v1/health"
    echo "3. View logs: railway logs"
    echo ""
    echo -e "${YELLOW}To setup database, run:${NC}"
    echo "  railway connect mysql"
    echo "  Then: CREATE DATABASE pharmacy_pos; USE pharmacy_pos; SOURCE src/database/sql/schema.sql;"
    echo ""
else
    echo -e "${RED}Deployment failed. Check logs with: railway logs${NC}"
    exit 1
fi
