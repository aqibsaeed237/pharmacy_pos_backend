# 🚀 Step-by-Step: GitHub to Live Deployment

## 🎯 Goal
Push code to GitHub → Deploy to Render → Get Live URL

---

## 📋 Step 1: Push Code to GitHub

### 1.1 Check Current Status
```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend
git status
```

### 1.2 Add All Changes
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "Ready for deployment"
```

### 1.4 Push to GitHub

**Option A: Using Personal Access Token (Easiest)**

1. **Create GitHub Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `Deployment Token`
   - Select: ✅ `repo` (Full control)
   - Click "Generate token"
   - **Copy the token** (save it!)

2. **Push Code:**
   ```bash
   git push origin develop
   ```
   - **Username:** `aqibsaeed237`
   - **Password:** (paste your token, NOT your GitHub password)

**Option B: Using GitHub Desktop**
1. Download: https://desktop.github.com
2. Sign in
3. Add repository
4. Click "Push origin"

---

## 📋 Step 2: Create Render Account

### 2.1 Sign Up
1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. **Sign up with GitHub** (recommended - easier!)
4. Authorize Render to access GitHub

---

## 📋 Step 3: Deploy to Render

### 3.1 Create Web Service

1. **Click "New +"** button (top right)
2. **Select "Web Service"**

3. **Connect Repository:**
   - Click **"Connect account"** or **"Connect GitHub"**
   - Select: **`aqibsaeed237/pharmacy_pos_backend`**
   - Click **"Connect"**

4. **Configure Service:**
   - **Name:** `pharmacy-pos-backend`
   - **Region:** Choose closest to you
   - **Branch:** `develop` (or `main`)
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

5. **Click "Create Web Service"**

---

## 📋 Step 4: Set Environment Variables

### 4.1 Go to Environment Tab

In your Render service, click **"Environment"** tab

### 4.2 Add Variables

Click **"Add Environment Variable"** and add these:

**Basic Settings:**
```
NODE_ENV = production
PORT = 10000
APP_NAME = Pharmacy POS Backend
CORS_ORIGIN = *
```

**Database (You can add later or use external):**
```
DB_HOST = (leave empty for now)
DB_PORT = 3306
DB_USERNAME = (leave empty)
DB_PASSWORD = (leave empty)
DB_DATABASE = pharmacy_pos
DB_SYNCHRONIZE = false
DB_LOGGING = false
```

**JWT Secrets (Generate these):**
```bash
# Run in terminal:
openssl rand -base64 32
openssl rand -base64 32
```

Then add:
```
JWT_SECRET = (paste first generated secret)
JWT_REFRESH_SECRET = (paste second generated secret)
JWT_EXPIRES_IN = 15m
JWT_REFRESH_EXPIRES_IN = 7d
```

---

## 📋 Step 5: Enable Auto-Deploy

1. Go to **"Settings"** tab
2. Scroll to **"Build & Deploy"**
3. **Auto-Deploy:** ✅ Enable
4. **Branch:** `develop` (or `main`)
5. **Click "Save Changes"**

---

## 📋 Step 6: Deploy

1. Click **"Manual Deploy"** button
2. Select **"Deploy latest commit"**
3. **Wait 3-5 minutes** for build
4. Watch the logs to see progress

---

## 📋 Step 7: Get Your Live URL

After deployment completes:

1. **Your URL will be:**
   ```
   https://pharmacy-pos-backend.onrender.com
   ```

2. **API Endpoints:**
   - **Swagger:** `https://pharmacy-pos-backend.onrender.com/api/docs`
   - **Health:** `https://pharmacy-pos-backend.onrender.com/api/v1/health`
   - **Base:** `https://pharmacy-pos-backend.onrender.com/api/v1`

---

## ✅ Test Your Deployment

### Test Health Endpoint:
```bash
curl https://pharmacy-pos-backend.onrender.com/api/v1/health
```

### Test Swagger:
Open in browser:
```
https://pharmacy-pos-backend.onrender.com/api/docs
```

---

## 🔄 Future Deployments (Auto)

Now every time you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update code"
git push origin develop

# Render automatically deploys! 🚀
```

---

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created on Render
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Auto-deploy enabled
- [ ] First deployment completed
- [ ] Live URL working
- [ ] Swagger accessible

---

## 🆘 Troubleshooting

### Build Fails?
- Check Render logs
- Verify build command: `npm install && npm run build`
- Check Node version compatibility

### App Not Starting?
- Check start command: `npm run start:prod`
- Verify PORT is set to 10000
- Check environment variables

### Can't Push to GitHub?
- See `PUSH_TO_GITHUB.md` for authentication help
- Use Personal Access Token
- Or use GitHub Desktop

---

## 🎉 Done!

Your backend is now:
- ✅ On GitHub
- ✅ Deployed to Render
- ✅ Live and accessible
- ✅ Auto-deploying on every push

**Share your Swagger URL with frontend developer!**

---

**Need help? Check the logs in Render dashboard!**
