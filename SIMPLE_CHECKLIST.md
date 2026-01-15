# ✅ Simple Checklist - Follow This Order

## 📍 PART 1: AWS Console (Do This First)

### ✅ Step 1: Find IAM
- [ ] Click the **Search bar** at top of AWS
- [ ] Type: `IAM`
- [ ] Click on "IAM" from results

### ✅ Step 2: Create User
- [ ] Click **"Users"** on left menu
- [ ] Click **"Create user"** button (orange, top right)
- [ ] Type name: `github-actions-deployer`
- [ ] Click **"Next"**

### ✅ Step 3: Add Permissions
- [ ] Click **"Attach policies directly"** tab
- [ ] Search: `ElasticBeanstalk`
- [ ] Check these 3 boxes:
  - [ ] `AWSElasticBeanstalkFullAccess`
  - [ ] `AWSElasticBeanstalkWebTier`
  - [ ] `AWSElasticBeanstalkWorkerTier`
- [ ] Click **"Next"**
- [ ] Click **"Create user"**

### ✅ Step 4: Get Keys
- [ ] Click on user name: `github-actions-deployer`
- [ ] Click **"Security credentials"** tab
- [ ] Click **"Create access key"**
- [ ] Select: **"Application running outside AWS"**
- [ ] Click **"Next"**
- [ ] **COPY BOTH KEYS** (save them somewhere!)
- [ ] Click **"Done"**

---

## 🐙 PART 2: GitHub (Do This Second)

### ✅ Step 1: Go to Repository
- [ ] Open: https://github.com/aqibsaeed237/pharmacy_pos_backend
- [ ] Click **"Settings"** tab (top of page)

### ✅ Step 2: Add Secrets
- [ ] Click **"Secrets and variables"** (left menu)
- [ ] Click **"Actions"**
- [ ] Click **"New repository secret"**

### ✅ Step 3: Add First Secret
- [ ] Name: `AWS_ACCESS_KEY_ID`
- [ ] Secret: (paste your Access Key ID)
- [ ] Click **"Add secret"**

### ✅ Step 4: Add Second Secret
- [ ] Click **"New repository secret"** again
- [ ] Name: `AWS_SECRET_ACCESS_KEY`
- [ ] Secret: (paste your Secret Access Key)
- [ ] Click **"Add secret"**

---

## 💻 PART 3: Terminal (Do This Third)

### ✅ Step 1: Open Terminal
- [ ] Press `Command + Space`
- [ ] Type: `Terminal`
- [ ] Press Enter

### ✅ Step 2: Go to Project
- [ ] Copy and paste:
```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend
export PATH=$PATH:/Users/app/Library/Python/3.9/bin
```

### ✅ Step 3: Push to GitHub
- [ ] Copy and paste:
```bash
git checkout main
git add .
git commit -m "Setup AWS deployment"
git push origin main
```

---

## 👀 PART 4: Watch It Deploy (Do This Last)

### ✅ Step 1: Check GitHub Actions
- [ ] Go to: https://github.com/aqibsaeed237/pharmacy_pos_backend
- [ ] Click **"Actions"** tab
- [ ] Watch the workflow run (takes 5-10 minutes)

### ✅ Step 2: Get Your URL
- [ ] When done, click on the workflow
- [ ] Scroll to "Deployment summary"
- [ ] Copy your URL!

---

## 🎉 DONE!

Your API is live at:
- `https://pharmacy-pos-backend-prod.elasticbeanstalk.com/api/docs`

**That's it!** 🚀
