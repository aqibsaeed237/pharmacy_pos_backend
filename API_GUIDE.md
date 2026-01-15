# 📮 API Testing Guide

## Quick Access

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base**: http://localhost:3000/api/v1

---

## 🧪 Testing with Swagger (Easiest)

1. Open: http://localhost:3000/api/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the data
5. Click "Execute"

---

## 📮 Testing with Postman

### Step 1: Create Environment

Create Postman Environment with variables:

| Variable | Initial Value |
|----------|---------------|
| `base_url` | `http://localhost:3000/api/v1` |
| `access_token` | (empty) |
| `refresh_token` | (empty) |
| `tenant_id` | (empty) |

### Step 2: Test Authentication

#### Register Pharmacy
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "pharmacyName": "Test Pharmacy",
  "email": "admin@test.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St"
}
```

**Save tokens automatically:**
Add to Tests tab:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.data.accessToken);
    pm.environment.set("refresh_token", response.data.refreshToken);
    pm.environment.set("tenant_id", response.data.tenantId);
}
```

#### Login
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Password123!"
}
```

### Step 3: Use Protected Endpoints

Add to Headers:
```
Authorization: Bearer {{access_token}}
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register pharmacy
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/switch-store` - Switch store
- `GET /api/v1/auth/stores` - Get user stores

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `POST /api/v1/notifications/mark-all-read` - Mark all as read
- `POST /api/v1/notifications/register-token` - Register FCM token

### Payments
- `POST /api/v1/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/v1/payments/stripe/webhook` - Stripe webhook
- `POST /api/v1/payments/payfast/generate-url` - Generate PayFast URL
- `POST /api/v1/payments/payfast/notify` - PayFast ITN

---

## 🧪 Testing with curl

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "admin@test.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Password123!"
  }'
```

### Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/auth/stores \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-15T..."
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2026-01-15T..."
}
```

---

## 🔐 Authentication Flow

1. **Register** → Get `accessToken` and `refreshToken`
2. **Use `accessToken`** in `Authorization: Bearer <token>` header
3. **When expired** → Use `refreshToken` to get new `accessToken`
4. **Repeat** as needed

---

## 📝 Postman Collection Structure

```
Pharmacy POS API
├── Authentication
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   └── Get Stores
├── Notifications
│   ├── Get Notifications
│   └── Mark as Read
└── Payments
    ├── Stripe Create Intent
    └── PayFast Generate URL
```

---

## 🌐 Production API

Once deployed, update your API base URL:

**Development:**
```
http://localhost:3000/api/v1
```

**Production:**
```
https://api.yourdomain.com/api/v1
```

### Update Postman Environment

Change `base_url` variable:
```
base_url = https://api.yourdomain.com/api/v1
```

### Update Frontend

```javascript
// config.js
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com/api/v1'
  : 'http://localhost:3000/api/v1';
```

---

## 📚 Next Steps

1. **Deploy to Production**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Add Features**: See [DEVELOPMENT.md](./DEVELOPMENT.md)
3. **Setup Integrations**: See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

**For detailed Postman setup, see Swagger UI at http://localhost:3000/api/docs**
