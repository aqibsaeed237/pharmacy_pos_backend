# 🌳 Branch Workflow - Develop & Main

## 📋 Branch Strategy

- **`develop`** - Development/Testing branch
- **`main`** - Production branch (Auto-deploys to live!)

---

## 🔄 Workflow

### Development (Testing):
```bash
# 1. Switch to develop branch
git checkout develop

# 2. Make your changes
# ... edit code ...

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin develop

# 4. Test in develop environment (if you have dev deployment)
```

### Deploy to Production (Live):
```bash
# 1. Switch to main branch
git checkout main

# 2. Merge develop into main
git merge develop

# 3. Push to main
git push origin main

# 4. 🚀 Auto-deploys to LIVE! (if Render is configured)
```

---

## ⚡ Quick Commands

### Work on Development:
```bash
git checkout develop
# Make changes
git add .
git commit -m "Your message"
git push origin develop
```

### Deploy to Production:
```bash
git checkout main
git merge develop
git push origin main
# → Auto-deploys to live!
```

---

## 🚀 Setup Auto-Deploy on Render

### Step 1: Create Render Service

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repo: `aqibsaeed237/pharmacy_pos_backend`
5. **Important:** Set **Branch** to `main`
6. Configure:
   - Name: `pharmacy-pos-backend`
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`

### Step 2: Enable Auto-Deploy

1. Go to **Settings** → **Build & Deploy**
2. **Auto-Deploy:** ✅ Enable
3. **Branch:** `main` (IMPORTANT!)
4. **Save Changes**

### Step 3: Test

```bash
# Make a small change
echo "# Test" >> README.md

# Push to main
git checkout main
git add .
git commit -m "Test auto-deploy"
git push origin main

# Check Render dashboard - should auto-deploy!
```

---

## ✅ Result

- ✅ **develop branch** - For development and testing
- ✅ **main branch** - For production (auto-deploys when pushed)
- ✅ **Push to main = Live deployment!** 🚀

---

## 📋 Daily Workflow

1. **Work on develop:**
   ```bash
   git checkout develop
   # Make changes
   git push origin develop
   ```

2. **When ready for production:**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # → Goes live automatically!
   ```

---

**Setup once, then just push to main to go live! 🎉**
