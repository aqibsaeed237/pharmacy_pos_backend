# ⚡ AWS Quick Start - Terminal Commands

Quick reference for deploying to AWS from terminal.

---

## 🚀 Quick Setup (5 Minutes)

### 1. Install AWS CLI & EB CLI

```bash
# Install AWS CLI (macOS)
brew install awscli

# Install AWS CLI (Linux)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install EB CLI
pip install awsebcli --upgrade --user

# Add to PATH (if needed)
export PATH=$PATH:~/.local/bin
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter: AWS Access Key ID
# Enter: AWS Secret Access Key
# Enter: Default region (e.g., us-east-1)
# Enter: Default output format (json)
```

**Get AWS Credentials:**
1. AWS Console → IAM → Users → Create user
2. Attach policy: `AWSElasticBeanstalkFullAccess`
3. Create Access Key → Copy credentials

### 3. Initialize Elastic Beanstalk

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

eb init pharmacy-pos-backend \
  --platform "Node.js 18 running on 64bit Amazon Linux 2" \
  --region us-east-1
```

### 4. Create Environment (First Time)

```bash
# Production
eb create pharmacy-pos-backend-prod \
  --instance_type t3.micro \
  --single

# Development (optional)
eb create pharmacy-pos-backend-dev \
  --instance_type t3.micro \
  --single
```

### 5. Set Environment Variables

```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=your-secret-key \
  JWT_REFRESH_SECRET=your-refresh-secret \
  DB_HOST=your-rds-endpoint \
  DB_PORT=3306 \
  DB_USERNAME=admin \
  DB_PASSWORD=your-password \
  DB_DATABASE=pharmacy_pos \
  DB_SYNCHRONIZE=false \
  CORS_ORIGIN=*
```

### 6. Deploy

```bash
# Build and deploy
npm run build
eb deploy pharmacy-pos-backend-prod

# OR use the script
./deploy-aws.sh pharmacy-pos-backend-prod
```

---

## 📋 Common Commands

### Deployment

```bash
# Deploy to production
eb deploy pharmacy-pos-backend-prod

# Deploy to development
eb deploy pharmacy-pos-backend-dev

# Deploy using script
./deploy-aws.sh [environment-name]
```

### Status & Logs

```bash
# Check environment status
eb status

# View logs
eb logs

# View specific environment logs
eb logs pharmacy-pos-backend-prod

# Open in browser
eb open
```

### Environment Management

```bash
# List environments
eb list

# Switch environment
eb use pharmacy-pos-backend-prod

# View environment info
eb status pharmacy-pos-backend-prod

# SSH into instance
eb ssh pharmacy-pos-backend-prod
```

### Environment Variables

```bash
# Set environment variables
eb setenv KEY=value KEY2=value2

# View environment variables
eb printenv

# Unset environment variable
eb setenv KEY=
```

### Health & Monitoring

```bash
# Check health
eb health

# View events
eb events

# View recent logs
eb logs --all
```

---

## 🔄 GitHub Integration

### Setup GitHub Secrets

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### Auto-Deploy

```bash
# Push to main → Auto-deploys to production
git push origin main

# Push to develop → Auto-deploys to development
git push origin develop
```

**See [GITHUB_AWS_SETUP.md](./GITHUB_AWS_SETUP.md) for complete guide.**

---

## 🌐 Get Your URLs

After deployment:

```bash
# Get production URL
eb status pharmacy-pos-backend-prod | grep CNAME

# Get development URL
eb status pharmacy-pos-backend-dev | grep CNAME
```

**Your URLs will be:**
- Production: `https://pharmacy-pos-backend-prod.elasticbeanstalk.com`
- Development: `https://pharmacy-pos-backend-dev.elasticbeanstalk.com`

**API Endpoints:**
- API Base: `https://your-url/api/v1`
- Swagger: `https://your-url/api/docs`

---

## 🐛 Troubleshooting

### Issue: "eb: command not found"

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Add to PATH
export PATH=$PATH:~/.local/bin
echo 'export PATH=$PATH:~/.local/bin' >> ~/.zshrc  # or ~/.bashrc
```

### Issue: "Access Denied"

```bash
# Reconfigure AWS credentials
aws configure

# Test credentials
aws sts get-caller-identity
```

### Issue: "Environment not found"

```bash
# Create environment
eb create pharmacy-pos-backend-prod --instance_type t3.micro --single
```

### Issue: "Build failed"

```bash
# Build locally first
npm run build

# Check for errors
npm run lint
```

---

## 📚 Full Guides

- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - Complete AWS deployment guide
- **[GITHUB_AWS_SETUP.md](./GITHUB_AWS_SETUP.md)** - GitHub auto-deploy setup

---

## ✅ Quick Checklist

- [ ] AWS CLI installed
- [ ] EB CLI installed
- [ ] AWS credentials configured
- [ ] Elastic Beanstalk initialized
- [ ] Environment created
- [ ] Environment variables set
- [ ] Application deployed
- [ ] URL accessible
- [ ] Swagger docs working

---

**That's it! You're ready to deploy! 🚀**
