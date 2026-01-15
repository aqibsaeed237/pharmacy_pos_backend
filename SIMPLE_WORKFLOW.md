# ⚡ Simple Workflow - Push to Main = Live!

## 🌳 Two Branches

- **`develop`** - Work on features here
- **`main`** - Push here to go live! 🚀

---

## 🔄 Daily Workflow

### 1. Work on Features (develop branch):
```bash
git checkout develop
# Make your changes
git add .
git commit -m "Add new feature"
git push origin develop
```

### 2. Deploy to Live (main branch):
```bash
git checkout main
git merge develop
git push origin main
# → Automatically deploys to live! 🎉
```

---

## 🚀 Setup Render (One-Time)

1. **Go to:** https://render.com
2. **Sign up with GitHub**
3. **Create Web Service:**
   - Connect repo: `aqibsaeed237/pharmacy_pos_backend`
   - **Branch:** `main` ⚠️ (IMPORTANT!)
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
4. **Enable Auto-Deploy:**
   - Settings → Build & Deploy
   - ✅ Enable Auto-Deploy
   - Branch: `main`
5. **Add Environment Variables** (see SETUP_AUTO_DEPLOY_MAIN.md)

---

## ✅ That's It!

**After setup:**
- Push to `develop` = Development
- Push to `main` = **LIVE!** 🚀

---

**See SETUP_AUTO_DEPLOY_MAIN.md for complete Render setup!**
