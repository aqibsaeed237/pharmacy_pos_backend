# 🔗 Pharmacy POS Backend - API URLs for Frontend Developer

## 🚀 Get Your Live URL

**Railway Dashboard:** https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896

1. Open the dashboard
2. Find your **APP service** (NestJS service, NOT MySQL)
3. Click on it → **Settings** → **Generate Domain**
4. Copy the URL

**URL Format:**
```
https://pharmacy-pos-backend-production-XXXXX.up.railway.app
```
(Replace XXXXX with your actual Railway-generated suffix)

---

## 📍 API Endpoints

### Base URL
```
https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1
```

### 🏥 Health Check
```
GET https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1/health
```

### 📚 Swagger Documentation (SHARE THIS!)
```
https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/docs
```
**👉 Frontend can test all APIs here interactively!**

### 🔐 Authentication
```
POST https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1/auth/register
POST https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1/auth/login
POST https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1/auth/refresh
```

---

## ⚙️ Frontend Configuration

### API Base URL
```javascript
const API_URL = 'https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1';
```

### CORS
✅ Enabled for all origins

### Authentication
- Header: `Authorization: Bearer <token>`
- Token expires: 15 minutes
- Refresh token: 7 days

### Example Request
```javascript
fetch('https://pharmacy-pos-backend-production-XXXXX.up.railway.app/api/v1/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ✅ Status

- ✅ Backend deployed and running
- ✅ Environment variables configured
- ✅ CORS enabled
- ⚠️ MySQL database needs to be reset (see FIX_MYSQL.md)
- ⚠️ Database schema setup needed after MySQL fix

---

**For detailed documentation, see:** `LIVE_URLS_PHARMACY_POS_BACKEND.md`
