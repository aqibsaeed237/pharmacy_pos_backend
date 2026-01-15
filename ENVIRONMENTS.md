# 🌳 Two Environments Setup

## 📋 Overview

Your project has **two environments**:

1. **Development** (`develop` branch)
   - For testing and development
   - Local database
   - Debug logging enabled
   - Longer token expiry

2. **Production/Live** (`main` branch)
   - For live users
   - Production database
   - No debug logging
   - Secure token expiry

---

## 🔧 Environment Files

### Development: `.env.development`
- Used when `NODE_ENV=development`
- Local MySQL database
- Debug mode enabled
- Longer JWT expiry (1 hour)

### Production: `.env.production`
- Used when `NODE_ENV=production`
- Production database (set via hosting platform)
- No debug logging
- Secure JWT expiry (15 minutes)

### Example: `.env.example`
- Template file
- Shows all required variables

---

## 🔄 Branch Workflow

### Development Environment:
```bash
# Work on develop branch
git checkout develop

# Run in development mode
npm run start:dev
# Uses: .env.development
# NODE_ENV=development
```

### Production Environment:
```bash
# Deploy from main branch
git checkout main
git merge develop
git push origin main

# Runs in production mode
npm run start:prod
# Uses: .env.production
# NODE_ENV=production
```

---

## 🚀 Deployment Setup

### Development Deployment (Optional):

If you want a dev environment deployed:

1. **Create service on Vercel/Railway:**
   - Name: `pharmacy-pos-backend-dev`
   - Branch: `develop`
   - Environment: Development

2. **Environment Variables:**
   ```
   NODE_ENV=development
   DB_SYNCHRONIZE=true
   DB_LOGGING=true
   JWT_EXPIRES_IN=1h
   ```

### Production Deployment (Main):

1. **Create service on Vercel/Railway:**
   - Name: `pharmacy-pos-backend`
   - Branch: `main`
   - Environment: Production

2. **Environment Variables:**
   ```
   NODE_ENV=production
   DB_SYNCHRONIZE=false
   DB_LOGGING=false
   JWT_EXPIRES_IN=15m
   ```

---

## ✅ Environment Check

### Check Current Environment:

```bash
# In your code
console.log(process.env.NODE_ENV); // development or production

# In terminal
echo $NODE_ENV
```

### Verify Environment Files:

```bash
# Development
cat .env.development

# Production
cat .env.production
```

---

## 📋 Environment Differences

| Setting | Development | Production |
|---------|------------|------------|
| **NODE_ENV** | `development` | `production` |
| **DB_SYNCHRONIZE** | `true` (auto-create) | `false` (manual) |
| **DB_LOGGING** | `true` (show SQL) | `false` (no logs) |
| **JWT_EXPIRES_IN** | `1h` (longer) | `15m` (secure) |
| **CORS_ORIGIN** | `localhost` | `*` or specific domains |
| **Branch** | `develop` | `main` |

---

## 🔄 Daily Workflow

### 1. Development:
```bash
git checkout develop
npm run start:dev
# Uses development environment
```

### 2. Deploy to Live:
```bash
git checkout main
git merge develop
git push origin main
# Uses production environment
```

---

## ✅ Verification

### Check Environment in Code:

```typescript
// src/main.ts or any service
const env = process.env.NODE_ENV;
console.log(`Running in: ${env}`); // development or production
```

### Check Branch:
```bash
git branch
# Should show: develop or main
```

---

**Two environments configured: develop (testing) and main (live)! 🚀**
