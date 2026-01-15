#!/bin/bash

# MySQL Setup Script for EC2
# This script installs MySQL on EC2, creates database and user for pharmacy_pos
# Usage: Run on EC2: bash setup-mysql-ec2.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "MySQL Setup for Pharmacy POS Backend (EC2)"
echo "==========================================${NC}"

# Generate random passwords
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}MySQL is not installed. Installing MySQL Server...${NC}"
    
    # Update system
    sudo apt update -qq
    
    # Install MySQL Server (non-interactive)
    export DEBIAN_FRONTEND=noninteractive
    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password temp_root_pass_12345"
    sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password temp_root_pass_12345"
    sudo apt install -y mysql-server mysql-client > /dev/null 2>&1
    
    # Start MySQL service
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    # Wait for MySQL to be ready
    echo -e "${YELLOW}Waiting for MySQL to start...${NC}"
    sleep 5
    
    # Change root password securely
    ROOT_PASSWORD=$(generate_password)
    mysql -u root -ptemp_root_pass_12345 <<EOF 2>/dev/null || true
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${ROOT_PASSWORD}';
FLUSH PRIVILEGES;
EOF
    
    # Save root password to file (secure location)
    echo "$ROOT_PASSWORD" | sudo tee /root/.mysql_root_pass > /dev/null
    sudo chmod 600 /root/.mysql_root_pass
    
    echo -e "${GREEN}✓ MySQL installed and started${NC}"
else
    echo -e "${GREEN}✓ MySQL is already installed${NC}"
    
    # Try to get root password from saved file
    if [ -f /root/.mysql_root_pass ]; then
        ROOT_PASSWORD=$(sudo cat /root/.mysql_root_pass)
    else
        echo -e "${YELLOW}⚠️  MySQL root password not found in /root/.mysql_root_pass${NC}"
        echo "Please enter MySQL root password:"
        read -s ROOT_PASSWORD
    fi
fi

# Verify MySQL is running
if ! sudo systemctl is-active --quiet mysql; then
    echo -e "${YELLOW}Starting MySQL service...${NC}"
    sudo systemctl start mysql
    sleep 3
fi

if sudo systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
else
    echo -e "${RED}✗ MySQL failed to start${NC}"
    exit 1
fi

# Database configuration
DB_NAME="pharmacy_pos"
DB_USER="pharmacy_user"
DB_PASSWORD=$(generate_password)

echo -e "${YELLOW}Creating database and user...${NC}"

# Test root connection
if mysql -u root -p"${ROOT_PASSWORD}" -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL root connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to MySQL with root password${NC}"
    echo "Please ensure MySQL is running and root password is correct"
    exit 1
fi

# Create database and user
mysql -u root -p"${ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';

GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';

FLUSH PRIVILEGES;

SELECT 'Database and user created successfully!' AS Status;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '${DB_NAME}' created${NC}"
    echo -e "${GREEN}✓ User '${DB_USER}' created${NC}"
else
    echo -e "${RED}✗ Failed to create database or user${NC}"
    exit 1
fi

# Save credentials to file for later use
CREDS_FILE="$HOME/.pharmacy_db_creds"
cat > "$CREDS_FILE" <<EOF
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_NAME}
EOF
chmod 600 "$CREDS_FILE"

# Verify database exists
DB_EXISTS=$(mysql -u root -p"${ROOT_PASSWORD}" -se "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='${DB_NAME}';" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" -eq 1 ]; then
    echo -e "${GREEN}✓ Database verified${NC}"
    
    # Check if schema.sql exists and run it
    SCHEMA_FILE="$HOME/pharmacy_pos_backend/src/database/sql/schema.sql"
    if [ -f "$SCHEMA_FILE" ]; then
        echo -e "${YELLOW}Running database schema...${NC}"
        mysql -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$SCHEMA_FILE" 2>/dev/null && {
            TABLE_COUNT=$(mysql -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}';" 2>/dev/null || echo "0")
            if [ "$TABLE_COUNT" -gt 0 ]; then
                echo -e "${GREEN}✓ Schema applied successfully ($TABLE_COUNT tables created)${NC}"
            else
                echo -e "${YELLOW}⚠️  Schema file executed but no tables found${NC}"
            fi
        } || echo -e "${YELLOW}⚠️  Could not apply schema (tables may already exist)${NC}"
    else
        echo -e "${YELLOW}⚠️  Schema file not found: $SCHEMA_FILE${NC}"
        echo "You can create tables manually or use TypeORM synchronize"
    fi
else
    echo -e "${RED}✗ Database verification failed${NC}"
    exit 1
fi

# Print summary
echo ""
echo -e "${GREEN}=========================================="
echo "MySQL Setup Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Database Configuration:${NC}"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  Database: ${DB_NAME}"
echo "  Username: ${DB_USER}"
echo "  Password: ${DB_PASSWORD}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Save these credentials!${NC}"
echo "Credentials saved to: ${CREDS_FILE}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Update .env file with these credentials"
echo "  2. Run schema: mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < src/database/sql/schema.sql"
echo "  3. Restart PM2: pm2 restart pharmacy-api"
echo ""
echo -e "${GREEN}Done!${NC}"