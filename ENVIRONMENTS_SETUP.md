# 🔄 Dev & Prod Environments Setup

## 📋 Overview

You now have **two environments**:
- **Development (Dev)** - For testing and development
- **Production (Prod)** - For live users

---

## 🌳 Git Branch Strategy

### Development Branch (Dev)
```bash
# Create and switch to dev branch
git checkout -b develop

# Work on dev branch
git add .
git commit -m "Add new feature"
git push origin develop
```

### Production Branch (Prod)
```bash
# Main branch is production
git checkout main

# Merge from develop when ready
git merge develop
git push origin main
```

---

## 🚀 Render Deployment Setup

### Option 1: Two Separate Services (Recommended)

#### Development Service:
1. **Create Web Service:**
   - Name: `pharmacy-pos-backend-dev`
   - Branch: `develop`
   - Environment: Development

2. **Environment Variables:**
   ```
   NODE_ENV=development
   PORT=10000
   APP_NAME=Pharmacy POS Backend (Dev)
   DB_SYNCHRONIZE=true
   DB_LOGGING=true
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=30d
   ```

3. **URL:** `https://pharmacy-pos-backend-dev.onrender.com`

#### Production Service:
1. **Create Web Service:**
   - Name: `pharmacy-pos-backend-prod`
   - Branch: `main`
   - Environment: Production

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   APP_NAME=Pharmacy POS Backend
   DB_SYNCHRONIZE=false
   DB_LOGGING=false
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```

3. **URL:** `https://pharmacy-pos-backend-prod.onrender.com`

---

## 📁 Environment Files

### Development: `.env.development`
- Used for local development
- More permissive settings
- Debug logging enabled
- Longer token expiry

### Production: `.env.production`
- Used for production deployment
- Strict security settings
- No debug logging
- Shorter token expiry

### Example: `.env.example`
- Template file
- Shows all required variables
- Don't commit actual secrets!

---

## 🔄 Workflow

### Development Workflow:
```bash
# 1. Switch to dev branch
git checkout develop

# 2. Make changes
# ... edit code ...

# 3. Test locally
npm run start:dev

# 4. Commit and push
git add .
git commit -m "Add feature"
git push origin develop

# 5. Auto-deploys to dev environment
```

### Production Deployment:
```bash
# 1. Merge dev to main
git checkout main
git merge develop

# 2. Push to main
git push origin main

# 3. Auto-deploys to production
```

---

## 🔐 Environment Variables

### Development Variables:
```bash
NODE_ENV=development
DB_SYNCHRONIZE=true      # Auto-create tables
DB_LOGGING=true          # Show SQL queries
JWT_EXPIRES_IN=1h        # Longer tokens for testing
CORS_ORIGIN=*            # Allow all origins
```

### Production Variables:
```bash
NODE_ENV=production
DB_SYNCHRONIZE=false     # Never auto-create tables
DB_LOGGING=false         # No SQL logging
JWT_EXPIRES_IN=15m       # Short tokens for security
CORS_ORIGIN=https://yourdomain.com  # Specific origins
```

---

## 📋 Setup Checklist

### Development Environment:
- [ ] Create `develop` branch
- [ ] Create Render service: `pharmacy-pos-backend-dev`
- [ ] Connect to `develop` branch
- [ ] Set development environment variables
- [ ] Enable auto-deploy from `develop`
- [ ] Test deployment

### Production Environment:
- [ ] Create Render service: `pharmacy-pos-backend-prod`
- [ ] Connect to `main` branch
- [ ] Set production environment variables
- [ ] Generate secure JWT secrets
- [ ] Enable auto-deploy from `main`
- [ ] Test deployment

---

## 🎯 Quick Commands

### Switch Environments:
```bash
# Development
git checkout develop
npm run start:dev

# Production
git checkout main
npm run start:prod
```

### Deploy:
```bash
# Deploy to Dev
git checkout develop
git push origin develop

# Deploy to Prod
git checkout main
git merge develop
git push origin main
```

---

## 🔗 URLs

### Development:
- API: `https://pharmacy-pos-backend-dev.onrender.com`
- Swagger: `https://pharmacy-pos-backend-dev.onrender.com/api/docs`

### Production:
- API: `https://pharmacy-pos-backend-prod.onrender.com`
- Swagger: `https://pharmacy-pos-backend-prod.onrender.com/api/docs`

---

## ✅ Benefits

- ✅ **Separate testing** - Test in dev before production
- ✅ **Safe deployments** - Only merge when ready
- ✅ **Different configs** - Dev has debug, prod has security
- ✅ **Rollback easy** - Can revert production if needed

---

**Setup both environments for safe development and deployment! 🚀**
