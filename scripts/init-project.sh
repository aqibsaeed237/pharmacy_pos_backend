#!/bin/bash

# Complete Project Initialization Script
# This script sets up everything needed to run the project

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=========================================="
echo "Pharmacy POS Backend - Complete Setup"
echo "==========================================${NC}"

# Step 1: Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your database credentials${NC}"
    else
        echo -e "${RED}✗ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Step 2: Check MySQL
echo -e "${YELLOW}Checking MySQL...${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL is installed${NC}"
    
    # Try to start MySQL (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if brew services list | grep -q mysql; then
            echo -e "${YELLOW}Starting MySQL service...${NC}"
            brew services start mysql 2>/dev/null || true
            sleep 2
        fi
    fi
    
    # Check if MySQL is running
    if mysqladmin ping -h localhost -u root 2>/dev/null | grep -q "mysqld is alive"; then
        echo -e "${GREEN}✓ MySQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MySQL might not be running. Please start it manually:${NC}"
        echo "   macOS: brew services start mysql"
        echo "   Linux: sudo systemctl start mysql"
        echo "   Or: mysql.server start"
    fi
else
    echo -e "${RED}✗ MySQL is not installed${NC}"
    echo "Please install MySQL first:"
    echo "  macOS: brew install mysql"
    echo "  Linux: sudo apt-get install mysql-server"
    exit 1
fi

# Step 3: Create database
echo -e "${YELLOW}Creating database...${NC}"
DB_NAME=${DB_NAME:-pharmacy_pos}

# Read database credentials from .env if possible
if [ -f .env ]; then
    source .env 2>/dev/null || true
fi

DB_USER=${DB_USERNAME:-root}
DB_PASS=${DB_PASSWORD:-}

if [ -z "$DB_PASS" ]; then
    read -sp "Enter MySQL root password (press Enter if no password): " DB_PASS
    echo ""
fi

mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} <<EOF 2>/dev/null || {
    echo -e "${YELLOW}Creating database with provided credentials...${NC}"
    mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE '${DB_NAME}';
SQL
}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database created successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Could not create database automatically${NC}"
    echo "Please create it manually:"
    echo "  mysql -u root -p"
    echo "  CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
fi

# Step 4: Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 5: Build project
echo -e "${YELLOW}Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Project built successfully${NC}"

echo -e "${GREEN}=========================================="
echo "Setup completed!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MySQL if not running:"
echo "   macOS: brew services start mysql"
echo "   Linux: sudo systemctl start mysql"
echo "3. Start the server:"
echo "   npm run start:dev"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
