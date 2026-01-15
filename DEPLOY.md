# 🚀 Deployment Guide

Complete deployment guide for Pharmacy POS Backend to make it work.

## 📋 Prerequisites

- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed (for local) or EC2 instance (for production)
- [ ] Git installed
- [ ] EC2 instance with SSH access (for production deployment)

---

## 🎯 Quick Deployment

### Option 1: EC2 Deployment (Recommended for Production)

This is the **fastest and easiest** way to deploy everything working:

```bash
# 1. Make sure you have EC2 IP and key file
# 2. Run deployment script
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

**This automatically:**
- ✅ Installs Node.js 18.x
- ✅ Installs MySQL and creates database
- ✅ Creates `pharmacy_pos` database and user
- ✅ Applies database schema (all 19 tables)
- ✅ Updates `.env` with database credentials
- ✅ Installs dependencies and builds project
- ✅ Configures PM2 and starts application
- ✅ Verifies everything works

**Example:**
```bash
./scripts/deploy-now.sh 18.123.45.67 ~/Downloads/pharmacy-key.pem
```

**After deployment, your app will be running at:**
- `http://YOUR_EC2_IP:3000/api/v1`
- `http://YOUR_EC2_IP:3000/api/docs`

---

### Option 2: Local Development

For local testing and development:

```bash
# 1. Install MySQL (if not installed)
# macOS:
brew install mysql
brew services start mysql

# Linux:
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql

# 2. Create database
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Create tables
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql

# 4. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=your-password
# DB_DATABASE=pharmacy_pos

# Generate JWT secrets
openssl rand -base64 32  # Copy for JWT_SECRET
openssl rand -base64 32  # Copy for JWT_REFRESH_SECRET

# Add to .env:
# JWT_SECRET=paste-first-secret-here
# JWT_REFRESH_SECRET=paste-second-secret-here

# 5. Install dependencies (if not installed)
npm install

# 6. Start development server
npm run start:dev
```

**Your app will be running at:**
- `http://localhost:3000/api/v1`
- `http://localhost:3000/api/docs`

---

## 📝 Step-by-Step EC2 Deployment

### Step 1: Prepare EC2 Instance

1. **Create EC2 instance** (Ubuntu 22.04 or 24.04)
   - Instance type: t2.micro (free tier) or t3.micro
   - Security group: Allow SSH (port 22), HTTP (port 80), HTTPS (port 443), and Custom TCP (port 3000)

2. **Get EC2 details:**
   - Public IP address
   - Key file (.pem) location

3. **Set key file permissions:**
   ```bash
   chmod 400 ~/path/to/your-key.pem
   ```

### Step 2: Run Automated Deployment

```bash
# From your local machine
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Run deployment script
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/your-key.pem
```

**Example:**
```bash
./scripts/deploy-now.sh 54.90.77.23 ~/Downloads/pharmacy-key.pem
```

### Step 3: Verify Deployment

After deployment completes, verify everything works:

```bash
# Test API endpoint
curl http://YOUR_EC2_IP:3000/api/v1

# View Swagger docs in browser
open http://YOUR_EC2_IP:3000/api/docs
```

---

## 🔧 Manual EC2 Deployment (Alternative)

If you prefer to deploy manually or the automated script has issues:

### Step 1: SSH into EC2

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
```

### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x.x
```

### Step 3: Install MySQL

```bash
# Install MySQL
sudo apt update
sudo apt install -y mysql-server mysql-client

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 4: Setup Database

```bash
cd ~
git clone https://github.com/aqibsaeed237/pharmacy_pos_backend.git
cd pharmacy_pos_backend

# Run MySQL setup script
bash scripts/setup-mysql-ec2.sh

# Update .env with database credentials
bash scripts/update-env-db.sh

# Or manually create .env file
nano .env
```

**Add to .env:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=pharmacy_user
DB_PASSWORD=<password-from-setup-mysql-ec2.sh>
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Generate JWT secrets
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>

CORS_ORIGIN=*
```

### Step 5: Install Dependencies and Build

```bash
npm install
npm run build
```

### Step 6: Install PM2 and Start Application

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start dist/main.js --name pharmacy-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it prints

