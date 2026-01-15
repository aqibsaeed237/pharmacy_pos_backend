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

3. **Deploy to Preview:**
   ```bash
   npm run vercel:deploy
   ```

4. **Deploy to Production:**
   ```bash
   npm run vercel:prod
   ```

5. **Test Locally (with Vercel):**
   ```bash
   npm run vercel:dev
   ```

6. **Add Environment Variables via CLI:**
   ```bash
   vercel env add NODE_ENV production
   vercel env add JWT_SECRET your-secret-key
   # Add all other environment variables
   ```

**Available Commands:**
- `npm run vercel:dev` - Run locally with Vercel
- `npm run vercel:deploy` - Deploy to preview
- `npm run vercel:prod` - Deploy to production

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

Required for production:
- `NODE_ENV=production`
- `PORT=3000` (or platform default)
- `JWT_SECRET` (generate: `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` (generate: `openssl rand -base64 32`)
- Database connection variables (if using external DB)

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
