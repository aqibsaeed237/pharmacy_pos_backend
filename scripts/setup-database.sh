#!/bin/bash

# Database Setup Script for Pharmacy POS Backend
# This script creates the database and sets up initial configuration

set -e

echo "=========================================="
echo "Pharmacy POS Backend - Database Setup"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}MySQL is not installed. Please install MySQL first.${NC}"
    exit 1
fi

# Get database credentials
read -p "Enter MySQL root password: " -s MYSQL_PASSWORD
echo ""

read -p "Enter database name [pharmacy_pos]: " DB_NAME
DB_NAME=${DB_NAME:-pharmacy_pos}

read -p "Enter database user [pharmacy_user]: " DB_USER
DB_USER=${DB_USER:-pharmacy_user}

read -p "Enter database password: " -s DB_PASSWORD
echo ""

# Create database
echo -e "${YELLOW}Creating database...${NC}"
mysql -u root -p"$MYSQL_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES LIKE '${DB_NAME}';
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database created successfully!${NC}"
    echo -e "${GREEN}✓ User created successfully!${NC}"
    echo ""
    echo "Database Configuration:"
    echo "  Database Name: ${DB_NAME}"
    echo "  Database User: ${DB_USER}"
    echo "  Database Host: localhost"
    echo "  Database Port: 3306"
    echo ""
    echo "Update your .env file with these credentials:"
    echo "  DB_DATABASE=${DB_NAME}"
    echo "  DB_USERNAME=${DB_USER}"
    echo "  DB_PASSWORD=${DB_PASSWORD}"
else
    echo -e "${RED}✗ Database creation failed!${NC}"
    exit 1
fi

echo -e "${GREEN}=========================================="
echo "Database setup completed successfully!"
echo "==========================================${NC}"
