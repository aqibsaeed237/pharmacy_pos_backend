# 🚀 Setup Auto-Deploy: Push to Main = Live!

## 🎯 Goal
When you push code to `main` branch → Automatically deploys to live production!

---

## 📋 Step 1: Verify Branches

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Check branches
git branch

# You should see:
# * develop
#   main
```

Both branches exist! ✅

---

## 📋 Step 2: Deploy to Render (One-Time Setup)

### 2.1 Create Render Account

1. **Go to:** https://render.com
2. **Sign up with GitHub** (use your GitHub account)
3. Authorize Render to access your repositories

### 2.2 Create Web Service

1. **Click "New +"** → **"Web Service"**

2. **Connect Repository:**
   - Click **"Connect GitHub"**
   - Select: **`aqibsaeed237/pharmacy_pos_backend`**
   - Click **"Connect"**

3. **Configure Service:**
   - **Name:** `pharmacy-pos-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main` ⚠️ **IMPORTANT - Must be main!**
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

4. **Click "Create Web Service"**

### 2.3 Set Environment Variables

Go to **"Environment"** tab, add:

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

**Generate JWT Secrets:**
```bash
openssl rand -base64 32  # Copy this
openssl rand -base64 32  # Copy this
```

Add:
```
JWT_SECRET=(paste first secret)
JWT_REFRESH_SECRET=(paste second secret)
```

### 2.4 Enable Auto-Deploy (CRITICAL!)

1. Go to **"Settings"** tab
2. Scroll to **"Build & Deploy"** section
3. **Auto-Deploy:** ✅ **Enable** (toggle ON)
4. **Branch:** `main` (must be main!)
5. **Click "Save Changes"**

---

## 📋 Step 3: Test Auto-Deploy

### 3.1 Make a Test Change

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Switch to main
git checkout main

# Make a small change
echo "# Auto-Deploy Test" >> README.md

# Commit and push
git add .
git commit -m "Test auto-deploy"
git push origin main
```

### 3.2 Check Render Dashboard

1. Go to Render dashboard
2. Click your service: `pharmacy-pos-backend`
3. Go to **"Events"** tab
4. You should see a new deployment starting automatically! 🎉

---

## ✅ Setup Complete!

Now your workflow is:

### Development:
```bash
git checkout develop
# Make changes
git push origin develop
```

### Deploy to Live:
```bash
git checkout main
git merge develop
git push origin main
# → Automatically deploys to live! 🚀
```

---

## 📍 Your Live URL

After first deployment:
- **Base:** `https://pharmacy-pos-backend.onrender.com`
- **Swagger:** `https://pharmacy-pos-backend.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend.onrender.com/api/v1/health`

---

## 🔄 Future Deployments

Every time you push to `main`:
1. Render detects the push
2. Automatically starts building
3. Deploys your code
4. Your backend is live! 🎉

**No manual deployment needed!**

---

## 📋 Quick Reference

### Work on Features:
```bash
git checkout develop
# ... make changes ...
git push origin develop
```

### Go Live:
```bash
git checkout main
git merge develop
git push origin main
# → Auto-deploys!
```

---

## 🆘 Troubleshooting

### Auto-deploy not working?
- Check Render Settings → Auto-Deploy is enabled
- Verify Branch is set to `main`
- Check you're pushing to `main` branch
- Check Render logs for errors

### Build fails?
- Check Render logs
- Verify build command: `npm install && npm run build`
- Check environment variables are set

---

**Setup once, then just push to main to go live! 🚀**
