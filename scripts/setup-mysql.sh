#!/bin/bash

# MySQL Setup Script for macOS
# This script helps install and start MySQL

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=========================================="
echo "MySQL Setup for Pharmacy POS Backend"
echo "==========================================${NC}"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo -e "${RED}Homebrew is not installed.${NC}"
    echo "Please install Homebrew first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}MySQL is not installed. Installing...${NC}"
    brew install mysql
    echo -e "${GREEN}✓ MySQL installed${NC}"
else
    echo -e "${GREEN}✓ MySQL is already installed${NC}"
fi

# Start MySQL service
echo -e "${YELLOW}Starting MySQL service...${NC}"
brew services start mysql || mysql.server start

# Wait for MySQL to be ready
echo -e "${YELLOW}Waiting for MySQL to be ready...${NC}"
sleep 3

# Check if MySQL is running
if mysqladmin ping -h localhost -u root 2>/dev/null | grep -q "mysqld is alive"; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL might need a password.${NC}"
    echo "Please set MySQL root password:"
    echo "  mysql_secure_installation"
    echo ""
    echo "Or start MySQL manually:"
    echo "  brew services start mysql"
    echo "  mysql.server start"
fi

# Create database
echo -e "${YELLOW}Creating database...${NC}"
read -sp "Enter MySQL root password (press Enter if no password): " MYSQL_PASSWORD
echo ""

DB_NAME="pharmacy_pos"

mysql -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} <<EOF 2>/dev/null || {
    echo -e "${YELLOW}Creating database...${NC}"
    mysql -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} <<SQL
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE '${DB_NAME}';
SQL
}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '${DB_NAME}' created successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Could not create database automatically${NC}"
    echo "Please create it manually:"
    echo "  mysql -u root -p"
    echo "  CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
fi

echo -e "${GREEN}=========================================="
echo "MySQL setup completed!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env file with your MySQL credentials"
echo "2. Start the server: npm run start:dev"
