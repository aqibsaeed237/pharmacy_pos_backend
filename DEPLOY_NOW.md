# 🚀 Deploy Now - Complete Commands

## ⚡ Run These Commands in Order

I've prepared everything. Just run these commands **one by one**:

### 1️⃣ Login to Railway
```bash
railway login
```
**Opens browser** - Sign in, then come back to terminal.

---

### 2️⃣ Initialize Project
```bash
railway init
```
**Choose:**
- ✅ Create new project
- Name: `pharmacy-pos-backend`

---

### 3️⃣ Add MySQL Database
```bash
railway add mysql
```

---

### 4️⃣ Set Environment Variables (Automated)
```bash
./scripts/set-railway-vars.sh
```

This script sets all required variables automatically!

---

### 5️⃣ Deploy!
```bash
railway up
```

**Wait 3-5 minutes** for deployment.

---

### 6️⃣ Get Your URL
```bash
railway domain
```

---

### 7️⃣ Setup Database

**Option A: Via Railway CLI**
```bash
railway connect mysql
```

Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_pos;
SOURCE src/database/sql/schema.sql;
EXIT;
```

**Option B: Via Railway Dashboard**
1. Go to https://railway.app/dashboard
2. Click on your MySQL service
3. Click "Connect" → Copy connection string
4. Use MySQL client or phpMyAdmin to import `src/database/sql/schema.sql`

---

## ✅ Test Your Deployment

```bash
# Get your URL
railway domain

# Test health endpoint (replace YOUR_URL)
curl https://YOUR_URL.up.railway.app/api/v1/health
```

---

## 🎉 Done!

Your backend is live!

**Swagger:** `https://YOUR_URL.up.railway.app/api/docs`

---

## 📝 Quick Commands

```bash
# View logs
railway logs

# View live logs
railway logs --follow

# Open dashboard
railway open

# Redeploy
railway up
```

---

**All files are ready! Just run the commands above! 🚀**
