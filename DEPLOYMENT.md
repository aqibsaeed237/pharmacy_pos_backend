# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Free, Easy)

#### Method A: Using Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com
2. **Sign up with GitHub**
3. **Import project:** Select `aqibsaeed237/pharmacy_pos_backend`
4. **Configure:**
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   APP_NAME=Pharmacy POS Backend
   CORS_ORIGIN=*
   DB_SYNCHRONIZE=false
   DB_LOGGING=false
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```
6. **Deploy!**

**Auto-deploys on every push to `main` branch!**

#### Method B: Using Vercel CLI (Command Line)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to Development (develop branch):**
   ```bash
   git checkout develop
   npm run vercel:deploy:dev
   ```

4. **Deploy to Production (main branch):**
   ```bash
   git checkout main
   npm run vercel:deploy:prod
   ```

5. **Test Locally (with Vercel):**
   ```bash
   npm run vercel:dev
   ```

6. **Add Environment Variables via CLI:**

   **For Development Environment:**
   ```bash
   vercel env add NODE_ENV development
   vercel env add JWT_SECRET your-dev-secret-key
   # Add all other development variables
   # Select: Development, Preview, Production (or just Development)
   ```

   **For Production Environment:**
   ```bash
   vercel env add NODE_ENV production
   vercel env add JWT_SECRET your-prod-secret-key
   # Add all other production variables
   # Select: Production only
   ```

**Available Commands:**
- `npm run vercel:dev` - Run locally with Vercel
- `npm run vercel:deploy:dev` - Deploy to development (develop branch)
- `npm run vercel:deploy:prod` - Deploy to production (main branch)
- `npm run vercel:deploy` - Deploy to preview (current branch)
- `npm run vercel:prod` - Deploy to production (main branch)

---

## 🌍 Two-Environment Setup (Development & Production)

### How Vercel Handles Environments:

Vercel automatically creates different environments based on your Git branches:

| Branch | Environment | Auto-Deploy | URL |
|--------|-------------|-------------|-----|
| `main` | **Production** | ✅ Yes | `your-app.vercel.app` |
| `develop` | **Preview/Development** | ✅ Yes | `your-app-git-develop.vercel.app` |
| `working` | Preview | ✅ Yes | `your-app-git-working.vercel.app` |

### Setup Two Environments:

#### 1. Development Environment (develop branch)

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add variables and select **Development** and **Preview** environments
4. Variables will be used for `develop` branch deployments

**Via CLI:**
```bash
# Switch to develop branch
git checkout develop

# Add environment variables for development
vercel env add NODE_ENV development
vercel env add DB_SYNCHRONIZE true
vercel env add DB_LOGGING true
vercel env add JWT_EXPIRES_IN 1h
# When prompted, select: Development, Preview

# Deploy to development
npm run vercel:deploy:dev
```

#### 2. Production Environment (main branch)

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add variables and select **Production** environment only
4. Variables will be used for `main` branch deployments

**Via CLI:**
```bash
# Switch to main branch
git checkout main

# Add environment variables for production
vercel env add NODE_ENV production
vercel env add DB_SYNCHRONIZE false
vercel env add DB_LOGGING false
vercel env add JWT_EXPIRES_IN 15m
# When prompted, select: Production

# Deploy to production
npm run vercel:deploy:prod
```

### Environment Variables by Environment:

**Development (.env.development):**
```
NODE_ENV=development
DB_SYNCHRONIZE=true
DB_LOGGING=true
JWT_EXPIRES_IN=1h
APP_NAME=Pharmacy POS Backend (Dev)
```

**Production (.env.production):**
```
NODE_ENV=production
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_EXPIRES_IN=15m
APP_NAME=Pharmacy POS Backend
```

---

### Option 2: Railway

1. **Go to:** https://railway.app
2. **Sign up with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select repository**
5. **Configure:**
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
6. **Add environment variables** (same as above)
7. **Enable Auto-Deploy** from `main` branch

---

### Option 3: Render

1. **Go to:** https://render.com
2. **Sign up with GitHub**
3. **New Web Service**
4. **Connect GitHub repo**
5. **Configure:**
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
6. **Add environment variables**
7. **Enable Auto-Deploy**

---

## 🔄 Three-Branch Workflow

### 1. Daily Development (working branch):
```bash
git checkout working
# Make your changes
git add .
git commit -m "Add feature"
git push origin working
```

### 2. Test in Develop (when ready):
```bash
git checkout develop
git merge working
git push origin develop
# → Test in develop environment
```

### 3. Deploy to Production (when tested):
```bash
git checkout main
git merge develop
git push origin main
# → Auto-deploys to live!
```

**Workflow:** `working` → `develop` → `main`

---

## 📍 After Deployment

Your API will be available at:
- **Base URL:** `https://your-app-url.com/api/v1`
- **Swagger:** `https://your-app-url.com/api/docs`
- **Health:** `https://your-app-url.com/api/v1/health`

---

## 🔐 Environment Variables

### Required for Both Environments:

- `NODE_ENV` - `development` or `production`
- `PORT=3000` (or platform default)
- `JWT_SECRET` (generate: `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` (generate: `openssl rand -base64 32`)
- Database connection variables (if using external DB)

### Development-Specific:
- `DB_SYNCHRONIZE=true`
- `DB_LOGGING=true`
- `JWT_EXPIRES_IN=1h`

### Production-Specific:
- `DB_SYNCHRONIZE=false`
- `DB_LOGGING=false`
- `JWT_EXPIRES_IN=15m`

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Database setup (if needed)
- [ ] Auto-deploy enabled
- [ ] Test health endpoint
- [ ] Test Swagger docs
- [ ] Share API URL with frontend

---

**See SETUP.md for local development setup.**
