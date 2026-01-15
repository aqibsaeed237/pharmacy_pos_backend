#!/bin/bash

# Complete Database Setup Script
# This script creates the database and runs all SQL files

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "Pharmacy POS Backend - Complete Database Setup"
echo "==========================================${NC}"

# Get database credentials
read -p "Enter MySQL root password (press Enter if no password): " -s MYSQL_PASSWORD
echo ""

read -p "Enter database name [pharmacy_pos]: " DB_NAME
DB_NAME=${DB_NAME:-pharmacy_pos}

read -p "Enter database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter database port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

# Check if MySQL is running
echo -e "${YELLOW}Checking MySQL connection...${NC}"
if ! mysqladmin ping -h "$DB_HOST" -P "$DB_PORT" -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} 2>/dev/null | grep -q "mysqld is alive"; then
    echo -e "${RED}✗ Cannot connect to MySQL${NC}"
    echo "Please ensure MySQL is running and credentials are correct"
    exit 1
fi
echo -e "${GREEN}✓ MySQL connection successful${NC}"

# Create database
echo -e "${YELLOW}Creating database '${DB_NAME}'...${NC}"
mysql -h "$DB_HOST" -P "$DB_PORT" -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${RED}✗ Failed to create database${NC}"
    exit 1
fi

# Run schema
SCHEMA_FILE="src/database/sql/schema.sql"
if [ -f "$SCHEMA_FILE" ]; then
    echo -e "${YELLOW}Running schema file...${NC}"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$DB_NAME" < "$SCHEMA_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Schema applied successfully${NC}"
    else
        echo -e "${RED}✗ Failed to apply schema${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Schema file not found: $SCHEMA_FILE${NC}"
    echo "Database created but tables not created."
    echo "You can create tables using TypeORM synchronize or run schema.sql manually"
fi

# Verify tables
echo -e "${YELLOW}Verifying tables...${NC}"
TABLE_COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$DB_NAME" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${DB_NAME}';" 2>/dev/null)

if [ ! -z "$TABLE_COUNT" ]; then
    echo -e "${GREEN}✓ Found $TABLE_COUNT tables${NC}"
    
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "${BLUE}Tables created:${NC}"
        mysql -h "$DB_HOST" -P "$DB_PORT" -u root ${MYSQL_PASSWORD:+-p"$MYSQL_PASSWORD"} "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null
    fi
else
    echo -e "${YELLOW}⚠️  Could not verify tables${NC}"
fi

echo -e "${GREEN}=========================================="
echo "Database setup completed!"
echo "==========================================${NC}"
echo ""
echo "Database Configuration:"
echo "  Database Name: ${DB_NAME}"
echo "  Database Host: ${DB_HOST}"
echo "  Database Port: ${DB_PORT}"
echo ""
echo "Update your .env file:"
echo "  DB_DATABASE=${DB_NAME}"
echo "  DB_HOST=${DB_HOST}"
echo "  DB_PORT=${DB_PORT}"
echo "  DB_USERNAME=root"
echo "  DB_PASSWORD=<your-password>"
echo ""
echo -e "${GREEN}Next step: Start the server with 'npm run start:dev'${NC}"
