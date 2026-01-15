#!/bin/bash

# Complete Railway Deployment Script
# Run this script to deploy your Pharmacy POS Backend to Railway

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "🚂 Railway Deployment - Pharmacy POS Backend"
echo "==========================================${NC}"
echo ""

# Step 1: Check login
echo -e "${YELLOW}Step 1: Checking Railway login...${NC}"
if ! railway whoami &>/dev/null; then
    echo -e "${RED}❌ Not logged in to Railway${NC}"
    echo -e "${YELLOW}Please run: railway login${NC}"
    echo "This will open your browser for authentication."
    echo ""
    read -p "Press Enter after you've logged in, or Ctrl+C to cancel..."
    
    # Verify login
    if ! railway whoami &>/dev/null; then
        echo -e "${RED}Still not logged in. Please run 'railway login' manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Logged in to Railway${NC}"
echo ""

# Step 2: Initialize project (if needed)
echo -e "${YELLOW}Step 2: Checking Railway project...${NC}"
if [ ! -f ".railway/project.json" ]; then
    echo "No Railway project found. Initializing..."
    railway init
    echo -e "${GREEN}✓ Project initialized${NC}"
else
    echo -e "${GREEN}✓ Project already linked${NC}"
fi
echo ""

# Step 3: Add MySQL database
echo -e "${YELLOW}Step 3: Adding MySQL database...${NC}"
if railway service mysql &>/dev/null; then
    echo -e "${GREEN}✓ MySQL service already exists${NC}"
else
    echo "Adding MySQL service..."
    railway add mysql
    echo -e "${GREEN}✓ MySQL database added${NC}"
fi
echo ""

# Step 4: Set environment variables
echo -e "${YELLOW}Step 4: Setting environment variables...${NC}"
./scripts/setup-railway-env.sh
echo ""

# Step 5: Deploy
echo -e "${YELLOW}Step 5: Deploying to Railway...${NC}"
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
        echo -e "${GREEN}Your app is live at: ${BLUE}$URL${NC}"
        echo ""
        echo "API Endpoints:"
        echo "  - Health: ${BLUE}$URL/api/v1/health${NC}"
        echo "  - Swagger: ${BLUE}$URL/api/docs${NC}"
        echo ""
    else
        echo "Run 'railway domain' to get your URL"
    fi
    
    echo "Next steps:"
    echo "1. Setup database schema: ${BLUE}railway connect mysql${NC}"
    echo "2. View logs: ${BLUE}railway logs${NC}"
    echo "3. Open dashboard: ${BLUE}railway open${NC}"
    echo ""
else
    echo -e "${RED}Deployment failed. Check logs with: railway logs${NC}"
    exit 1
fi
