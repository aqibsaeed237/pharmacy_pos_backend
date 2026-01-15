# 🌐 Pharmacy POS Backend - API Endpoints

## Base URL
**Note:** You need to generate a domain for your app service in Railway dashboard.

### Steps to Get Your App URL:

1. **Go to Railway Dashboard:**
   https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896

2. **Find your app service** (not MySQL service)

3. **Click on the app service** → Settings → Generate Domain

4. **Or use Railway CLI:**
   ```bash
   # First, make sure you're linked to the app service (not MySQL)
   railway link
   # Select your app service
   
   # Then generate domain
   railway domain generate
   ```

---

## 📋 API Endpoints (Replace `YOUR_APP_URL` with your actual URL)

### Base URL Format
```
https://YOUR_APP_URL.up.railway.app
```

### Health Check
```
GET https://YOUR_APP_URL.up.railway.app/api/v1/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-15T13:52:19.000Z"
  }
}
```

### Swagger API Documentation
```
https://YOUR_APP_URL.up.railway.app/api/docs
```

**Features:**
- Interactive API testing
- All endpoints documented
- Try out requests directly
- Authentication examples

---

## 🔐 Authentication Endpoints

### Register Pharmacy
```
POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/register
Content-Type: application/json

{
  "pharmacyName": "Test Pharmacy",
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```
POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
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

## 📝 For Frontend Developer

### CORS Configuration
The API is configured to accept requests from any origin (`CORS_ORIGIN=*`).

### API Prefix
All endpoints are prefixed with: `/api/v1/`

### Authentication
- Use JWT Bearer tokens for authenticated requests
- Token format: `Authorization: Bearer <token>`
- Token expires in: 15 minutes
- Refresh token expires in: 7 days

### Example Request
```javascript
fetch('https://YOUR_APP_URL.up.railway.app/api/v1/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Example Authenticated Request
```javascript
fetch('https://YOUR_APP_URL.up.railway.app/api/v1/your-endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🧪 Testing Endpoints

### 1. Test Health Endpoint
```bash
curl https://YOUR_APP_URL.up.railway.app/api/v1/health
```

### 2. Test Registration
```bash
curl -X POST https://YOUR_APP_URL.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. View Swagger Docs
Open in browser:
```
https://YOUR_APP_URL.up.railway.app/api/docs
```

---

## ⚠️ Important Notes

1. **Database Setup Required:** The app is deployed but needs database schema setup
   - Run: `railway connect mysql`
   - Then import: `src/database/sql/schema.sql`

2. **Get Your Actual URL:**
   - Check Railway dashboard
   - Or run: `railway domain` (after linking to app service)

3. **Environment Variables:**
   - All required variables are set
   - Database connection uses Railway's internal network

---

## 📞 Support

If you need help:
- Check Railway logs: `railway logs`
- View Railway dashboard: https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896
- Check Swagger docs for API details

---

**Last Updated:** 2026-01-15
**Project:** Pharmacy POS Backend
**Environment:** Production
