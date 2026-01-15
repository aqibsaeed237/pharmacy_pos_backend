# 🔄 Three-Branch Workflow

## 🌳 Branches

1. **`working`** - Your active development branch
2. **`develop`** - Testing/staging environment
3. **`main`** - Production/Live environment

---

## 🔄 Workflow

### Daily Development (working branch):
```bash
# Switch to working branch
git checkout working

# Make your changes
# ... edit code ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin working
```

### Test in Develop (when ready):
```bash
# Merge working to develop
git checkout develop
git merge working
git push origin develop

# Test in develop environment
```

### Deploy to Live (when tested):
```bash
# Merge develop to main
git checkout main
git merge develop
git push origin main

# → Auto-deploys to production!
```

---

## 📋 Branch Purposes

| Branch | Purpose | Environment | When to Use |
|--------|---------|-------------|-------------|
| **working** | Active development | Local | Daily coding |
| **develop** | Testing/Staging | Development | After features complete |
| **main** | Production/Live | Production | When ready for users |

---

## ✅ Benefits

- ✅ **Safe development** - Work on `working`, don't break `develop`
- ✅ **Testing first** - Test in `develop` before production
- ✅ **Clean production** - Only tested code goes to `main`
- ✅ **Easy rollback** - Can revert if issues

---

## 🚀 Quick Commands

### Start Working:
```bash
git checkout working
# Make changes
git push origin working
```

### Test in Develop:
```bash
git checkout develop
git merge working
git push origin develop
```

### Deploy to Live:
```bash
git checkout main
git merge develop
git push origin main
```

---

**Work on `working` → Test in `develop` → Deploy from `main`! 🚀**
