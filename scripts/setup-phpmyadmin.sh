#!/bin/bash

# phpMyAdmin Setup Script for macOS
# This script downloads and sets up phpMyAdmin

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================="
echo "phpMyAdmin Setup for Pharmacy POS Backend"
echo "==========================================${NC}"

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo -e "${RED}PHP is not installed.${NC}"
    echo "Installing PHP..."
    brew install php
fi

echo -e "${GREEN}✓ PHP is installed${NC}"

# Create phpMyAdmin directory
PHPMYADMIN_DIR="$HOME/phpmyadmin"
mkdir -p "$PHPMYADMIN_DIR"
cd "$PHPMYADMIN_DIR"

# Download phpMyAdmin
echo -e "${YELLOW}Downloading phpMyAdmin...${NC}"
if [ ! -f "phpmyadmin.tar.gz" ]; then
    curl -L "https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.tar.gz" \
         -o phpmyadmin.tar.gz || {
        echo -e "${RED}Download failed. Trying alternative method...${NC}"
        # Try alternative download
        curl -L "https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.tar.gz" \
             -o phpmyadmin.tar.gz || {
            echo -e "${RED}Download failed. Please download manually from:${NC}"
            echo "https://www.phpmyadmin.net/downloads/"
            exit 1
        }
    }
fi

# Extract phpMyAdmin
if [ ! -d "phpmyadmin" ]; then
    echo -e "${YELLOW}Extracting phpMyAdmin...${NC}"
    tar -xzf phpmyadmin.tar.gz
    # Move extracted folder to phpmyadmin
    EXTRACTED_DIR=$(ls -d phpMyAdmin-* 2>/dev/null | head -1)
    if [ -n "$EXTRACTED_DIR" ]; then
        mv "$EXTRACTED_DIR" phpmyadmin
    fi
fi

echo -e "${GREEN}✓ phpMyAdmin extracted${NC}"

# Create config file
CONFIG_FILE="$PHPMYADMIN_DIR/phpmyadmin/config.inc.php"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Creating configuration file...${NC}"
    cat > "$CONFIG_FILE" << 'EOF'
<?php
declare(strict_types=1);

$cfg['blowfish_secret'] = 'a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f7';

$i = 0;
$i++;
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = true;
$cfg['Servers'][$i]['port'] = '3306';

$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
EOF
    echo -e "${GREEN}✓ Configuration file created${NC}"
fi

# Create start script
START_SCRIPT="$PHPMYADMIN_DIR/start-phpmyadmin.sh"
cat > "$START_SCRIPT" << 'EOF'
#!/bin/bash
cd "$HOME/phpmyadmin/phpmyadmin"
echo "Starting phpMyAdmin..."
echo "Access at: http://localhost:8080"
echo "Press Ctrl+C to stop"
php -S localhost:8080
EOF

chmod +x "$START_SCRIPT"
echo -e "${GREEN}✓ Start script created${NC}"

echo ""
echo -e "${GREEN}=========================================="
echo "phpMyAdmin Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "To start phpMyAdmin, run:"
echo -e "${YELLOW}  ~/phpmyadmin/start-phpmyadmin.sh${NC}"
echo ""
echo "Then open in browser:"
echo -e "${BLUE}  http://localhost:8080${NC}"
echo ""
echo "Login with:"
echo "  Username: root"
echo "  Password: (leave empty or your MySQL password)"
echo ""
