# 🔄 Git Workflow - Quick Reference

## 🚀 Daily Workflow (Push & Auto Deploy)

### 1. Make Changes
Edit your code files

### 2. Check Status
```bash
git status
```

### 3. Add Changes
```bash
# Add all changes
git add .

# Or add specific files
git add src/main.ts
```

### 4. Commit
```bash
git commit -m "Add user authentication feature"
```

### 5. Push to GitHub
```bash
git push origin main
```

### 6. Auto Deploy! 🎉
Render automatically deploys your code!

---

## 📋 Common Commands

### Setup (First Time)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pharmacy-pos-backend.git
git push -u origin main
```

### Daily Use
```bash
git pull origin main    # Get latest code
git add .              # Stage changes
git commit -m "message" # Save changes
git push origin main   # Upload to GitHub → Auto deploy!
```

### Branch Management
```bash
git checkout -b feature/new-feature  # Create new branch
git checkout main                    # Switch to main
git merge feature/new-feature        # Merge branch
```

---

## ✅ Quick Checklist

- [ ] Code changes made
- [ ] `git add .`
- [ ] `git commit -m "description"`
- [ ] `git push origin main`
- [ ] Check Render dashboard for deployment
- [ ] Code is live! 🚀

---

**That's it! Simple workflow for auto-deployment.**
