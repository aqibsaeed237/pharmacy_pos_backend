# 🔗 GitHub → AWS Auto-Deploy Setup

Complete guide to set up automatic deployment from GitHub to AWS Elastic Beanstalk.

---

## 📋 Prerequisites

- ✅ AWS Account (Free tier eligible)
- ✅ GitHub repository with your code
- ✅ AWS IAM user with Elastic Beanstalk permissions

---

## 🚀 Step-by-Step Setup

### Step 1: Create AWS IAM User for GitHub Actions

1. **Go to AWS Console** → **IAM** → **Users** → **Create user**

2. **User name:** `github-actions-deployer` (or any name)

3. **Attach policies:**
   - `AWSElasticBeanstalkFullAccess`
   - `AWSElasticBeanstalkWebTier`
   - `AWSElasticBeanstalkWorkerTier`
   - `AWSElasticBeanstalkMulticontainerDocker`

4. **Create Access Key:**
   - Click on the user → **Security credentials** tab
   - Click **Create access key**
   - Choose **Application running outside AWS**
   - **Download** or **copy** the credentials:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`

⚠️ **Important:** Save these credentials securely. You won't be able to see the secret key again!

---

### Step 2: Add Secrets to GitHub Repository

1. **Go to your GitHub repository**

2. **Settings** → **Secrets and variables** → **Actions**

3. **Click "New repository secret"** and add:

   **Secret 1:**
   - **Name:** `AWS_ACCESS_KEY_ID`
   - **Value:** Your AWS Access Key ID (from Step 1)

   **Secret 2:**
   - **Name:** `AWS_SECRET_ACCESS_KEY`
   - **Value:** Your AWS Secret Access Key (from Step 1)

4. **Click "Add secret"** for each

---

### Step 3: Initialize Elastic Beanstalk (First Time Only)

**Option A: Using Terminal (Recommended for first setup)**

```bash
# 1. Install AWS CLI (if not installed)
brew install awscli  # macOS
# OR
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  # Linux

# 2. Install EB CLI
pip install awsebcli --upgrade --user

# 3. Configure AWS credentials
aws configure
# Enter your AWS_ACCESS_KEY_ID
# Enter your AWS_SECRET_ACCESS_KEY
# Enter region: us-east-1 (or your preferred)
# Enter output format: json

# 4. Navigate to project
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# 5. Initialize Elastic Beanstalk
eb init pharmacy-pos-backend \
  --platform "Node.js 18 running on 64bit Amazon Linux 2" \
  --region us-east-1

# 6. Create production environment (first time)
eb create pharmacy-pos-backend-prod \
  --instance_type t3.micro \
  --single \
  --timeout 20

# 7. Create development environment (optional)
eb create pharmacy-pos-backend-dev \
  --instance_type t3.micro \
  --single \
  --timeout 20
```

**Option B: Let GitHub Actions Create It**

The GitHub Actions workflow will automatically create the environment on first run if it doesn't exist.

---

### Step 4: Configure Environment Variables in AWS

After the environment is created, set environment variables:

**Via AWS Console:**
1. Go to **Elastic Beanstalk** → Your environment
2. **Configuration** → **Software** → **Environment properties**
3. Add these variables:

```bash
NODE_ENV=production
PORT=8080
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=your-db-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=false
CORS_ORIGIN=*
```

**Via Terminal:**
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

---

### Step 5: Push to GitHub and Deploy

```bash
# Make sure you're on the correct branch
git checkout main  # for production
# OR
git checkout develop  # for development

