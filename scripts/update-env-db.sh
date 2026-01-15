#!/bin/bash

# Update .env file with database credentials
# Usage: bash update-env-db.sh [credentials_file]
# If credentials_file is not provided, reads from ~/.pharmacy_db_creds

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get project directory (where .env file is)
PROJECT_DIR="${1:-$HOME/pharmacy_pos_backend}"
CREDS_FILE="${2:-$HOME/.pharmacy_db_creds}"
ENV_FILE="$PROJECT_DIR/.env"

echo -e "${BLUE}=========================================="
echo "Update .env with Database Credentials"
echo "==========================================${NC}"

# Check if credentials file exists
if [ ! -f "$CREDS_FILE" ]; then
    echo -e "${RED}✗ Credentials file not found: $CREDS_FILE${NC}"
    echo "Please run setup-mysql-ec2.sh first or provide credentials manually"
    exit 1
fi

# Read credentials
source "$CREDS_FILE"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    touch "$ENV_FILE"
fi

# Backup .env file
cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true

# Update or add database variables
update_env_var() {
    local key=$1
    local value=$2
    local file=$3
    
    if grep -q "^${key}=" "$file" 2>/dev/null; then
        # Update existing variable
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
        else
            sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        fi
    else
        # Add new variable
        echo "${key}=${value}" >> "$file"
    fi
}

echo -e "${YELLOW}Updating .env file with database credentials...${NC}"

# Ensure required variables exist
update_env_var "DB_HOST" "${DB_HOST:-localhost}" "$ENV_FILE"
update_env_var "DB_PORT" "${DB_PORT:-3306}" "$ENV_FILE"
update_env_var "DB_USERNAME" "${DB_USERNAME}" "$ENV_FILE"
update_env_var "DB_PASSWORD" "${DB_PASSWORD}" "$ENV_FILE"
update_env_var "DB_DATABASE" "${DB_DATABASE}" "$ENV_FILE"

# Set other database defaults if not present
if ! grep -q "^DB_SYNCHRONIZE=" "$ENV_FILE" 2>/dev/null; then
    echo "DB_SYNCHRONIZE=false" >> "$ENV_FILE"
fi

if ! grep -q "^DB_LOGGING=" "$ENV_FILE" 2>/dev/null; then
    echo "DB_LOGGING=false" >> "$ENV_FILE"
fi

# Verify updates
if grep -q "^DB_DATABASE=${DB_DATABASE}" "$ENV_FILE" && grep -q "^DB_USERNAME=${DB_USERNAME}" "$ENV_FILE"; then
    echo -e "${GREEN}✓ .env file updated successfully${NC}"
else
    echo -e "${RED}✗ Failed to update .env file${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================="
echo ".env Update Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Updated variables:${NC}"
echo "  DB_HOST=${DB_HOST}"
echo "  DB_PORT=${DB_PORT}"
echo "  DB_USERNAME=${DB_USERNAME}"
echo "  DB_PASSWORD=***"
echo "  DB_DATABASE=${DB_DATABASE}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Verify .env file: cat $ENV_FILE | grep DB_"
echo "  2. Restart PM2: pm2 restart pharmacy-api"
echo ""
echo -e "${GREEN}Done!${NC}"