# 🖥️ Terminal Commands for AWS Deployment

Quick reference for all terminal commands needed for AWS deployment.

## 📦 Installation

```bash
# Install AWS CLI (macOS)
brew install awscli

# Install AWS CLI (Linux)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install EB CLI
pip install awsebcli --upgrade --user

# Add EB CLI to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH=$PATH:~/.local/bin
```

## 🔐 AWS Configuration

```bash
# Configure AWS credentials
aws configure

# Test AWS connection
aws sts get-caller-identity

# List AWS regions
aws ec2 describe-regions --query 'Regions[].RegionName'
```

## 🚀 Elastic Beanstalk Setup

```bash
# Navigate to project
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Initialize Elastic Beanstalk
eb init pharmacy-pos-backend \
  --platform "Node.js 18 running on 64bit Amazon Linux 2" \
  --region us-east-1

# Create production environment
eb create pharmacy-pos-backend-prod \
  --instance_type t3.micro \
  --single \
  --timeout 20

# Create development environment
eb create pharmacy-pos-backend-dev \
  --instance_type t3.micro \
  --single \
  --timeout 20
```

## 📤 Deployment Commands

```bash
# Build application
npm run build

# Deploy to production
eb deploy pharmacy-pos-backend-prod

# Deploy to development
eb deploy pharmacy-pos-backend-dev

# Deploy using script
./deploy-aws.sh pharmacy-pos-backend-prod
```

## 🔍 Status & Monitoring

```bash
# Check environment status
eb status

# View logs
eb logs

# View specific environment
eb status pharmacy-pos-backend-prod
eb logs pharmacy-pos-backend-prod

# Open in browser
eb open

# View health
eb health

# View events
eb events
```

## ⚙️ Environment Variables

```bash
# Set environment variables
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=your-secret \
  DB_HOST=your-host \
  DB_PASSWORD=your-password

# View environment variables
eb printenv

# Unset variable
eb setenv KEY=
```

## 🔧 Management Commands

```bash
# List all environments
eb list

# Switch environment
eb use pharmacy-pos-backend-prod

# SSH into instance
eb ssh pharmacy-pos-backend-prod

# Terminate environment (careful!)
eb terminate pharmacy-pos-backend-prod
```

## 🌐 Get URLs

```bash
# Get production URL
eb status pharmacy-pos-backend-prod | grep CNAME

# Get development URL
eb status pharmacy-pos-backend-dev | grep CNAME
```

## 🐛 Troubleshooting

```bash
# Check EB CLI version
eb --version

# Check AWS CLI version
aws --version

# View detailed logs
eb logs --all

# Restart environment
eb restart

# Rebuild environment
eb rebuild
```

## 📚 Full Documentation

- [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) - Complete guide
- [GITHUB_AWS_SETUP.md](./GITHUB_AWS_SETUP.md) - GitHub integration
- [AWS_QUICK_START.md](./AWS_QUICK_START.md) - Quick start guide
