#!/bin/bash

# Quick Local Deployment Script
# This script deploys the application locally

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Pharmacy POS Backend - Quick Deployment"
echo "==========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

# Check MySQL
MYSQL_AVAILABLE=false
if command -v mysql &> /dev/null; then
    if mysql -u root -e "SELECT 1" 2>/dev/null; then
        MYSQL_AVAILABLE=true
        echo -e "${GREEN}✓ MySQL is available${NC}"
    elif mysql -u root -p -e "SELECT 1" 2>/dev/null; then
        MYSQL_AVAILABLE=true
        echo -e "${GREEN}✓ MySQL is available (with password)${NC}"
    else
        echo -e "${YELLOW}⚠️  MySQL found but connection failed${NC}"
        echo "   You'll need to set up MySQL manually"
    fi
else
    echo -e "${YELLOW}⚠️  MySQL not found in PATH${NC}"
    echo "   You'll need to install MySQL or use remote database"
fi
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    
    # Generate JWT secrets
    JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/")
    JWT_REFRESH_SECRET=$(openssl rand -base64 32 | tr -d "=+/")
    
    cat > .env << EOF
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# CORS
CORS_ORIGIN=*

# Optional: Firebase (for notifications)
# FIREBASE_PROJECT_ID=
# FIREBASE_PRIVATE_KEY=
# FIREBASE_CLIENT_EMAIL=

# Optional: Stripe (for payments)
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=

# Optional: PayFast (for payments)
# PAYFAST_MERCHANT_ID=
# PAYFAST_MERCHANT_KEY=
# PAYFAST_PASSPHRASE=
# PAYFAST_MODE=sandbox
EOF
    
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update DB_PASSWORD if your MySQL has a password${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi
echo ""

# Setup database if MySQL is available
if [ "$MYSQL_AVAILABLE" = true ]; then
    echo -e "${YELLOW}Setting up database...${NC}"
    
    # Check if database exists
    if mysql -u root -e "USE pharmacy_pos" 2>/dev/null; then
        echo -e "${GREEN}✓ Database 'pharmacy_pos' already exists${NC}"
    else
        echo -e "${YELLOW}Creating database 'pharmacy_pos'...${NC}"
        mysql -u root <<EOF 2>/dev/null || {
            echo -e "${YELLOW}⚠️  Could not create database automatically${NC}"
            echo "   Please create it manually:"
            echo "   mysql -u root -p"
            echo "   CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        }
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Database created${NC}"
        fi
    fi
    
    # Check if tables exist
    TABLE_COUNT=$(mysql -u root pharmacy_pos -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'pharmacy_pos';" 2>/dev/null | tail -n 1 || echo "0")
    
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Database tables already exist ($TABLE_COUNT tables)${NC}"
    else
        echo -e "${YELLOW}Creating database tables...${NC}"
        if [ -f "src/database/sql/schema.sql" ]; then
            mysql -u root pharmacy_pos < src/database/sql/schema.sql 2>/dev/null && {
                echo -e "${GREEN}✓ Database tables created${NC}"
            } || {
                echo -e "${YELLOW}⚠️  Could not create tables automatically${NC}"
                echo "   Please create them manually:"
                echo "   mysql -u root -p pharmacy_pos < src/database/sql/schema.sql"
            }
        else
            echo -e "${YELLOW}⚠️  Schema file not found${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Skipping database setup (MySQL not available)${NC}"
    echo "   You'll need to set up MySQL and database manually"
fi
echo ""

# Build project
echo -e "${YELLOW}Building project...${NC}"
npm run build && echo -e "${GREEN}✓ Build successful${NC}" || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}
echo ""

# Summary
echo -e "${GREEN}=========================================="
echo "✅ Deployment Ready!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review .env file and update if needed"
echo "  2. Ensure MySQL is running"
echo "  3. Start the application:"
echo "     ${GREEN}npm run start:dev${NC}"
echo ""
echo -e "${BLUE}After starting:${NC}"
echo "  - API: http://localhost:3000/api/v1"
echo "  - Swagger: http://localhost:3000/api/docs"
echo ""
echo -e "${GREEN}Ready to start! Run: npm run start:dev${NC}"