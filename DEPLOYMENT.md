# 🚀 Render Deployment Guide

## Quick Deploy to Render (Recommended)

Render is the best platform for deploying NestJS backends with Swagger. It's free, easy, and works perfectly with GitHub auto-deployment.

---

## 📋 Step-by-Step Setup

### Step 1: Sign Up

1. **Go to:** https://render.com
2. **Sign up with GitHub** (recommended for auto-deploy)
3. **Verify your email**

### Step 2: Create Production Service (main branch)

1. **Click:** "New +" → "Web Service"
2. **Connect GitHub repository:**
   - Select: `aqibsaeed237/pharmacy_pos_backend`
   - Branch: `main`
3. **Configure Service:**
   - **Name:** `pharmacy-pos-backend-prod` (or any name)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `./` (leave empty)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free
4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   NODE_ENV=production
   PORT=10000
   DB_SYNCHRONIZE=false
   DB_LOGGING=false
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   APP_NAME=Pharmacy POS Backend
   CORS_ORIGIN=*
   ```
   **Also add these (you'll need to set values):**
   ```
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   DB_DATABASE=pharmacy_pos
   ```
5. **Click:** "Create Web Service"

### Step 3: Create Development Service (develop branch)

1. **Click:** "New +" → "Web Service"
2. **Connect GitHub repository:**
   - Select: `aqibsaeed237/pharmacy_pos_backend`
   - Branch: `develop`
3. **Configure Service:**
   - **Name:** `pharmacy-pos-backend-dev`
   - **Environment:** `Node`
   - **Region:** Same as production
   - **Branch:** `develop`
   - **Root Directory:** `./`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free
4. **Add Environment Variables:**
   ```
   NODE_ENV=development
   PORT=10000
   DB_SYNCHRONIZE=true
   DB_LOGGING=true
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   APP_NAME=Pharmacy POS Backend (Dev)
   CORS_ORIGIN=*
   ```
   **Also add database and JWT secrets (same as production or different)**
5. **Click:** "Create Web Service"

---

## 🔄 Auto-Deploy Setup

After creating services, Render will automatically:

- ✅ **Deploy from `main` branch** → Production service
- ✅ **Deploy from `develop` branch** → Development service
- ✅ **Redeploy on every push** to respective branches

**No manual deployment needed!** Just push to GitHub and Render handles the rest.

---

## 📍 After Deployment

Your APIs will be available at:

### Production (main branch):
- **Base URL:** `https://pharmacy-pos-backend-prod.onrender.com/api/v1`
- **Swagger:** `https://pharmacy-pos-backend-prod.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend-prod.onrender.com/api/v1/health`

### Development (develop branch):
- **Base URL:** `https://pharmacy-pos-backend-dev.onrender.com/api/v1`
- **Swagger:** `https://pharmacy-pos-backend-dev.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend-dev.onrender.com/api/v1/health`

---

## 🔐 Required Environment Variables

### For Both Environments:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` or `development` |
| `PORT` | Server port | `10000` (Render default) |
| `JWT_SECRET` | JWT signing secret | Generate: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Generate: `openssl rand -base64 32` |
| `DB_HOST` | Database host | Your MySQL host |
| `DB_PORT` | Database port | `3306` |
| `DB_USERNAME` | Database username | Your username |
| `DB_PASSWORD` | Database password | Your password |
| `DB_DATABASE` | Database name | `pharmacy_pos` |
| `CORS_ORIGIN` | Allowed origins | `*` or specific domain |

### Production-Specific:
- `DB_SYNCHRONIZE=false`
- `DB_LOGGING=false`
- `JWT_EXPIRES_IN=15m`

### Development-Specific:
- `DB_SYNCHRONIZE=true`
- `DB_LOGGING=true`
- `JWT_EXPIRES_IN=1h`

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
# → Auto-deploys to development environment!
```

### 3. Deploy to Production (when tested):
```bash
git checkout main
git merge develop
git push origin main
# → Auto-deploys to production!
```

**Workflow:** `working` → `develop` → `main`

---

## 🛠️ Using render.yaml (Optional)

If you prefer configuration as code, we've included `render.yaml` in the project. Render will automatically detect and use it.

**Note:** You can still configure everything via the dashboard if you prefer.

---

## 📊 Render Free Tier Limits

- ✅ **750 hours/month** (enough for 24/7 operation)
- ✅ **512 MB RAM**
- ✅ **Auto-deploy from GitHub**
- ✅ **Free SSL/HTTPS**
- ✅ **Custom domains** (paid plans)

**For most projects, the free tier is sufficient!**

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Production service created (main branch)
- [ ] Development service created (develop branch)
- [ ] Environment variables configured
- [ ] Database connection set up
- [ ] First deployment successful
- [ ] Test health endpoint
- [ ] Test Swagger docs
- [ ] Share API URLs with frontend team

---

## 🐛 Troubleshooting

### Service won't start:
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure database is accessible

### Build fails:
- Check Node.js version (should be 20.x)
- Verify all dependencies in `package.json`
- Check build logs in Render dashboard

### Database connection fails:
- Verify database credentials
- Check database host allows Render IPs
- Ensure database is running

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Render Dashboard:** https://dashboard.render.com
- **Support:** https://render.com/docs/support

---

**See SETUP.md for local development setup.**
