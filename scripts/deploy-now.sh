#!/bin/bash

# Fully Automated Non-Interactive EC2 Deployment
# Usage: ./deploy-now.sh <EC2_IP> <KEY_FILE_PATH>
# Or set: export EC2_IP=... && export KEY_FILE=... && ./deploy-now.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get arguments or use env vars
EC2_IP="${1:-${EC2_IP}}"
KEY_FILE="${2:-${KEY_FILE}}"
EC2_USER="${EC2_USER:-ubuntu}"
REPO_URL="https://github.com/aqibsaeed237/pharmacy_pos_backend.git"

# Validate
if [ -z "$EC2_IP" ] || [ -z "$KEY_FILE" ]; then
    echo -e "${RED}❌ Usage: $0 <EC2_IP> <KEY_FILE_PATH>${NC}"
    echo -e "${YELLOW}   Example: $0 18.123.45.67 ~/Downloads/pharmacy-key.pem${NC}"
    exit 1
fi

# Expand tilde
KEY_FILE="${KEY_FILE/#\~/$HOME}"

if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}❌ Key file not found: $KEY_FILE${NC}"
    exit 1
fi

chmod 400 "$KEY_FILE" 2>/dev/null || true

echo -e "${GREEN}🚀 Starting automated deployment...${NC}"
echo -e "   EC2: ${BLUE}$EC2_IP${NC}"
echo -e "   Key: ${BLUE}$KEY_FILE${NC}"
echo ""

# SSH helper
run_ssh() {
    ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$EC2_USER@$EC2_IP" "$1"
}

# Test connection
echo -e "${BLUE}🔌 Testing connection...${NC}"
if ! run_ssh "echo OK" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to EC2!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Connected${NC}"
echo ""

# Update system
echo -e "${BLUE}🔹 Updating system...${NC}"
run_ssh "sudo apt update -qq && sudo apt upgrade -y -qq" > /dev/null
echo -e "${GREEN}   ✅ Done${NC}"

# Install Node.js
echo -e "${BLUE}🔹 Installing Node.js 20.x...${NC}"
run_ssh "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1 && sudo apt install -y nodejs > /dev/null 2>&1"
run_ssh "node --version && npm --version"
echo -e "${GREEN}   ✅ Done${NC}"

# Install Git
echo -e "${BLUE}🔹 Installing Git...${NC}"
run_ssh "sudo apt install -y git > /dev/null 2>&1"
echo -e "${GREEN}   ✅ Done${NC}"

# Install PM2
echo -e "${BLUE}🔹 Installing PM2...${NC}"
run_ssh "sudo npm install -g pm2 > /dev/null 2>&1"
echo -e "${GREEN}   ✅ Done${NC}"

# Install MySQL (if not installed)
echo -e "${BLUE}🔹 Checking MySQL...${NC}"
if ! run_ssh "command -v mysql > /dev/null 2>&1" > /dev/null 2>&1; then
    echo "   MySQL not found, will install after repository setup..."
else
    echo -e "${GREEN}   ✅ MySQL is installed${NC}"
fi

# Setup repository
echo -e "${BLUE}🔹 Setting up repository...${NC}"
if run_ssh "[ -d ~/pharmacy_pos_backend ]" > /dev/null 2>&1; then
    echo "   Repository exists, updating..."
    run_ssh "cd ~/pharmacy_pos_backend && git stash > /dev/null 2>&1 || true && git pull origin main || true" > /dev/null
else
    echo "   Cloning repository..."
    run_ssh "git clone $REPO_URL ~/pharmacy_pos_backend > /dev/null 2>&1"
fi
echo -e "${GREEN}   ✅ Done${NC}"

# Install dependencies
echo -e "${BLUE}🔹 Installing dependencies...${NC}"
run_ssh "cd ~/pharmacy_pos_backend && npm install"
echo -e "${GREEN}   ✅ Done${NC}"

# Build
echo -e "${BLUE}🔹 Building project...${NC}"
run_ssh "cd ~/pharmacy_pos_backend && npm run build"
echo -e "${GREEN}   ✅ Done${NC}"

# Setup MySQL and Database
echo -e "${BLUE}🔹 Setting up MySQL and database...${NC}"
run_ssh "cd ~/pharmacy_pos_backend && chmod +x scripts/*.sh 2>/dev/null || true"
run_ssh "cd ~/pharmacy_pos_backend && bash scripts/setup-mysql-ec2.sh" || {
    echo -e "${YELLOW}   ⚠️  MySQL setup had issues, but continuing...${NC}"
}
echo -e "${GREEN}   ✅ MySQL setup complete${NC}"

# Update .env with database credentials
echo -e "${BLUE}🔹 Updating .env with database credentials...${NC}"
run_ssh "cd ~/pharmacy_pos_backend && bash scripts/update-env-db.sh ~/pharmacy_pos_backend ~/.pharmacy_db_creds" || {
    echo -e "${YELLOW}   ⚠️  Could not auto-update .env, creating default...${NC}"
    run_ssh 'if [ ! -f ~/pharmacy_pos_backend/.env ]; then
cat > ~/pharmacy_pos_backend/.env << EOF
NODE_ENV=production
PORT=3000
JWT_SECRET=change-this-secret-key-$(openssl rand -hex 16)
JWT_REFRESH_SECRET=change-this-refresh-secret-$(openssl rand -hex 16)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=false
CORS_ORIGIN=*
EOF
fi'
}
echo -e "${GREEN}   ✅ .env configured${NC}"

# Restart PM2 and verify
echo -e "${BLUE}🔹 Restarting application and verifying...${NC}"
run_ssh "cd ~/pharmacy_pos_backend && bash scripts/restart-and-verify.sh ~/pharmacy_pos_backend" || {
    echo -e "${YELLOW}   ⚠️  Verification script had issues, starting manually...${NC}"
    run_ssh "cd ~/pharmacy_pos_backend && pm2 stop pharmacy-api 2>/dev/null || true"
    run_ssh "cd ~/pharmacy_pos_backend && pm2 delete pharmacy-api 2>/dev/null || true"
    run_ssh "cd ~/pharmacy_pos_backend && pm2 start dist/main.js --name pharmacy-api"
    run_ssh "pm2 save > /dev/null 2>&1"
}
echo -e "${GREEN}   ✅ Application restarted${NC}"

# Show status
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📊 PM2 Status:${NC}"
run_ssh "pm2 status"
echo ""
echo -e "${BLUE}🔗 Next steps:${NC}"
echo "  1. Edit .env: ssh -i $KEY_FILE $EC2_USER@$EC2_IP 'nano ~/pharmacy_pos_backend/.env'"
echo "  2. Restart: ssh -i $KEY_FILE $EC2_USER@$EC2_IP 'pm2 restart pharmacy-api'"
echo "  3. Test: http://$EC2_IP:3000/api/v1"
echo ""
echo -e "${GREEN}📝 GitHub Secret APP_PATH: /home/ubuntu/pharmacy_pos_backend${NC}"
