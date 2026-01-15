# 🔗 Pharmacy POS Backend - API Links for Frontend Developer

## 🚀 Quick Setup - Get Your App URL

### Step 1: Generate Domain in Railway Dashboard

1. **Open Railway Dashboard:**
   👉 https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896

2. **Find your app service** (the one that's NOT MySQL - it should show "NestJS" or your app name)

3. **Click on the app service** → Go to **Settings** tab

4. **Click "Generate Domain"** or **"Add Domain"**

5. **Copy the generated URL** (format: `https://your-service-name.up.railway.app`)

---

## 📍 API Endpoints (Replace `YOUR_APP_URL` with your Railway URL)

Once you have your URL, use these endpoints:

### 🌐 Base URL
```
https://YOUR_APP_URL.up.railway.app
```

### 🏥 Health Check
```
GET https://YOUR_APP_URL.up.railway.app/api/v1/health
```

**Test it:**
```bash
curl https://YOUR_APP_URL.up.railway.app/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-15T13:52:19.000Z"
  }
}
```

---

### 📚 Swagger API Documentation
```
https://YOUR_APP_URL.up.railway.app/api/docs
```

**Features:**
- ✅ Interactive API testing
- ✅ All endpoints documented
- ✅ Try requests directly in browser
- ✅ Authentication examples
- ✅ Request/Response schemas

**👉 Share this link with frontend developer for API reference**

---

## 🔐 Authentication Endpoints

### Register New Pharmacy
```
POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/register
Content-Type: application/json

{
  "pharmacyName": "My Pharmacy",
  "email": "pharmacy@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```
POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "pharmacy@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "pharmacy@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Refresh Token
```
POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

---

## 📋 API Configuration for Frontend

### Base URL
```javascript
const API_BASE_URL = 'https://YOUR_APP_URL.up.railway.app/api/v1';
```

### CORS
✅ CORS is enabled for all origins (`*`)

### API Prefix
All endpoints use: `/api/v1/`

### Authentication Header
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### Token Expiration
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

---

## 💻 Frontend Integration Examples

### JavaScript/Fetch Example
```javascript
// Health Check
fetch('https://YOUR_APP_URL.up.railway.app/api/v1/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Login
fetch('https://YOUR_APP_URL.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'pharmacy@example.com',
    password: 'SecurePass123!'
  })
})
.then(res => res.json())
.then(data => {
  // Save token
  localStorage.setItem('token', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
});

// Authenticated Request
fetch('https://YOUR_APP_URL.up.railway.app/api/v1/your-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Axios Example
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://YOUR_APP_URL.up.railway.app/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health check
api.get('/health').then(response => console.log(response.data));

// Login
api.post('/auth/login', {
  email: 'pharmacy@example.com',
  password: 'SecurePass123!'
}).then(response => {
  localStorage.setItem('token', response.data.data.accessToken);
});
```

---

## 🧪 Quick Test Commands

### Test Health Endpoint
```bash
curl https://YOUR_APP_URL.up.railway.app/api/v1/health
```

### Test Registration
```bash
curl -X POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Login
```bash
curl -X POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## 📝 Important Notes

### ⚠️ Database Setup Required
The backend is deployed but needs database schema setup:
1. Run: `railway connect mysql`
2. Then run:
   ```sql
   CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE pharmacy_pos;
   SOURCE src/database/sql/schema.sql;
   ```

### ✅ What's Ready
- ✅ Backend deployed and running
- ✅ Environment variables configured
- ✅ CORS enabled for all origins
- ✅ JWT authentication setup
- ✅ Swagger documentation available

### 🔄 Next Steps
1. Generate domain in Railway dashboard
2. Setup database schema
3. Test health endpoint
4. Share Swagger docs link with frontend team

---

## 📞 Support & Resources

- **Railway Dashboard:** https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896
- **View Logs:** `railway logs`
- **Swagger Docs:** `https://YOUR_APP_URL.up.railway.app/api/docs`
- **Health Check:** `https://YOUR_APP_URL.up.railway.app/api/v1/health`

---

**📅 Last Updated:** 2026-01-15  
**🚀 Status:** Deployed and Running  
**🔗 Share this document with your frontend developer!**
