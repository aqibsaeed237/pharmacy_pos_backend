# ⚡ Quick Start - Dev & Prod Environments

## 🎯 What You Have Now

- ✅ **Development Environment** - For testing (`develop` branch)
- ✅ **Production Environment** - For live users (`main` branch)
- ✅ **Separate Configs** - Different settings for each
- ✅ **Auto-Deploy** - Push to branch = Auto deploy

---

## 🚀 Quick Commands

### Development Workflow:
```bash
# Switch to dev branch
git checkout develop

# Make changes and test
npm run start:dev

# Deploy to dev
git add .
git commit -m "Add feature"
git push origin develop
# → Auto-deploys to: https://pharmacy-pos-backend-dev.onrender.com
```

### Production Deployment:
```bash
# Merge dev to main
git checkout main
git merge develop

# Deploy to prod
git push origin main
# → Auto-deploys to: https://pharmacy-pos-backend-prod.onrender.com
```

---

## 📍 Your URLs

### Development:
- API: `https://pharmacy-pos-backend-dev.onrender.com`
- Swagger: `https://pharmacy-pos-backend-dev.onrender.com/api/docs`

### Production:
- API: `https://pharmacy-pos-backend-prod.onrender.com`
- Swagger: `https://pharmacy-pos-backend-prod.onrender.com/api/docs`

---

## 🔄 Workflow Diagram

```
develop branch → Push → Dev Environment (Testing)
         ↓
    Test & Fix
         ↓
main branch → Push → Prod Environment (Live)
```

---

## ✅ Setup Checklist

- [x] Environment files created
- [x] Develop branch created
- [ ] Push develop branch to GitHub
- [ ] Deploy dev to Render
- [ ] Deploy prod to Render
- [ ] Test both environments

---

**See `DEPLOY_DEV_PROD.md` for complete deployment guide! 🚀**
