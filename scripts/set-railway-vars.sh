#!/bin/bash

# Set Railway Environment Variables
# Run this AFTER: railway login && railway init && railway add mysql

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting Railway environment variables...${NC}"

# Database variables (uses Railway's MySQL service)
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_SYNCHRONIZE='false'
railway variables set DB_LOGGING='false'

# Generate JWT secrets if not already generated
if [ -f ".railway-secrets.txt" ]; then
    source .railway-secrets.txt
else
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
fi

# JWT Configuration
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_EXPIRES_IN='15m'
railway variables set JWT_REFRESH_EXPIRES_IN='7d'

# App Configuration
railway variables set NODE_ENV='production'
railway variables set PORT='3000'
railway variables set APP_NAME='Pharmacy POS Backend'
railway variables set CORS_ORIGIN='*'

echo -e "${GREEN}✅ All environment variables set!${NC}"
