#!/bin/bash

# Quick MySQL Start Script
# This script helps start MySQL on macOS

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Starting MySQL for Pharmacy POS Backend"
echo "==========================================${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}✗ MySQL is not installed${NC}"
    echo ""
    echo "Install MySQL:"
    echo "  brew install mysql"
    exit 1
fi

echo -e "${YELLOW}Checking MySQL status...${NC}"

# Try different methods to start MySQL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - Try Homebrew services
    if command -v brew &> /dev/null; then
        echo -e "${YELLOW}Starting MySQL via Homebrew...${NC}"
        brew services start mysql 2>/dev/null || mysql.server start 2>/dev/null || {
            echo -e "${YELLOW}Trying alternative method...${NC}"
            sudo /usr/local/mysql/support-files/mysql.server start 2>/dev/null || true
        }
    else
        # Try mysql.server directly
        mysql.server start 2>/dev/null || {
            echo -e "${YELLOW}Trying with sudo...${NC}"
            sudo mysql.server start 2>/dev/null || true
        }
    fi
else
    # Linux
    sudo systemctl start mysql 2>/dev/null || sudo service mysql start 2>/dev/null || {
        echo -e "${RED}Could not start MySQL automatically${NC}"
        echo "Please start MySQL manually:"
        echo "  sudo systemctl start mysql"
        echo "  OR"
        echo "  sudo service mysql start"
        exit 1
    }
fi

# Wait a moment for MySQL to start
echo -e "${YELLOW}Waiting for MySQL to start...${NC}"
sleep 3

# Check if MySQL is running
if mysqladmin ping -h localhost -u root 2>/dev/null | grep -q "mysqld is alive"; then
    echo -e "${GREEN}✓ MySQL is running!${NC}"
    echo ""
    echo -e "${BLUE}MySQL Status:${NC}"
    mysqladmin -u root status 2>/dev/null || echo "Could not get status (may need password)"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Create database: ./scripts/setup-database-complete.sh"
    echo "2. Or manually: mysql -u root -p < src/database/sql/schema.sql"
    echo "3. Start server: npm run start:dev"
elif mysqladmin ping -h localhost -u root -p 2>/dev/null | grep -q "mysqld is alive"; then
    echo -e "${GREEN}✓ MySQL is running (with password)!${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Create database: ./scripts/setup-database-complete.sh"
    echo "2. Start server: npm run start:dev"
else
    echo -e "${YELLOW}⚠️  MySQL might be starting or needs password${NC}"
    echo ""
    echo "Try these commands:"
    echo "  mysql -u root -p"
    echo "  # If that works, MySQL is running"
    echo ""
    echo "Or check status:"
    echo "  brew services list | grep mysql  # macOS"
    echo "  sudo systemctl status mysql      # Linux"
fi
