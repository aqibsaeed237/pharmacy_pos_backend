# 🚀 Complete Setup Guide

## Step 1: Install MySQL

### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL
brew services start mysql
```

### Linux
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Verify MySQL
```bash
mysql -u root -p
# Press Enter if no password
# Type EXIT; to leave
```

---

## Step 2: Create Database

### Option A: Using Script (Easiest)
```bash
./scripts/setup-database-complete.sh
```

### Option B: Manual
```bash
# Create database
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Create all tables
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

### Verify
```bash
mysql -u root -p pharmacy_pos -e "SHOW TABLES;"
# Should show 19 tables
```

---

## Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env
```

**Minimum required configuration:**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=          # Leave empty if no password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
```

**Generate JWT secrets:**
```bash
openssl rand -base64 32
openssl rand -base64 32
```

---

## Step 4: Install Dependencies

```bash
npm install
```

---

## Step 5: Build & Start

```bash
# Build project
npm run build

# Start development server
npm run start:dev
```

**Expected output:**
```
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api/docs
```

---

## Step 6: Verify Setup

1. **Check server**: http://localhost:3000/api/v1
2. **Check Swagger**: http://localhost:3000/api/docs
3. **Test registration**: Use Swagger UI to register a pharmacy

---

## 🔧 Optional Integrations

### Firebase (Push Notifications)

1. Create Firebase project
2. Get service account key
3. Add to `.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FCM_SERVER_KEY=your-fcm-server-key
```

### Google OAuth

1. Create Google Cloud project
2. Configure OAuth consent screen
3. Create OAuth credentials
4. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

### Stripe Payments

1. Create Stripe account
2. Get API keys
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### PayFast Payments

1. Create PayFast account
2. Get merchant credentials
3. Add to `.env`:
```env
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase
PAYFAST_MODE=sandbox
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup.

---

## 🆘 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Start MySQL
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux
```

### Port Already in Use
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Or change port in .env
PORT=3001
```

### Database Doesn't Exist
```bash
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Tables Not Created
```bash
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

---

## ✅ Setup Checklist

- [ ] MySQL installed and running
- [ ] Database `pharmacy_pos` created
- [ ] 19 tables created
- [ ] `.env` file configured
- [ ] JWT secrets generated
- [ ] Dependencies installed
- [ ] Server starts successfully
- [ ] Can access Swagger docs

---

## 📚 Next Steps

### ✅ You've Completed Setup!

1. **Test API**: Use Swagger at http://localhost:3000/api/docs
2. **Register & Login**: Create your first pharmacy account
3. **Test Endpoints**: Try protected endpoints with JWT token

### 🚀 What's Next?

1. **Setup Integrations** (Optional)
   - Firebase for push notifications
   - Google OAuth for social login
   - Stripe/PayFast for payments
   - See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

2. **Deploy to Production**
   - Make your backend live
   - Link your domain
   - Setup SSL/HTTPS
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide

3. **Add New Features**
   - Products, Sales, Inventory modules
   - Custom business logic
   - See [DEVELOPMENT.md](./DEVELOPMENT.md) for how to add modules

4. **Connect Frontend**
   - Update API base URL to production
   - Implement authentication flow
   - Test all endpoints

### 📖 Documentation

- **[API_GUIDE.md](./API_GUIDE.md)** - API testing with Postman/Swagger
- **[DATABASE.md](./DATABASE.md)** - Database setup and SQL files
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production & make it live
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - How to add new features & modules
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Firebase, Google OAuth, Payments

---

**Your backend is ready! 🎉**

**Next:** Deploy it live or start adding features!
