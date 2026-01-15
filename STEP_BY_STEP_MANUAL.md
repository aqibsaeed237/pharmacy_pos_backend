# 📋 Step-by-Step Manual Guide - For Beginners

**I'll walk you through EVERYTHING step by step. Just follow along!**

---

## 🎯 What We're Going To Do

1. Create an AWS user for GitHub (so GitHub can deploy to AWS)
2. Get the secret keys (like a password for GitHub to use)
3. Add those keys to GitHub (so GitHub knows how to connect)
4. Push code to GitHub (and it will auto-deploy!)

---

## 📍 PART 1: Create AWS User (10 minutes)

### Step 1: Open IAM in AWS Console

1. **Look at the top of your AWS screen** - you'll see a **"Search"** bar
2. **Click in the search bar** and type: `IAM`
3. **Click on "IAM"** from the dropdown (it will say "IAM - Identity and Access Management")

### Step 2: Create a New User

1. **On the left side**, you'll see a menu
2. **Click on "Users"** (under "Access management")
3. **Click the orange button** that says **"Create user"** (top right)

### Step 3: Name Your User

1. **In the "User name" box**, type: `github-actions-deployer`
2. **Click "Next"** (bottom right)

### Step 4: Give Permissions

1. **You'll see "Set permissions"** page
2. **Click on "Attach policies directly"** (it's a tab/button)
3. **In the search box**, type: `ElasticBeanstalk`
4. **Check the boxes** next to these (click the checkbox):
   - ✅ `AWSElasticBeanstalkFullAccess`
   - ✅ `AWSElasticBeanstalkWebTier`
   - ✅ `AWSElasticBeanstalkWorkerTier`
5. **Click "Next"** (bottom right)

### Step 5: Review and Create

1. **Review page** - just check that it says:
   - User name: `github-actions-deployer`
   - Permissions: 3 policies attached
2. **Click "Create user"** (bottom right)

✅ **User created!** You'll see a success message.

---

## 🔑 PART 2: Get Access Keys (5 minutes)

### Step 1: Open Your New User

1. **You should see your user** `github-actions-deployer` in the list
2. **Click on the user name** `github-actions-deployer` (it's a link)

### Step 2: Go to Security Credentials

1. **You'll see tabs** at the top: "Summary", "Permissions", "Security credentials", etc.
2. **Click on "Security credentials"** tab

### Step 3: Create Access Key

1. **Scroll down** to find **"Access keys"** section
2. **Click the button** that says **"Create access key"**

### Step 4: Choose Use Case

1. **A popup will appear** asking "Use case"
2. **Select:** "Application running outside AWS" (it's a radio button/option)
3. **Click "Next"**

### Step 5: Download/Copy Keys

1. **You'll see two important things:**
   - **Access key ID** - looks like: `AKIAIOSFODNN7EXAMPLE`
   - **Secret access key** - looks like: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

2. **⚠️ IMPORTANT:** 
   - **Copy BOTH of these** to a text file or note
   - **You can only see the secret key ONCE!** If you close this, you can't see it again
   - **Click "Download .csv file"** to save them, OR copy them manually

3. **Click "Done"** when you've saved them

✅ **Keys saved!** Keep them safe - you'll need them next.

---

## 🐙 PART 3: Add Secrets to GitHub (5 minutes)

### Step 1: Open Your GitHub Repository

1. **Open a new browser tab**
2. **Go to:** https://github.com/aqibsaeed237/pharmacy_pos_backend
3. **Make sure you're logged in** to GitHub

### Step 2: Go to Settings

1. **At the top of the page**, you'll see tabs: "Code", "Issues", "Pull requests", **"Settings"**, etc.
2. **Click on "Settings"** tab

### Step 3: Go to Secrets

1. **On the left side menu**, scroll down to find **"Secrets and variables"**
2. **Click on "Secrets and variables"**
3. **Click on "Actions"** (under it)

### Step 4: Add First Secret (Access Key ID)

1. **Click the green button** that says **"New repository secret"**
2. **In "Name" box**, type exactly: `AWS_ACCESS_KEY_ID`
3. **In "Secret" box**, paste your **Access key ID** (the one that looks like `AKIAIOSFODNN7EXAMPLE`)
4. **Click "Add secret"** (green button)

✅ **First secret added!**

### Step 5: Add Second Secret (Secret Access Key)

1. **Click "New repository secret"** again
2. **In "Name" box**, type exactly: `AWS_SECRET_ACCESS_KEY`
3. **In "Secret" box**, paste your **Secret access key** (the long one)
4. **Click "Add secret"**

✅ **Both secrets added!** You should see both in the list now.

---

## 🚀 PART 4: Push Code to GitHub (2 minutes)

### Step 1: Open Terminal

1. **On your Mac**, press `Command + Space`
2. **Type:** `Terminal`
3. **Press Enter** to open Terminal

### Step 2: Go to Your Project

1. **Copy and paste this command:**
```bash
cd /Users/app/Desktop/NewProject/Project/pharmacybackend/pharmacy_pos_backend
```
2. **Press Enter**

### Step 3: Add EB CLI to Path (One Time)

1. **Copy and paste this:**
```bash
export PATH=$PATH:/Users/app/Library/Python/3.9/bin
```
2. **Press Enter**

### Step 4: Check What Branch You're On

1. **Type:**
```bash
git branch
```
2. **Press Enter**
3. **You should see:** `* working` (or main, or develop)

### Step 5: Switch to Main Branch (for Production)

1. **Type:**
```bash
git checkout main
```
2. **Press Enter**
3. **If it says "branch doesn't exist", create it:**
```bash
git checkout -b main
```

### Step 6: Add All Files

1. **Type:**
```bash
git add .
```
2. **Press Enter**

### Step 7: Commit Changes

1. **Type:**
```bash
git commit -m "Setup AWS deployment with GitHub Actions"
```
2. **Press Enter**

### Step 8: Push to GitHub

1. **Type:**
```bash
git push origin main
```
2. **Press Enter**
3. **If it asks for GitHub password**, you might need to use a Personal Access Token (see below)

---

## ✅ PART 5: Watch It Deploy! (5-10 minutes)

### Step 1: Check GitHub Actions

1. **Go back to GitHub** in your browser
2. **Go to:** https://github.com/aqibsaeed237/pharmacy_pos_backend
3. **Click on "Actions"** tab (at the top)

### Step 2: Watch the Workflow

1. **You'll see** a workflow called "Deploy to AWS Production"
2. **Click on it** to see details
3. **Watch it run** - it will:
   - ✅ Checkout code
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Deploy to AWS

### Step 3: Get Your URL

1. **When it's done** (green checkmark), **click on the workflow run**
2. **Scroll down** to see "Deployment summary"
3. **You'll see your URL** like: `https://pharmacy-pos-backend-prod.elasticbeanstalk.com`

---

## 🎉 DONE! Your API is Live!

**Your API will be at:**
- **API Base:** `https://pharmacy-pos-backend-prod.elasticbeanstalk.com/api/v1`
- **Swagger Docs:** `https://pharmacy-pos-backend-prod.elasticbeanstalk.com/api/docs`

---

## 🆘 Troubleshooting

### Problem: "Git push asks for password"

**Solution:**
1. GitHub doesn't accept passwords anymore
2. You need a **Personal Access Token**
3. Go to: https://github.com/settings/tokens
4. Click "Generate new token" → "Generate new token (classic)"
5. Give it a name, check "repo" permission
6. Generate and copy the token
7. Use this token as your password when pushing

### Problem: "AWS Access Denied"

**Solution:**
1. Go back to AWS IAM
2. Check that you attached all 3 policies:
   - `AWSElasticBeanstalkFullAccess`
   - `AWSElasticBeanstalkWebTier`
   - `AWSElasticBeanstalkWorkerTier`
3. Make sure you copied the keys correctly in GitHub Secrets

### Problem: "Environment not found" in GitHub Actions

**Solution:**
- This is normal for first deployment!
- GitHub Actions will create it automatically
- Just wait 5-10 minutes for the first deployment

### Problem: "Can't find IAM"

**Solution:**
1. Use the search bar at the top of AWS Console
2. Type exactly: `IAM`
3. Click on it from the results

---

## 📝 Quick Checklist

- [ ] Created IAM user: `github-actions-deployer`
- [ ] Attached 3 Elastic Beanstalk policies
- [ ] Created Access Key
- [ ] Saved Access Key ID and Secret Key
- [ ] Added `AWS_ACCESS_KEY_ID` to GitHub Secrets
- [ ] Added `AWS_SECRET_ACCESS_KEY` to GitHub Secrets
- [ ] Pushed code to GitHub
- [ ] Checked GitHub Actions workflow
- [ ] Got deployment URL

---

## 🎯 Summary

**What you did:**
1. ✅ Created AWS user with permissions
2. ✅ Got secret keys
3. ✅ Added keys to GitHub
4. ✅ Pushed code
5. ✅ GitHub automatically deployed to AWS!

**Now every time you push to `main` branch, it will auto-deploy!** 🚀

---

**Need help?** Check the GitHub Actions logs if something fails, or see the troubleshooting section above.
