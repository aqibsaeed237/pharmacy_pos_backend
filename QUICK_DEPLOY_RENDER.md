# ⚡ Quick Deploy to Render - 5 Minutes!

## 🚀 Fastest Way to Go Live

### 1. Sign up at Render.com
👉 https://render.com (Sign up with GitHub)

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repo
- Settings:
  - **Name:** `pharmacy-pos-backend`
  - **Build:** `npm install && npm run build`
  - **Start:** `npm run start:prod`

### 3. Add PostgreSQL Database
- Click **"New +"** → **"PostgreSQL"**
- Name: `pharmacy-pos-db`
- Plan: **Free**

### 4. Set Environment Variables
In your Web Service → **Environment** tab:

**Copy from PostgreSQL service:**
```
DB_HOST = (from PostgreSQL Internal URL)
DB_PORT = 5432
DB_USERNAME = (from PostgreSQL)
DB_PASSWORD = (from PostgreSQL)
DB_DATABASE = pharmacy_pos
```

**Generate JWT secrets:**
```bash
openssl rand -base64 32  # Copy this
openssl rand -base64 32  # Copy this
```

**Set these:**
```
JWT_SECRET = (paste first)
JWT_REFRESH_SECRET = (paste second)
NODE_ENV = production
PORT = 10000
CORS_ORIGIN = *
```

### 5. Deploy!
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Wait 3-5 minutes
- Done! 🎉

---

## 📍 Your Live URLs

After deployment:
- **Swagger:** `https://pharmacy-pos-backend.onrender.com/api/docs`
- **Health:** `https://pharmacy-pos-backend.onrender.com/api/v1/health`
- **Base:** `https://pharmacy-pos-backend.onrender.com/api/v1`

---

## ⚠️ Note: MySQL vs PostgreSQL

Your app uses MySQL. Options:
1. **Use PostgreSQL** (free on Render) - Update database config
2. **Use external MySQL** (PlanetScale, Aiven, etc.)
3. **Use Render MySQL addon** (paid)

**Easiest:** Switch to PostgreSQL (just change `type: 'mysql'` to `type: 'postgres'` in database config)

---

**That's it! Your backend is live! 🚀**
