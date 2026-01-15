# 🚀 Deployment Guide - Make Your Backend Live

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Options](#deployment-options)
3. [Domain & SSL Setup](#domain--ssl-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup (Production)](#database-setup-production)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] All features tested locally
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Production database configured
- [ ] SSL certificate ready (or use platform SSL)
- [ ] Domain name purchased
- [ ] Payment gateway production keys
- [ ] Firebase production credentials
- [ ] Google OAuth production credentials
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Backup strategy planned

---

## Deployment Options

### ⚠️ Firebase Hosting Note

**Firebase Hosting is for static websites (frontend), NOT for NestJS backends.**

For your NestJS backend, use one of the options below. For frontend hosting, Firebase Hosting is perfect (see [FIREBASE_HOSTING_GUIDE.md](./FIREBASE_HOSTING_GUIDE.md)).

---

### Option 1: Railway (Easiest) ⭐ Recommended

**Why Railway:**
- ✅ Free tier available
- ✅ Automatic SSL
- ✅ Built-in database
- ✅ Zero-config deployment
- ✅ Custom domain support

**Steps:**

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project:**
   ```bash
   railway init
   ```

3. **Add Database:**
   ```bash
   railway add mysql
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set DB_HOST=${{MySQL.MYSQLHOST}}
   railway variables set DB_USERNAME=${{MySQL.MYSQLUSER}}
   railway variables set DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   railway variables set DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   railway variables set JWT_SECRET=your-secret
   railway variables set JWT_REFRESH_SECRET=your-refresh-secret
   # Add all other .env variables
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Setup Database:**
   ```bash
   # Connect to Railway MySQL
   railway connect mysql
   # Then run:
   source src/database/sql/schema.sql;
   ```

7. **Link Domain:**
   - Go to Railway dashboard
   - Settings > Domains
   - Add your custom domain
   - Railway provides SSL automatically

**Cost:** Free tier: $5/month credit, then pay-as-you-go

---

### Option 2: Heroku

**Steps:**

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku  # macOS
   heroku login
   ```

2. **Create App:**
   ```bash
   heroku create your-pharmacy-backend
   ```

3. **Add MySQL Database:**
   ```bash
   heroku addons:create cleardb:ignite
   # Or use JawsDB
   heroku addons:create jawsdb:kitefin
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
   heroku config:set NODE_ENV=production
   # Add all other variables
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Run Migrations:**
   ```bash
   heroku run npm run migration:run
   # Or manually:
   heroku run bash
   mysql -h $CLEARDB_DATABASE_URL < src/database/sql/schema.sql
   ```

7. **Setup Domain:**
   ```bash
   heroku domains:add api.yourdomain.com
   # SSL is automatic with Heroku
   ```

**Cost:** Free tier removed, starts at $7/month

---

### Option 3: DigitalOcean App Platform

**Steps:**

1. **Create Account:** https://www.digitalocean.com/

2. **Create App:**
   - Go to App Platform
   - Connect GitHub repository
   - Select Node.js
   - Set build command: `npm run build`
   - Set run command: `npm run start:prod`

3. **Add Database:**
   - Add MySQL database component
   - Choose plan ($15/month minimum)

4. **Environment Variables:**
   - Add all variables from `.env`
   - Database connection auto-configured

5. **Deploy:**
   - Push to GitHub
   - Auto-deploys on push

6. **Custom Domain:**
   - Settings > Domains
   - Add your domain
   - SSL auto-configured

**Cost:** Starts at $12/month (app) + $15/month (database)

---

### Option 4: AWS (Elastic Beanstalk)

**Steps:**

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   eb init
   # Select region, platform (Node.js)
   ```

3. **Create Environment:**
   ```bash
   eb create production-env
   ```

4. **Setup RDS MySQL:**
   - AWS Console > RDS
   - Create MySQL instance
   - Note connection details

5. **Configure Environment:**
   ```bash
   eb setenv JWT_SECRET=your-secret DB_HOST=your-rds-endpoint
   # Add all variables
   ```

6. **Deploy:**
   ```bash
   eb deploy
   ```

7. **Setup Domain:**
   - Use Route 53 or external DNS
   - Point to EB environment URL
   - Setup SSL with ACM

**Cost:** Pay-as-you-go (~$20-50/month)

---

### Option 5: VPS (DigitalOcean Droplet / AWS EC2)

**Steps:**

1. **Create VPS:**
   - DigitalOcean: Create Droplet (Ubuntu 22.04)
   - AWS: Launch EC2 instance

2. **SSH into Server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Dependencies:**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   
   # Install MySQL
   apt install -y mysql-server
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

4. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/pharmacybackend.git
   cd pharmacybackend
   npm install
   npm run build
   ```

5. **Setup Database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
   ```

6. **Configure Environment:**
   ```bash
   cp .env.example .env
   nano .env
   # Add all production values
   ```

7. **Start with PM2:**
   ```bash
   pm2 start npm --name "pharmacy-backend" -- run start:prod
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx Reverse Proxy:**
   ```bash
   nano /etc/nginx/sites-available/pharmacy-backend
   ```
   
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   ln -s /etc/nginx/sites-available/pharmacy-backend /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt:**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d api.yourdomain.com
   ```

**Cost:** $6-12/month (VPS) + domain

---

## Domain & SSL Setup

### Option A: Platform Provides SSL (Easiest)

**Railway, Heroku, DigitalOcean App Platform:**
- Add domain in dashboard
- SSL automatically configured
- No additional steps needed

### Option B: Manual SSL (VPS)

**Using Let's Encrypt:**
```bash
certbot --nginx -d api.yourdomain.com
# Auto-renewal is configured
```

**Using Cloudflare:**
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full mode)
4. Point DNS to your server IP

---

## Environment Configuration

### Production `.env` Template

```env
# Server
NODE_ENV=production
PORT=3000

# Database (Production)
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-db-user
DB_PASSWORD=your-strong-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT (Generate new secrets!)
JWT_SECRET=your-production-jwt-secret-32-chars-min
JWT_REFRESH_SECRET=your-production-refresh-secret-32-chars-min
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Your frontend domains)
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Firebase (Production)
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FCM_SERVER_KEY=your-production-fcm-key

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/v1/auth/google/callback

# Stripe (Production - Use live keys!)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayFast (Production)
PAYFAST_MERCHANT_ID=your-production-merchant-id
PAYFAST_MERCHANT_KEY=your-production-merchant-key
PAYFAST_PASSPHRASE=your-production-passphrase
PAYFAST_MODE=production
PAYFAST_RETURN_URL=https://yourdomain.com/payment/return
PAYFAST_CANCEL_URL=https://yourdomain.com/payment/cancel
PAYFAST_NOTIFY_URL=https://api.yourdomain.com/api/v1/payments/payfast/notify
```

### Generate Production Secrets

```bash
# JWT Secrets
openssl rand -base64 32
openssl rand -base64 32

# Database Password
openssl rand -base64 24
```

---

## Database Setup (Production)

### Option 1: Managed Database (Recommended)

**Railway, Heroku, DigitalOcean:**
- Database automatically provisioned
- Connection string provided
- Backups included

### Option 2: Self-Managed (VPS)

**Secure MySQL Setup:**
```bash
mysql_secure_installation

# Create production user
mysql -u root -p
CREATE USER 'pharmacy_user'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON pharmacy_pos.* TO 'pharmacy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Setup Backups:**
```bash
# Create backup script
nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/pharmacy"
mkdir -p $BACKUP_DIR
mysqldump -u pharmacy_user -p pharmacy_pos > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-db.sh
# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Health check
curl https://api.yourdomain.com/api/v1/health

# Swagger docs
https://api.yourdomain.com/api/docs
```

### 2. Test Authentication

```bash
# Register
curl -X POST https://api.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"pharmacyName":"Test","email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST https://api.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### 3. Update Frontend

Update your frontend API base URL:
```javascript
const API_URL = 'https://api.yourdomain.com/api/v1';
```

### 4. Monitor Performance

**Setup Monitoring:**
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring
- **Uptime Robot**: Uptime monitoring
- **LogRocket**: User session replay

### 5. Setup CI/CD

**GitHub Actions Example:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
```

---

## Security Checklist

- [ ] All secrets are in environment variables (never in code)
- [ ] Database password is strong (32+ characters)
- [ ] JWT secrets are unique and strong
- [ ] CORS configured for production domains only
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Error tracking setup (Sentry)
- [ ] Logging configured
- [ ] Firewall rules configured (VPS)
- [ ] Regular security updates scheduled

---

## Troubleshooting

### Server Not Starting

```bash
# Check logs
pm2 logs pharmacy-backend  # VPS
railway logs              # Railway
heroku logs --tail        # Heroku

# Check environment variables
railway variables         # Railway
heroku config             # Heroku
```

### Database Connection Issues

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USERNAME -p

# Check firewall rules
# Ensure database allows connections from your server IP
```

### SSL Certificate Issues

```bash
# Renew Let's Encrypt
certbot renew

# Check certificate
openssl s_client -connect api.yourdomain.com:443
```

---

## Cost Comparison

| Platform | Monthly Cost | Database | SSL | Ease of Use |
|----------|-------------|----------|-----|-------------|
| Railway | $5+ | Included | ✅ Auto | ⭐⭐⭐⭐⭐ |
| Heroku | $7+ | $15+ | ✅ Auto | ⭐⭐⭐⭐ |
| DigitalOcean App | $12+ | $15+ | ✅ Auto | ⭐⭐⭐⭐ |
| AWS EB | $20-50 | $15+ | Manual | ⭐⭐⭐ |
| VPS (DO) | $6+ | Self-managed | Manual | ⭐⭐ |

---

## 🎉 You're Live!

Your backend is now accessible at:
- **API**: `https://api.yourdomain.com/api/v1`
- **Docs**: `https://api.yourdomain.com/api/docs`

**Next Steps:**
1. Update frontend to use production API
2. Test all endpoints
3. Setup monitoring
4. Configure backups
5. Share with your team!

---

**Need Help?** Check the main [README.md](./README.md) or [SETUP.md](./SETUP.md)
