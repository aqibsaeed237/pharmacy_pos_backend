# ✅ Environment Check - Develop & Main (Live)

## 🌳 Two Environments Confirmed

### ✅ Environment 1: Development
- **Branch:** `develop`
- **File:** `.env.development`
- **NODE_ENV:** `development`
- **Purpose:** Testing and development
- **Database:** Local MySQL (`pharmacy_pos_dev`)
- **Settings:** Debug enabled, longer tokens

### ✅ Environment 2: Production/Live
- **Branch:** `main`
- **File:** `.env.production`
- **NODE_ENV:** `production`
- **Purpose:** Live production
- **Database:** Production MySQL (set via hosting)
- **Settings:** Secure, no debug

---

## 🔍 How to Check

### Check Current Branch:
```bash
git branch
# Should show: develop or main
```

### Check Environment in Code:
```typescript
console.log(process.env.NODE_ENV);
// Output: "development" or "production"
```

### Check Environment Files:
```bash
# Development
cat .env.development

# Production
cat .env.production
```

---

## 🔄 Workflow

### Development:
```bash
git checkout develop
npm run start:dev
# → Uses .env.development
# → NODE_ENV=development
```

### Deploy to Live:
```bash
git checkout main
git merge develop
git push origin main
# → Uses .env.production
# → NODE_ENV=production
# → Auto-deploys to live!
```

---

## ✅ Verification Checklist

- [x] `develop` branch exists
- [x] `main` branch exists
- [x] `.env.development` file created
- [x] `.env.production` file created
- [x] `.env.example` template created
- [x] App module loads environment files correctly
- [x] Package.json has environment-specific scripts

---

## 📋 Environment Variables

### Development (.env.development):
```
NODE_ENV=development
DB_SYNCHRONIZE=true
DB_LOGGING=true
JWT_EXPIRES_IN=1h
```

### Production (.env.production):
```
NODE_ENV=production
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_EXPIRES_IN=15m
```

---

## 🚀 Deployment

When you deploy:
- **develop branch** → Development environment
- **main branch** → Production/Live environment

Both environments are configured and ready! ✅

---

**See ENVIRONMENTS.md for complete setup details.**
