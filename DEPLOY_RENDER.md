# 🚀 Deploy to Render - Simple & Free!

## Why Render?
- ✅ **Free tier available** (with limitations)
- ✅ **Simple deployment** - just connect GitHub
- ✅ **Automatic SSL** certificates
- ✅ **Easy database setup**
- ✅ **Better for NestJS** than Railway

---

## 📋 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with **GitHub** (recommended)
3. Verify your email

---

### Step 2: Create Web Service

1. **Click "New +"** → **"Web Service"**

2. **Connect your repository:**
   - Connect your GitHub account
   - Select your `pharmacy_pos_backend` repository
   - Or use "Public Git repository" and paste your repo URL

3. **Configure Service:**
   - **Name:** `pharmacy-pos-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main` or `master`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

4. **Click "Create Web Service"**

---

### Step 3: Add PostgreSQL Database (Free)

1. **Click "New +"** → **"PostgreSQL"**
2. **Name:** `pharmacy-pos-db`
3. **Database:** `pharmacy_pos`
4. **User:** (auto-generated)
5. **Region:** Same as web service
6. **PostgreSQL Version:** Latest
7. **Plan:** Free (or Starter for production)
8. **Click "Create Database"**

---

### Step 4: Set Environment Variables

Go to your **Web Service** → **Environment** tab:

#### Database Variables:
```
DB_HOST = (from PostgreSQL service - Internal Database URL)
DB_PORT = 5432
DB_USERNAME = (from PostgreSQL service)
DB_PASSWORD = (from PostgreSQL service)
DB_DATABASE = pharmacy_pos
DB_TYPE = postgres
```

**OR use the Internal Database URL:**
```
DATABASE_URL = (copy from PostgreSQL service → Internal Database URL)
```

#### JWT Secrets (Generate these):
```bash
# Generate secrets
openssl rand -base64 32
openssl rand -base64 32
```

Then set:
```
JWT_SECRET = (paste first generated secret)
JWT_REFRESH_SECRET = (paste second generated secret)
JWT_EXPIRES_IN = 15m
JWT_REFRESH_EXPIRES_IN = 7d
```

#### App Configuration:
```
NODE_ENV = production
PORT = 10000
APP_NAME = Pharmacy POS Backend
CORS_ORIGIN = *
DB_SYNCHRONIZE = false
DB_LOGGING = false
```

---

### Step 5: Update Database Config (If using PostgreSQL)

If you're using PostgreSQL instead of MySQL, update `src/config/database.config.ts`:

```typescript
type: 'postgres', // instead of 'mysql'
```

And install PostgreSQL driver:
```bash
npm install pg
npm install --save-dev @types/pg
```

**OR keep MySQL and use Render's MySQL addon** (paid) or external MySQL service.

---

### Step 6: Deploy

1. **Click "Manual Deploy"** → **"Deploy latest commit"**
2. Wait 3-5 minutes for build
3. Your app will be live at: `https://pharmacy-pos-backend.onrender.com`

---

### Step 7: Get Your URL

After deployment, you'll get a URL like:
```
https://pharmacy-pos-backend.onrender.com
```

**Your API endpoints:**
- Health: `https://pharmacy-pos-backend.onrender.com/api/v1/health`
- Swagger: `https://pharmacy-pos-backend.onrender.com/api/docs`
- Base: `https://pharmacy-pos-backend.onrender.com/api/v1`

---

### Step 8: Setup Database Schema

1. **Get database connection:**
   - Go to PostgreSQL service
   - Copy "External Database URL" or use connection details

2. **Connect and import schema:**
   ```bash
   # Using psql (if you have it)
   psql <external-database-url>
   
   # Or use a database client like DBeaver, TablePlus, etc.
   ```

3. **Import schema:**
   ```sql
   -- Convert MySQL schema to PostgreSQL if needed
   -- Or use the existing schema.sql
   ```

---

## 🔗 Custom Domain (Optional)

1. Go to your Web Service → **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records as shown
4. SSL is automatic!

---

## 📊 Free Tier Limits

- **Web Service:** Spins down after 15 min inactivity (wakes on request)
- **Database:** 90 days free, then $7/month
- **Bandwidth:** 100 GB/month

**For production:** Consider Starter plan ($7/month)

---

## ✅ Quick Commands

**View Logs:**
- Go to Web Service → **Logs** tab

**Redeploy:**
- Click **"Manual Deploy"** → **"Deploy latest commit"**

**Environment Variables:**
- Go to **Environment** tab

---

## 🎉 Done!

Your backend is now live on Render!

**Share these URLs with frontend:**
- Swagger: `https://pharmacy-pos-backend.onrender.com/api/docs`
- Health: `https://pharmacy-pos-backend.onrender.com/api/v1/health`
- Base: `https://pharmacy-pos-backend.onrender.com/api/v1`

---

## 🆘 Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Ensure `npm run build` works locally
- Check Node version (Render uses latest LTS)

### Database Connection Fails
- Verify environment variables are set
- Check database is running
- Use Internal Database URL for connection

### App Not Starting
- Check logs for errors
- Verify PORT is set to 10000 (Render's default)
- Ensure start command is correct

---

**Need Help?** Check Render docs: https://render.com/docs
