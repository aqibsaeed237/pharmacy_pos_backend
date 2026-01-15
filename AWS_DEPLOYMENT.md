# 🚀 AWS Deployment Guide (Free Tier - No Domain Required)

Complete guide to deploy your Pharmacy POS Backend to AWS **for free** without needing a domain name. Perfect for hosting Swagger APIs and testing.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Free Tier Overview](#aws-free-tier-overview)
3. [Method 1: AWS Elastic Beanstalk (Recommended)](#method-1-aws-elastic-beanstalk-recommended)
4. [Method 2: AWS App Runner (Alternative)](#method-2-aws-app-runner-alternative)
5. [Database Setup (AWS RDS Free Tier)](#database-setup-aws-rds-free-tier)
6. [Environment Variables](#environment-variables)
7. [Accessing Your API](#accessing-your-api)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ AWS Account (Free tier eligible)
- ✅ AWS CLI installed ([Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- ✅ Git repository with your code
- ✅ Node.js 18+ installed locally

---

## AWS Free Tier Overview

**What's Free:**
- ✅ **Elastic Beanstalk**: Free (you only pay for EC2 resources)
- ✅ **EC2 t2.micro**: 750 hours/month free (12 months)
- ✅ **RDS db.t2.micro**: 750 hours/month free (12 months)
- ✅ **20GB EBS Storage**: Free (12 months)
- ✅ **Application Load Balancer**: Free tier available

**After Free Tier:**
- EC2 t2.micro: ~$8-10/month
- RDS db.t2.micro: ~$15/month
- Total: ~$25/month (still very affordable)

---

## Method 1: AWS Elastic Beanstalk (Recommended)

**Why Elastic Beanstalk?**
- ✅ Provides default URL: `your-app.elasticbeanstalk.com`
- ✅ No domain required
- ✅ Easy deployment
- ✅ Auto-scaling ready
- ✅ Perfect for NestJS + Swagger

### Step 1: Install AWS CLI & EB CLI

```bash
# Install AWS CLI (if not installed)
# macOS:
brew install awscli

# Install Elastic Beanstalk CLI
pip install awsebcli --upgrade --user

# Verify installation
eb --version
aws --version
```

### Step 2: Configure AWS Credentials

```bash
# Configure AWS credentials
aws configure

# Enter:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region: us-east-1 (or your preferred region)
# Default output format: json
```

**Get AWS Credentials:**
1. Go to AWS Console → IAM → Users
2. Create new user or select existing
3. Attach policy: `AWSElasticBeanstalkFullAccess`
4. Create Access Key → Download credentials

### Step 3: Initialize Elastic Beanstalk

```bash
# Navigate to project directory
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Initialize Elastic Beanstalk
eb init

# Follow prompts:
# 1. Select region: us-east-1 (or your choice)
# 2. Application name: pharmacy-pos-backend
# 3. Platform: Node.js
# 4. Platform version: Node.js 18 (or latest)
# 5. SSH: Yes (for debugging)
# 6. Keypair: Create new or select existing
```

### Step 4: Create Environment Configuration File

Create `.ebextensions/01-nodejs.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm run start:prod"
    NodeVersion: 18.18.0
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /api/docs: dist
```

### Step 5: Create Procfile

Create `Procfile` in root directory:

```
web: npm run start:prod
```

### Step 6: Update package.json Build Script

Ensure your `package.json` has:

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "NODE_ENV=production node dist/main"
  }
}
```

### Step 7: Create .ebignore

Create `.ebignore` (similar to .gitignore):

```
node_modules/
.git/
.env
*.log
coverage/
dist/
```

### Step 8: Deploy to Elastic Beanstalk

```bash
# Create and deploy environment
eb create pharmacy-pos-backend-env

# This will:
# - Create EC2 instance
# - Deploy your app
# - Provide a URL like: pharmacy-pos-backend-env.elasticbeanstalk.com

# Wait for deployment (5-10 minutes)
eb status

# View logs
eb logs

# Open in browser
eb open
```

### Step 9: Set Environment Variables

```bash
# Set environment variables
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=your-secret-key-here \
  JWT_REFRESH_SECRET=your-refresh-secret-here \
  DB_HOST=your-rds-endpoint.region.rds.amazonaws.com \
  DB_PORT=3306 \
  DB_USERNAME=admin \
  DB_PASSWORD=your-db-password \
  DB_DATABASE=pharmacy_pos \
  DB_SYNCHRONIZE=false \
  CORS_ORIGIN=*

# Or set via AWS Console:
# Elastic Beanstalk → Your Environment → Configuration → Software → Environment Properties
```

### Step 10: Update Application

```bash
# After making changes
npm run build
git add .
git commit -m "Deploy to AWS"
eb deploy

# Or deploy specific environment
eb deploy pharmacy-pos-backend-env
```

---

## Method 2: AWS App Runner (Alternative)

**Why App Runner?**
- ✅ Simpler setup
- ✅ Auto-scaling
- ✅ Default URL provided
- ✅ Pay-per-use pricing

### Step 1: Create apprunner.yaml

Create `apprunner.yaml` in root:

```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm install
      - npm run build
run:
  runtime-version: 18
  command: npm run start:prod
  network:
    port: 8080
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Step 2: Deploy via AWS Console

1. Go to **AWS App Runner** → Create service
2. Source: **GitHub** (connect your repo)
3. Deployment trigger: **Automatic**
4. Configure build:
   - Runtime: Node.js 18
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`
5. Configure service:
   - Port: 8080
   - Environment variables: (add all from Step 9 above)
6. Create & Deploy

**Result:** You'll get a URL like: `your-app.xxxxx.us-east-1.awsapprunner.com`

---

## Database Setup (AWS RDS Free Tier)

### Option 1: AWS RDS MySQL (Free Tier)

```bash
# Via AWS Console:
# 1. Go to RDS → Create database
# 2. Engine: MySQL
# 3. Template: Free tier
# 4. DB instance: db.t2.micro
# 5. Storage: 20GB (free)
# 6. Database name: pharmacy_pos
# 7. Username: admin
# 8. Password: [your-password]
# 9. Public access: Yes (for now, restrict later)
# 10. Create database

# Note the endpoint: your-db.xxxxx.us-east-1.rds.amazonaws.com
```

### Option 2: Use External Free MySQL

- **PlanetScale**: Free tier available
- **Supabase**: Free tier available
- **AWS RDS Free Tier**: Recommended (see Option 1 above)

---

## Environment Variables

Set these in Elastic Beanstalk or App Runner:

```bash
NODE_ENV=production
PORT=8080
APP_NAME=Pharmacy POS Backend
APP_VERSION=1.0.0

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=your-db-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=false

# CORS (allow all for testing)
CORS_ORIGIN=*

# Optional: Firebase, Stripe, etc.
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
STRIPE_SECRET_KEY=your-stripe-key
```

---

## Accessing Your API

After deployment, you'll get a URL like:

**Elastic Beanstalk:**
```
https://pharmacy-pos-backend-env.elasticbeanstalk.com
```

**App Runner:**
```
https://your-app.xxxxx.us-east-1.awsapprunner.com
```

### API Endpoints:

- **API Base:** `https://your-url/api/v1`
- **Swagger Docs:** `https://your-url/api/docs`
- **Health Check:** `https://your-url/api/v1/health` (if implemented)

### Example:

```
Swagger: https://pharmacy-pos-backend-env.elasticbeanstalk.com/api/docs
API: https://pharmacy-pos-backend-env.elasticbeanstalk.com/api/v1
```

---

## Troubleshooting

### Issue: Application won't start

```bash
# Check logs
eb logs

# SSH into instance
eb ssh

# Check if app is running
ps aux | grep node

# Check environment variables
eb printenv
```

### Issue: Port 3000 not accessible

- Elastic Beanstalk uses port **8080** by default
- Update your app to use `process.env.PORT || 8080`
- Already configured in `main.ts` ✅

### Issue: Database connection failed

1. Check RDS security group allows inbound from EC2
2. Verify DB endpoint is correct
3. Check username/password
4. Ensure database exists

### Issue: CORS errors

```bash
# Set CORS_ORIGIN to * (for testing)
eb setenv CORS_ORIGIN=*

# Or specific origins
eb setenv CORS_ORIGIN=https://your-frontend.com,https://another.com
```

### Issue: Swagger not loading

1. Ensure app is built: `npm run build`
2. Check that Swagger is enabled in production
3. Verify route: `/api/docs`
4. Check logs for errors

### Common Commands

```bash
# View status
eb status

# View logs
eb logs

# SSH into instance
eb ssh

# Update environment variables
eb setenv KEY=value

# Redeploy
eb deploy

# Terminate environment (careful!)
eb terminate
```

---

## Quick Deploy Script

Create `deploy-aws.sh`:

```bash
#!/bin/bash

echo "🚀 Building application..."
npm run build

echo "📦 Deploying to AWS Elastic Beanstalk..."
eb deploy

echo "✅ Deployment complete!"
echo "🌐 Your API: https://$(eb status | grep 'CNAME' | awk '{print $2}')"
echo "📚 Swagger: https://$(eb status | grep 'CNAME' | awk '{print $2}')/api/docs"
```

Make it executable:
```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

---

## Cost Summary

**Free Tier (First 12 Months):**
- ✅ EC2 t2.micro: 750 hours/month FREE
- ✅ RDS db.t2.micro: 750 hours/month FREE
- ✅ 20GB EBS Storage: FREE
- ✅ Data Transfer: 1GB/month FREE

**After Free Tier:**
- EC2: ~$8-10/month
- RDS: ~$15/month
- **Total: ~$25/month**

**Very affordable for a production API!**

---

## Next Steps

1. ✅ Deploy to AWS Elastic Beanstalk
2. ✅ Set up RDS MySQL database
3. ✅ Configure environment variables
4. ✅ Access Swagger at `https://your-url/api/docs`
5. ✅ Test your APIs
6. ✅ Share URL with frontend team

---

## 🎉 You're Live!

Your API is now accessible at:
- **Swagger:** `https://your-app.elasticbeanstalk.com/api/docs`
- **API:** `https://your-app.elasticbeanstalk.com/api/v1`

No domain needed! Share these URLs with your team.

---

## Additional Resources

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [EB CLI Docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)

---

**Need Help?** Check the logs: `eb logs` or AWS Console → Elastic Beanstalk → Logs
