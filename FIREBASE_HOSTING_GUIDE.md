# 🔥 Firebase Services & Hosting Guide

## ⚠️ Important: Firebase Hosting vs Backend

**Firebase Hosting** is for **static websites** (frontend), **NOT** for NestJS backend APIs.

**For your NestJS backend**, you need **Node.js hosting**, not Firebase Hosting.

---

## 🔥 Firebase Services Overview

### What Firebase Offers

| Service | Purpose | Free Tier | Suitable for Backend? |
|--------|--------|-----------|----------------------|
| **Firebase Hosting** | Static website hosting | ✅ 10GB storage, 360MB/day transfer | ❌ No - Frontend only |
| **Cloud Functions** | Serverless functions | ✅ 2M invocations/month | ⚠️ Limited - Not full NestJS |
| **Firestore** | NoSQL database | ✅ 1GB storage, 50K reads/day | ✅ Yes - Alternative to MySQL |
| **Realtime Database** | Real-time database | ✅ 1GB storage, 100 connections | ✅ Yes - Alternative to MySQL |
| **Cloud Storage** | File storage | ✅ 5GB storage, 1GB/day transfer | ✅ Yes - For file uploads |
| **Authentication** | User auth | ✅ Unlimited users | ✅ Yes - Alternative to JWT |
| **Cloud Messaging (FCM)** | Push notifications | ✅ Unlimited | ✅ Yes - Already integrated |

---

## 🚀 Free Hosting Options for NestJS Backend

### Option 1: Railway (Recommended) ⭐

**Free Tier:**
- $5/month credit (free)
- 500 hours/month
- Auto SSL
- Custom domain

**Deploy:**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**See:** [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide

---

### Option 2: Render

**Free Tier:**
- 750 hours/month
- Auto SSL
- Sleeps after 15min inactivity

**Deploy:**
1. Connect GitHub repo
2. Select "Web Service"
3. Build: `npm install && npm run build`
4. Start: `npm run start:prod`

**URL:** https://render.com

---

### Option 3: Fly.io

**Free Tier:**
- 3 shared VMs
- 160GB outbound transfer
- Auto SSL

**Deploy:**
```bash
curl -L https://fly.io/install.sh | sh
fly launch
fly deploy
```

**URL:** https://fly.io

---

### Option 4: Heroku (Limited Free Tier)

**Note:** Heroku removed free tier, but has low-cost options ($7/month)

---

## 🔥 Using Firebase Services with Your Backend

### 1. Firebase Hosting (Frontend Only)

**If you have a React/Vue/Angular frontend:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build your frontend
npm run build

# Deploy
firebase deploy --only hosting
```

**Your frontend will be at:**
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

### 2. Cloud Functions (Limited Backend)

**Convert your NestJS to Cloud Functions (Not Recommended):**

This requires rewriting your entire backend. Not practical for existing NestJS apps.

**Better:** Use Railway/Render for full NestJS backend.

---

### 3. Firestore Database (Alternative to MySQL)

**If you want to use Firestore instead of MySQL:**

1. **Install:**
```bash
npm install @google-cloud/firestore
```

2. **Initialize:**
```typescript
import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: 'path/to/service-account.json',
});
```

3. **Use in your services:**
```typescript
// Instead of TypeORM
const usersRef = firestore.collection('users');
const snapshot = await usersRef.where('email', '==', email).get();
```

**Note:** This requires rewriting your database layer. MySQL is already set up and working.

---

### 4. Firebase Authentication (Alternative to JWT)

**If you want to use Firebase Auth instead of JWT:**

1. **Install:**
```bash
npm install firebase-admin
```

2. **Verify tokens:**
```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Verify token
const decodedToken = await admin.auth().verifyIdToken(token);
```

**Note:** Your JWT system is already working. Only switch if you have specific needs.

---

## 🎯 Recommended Setup

### For Your Pharmacy POS Backend:

**Backend (NestJS):**
- ✅ **Host on Railway** (free tier)
- ✅ **Keep MySQL database** (or use Railway's MySQL)
- ✅ **Use Firebase FCM** for push notifications (already integrated)

**Frontend (if you have one):**
- ✅ **Host on Firebase Hosting** (free tier)
- ✅ **Connect to your Railway backend API**

---

## 📋 Complete Firebase Services Guide

### Firebase Hosting Setup (Frontend)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize project
firebase init hosting

# 4. Configure firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# 5. Build frontend
npm run build

# 6. Deploy
firebase deploy --only hosting
```

**Free Tier Limits:**
- 10GB storage
- 360MB/day transfer
- Custom domain support
- SSL included

---

### Firestore Setup (If Switching from MySQL)

**Not recommended** - Your MySQL setup is already working. Only use if you need:
- Real-time updates
- Offline support
- NoSQL structure

**Setup:**
```bash
npm install @google-cloud/firestore
```

**Initialize:**
```typescript
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'your-project-id',
});
```

---

### Cloud Functions (Limited Use)

**For small serverless functions only:**

```bash
firebase init functions
```

**Limitations:**
- Not suitable for full NestJS app
- 60-second timeout (free tier)
- Cold starts
- Limited to Express.js

---

## 🆓 Free Hosting Comparison

| Platform | Free Tier | Best For | Backend Support |
|----------|----------|----------|-----------------|
| **Railway** | $5/month credit | Full apps | ✅ Yes |
| **Render** | 750 hrs/month | Full apps | ✅ Yes |
| **Fly.io** | 3 VMs | Full apps | ✅ Yes |
| **Firebase Hosting** | 10GB storage | Static sites | ❌ No |
| **Cloud Functions** | 2M invocations | Small functions | ⚠️ Limited |

---

## 🚀 Quick Deploy: Backend to Railway

**Easiest free option for your NestJS backend:**

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Add MySQL database
railway add mysql

# 5. Set environment variables
railway variables set DB_HOST=${{MySQL.MYSQLHOST}}
railway variables set DB_USERNAME=${{MySQL.MYSQLUSER}}
railway variables set DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
railway variables set DB_DATABASE=${{MySQL.MYSQLDATABASE}}
railway variables set JWT_SECRET=your-secret
railway variables set NODE_ENV=production

# 6. Deploy
railway up
```

**Your backend will be live at:**
- `https://your-project.up.railway.app`

**See:** [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide

---

## 📝 Summary

### ✅ What You CAN Use Firebase For:

1. **Frontend Hosting** - Deploy React/Vue/Angular frontend
2. **Push Notifications** - FCM (already integrated)
3. **File Storage** - Cloud Storage for uploads
4. **Authentication** - Firebase Auth (if you want to switch)

### ❌ What You CANNOT Use Firebase For:

1. **Backend API Hosting** - Firebase Hosting is static only
2. **Full NestJS App** - Cloud Functions too limited

### 🎯 Recommended:

**Backend:** Railway (free tier)  
**Frontend:** Firebase Hosting (free tier)  
**Database:** MySQL (Railway provides)  
**Notifications:** Firebase FCM (already integrated)

---

## 🔗 Next Steps

1. **Deploy Backend:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Setup Firebase Hosting:** For your frontend (if you have one)
3. **Keep Current Setup:** MySQL + JWT is working perfectly

---

**Firebase is great for frontend and services, but use Railway/Render for your NestJS backend! 🚀**
