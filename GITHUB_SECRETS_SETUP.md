# 🔐 GitHub Secrets Setup for AWS Deployment

This guide shows how to set up GitHub Secrets for automatic deployment to AWS EC2.

## 📋 Required GitHub Secrets

Your GitHub Actions workflow needs these secrets configured:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `EC2_HOST` | Your EC2 instance IP address | `18.123.45.67` |
| `EC2_USER` | EC2 SSH username | `ubuntu` |
| `EC2_KEY` | EC2 private key (.pem file content) | Content of `pharmacy-key.pem` |
| `APP_PATH` | Application path on EC2 | `/home/ubuntu/pharmacy_pos_backend` |

---

## 🚀 How to Set Up GitHub Secrets

### Step 1: Go to GitHub Repository Settings

1. Open your repository on GitHub
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

### Step 2: Add Each Secret

#### 1. EC2_HOST

- **Name:** `EC2_HOST`
- **Value:** Your EC2 public IP address
  - Example: `18.123.45.67`
  - Find it in: AWS Console → EC2 → Instances → Your instance → IPv4 Public IP

**Click "Add secret"**

#### 2. EC2_USER

- **Name:** `EC2_USER`
- **Value:** `ubuntu` (default for Ubuntu instances)
  - Or your EC2 username if different

**Click "Add secret"**

#### 3. EC2_KEY

- **Name:** `EC2_KEY`
- **Value:** Content of your EC2 private key file (`.pem` file)

**To get the key content:**
```bash
# On your local machine
cat ~/path/to/your-key.pem
```

Copy the entire content including:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

**Click "Add secret"**

#### 4. APP_PATH

- **Name:** `APP_PATH`
- **Value:** `/home/ubuntu/pharmacy_pos_backend`
  - Path where application is deployed on EC2

**Click "Add secret"**

---

## ✅ Verify Secrets Are Set

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see all 4 secrets listed:
   - ✅ EC2_HOST
   - ✅ EC2_USER
   - ✅ EC2_KEY
   - ✅ APP_PATH

---

## 🚀 Deploy

Once secrets are configured, deployment is automatic:

### Automatic Deployment

**Every time you push to `main` branch:**
```bash
git checkout main
git push origin main
```

GitHub Actions will automatically:
1. ✅ Connect to EC2
2. ✅ Pull latest code
3. ✅ Install dependencies
4. ✅ Build project
5. ✅ Setup MySQL (first time only)
6. ✅ Restart PM2 application
7. ✅ Verify deployment

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

---

## 🔍 Check Deployment Status

### On GitHub

1. Go to your repository
2. Click **Actions** tab
3. Click on latest workflow run
4. See deployment progress in real-time

### On EC2

```bash
# SSH into EC2
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP

# Check PM2 status
pm2 status

# View logs
pm2 logs pharmacy-api

# Test application
curl http://localhost:3000/api/v1
```

---

## 🛠️ Troubleshooting

### Deployment Fails with "Permission Denied"

**Issue:** EC2_KEY secret might be incorrect.

**Solution:**
1. Verify key file path on local machine
2. Copy entire key content (including BEGIN/END lines)
3. Update EC2_KEY secret

### Deployment Fails with "Host Key Verification Failed"

**Issue:** SSH host key not trusted.

**Solution:**
SSH into EC2 once manually:
```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
# Type 'yes' when prompted
# Exit: type 'exit'
```

### Deployment Fails with "Cannot Connect" or "Connection Reset by Peer"

**Issue:** Security group doesn't allow SSH from GitHub Actions runners.

**Symptoms:**
- `ssh: handshake failed: read tcp ... connection reset by peer`
- `Cannot connect to host`
- `Connection timeout`

**Solution:**
1. AWS Console → EC2 → Security Groups
2. Select your instance's security group
3. Edit inbound rules
4. Add/update SSH rule:
   - **Type:** SSH
   - **Port:** 22
   - **Source:** `0.0.0.0/0` (This allows SSH from any IP, including GitHub Actions)
   - **Description:** SSH from GitHub Actions
5. Click **Save rules**

**Why this happens:**
- GitHub Actions runners use dynamic IP addresses
- Security groups need to allow SSH from any IP (`0.0.0.0/0`) for automated deployments
- If you set it to "My IP" only, GitHub Actions can't connect

**Security Note:**
- Allowing `0.0.0.0/0` for SSH is common for GitHub Actions
- Your SSH key still protects access (no one can connect without the private key)
- For extra security, restrict to GitHub's IP ranges (though they change frequently)

### Application Not Starting

**Check logs:**
```bash
# On EC2
pm2 logs pharmacy-api --lines 50

# Common issues:
# - Database connection failed → Check .env file
# - Port already in use → Kill process on port 3000
# - Missing dependencies → Run 'npm install'
```

---

## 📝 Quick Reference

### Repository Secrets URL
```
https://github.com/YOUR_USERNAME/pharmacy_pos_backend/settings/secrets/actions
```

### Workflow File
```
.github/workflows/deploy.yml
```

### Workflow Triggers
- Push to `main` branch
- Automatic deployment

---

## 🎯 Next Steps

1. ✅ Set up all 4 GitHub Secrets
2. ✅ Push code to `main` branch
3. ✅ Watch deployment in GitHub Actions
4. ✅ Verify application is running
5. ✅ Test API endpoint

---

**Need Help?** Check [AWS_EC2_SETUP_GUIDE.md](./AWS_EC2_SETUP_GUIDE.md) for EC2 setup instructions.