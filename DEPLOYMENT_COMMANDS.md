# 🚀 Deployment Commands Reference

Quick reference for all deployment commands.

---

## 📋 Git Commands

### Check Status
```bash
git status
```

### Commit Changes
```bash
git add -A
git commit -m "your commit message"
```

### Push to GitHub
```bash
git push origin main
```

### View Branches
```bash
git branch -a
```

### Switch Branches
```bash
git checkout main
git checkout develop
git checkout working
```

---

## 🚀 Deployment Commands

### 1. Manual EC2 Deployment (Complete Setup)

```bash
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

**Example:**
```bash
./scripts/deploy-now.sh 18.123.45.67 ~/Downloads/pharmacy-key.pem
```

**This command:**
- ✅ Installs Node.js 18.x
- ✅ Installs MySQL and creates database
- ✅ Creates `pharmacy_pos` database and `pharmacy_user`
- ✅ Applies database schema (all 19 tables)
- ✅ Updates `.env` with database credentials
- ✅ Installs dependencies and builds project
- ✅ Configures PM2 and starts application
- ✅ Verifies everything works

---

### 2. Deploy Using Environment Variables

```bash
export EC2_IP="18.123.45.67"
export KEY_FILE="~/Downloads/pharmacy-key.pem"
./scripts/deploy-now.sh
```

---

### 3. MySQL Setup Only (on EC2)

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
cd ~/pharmacy_pos_backend
bash scripts/setup-mysql-ec2.sh
```

---

### 4. Update .env with Database Credentials

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
cd ~/pharmacy_pos_backend
bash scripts/update-env-db.sh
```

---

### 5. Restart PM2 and Verify

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP
cd ~/pharmacy_pos_backend
bash scripts/restart-and-verify.sh
```

---

## 🔧 Quick Commands

### Check Deployment Status on EC2

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "pm2 status"
```

### View Application Logs

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "pm2 logs pharmacy-api"
```

### Restart Application

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "pm2 restart pharmacy-api"
```

### Test API Endpoint

```bash
curl http://YOUR_EC2_IP:3000/api/v1
```

---

## 📦 Build Commands

### Build for Production

```bash
npm run build
```

### Start Development Server

```bash
npm run start:dev
```

### Start Production Server

```bash
npm run start:prod
```

---

## 🔍 Verification Commands

### Check if Server is Running

```bash
lsof -ti:3000
# or
curl http://localhost:3000/api/v1
```

### Check Database

```bash
mysql -u root -p pharmacy_pos -e "SHOW TABLES;"
```

### Check GitHub Actions

```bash
open https://github.com/aqibsaeed237/pharmacy_pos_backend/actions
```

---

## 🌐 Quick Deploy Workflow

### Complete Deployment (First Time)

```bash
# 1. Ensure code is committed
git add -A
git commit -m "deploy: ready for production"

# 2. Push to GitHub
git push origin main

# 3. Deploy to EC2 (if manual)
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

### Update Existing Deployment

```bash
# 1. Make changes and commit
git add -A
git commit -m "update: new features"

# 2. Push to GitHub (auto-deploys if secrets set)
git push origin main

# OR manually update on EC2:
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "cd ~/pharmacy_pos_backend && git pull && npm install && npm run build && pm2 restart pharmacy-api"
```

---

## 🛠️ Troubleshooting Commands

### Check PM2 Status

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "pm2 status"
```

### View Recent Logs

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "pm2 logs pharmacy-api --lines 50"
```

### Check MySQL Status

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "sudo systemctl status mysql"
```

### Check Port 3000

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "lsof -ti:3000"
```

### Restart MySQL

```bash
ssh -i ~/path/to/key.pem ubuntu@YOUR_EC2_IP "sudo systemctl restart mysql"
```

---

## 📝 All-in-One Deployment Command

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend && \
git add -A && \
git commit -m "deploy: $(date +%Y-%m-%d)" && \
git push origin main && \
echo "✅ Pushed to GitHub. Deploy with: ./scripts/deploy-now.sh EC2_IP KEY_FILE"
```

---

## 🔐 GitHub Secrets Setup

### Set Secrets for Auto-Deployment

Go to: https://github.com/aqibsaeed237/pharmacy_pos_backend/settings/secrets/actions

Add these secrets:
- `EC2_HOST` - Your EC2 IP
- `EC2_USER` - `ubuntu`
- `EC2_KEY` - Your .pem file content
- `APP_PATH` - `/home/ubuntu/pharmacy_pos_backend`

---

## ✅ Quick Checklist

Before deploying:

- [ ] Code committed and pushed
- [ ] EC2 instance running
- [ ] EC2 IP address ready
- [ ] Key file (.pem) available
- [ ] GitHub Secrets set (for auto-deployment)

Deployment:

- [ ] Run deployment script OR
- [ ] Push to GitHub (auto-deploy)

After deployment:

- [ ] Check PM2 status
- [ ] Test API endpoint
- [ ] Verify Swagger docs
- [ ] Check application logs

---

**Need help?** Check:
- `GITHUB_SECRETS_SETUP.md` - GitHub Secrets setup
- `AWS_EC2_SETUP_GUIDE.md` - EC2 setup guide
- `DEPLOY.md` - Complete deployment guide