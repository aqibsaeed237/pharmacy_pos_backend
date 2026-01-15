#!/bin/bash

# Restart PM2 and verify application works
# Usage: bash restart-and-verify.sh [project_dir]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="${1:-$HOME/pharmacy_pos_backend}"
APP_NAME="pharmacy-api"
PORT="${PORT:-3000}"

echo -e "${BLUE}=========================================="
echo "Restart PM2 and Verify Application"
echo "==========================================${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}✗ PM2 is not installed${NC}"
    echo "Please install PM2 first: npm install -g pm2"
    exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}✗ Project directory not found: $PROJECT_DIR${NC}"
    exit 1
fi

# Check if built application exists
if [ ! -f "$PROJECT_DIR/dist/main.js" ]; then
    echo -e "${YELLOW}⚠️  Application not built. Building now...${NC}"
    cd "$PROJECT_DIR"
    npm run build || {
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    }
fi

# Check if .env file exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Please create .env file or run update-env-db.sh"
fi

# Restart PM2 application
echo -e "${YELLOW}Restarting PM2 application...${NC}"
cd "$PROJECT_DIR"

# Stop if running
pm2 stop "$APP_NAME" 2>/dev/null || true

# Delete if exists (clean restart)
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start application
pm2 start dist/main.js --name "$APP_NAME" || {
    echo -e "${RED}✗ Failed to start application${NC}"
    exit 1
}

# Save PM2 configuration
pm2 save

# Wait for application to start
echo -e "${YELLOW}Waiting for application to start...${NC}"
sleep 5

# Check PM2 status
echo ""
echo -e "${BLUE}PM2 Status:${NC}"
pm2 status

# Check if application is running
if pm2 list | grep -q "$APP_NAME.*online"; then
    echo -e "${GREEN}✓ Application is running${NC}"
else
    echo -e "${RED}✗ Application is not running${NC}"
    echo ""
    echo -e "${YELLOW}Checking logs...${NC}"
    pm2 logs "$APP_NAME" --lines 20 --nostream
    exit 1
fi

# Test application endpoint
echo ""
echo -e "${YELLOW}Testing application endpoint...${NC}"

# Get local IP or use localhost
if command -v hostname &> /dev/null; then
    HOST="localhost"
else
    HOST="127.0.0.1"
fi

# Try to check if port is listening
if command -v netstat &> /dev/null; then
    if netstat -tln | grep -q ":$PORT "; then
        echo -e "${GREEN}✓ Port $PORT is listening${NC}"
    else
        echo -e "${YELLOW}⚠️  Port $PORT is not listening${NC}"
    fi
elif command -v ss &> /dev/null; then
    if ss -tln | grep -q ":$PORT "; then
        echo -e "${GREEN}✓ Port $PORT is listening${NC}"
    else
        echo -e "${YELLOW}⚠️  Port $PORT is not listening${NC}"
    fi
fi

# Try to curl the endpoint (if curl is available)
if command -v curl &> /dev/null; then
    echo -e "${YELLOW}Testing HTTP endpoint...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "http://${HOST}:${PORT}/api/v1" | grep -q "200\|404\|401"; then
        echo -e "${GREEN}✓ Application is responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Application may not be responding correctly${NC}"
        echo "Check logs: pm2 logs $APP_NAME"
    fi
fi

# Show recent logs
echo ""
echo -e "${BLUE}Recent Application Logs:${NC}"
pm2 logs "$APP_NAME" --lines 10 --nostream

echo ""
echo -e "${GREEN}=========================================="
echo "Verification Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Application Info:${NC}"
echo "  Name: $APP_NAME"
echo "  Status: $(pm2 jlist | grep -A 5 "\"name\":\"$APP_NAME\"" | grep "pm2_env.status" | cut -d'"' -f4 || echo 'unknown')"
echo "  Port: $PORT"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs: pm2 logs $APP_NAME"
echo "  View status: pm2 status"
echo "  Restart: pm2 restart $APP_NAME"
echo "  Stop: pm2 stop $APP_NAME"
echo ""
echo -e "${GREEN}Done!${NC}"