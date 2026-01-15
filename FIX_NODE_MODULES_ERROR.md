# 🔧 Fix: "Cannot find module '@nestjs/core'" Error

## ❌ Problem

**Error:** `Error: Cannot find module '@nestjs/core'`

**Cause:** `node_modules` are not installed on the server. The application tries to start but can't find dependencies.

---

## ✅ Solution: Install Dependencies on Server

### What I Fixed

1. **Updated Procfile** - Now runs `npm install` before starting
2. **Updated .ebextensions config** - Ensures npm install runs
3. **Updated .ebignore** - Keeps package.json and package-lock.json

### Changes Made

**Procfile:**
```bash
# Before:
web: npm run start:prod

# After:
web: npm install --production && npm run start:prod
```

**This ensures:**
- Dependencies are installed on the server
- Then the app starts

---

## 🚀 Deploy the Fix

The changes are ready. Now deploy:

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend
git add .
git commit -m "Fix: Install npm dependencies on server before starting app"
git push origin main
```

**Or wait for GitHub Actions to auto-deploy.**

---

## ⚙️ Also Set Environment Variables

**While waiting for deployment, set these in AWS:**

1. **Configuration** → **Software** → **Edit**
2. **Environment properties** → **Add:**

```bash
PORT=8080
NODE_ENV=production
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CORS_ORIGIN=*
```

**If using database:**
```bash
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=your-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
```

3. **Click "Apply"**
4. **Wait 2-3 minutes**

---

## 📋 What Happens Next

1. **GitHub Actions** will deploy the fix
2. **Elastic Beanstalk** will:
   - Install dependencies (`npm install --production`)
   - Start the application (`npm run start:prod`)
3. **Health status** should turn Green
4. **Your API** will be accessible

---

## ✅ After Deployment

**Check:**
1. **Health status** turns Green
2. **Logs** show "Application is running"
3. **URL** opens: https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

---

**The fix is ready - just push to GitHub and it will auto-deploy!** 🚀
