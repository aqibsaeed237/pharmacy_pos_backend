# 🌐 Pharmacy POS Backend - Live API URLs

## 🚀 Get Your Live URL (Do This First!)

### Step 1: Generate Domain in Railway Dashboard

1. **Open Railway Dashboard:**
   👉 https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896

2. **Find your APP service** (the one running NestJS, NOT MySQL)

3. **Click on the app service** → **Settings** tab

4. **Click "Generate Domain"** button

5. **The domain will be auto-generated** (format: `https://pharmacy-pos-backend-production-xxxxx.up.railway.app`)

6. **Copy the URL** and replace `YOUR_URL` below with it

---

## 📍 LIVE API ENDPOINTS

**⚠️ Replace `YOUR_URL` with your actual Railway domain URL**

### Base URL
```
https://YOUR_URL.up.railway.app
```

### 🏥 Health Check API
```
GET https://YOUR_URL.up.railway.app/api/v1/health
```

**Test it now:**
```bash
curl https://YOUR_URL.up.railway.app/api/v1/health
```

---

### 📚 Swagger API Documentation (Interactive)
```
https://YOUR_URL.up.railway.app/api/docs
```

**👉 SHARE THIS LINK WITH FRONTEND DEVELOPER!**

This is an interactive API documentation where they can:
- ✅ See all available endpoints
- ✅ Test APIs directly in the browser
- ✅ View request/response examples
- ✅ Try authentication
- ✅ Copy code examples

---

### 🔐 Authentication Endpoints

**Register:**
```
POST https://YOUR_URL.up.railway.app/api/v1/auth/register
```

**Login:**
```
POST https://YOUR_URL.up.railway.app/api/v1/auth/login
```

**Refresh Token:**
```
POST https://YOUR_URL.up.railway.app/api/v1/auth/refresh
```

---

## 💻 Frontend Integration

### Base URL Configuration
```javascript
const API_BASE_URL = 'https://YOUR_URL.up.railway.app/api/v1';
```

### Example: Health Check
```javascript
fetch('https://YOUR_URL.up.railway.app/api/v1/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Example: Login
```javascript
fetch('https://YOUR_URL.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'pharmacy@example.com',
    password: 'YourPassword123!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Token:', data.data.accessToken);
  localStorage.setItem('token', data.data.accessToken);
});
```

### Example: Authenticated Request
```javascript
fetch('https://YOUR_URL.up.railway.app/api/v1/your-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ✅ Database Connection Status

✅ Database connection variables are configured:
- `DB_HOST` → `${{MySQL.MYSQLHOST}}`
- `DB_PORT` → `${{MySQL.MYSQLPORT}}`
- `DB_USERNAME` → `${{MySQL.MYSQLUSER}}`
- `DB_PASSWORD` → `${{MySQL.MYSQLPASSWORD}}`
- `DB_DATABASE` → `${{MySQL.MYSQLDATABASE}}`
- `MYSQL_URL` → `${{MySQL.MYSQL_URL}}`

⚠️ **Next Step:** Setup database schema (see SETUP_DATABASE_NOW.md)

---

## 📋 Quick Test Commands

### Test Health
```bash
curl https://YOUR_URL.up.railway.app/api/v1/health
```

### Test Registration
```bash
curl -X POST https://YOUR_URL.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 🎯 Share With Frontend Developer

**Copy and share these URLs (after replacing YOUR_URL):**

1. **Swagger Docs (Most Important!):**
   ```
   https://YOUR_URL.up.railway.app/api/docs
   ```

2. **Health Check:**
   ```
   https://YOUR_URL.up.railway.app/api/v1/health
   ```

3. **Base API URL:**
   ```
   https://YOUR_URL.up.railway.app/api/v1
   ```

---

## 📞 Support

- **Railway Dashboard:** https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896
- **View Logs:** `railway logs`
- **Check Status:** `railway status`

---

**🚀 Your backend is LIVE! Just get the URL from Railway dashboard and share it!**