# Check status
pm2 status
pm2 logs pharmacy-api
```

---

## ✅ Verification Steps

### 1. Check Application Status

```bash
# On EC2
pm2 status
pm2 logs pharmacy-api
```

### 2. Test API Endpoint

```bash
# From local machine or EC2
curl http://YOUR_EC2_IP:3000/api/v1
# Should return: {"message":"Welcome to Pharmacy POS API"}
```

### 3. Test Swagger Documentation

Open in browser: `http://YOUR_EC2_IP:3000/api/docs`

You should see the Swagger UI with all API endpoints.

### 4. Test Registration

```bash
curl -X POST http://YOUR_EC2_IP:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "admin@test.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Should return JWT tokens and user info.

### 5. Test Login

```bash
curl -X POST http://YOUR_EC2_IP:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Password123!"
  }'
```

---

## 🔍 Troubleshooting

### Issue: Application Won't Start

**Check logs:**
```bash
pm2 logs pharmacy-api --lines 50
```

**Common issues:**
- **Database connection failed:** Check `.env` file has correct DB credentials
- **Port already in use:** Change PORT in `.env` or kill process on port 3000
- **Missing dependencies:** Run `npm install`

### Issue: Database Connection Error

**Check MySQL:**
```bash
# On EC2
sudo systemctl status mysql
mysql -u pharmacy_user -p pharmacy_pos
```

**Check credentials:**
```bash
cat .env | grep DB_
```

### Issue: PM2 Not Starting on Boot

```bash
# Run startup command
pm2 startup
# Copy and run the command it prints

# Save current processes
pm2 save
```

### Issue: Port 3000 Not Accessible

**Check security group:**
- AWS Console → EC2 → Security Groups
- Add inbound rule: Custom TCP, Port 3000, Source: 0.0.0.0/0

**Check firewall:**
```bash
# On EC2
sudo ufw allow 3000
sudo ufw status
```

---

## 🔐 Security Configuration

### Production Recommendations

1. **Change Default Passwords:**
   - MySQL root password
   - Application user password
   - JWT secrets (use strong random strings)

2. **Restrict Database Access:**
   - Only allow localhost connections
   - Use dedicated database user (not root)

3. **Configure Firewall:**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 3000  # API
   sudo ufw enable
   ```

4. **Use Environment Variables:**
   - Never commit `.env` file
   - Use AWS Systems Manager Parameter Store for production

5. **Enable HTTPS:**
   - Use AWS Application Load Balancer
   - Or use Nginx as reverse proxy with SSL

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs pharmacy-api

# View status
pm2 status

# Monitor resources
pm2 monit

# View info
pm2 info pharmacy-api
```

### Application Health Check

Create a health check endpoint (already available):
```bash
curl http://YOUR_EC2_IP:3000/api/v1
```

---

## 🎯 Next Steps After Deployment

1. **Register First Pharmacy:**
   ```bash
   curl -X POST http://YOUR_EC2_IP:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "pharmacyName": "My Pharmacy",
       "email": "admin@pharmacy.com",
       "password": "SecurePassword123!",
       "firstName": "Admin",
       "lastName": "User"
     }'
   ```

2. **Login and Get Token:**
   ```bash
   curl -X POST http://YOUR_EC2_IP:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@pharmacy.com",
       "password": "SecurePassword123!"
     }'
   ```

3. **Test Protected Endpoints:**
   ```bash
   curl http://YOUR_EC2_IP:3000/api/v1/auth/stores \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

4. **Use Swagger UI:**
   - Visit: `http://YOUR_EC2_IP:3000/api/docs`
   - Try all endpoints interactively

---

## 📚 Additional Resources

- **[README.md](./README.md)** - Complete project documentation
- **[AWS_EC2_SETUP_GUIDE.md](./AWS_EC2_SETUP_GUIDE.md)** - Detailed EC2 setup
- **[DATABASE.md](./DATABASE.md)** - Database documentation
- **[API_GUIDE.md](./API_GUIDE.md)** - API usage examples

---

**Need Help?** Check the troubleshooting section above or review the error logs with `pm2 logs pharmacy-api`.