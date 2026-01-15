# 🚀 Deploy Dev & Prod Environments to Render

## 📋 Overview

Deploy **two separate services** on Render:
- **Development** - For testing (`develop` branch)
- **Production** - For live users (`main` branch)

---

## 🔧 Step 1: Create Development Branch

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Create develop branch
git checkout -b develop

# Push to GitHub
git push -u origin develop
```

---

## 🌐 Step 2: Deploy Development Environment

### 2.1 Create Dev Web Service on Render

1. **Go to Render:** https://render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub:**
   - Select repository: `aqibsaeed237/pharmacy_pos_backend`
   - **Branch:** `develop` (important!)
4. **Configure:**
   - **Name:** `pharmacy-pos-backend-dev`
   - **Region:** Choose closest
   - **Root Directory:** (empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
5. **Click "Create Web Service"**

### 2.2 Set Dev Environment Variables

Go to **Environment** tab, add:

```
NODE_ENV=development
PORT=10000
APP_NAME=Pharmacy POS Backend (Dev)
CORS_ORIGIN=*
DB_SYNCHRONIZE=true
DB_LOGGING=true
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
```

**Database Variables** (from PostgreSQL service):
```
DB_HOST=(from PostgreSQL Internal URL)
DB_PORT=5432
DB_USERNAME=(from PostgreSQL)
DB_PASSWORD=(from PostgreSQL)
DB_DATABASE=pharmacy_pos_dev
```

**JWT Secrets** (generate):
```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### 2.3 Enable Auto-Deploy for Dev

- **Settings** → **Build & Deploy**
- **Auto-Deploy:** ✅ Enable
- **Branch:** `develop`
- **Save**

**Dev URL:** `https://pharmacy-pos-backend-dev.onrender.com`

---

## 🌐 Step 3: Deploy Production Environment

### 3.1 Create Prod Web Service on Render

1. **Click "New +"** → **"Web Service"**
2. **Connect GitHub:**
   - Select repository: `aqibsaeed237/pharmacy_pos_backend`
   - **Branch:** `main` (important!)
3. **Configure:**
   - **Name:** `pharmacy-pos-backend-prod`
   - **Region:** Same as dev
   - **Root Directory:** (empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
4. **Click "Create Web Service"**

### 3.2 Set Prod Environment Variables

Go to **Environment** tab, add:

```
NODE_ENV=production
PORT=10000
APP_NAME=Pharmacy POS Backend
CORS_ORIGIN=*
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Database Variables** (from PostgreSQL service):
```
DB_HOST=(from PostgreSQL Internal URL)
DB_PORT=5432
DB_USERNAME=(from PostgreSQL)
DB_PASSWORD=(from PostgreSQL)
DB_DATABASE=pharmacy_pos
```

**JWT Secrets** (generate NEW secrets, different from dev):
```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### 3.3 Enable Auto-Deploy for Prod

- **Settings** → **Build & Deploy**
- **Auto-Deploy:** ✅ Enable
- **Branch:** `main`
- **Save**

**Prod URL:** `https://pharmacy-pos-backend-prod.onrender.com`

---

## 🔄 Daily Workflow

### Development (Testing):
```bash
# 1. Switch to develop branch
git checkout develop

# 2. Make changes
# ... edit code ...

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin develop

# 4. Auto-deploys to DEV environment
# Test at: https://pharmacy-pos-backend-dev.onrender.com
```

### Production (Deploy):
```bash
# 1. When ready, merge to main
git checkout main
git merge develop

# 2. Push to main
git push origin main

# 3. Auto-deploys to PROD environment
# Live at: https://pharmacy-pos-backend-prod.onrender.com
```

---

## 📍 Environment URLs

### Development:
- **API:** `https://pharmacy-pos-backend-dev.onrender.com`
- **Swagger:** `https://pharmacy-pos-backend-dev.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend-dev.onrender.com/api/v1/health`

### Production:
- **API:** `https://pharmacy-pos-backend-prod.onrender.com`
- **Swagger:** `https://pharmacy-pos-backend-prod.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend-prod.onrender.com/api/v1/health`

---

## 🔐 Environment Differences

| Setting | Development | Production |
|---------|------------|------------|
| **NODE_ENV** | `development` | `production` |
| **DB_SYNCHRONIZE** | `true` (auto-create tables) | `false` (manual migrations) |
| **DB_LOGGING** | `true` (show SQL) | `false` (no logging) |
| **JWT_EXPIRES_IN** | `1h` (longer for testing) | `15m` (secure) |
| **Branch** | `develop` | `main` |
| **Purpose** | Testing & Development | Live Users |

---

## ✅ Checklist

### Development:
- [ ] Create `develop` branch
- [ ] Push `develop` to GitHub
- [ ] Create Render service: `pharmacy-pos-backend-dev`
- [ ] Connect to `develop` branch
- [ ] Set dev environment variables
- [ ] Enable auto-deploy from `develop`
- [ ] Test deployment

### Production:
- [ ] Create Render service: `pharmacy-pos-backend-prod`
- [ ] Connect to `main` branch
- [ ] Set prod environment variables
- [ ] Generate secure JWT secrets
- [ ] Enable auto-deploy from `main`
- [ ] Test deployment

---

## 🎯 Benefits

- ✅ **Safe Testing** - Test in dev before production
- ✅ **No Downtime** - Deploy to dev first, then prod
- ✅ **Easy Rollback** - Can revert production if needed
- ✅ **Different Configs** - Dev has debug, prod has security

---

## 🆘 Troubleshooting

### Dev not deploying?
- Check branch is `develop`
- Verify auto-deploy is enabled
- Check Render logs

### Prod not deploying?
- Check branch is `main`
- Verify auto-deploy is enabled
- Ensure you merged from develop first

---

**Setup complete! You now have separate dev and prod environments! 🚀**
