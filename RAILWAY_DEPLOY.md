# 🚂 Railway Deployment - Step by Step

## Quick Deploy (Automated)

Run the deployment script:

```bash
./scripts/deploy-railway.sh
```

This will guide you through the entire process.

---

## Manual Deployment Steps

### Step 1: Login to Railway

```bash
railway login
```

This will open your browser. Sign in with GitHub, Google, or email.

---

### Step 2: Initialize Project

```bash
railway init
```

Choose:
- **Create new project** (or link existing)
- **Project name:** `pharmacy-pos-backend`

---

### Step 3: Add MySQL Database

```bash
railway add mysql
```

This creates a MySQL service and provides connection variables.

---

### Step 4: Set Environment Variables

```bash
# Database (uses Railway's MySQL service)
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_SYNCHRONIZE='false'
railway variables set DB_LOGGING='false'

# Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# JWT Configuration
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_EXPIRES_IN='15m'
railway variables set JWT_REFRESH_EXPIRES_IN='7d'

# App Configuration
railway variables set NODE_ENV='production'
railway variables set PORT='3000'
railway variables set APP_NAME='Pharmacy POS Backend'
railway variables set CORS_ORIGIN='*'
```

**Optional (if you have them):**
```bash
# Firebase (if using)
railway variables set FIREBASE_PROJECT_ID='your-project-id'
railway variables set FIREBASE_PRIVATE_KEY='your-key'
railway variables set FIREBASE_CLIENT_EMAIL='your-email'

# Google OAuth (if using)
railway variables set GOOGLE_CLIENT_ID='your-client-id'
railway variables set GOOGLE_CLIENT_SECRET='your-secret'

# Stripe (if using)
railway variables set STRIPE_SECRET_KEY='your-key'
railway variables set STRIPE_PUBLISHABLE_KEY='your-key'
```

---

### Step 5: Deploy

```bash
railway up
```

This will:
1. Build your NestJS app
2. Deploy to Railway
3. Start the server

**First deployment takes 3-5 minutes.**

---

### Step 6: Get Your URL

```bash
railway domain
```

Or check Railway dashboard for your app URL:
- `https://your-project.up.railway.app`

---

### Step 7: Setup Database

**Option A: Using Railway MySQL (Recommended)**

1. **Get MySQL connection:**
   ```bash
   railway connect mysql
   ```

2. **Create database and tables:**
   ```sql
   CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE pharmacy_pos;
   SOURCE src/database/sql/schema.sql;
   ```

**Option B: Using phpMyAdmin**

1. Get MySQL connection string from Railway dashboard
2. Connect with phpMyAdmin
3. Import `src/database/sql/schema.sql`

**Option C: Using Railway CLI**

```bash
# Connect to MySQL
railway connect mysql

# Then run SQL
mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < src/database/sql/schema.sql
```

---

## Verify Deployment

### 1. Check Health Endpoint

```bash
curl https://your-project.up.railway.app/api/v1/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "..."
  }
}
```

### 2. Check Swagger Docs

Visit: `https://your-project.up.railway.app/api/docs`

### 3. Test Registration

```bash
curl -X POST https://your-project.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacyName": "Test Pharmacy",
    "email": "test@test.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## Useful Railway Commands

```bash
# View logs
railway logs

# View logs (follow)
railway logs --follow

# Open dashboard
railway open

# View environment variables
railway variables

# Connect to database
railway connect mysql

# Redeploy
railway up

# View service status
railway status
```

---

## Custom Domain Setup

### 1. Add Domain in Railway

```bash
railway domain add yourdomain.com
```

### 2. Update DNS

Add CNAME record:
- **Name:** `api` (or `@` for root)
- **Value:** `your-project.up.railway.app`

### 3. SSL is Automatic

Railway provides SSL certificates automatically via Let's Encrypt.

---

## Troubleshooting

### Build Fails

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Missing dependencies → Check `package.json`
- TypeScript errors → Run `npm run build` locally first
- Environment variables → Check all required vars are set

### Database Connection Fails

**Check:**
1. MySQL service is running in Railway
2. Environment variables are set correctly
3. Database exists (create it if needed)

**Test connection:**
```bash
railway connect mysql
mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD -e "SELECT 1"
```

### App Won't Start

**Check:**
1. Port is set to `3000` (Railway auto-assigns PORT env var)
2. Start command: `npm run start:prod`
3. Build completed successfully

**View logs:**
```bash
railway logs --follow
```

### 404 Errors

**Check:**
1. API prefix: `/api/v1/...`
2. Routes are registered in `app.module.ts`
3. CORS is configured for your frontend domain

---

## Environment Variables Reference

### Required

| Variable | Value | Description |
|----------|-------|-------------|
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` | MySQL host |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` | MySQL port |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` | MySQL user |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` | MySQL password |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` | Database name |
| `JWT_SECRET` | (generated) | JWT signing secret |
| `JWT_REFRESH_SECRET` | (generated) | JWT refresh secret |
| `NODE_ENV` | `production` | Environment |
| `PORT` | `3000` | Server port |

### Optional

| Variable | Description |
|----------|-------------|
| `CORS_ORIGIN` | Allowed origins (comma-separated) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `STRIPE_SECRET_KEY` | Stripe secret key |

---

## Cost

**Free Tier:**
- $5/month credit
- 500 hours/month
- Perfect for development and small projects

**After Free Tier:**
- Pay-as-you-go
- ~$5-10/month for small apps

---

## Next Steps

1. ✅ **Deploy** - Your backend is live!
2. ✅ **Test** - Verify all endpoints work
3. ✅ **Setup Domain** - Add custom domain (optional)
4. ✅ **Monitor** - Check logs regularly
5. ✅ **Update** - Push changes to auto-deploy

---

## 🎉 Deployment Complete!

Your backend is now live on Railway!

**URL:** `https://your-project.up.railway.app`

**Next:** Connect your frontend to this API URL.

---

**Need Help?** Check Railway dashboard or run `railway logs` for errors.
