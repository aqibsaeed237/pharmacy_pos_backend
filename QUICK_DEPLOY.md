# 🚀 Quick Deploy to Railway - Run These Commands

## ⚡ Fast Deployment (Copy & Paste)

Run these commands **one by one** in your terminal:

### 1. Login to Railway
```bash
railway login
```
**This opens your browser** - Sign in with GitHub, Google, or email.

---

### 2. Initialize Project
```bash
railway init
```
**Choose:**
- Create new project
- Name: `pharmacy-pos-backend`

---

### 3. Add MySQL Database
```bash
railway add mysql
```

---

### 4. Set Environment Variables

**Copy and paste this entire block:**

```bash
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_SYNCHRONIZE='false'
railway variables set DB_LOGGING='false'
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
railway variables set JWT_EXPIRES_IN='15m'
railway variables set JWT_REFRESH_EXPIRES_IN='7d'
railway variables set NODE_ENV='production'
railway variables set PORT='3000'
railway variables set APP_NAME='Pharmacy POS Backend'
railway variables set CORS_ORIGIN='*'
```

---

### 5. Deploy!
```bash
railway up
```

**Wait 3-5 minutes** for the first deployment.

---

### 6. Get Your URL
```bash
railway domain
```

Or check: https://railway.app/dashboard

---

### 7. Setup Database

**Get MySQL connection:**
```bash
railway connect mysql
```

**Then create database:**
```sql
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_pos;
SOURCE src/database/sql/schema.sql;
EXIT;
```

**Or import via Railway dashboard:**
1. Go to Railway dashboard
2. Click on MySQL service
3. Click "Connect" → "MySQL"
4. Copy connection string
5. Use phpMyAdmin or MySQL client to import `src/database/sql/schema.sql`

---

## ✅ Verify It Works

```bash
# Get your URL first
railway domain

# Then test (replace YOUR_URL with your Railway URL)
curl https://YOUR_URL.up.railway.app/api/v1/health
```

Should return:
```json
{"success":true,"data":{"status":"ok"}}
```

---

## 🎉 Done!

Your backend is live at: `https://your-project.up.railway.app`

**Swagger Docs:** `https://your-project.up.railway.app/api/docs`

---

## 📝 Useful Commands

```bash
# View logs
railway logs

# View logs (live)
railway logs --follow

# Open dashboard
railway open

# Redeploy
railway up
```

---

**That's it! Your backend is deployed! 🚀**
