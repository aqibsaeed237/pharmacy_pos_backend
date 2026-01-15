# 🚀 Quick Deploy to Railway

## Prerequisites
- Railway CLI installed ✅ (already installed)
- GitHub account (for Railway login)

## Step-by-Step Deployment

### 1. Login to Railway
```bash
railway login
```
This will open your browser. Sign in with GitHub, Google, or email.

### 2. Initialize Project (First Time Only)
```bash
railway init
```
- Choose: **Create new project**
- Project name: `pharmacy-pos-backend` (or your preferred name)

### 3. Add MySQL Database
```bash
railway add mysql
```
This creates a MySQL service automatically.

### 4. Set Environment Variables

Run this script to set all required variables:

```bash
# Database (uses Railway's MySQL service automatically)
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_SYNCHRONIZE='false'
railway variables set DB_LOGGING='false'

# Generate and set JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_EXPIRES_IN='15m'
railway variables set JWT_REFRESH_EXPIRES_IN='7d'

# App Configuration
railway variables set NODE_ENV='production'
railway variables set APP_NAME='Pharmacy POS Backend'
railway variables set CORS_ORIGIN='*'
```

**Note:** Railway automatically sets `PORT`, so you don't need to set it manually.

### 5. Deploy
```bash
railway up
```

This will:
- Build your NestJS application
- Deploy to Railway
- Start the server

**First deployment takes 3-5 minutes.**

### 6. Get Your URL
```bash
railway domain
```

Or check Railway dashboard: `https://railway.app`

Your app will be available at: `https://your-project.up.railway.app`

### 7. Setup Database Schema

After deployment, you need to create the database tables:

**Option A: Using Railway MySQL Connection**
```bash
railway connect mysql
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_pos;
SOURCE src/database/sql/schema.sql;
```

**Option B: Using MySQL Client**
```bash
# Get connection details
railway variables

# Connect and import
mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < src/database/sql/schema.sql
```

## Verify Deployment

### 1. Check Health Endpoint
```bash
curl https://your-project.up.railway.app/api/v1/health
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

## Useful Commands

```bash
# View logs
railway logs

# Follow logs in real-time
railway logs --follow

# Open Railway dashboard
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

## Automated Deployment Script

You can also use the automated script:

```bash
./scripts/deploy-railway.sh
```

This script will guide you through all steps interactively.

## Troubleshooting

### Build Fails
- Check logs: `railway logs`
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first to check for errors

### Database Connection Fails
- Verify MySQL service is running in Railway dashboard
- Check environment variables are set correctly
- Ensure database exists

### App Won't Start
- Check logs: `railway logs --follow`
- Verify PORT is being read (Railway sets this automatically)
- Ensure build completed successfully

## Next Steps

1. ✅ **Deploy** - Your backend is live!
2. ✅ **Test** - Verify all endpoints work
3. ✅ **Setup Domain** - Add custom domain (optional)
4. ✅ **Monitor** - Check logs regularly
5. ✅ **Update** - Push changes to auto-deploy

---

**Need Help?** Check `RAILWAY_DEPLOY.md` for detailed documentation.