# Commit and push
git add .
git commit -m "Setup AWS deployment"
git push origin main  # or develop
```

**GitHub Actions will automatically:**
1. ✅ Build your application
2. ✅ Run tests
3. ✅ Deploy to AWS Elastic Beanstalk
4. ✅ Show deployment URL in workflow summary

---

## 🔄 How It Works

### Automatic Deployment Flow

1. **Push to `main` branch** → Deploys to `pharmacy-pos-backend-prod`
2. **Push to `develop` branch** → Deploys to `pharmacy-pos-backend-dev`

### Workflow Steps

1. **Checkout code** from GitHub
2. **Install dependencies** (`npm ci`)
3. **Build application** (`npm run build`)
4. **Run tests** (if any)
5. **Configure AWS credentials** from GitHub Secrets
6. **Install EB CLI** in GitHub Actions runner
7. **Deploy to Elastic Beanstalk** using `eb deploy`
8. **Display deployment URL** in workflow summary

---

## 📍 After Deployment

Your APIs will be available at:

**Production (main branch):**
- **API Base:** `https://pharmacy-pos-backend-prod.elasticbeanstalk.com/api/v1`
- **Swagger:** `https://pharmacy-pos-backend-prod.elasticbeanstalk.com/api/docs`

**Development (develop branch):**
- **API Base:** `https://pharmacy-pos-backend-dev.elasticbeanstalk.com/api/v1`
- **Swagger:** `https://pharmacy-pos-backend-dev.elasticbeanstalk.com/api/docs`

---

## 🛠️ Manual Deployment (Optional)

You can also deploy manually using the script:

```bash
# Make script executable
chmod +x deploy-aws.sh

# Deploy to production
./deploy-aws.sh pharmacy-pos-backend-prod

# Deploy to development
./deploy-aws.sh pharmacy-pos-backend-dev
```

---

## 🔐 Security Best Practices

1. **IAM User Permissions:**
   - Use least privilege principle
   - Only grant necessary Elastic Beanstalk permissions
   - Don't use root AWS credentials

2. **GitHub Secrets:**
   - Never commit AWS credentials to code
   - Rotate access keys regularly
   - Use separate IAM users for different environments

3. **Environment Variables:**
   - Store sensitive data in AWS Elastic Beanstalk environment properties
   - Don't hardcode secrets in code

---

## 🐛 Troubleshooting

### Issue: "Access Denied" Error

**Solution:**
- Check IAM user has correct permissions
- Verify AWS credentials in GitHub Secrets are correct
- Ensure region matches in workflow and AWS Console

### Issue: "Environment not found"

**Solution:**
- First deployment will create the environment automatically
- Or create manually: `eb create pharmacy-pos-backend-prod`

### Issue: "Build failed"

**Solution:**
- Check build logs in GitHub Actions
- Verify `package.json` has correct build script
- Ensure all dependencies are in `package.json`

### Issue: "Deployment timeout"

**Solution:**
- First deployment takes 5-10 minutes (normal)
- Check AWS Console for environment status
- View logs: `eb logs pharmacy-pos-backend-prod`

---

## 📊 Monitoring Deployments

### View Deployment Status

1. **GitHub Actions:**
   - Go to your repository → **Actions** tab
   - Click on the latest workflow run
   - View logs and deployment summary

2. **AWS Console:**
   - Go to **Elastic Beanstalk** → Your environment
   - View **Events** and **Logs**

### View Logs

```bash
# Via terminal
eb logs pharmacy-pos-backend-prod

# Via AWS Console
# Elastic Beanstalk → Your environment → Logs → Request Logs
```

---

## ✅ Deployment Checklist

- [ ] AWS IAM user created with Elastic Beanstalk permissions
- [ ] AWS Access Key and Secret Key generated
- [ ] GitHub Secrets configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- [ ] Elastic Beanstalk application initialized (or let GitHub Actions do it)
- [ ] Environment variables set in AWS Elastic Beanstalk
- [ ] Code pushed to `main` or `develop` branch
- [ ] GitHub Actions workflow runs successfully
- [ ] API accessible at deployment URL
- [ ] Swagger docs accessible at `/api/docs`

---

## 🎉 You're All Set!

Now every time you push to:
- **`main`** → Auto-deploys to production
- **`develop`** → Auto-deploys to development

**No manual deployment needed!** 🚀

---

## 📚 Additional Resources

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [EB CLI Docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)

---

**Need Help?** Check the GitHub Actions logs or AWS Elastic Beanstalk events for detailed error messages.
