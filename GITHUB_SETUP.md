# 🔄 GitHub Setup - Auto Deploy on Push

## 🎯 What You'll Get
- ✅ Push code to GitHub → **Automatically deploys to Render**
- ✅ No manual deployment needed
- ✅ Code is live immediately after push

---

## 📋 Step 1: Initialize Git Repository

```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend

# Initialize git (if not already)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Pharmacy POS Backend"
```

---

## 📋 Step 2: Create GitHub Repository

1. **Go to GitHub:** https://github.com
2. **Click "+"** → **"New repository"**
3. **Repository name:** `pharmacy-pos-backend`
4. **Description:** `Pharmacy POS Backend API`
5. **Visibility:** Private (or Public)
6. **DO NOT** initialize with README, .gitignore, or license
7. **Click "Create repository"**

---

## 📋 Step 3: Connect Local to GitHub

GitHub will show you commands. Run these:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pharmacy-pos-backend.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

**Enter your GitHub username and password/token when prompted.**

---

## 📋 Step 4: Setup Render Auto-Deploy

### Option A: Render Auto-Deploy (Easiest - Recommended)

1. **Deploy to Render first** (follow `QUICK_DEPLOY_RENDER.md`)

2. **In Render Dashboard:**
   - Go to your Web Service
   - **Settings** → **Build & Deploy**
   - **Auto-Deploy:** Enable
   - **Branch:** `main` (or `master`)
   - **Save**

3. **Done!** Now every push to `main` branch automatically deploys!

---

### Option B: GitHub Actions (Advanced)

If you want GitHub Actions to deploy:

1. **Get Render API Key:**
   - Go to Render Dashboard
   - Click your profile → **Account Settings**
   - **API Keys** → **Create API Key**
   - Copy the key

2. **Get Service ID:**
   - Go to your Web Service in Render
   - **Settings** → Copy the **Service ID**

3. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Add:
     - Name: `RENDER_API_KEY` → Value: (your API key)
     - Name: `RENDER_SERVICE_ID` → Value: (your service ID)

4. **GitHub Actions is already configured!** (`.github/workflows/deploy.yml`)

---

## 📋 Step 5: Daily Workflow

### Make Changes & Deploy:

```bash
# 1. Make your code changes

# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with message
git commit -m "Add new feature: user authentication"

# 5. Push to GitHub
git push origin main

# 6. Render automatically deploys! 🚀
```

---

## 📋 Git Commands Cheat Sheet

### Basic Commands:
```bash
# Check status
git status

# Add all changes
git add .

# Add specific file
git add src/main.ts

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# See commit history
git log

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git checkout main
git merge feature/new-feature
```

---

## 🔄 Branch Workflow (Recommended)

### Main Branch (Production):
```bash
# Always deploy from main branch
git checkout main
git pull origin main
# Make changes
git add .
git commit -m "Update"
git push origin main
# → Auto deploys to Render
```

### Feature Branch (Development):
```bash
# Create feature branch
git checkout -b feature/new-api

# Make changes
git add .
git commit -m "Add new API endpoint"

# Push feature branch
git push origin feature/new-api

# When ready, merge to main
git checkout main
git merge feature/new-api
git push origin main
# → Auto deploys
```

---

## ✅ Verify Auto-Deploy

1. **Make a small change** (add a comment in code)
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. **Check Render Dashboard:**
   - Go to your Web Service
   - **Events** tab
   - You should see a new deployment starting!

---

## 🆘 Troubleshooting

### Git Not Installed?
```bash
# Install Git
# macOS:
brew install git

# Or download from: https://git-scm.com
```

### Authentication Issues?
```bash
# Use Personal Access Token instead of password
# GitHub → Settings → Developer settings → Personal access tokens
# Create token with 'repo' permissions
```

### Render Not Auto-Deploying?
- Check Render service settings → Auto-Deploy is enabled
- Verify branch name matches (main vs master)
- Check Render logs for errors

---

## 🎉 Done!

Now your workflow is:
1. **Code** → Make changes
2. **Commit** → `git commit -m "message"`
3. **Push** → `git push origin main`
4. **Deploy** → Automatic! 🚀

**Your code is live in minutes!**

---

## 📚 Additional Resources

- **Git Tutorial:** https://git-scm.com/docs
- **GitHub Docs:** https://docs.github.com
- **Render Docs:** https://render.com/docs
