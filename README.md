# Pharmacy POS Backend

A production-ready, multi-tenant NestJS backend for Pharmacy Point of Sale (POS) system.

## 🚀 Quick Start

```bash
# 1. Install MySQL (if not installed)
brew install mysql
brew services start mysql

# 2. Create database
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Create tables
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql

# 4. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 5. Install and start
npm install
npm run start:dev
```

**Access:**
- **Local API:** http://localhost:3000/api/v1
- **Local Swagger:** http://localhost:3000/api/docs
- **Production API:** https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/v1
- **Production Swagger:** https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

## ✨ Features

- ✅ Multi-tenant Architecture
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ MySQL Database (19 tables)
- ✅ Push Notifications (Firebase)
- ✅ Payment Integration (Stripe, PayFast)
- ✅ Google OAuth
- ✅ Swagger API Documentation
- ✅ Request/Response Logging
- ✅ Error Handling

## 📁 Project Structure

```
src/
├── common/          # Shared utilities, decorators, guards
├── config/         # Configuration files
├── database/       # TypeORM entities & SQL files
│   ├── entities/   # Database entities
│   └── sql/        # SQL schema files
├── modules/        # Feature modules
│   ├── auth/       # Authentication
│   ├── notifications/  # Push notifications
│   └── payments/   # Payment processing
└── main.ts         # Application entry
```

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete developer guide (architecture, installation, commands)
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - ⭐ Complete developer guide (architecture, installation, commands, deployment)
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[API_GUIDE.md](./API_GUIDE.md)** - API testing and usage
- **[DATABASE.md](./DATABASE.md)** - Database setup and SQL files
- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - Deploy to AWS (Free Tier - No Domain Required)
- **[GITHUB_AWS_SETUP.md](./GITHUB_AWS_SETUP.md)** - GitHub → AWS Auto-Deploy Setup
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code structure and organization
- **[WORKFLOW.md](./WORKFLOW.md)** - Three-branch workflow (working → develop → main)

## 🔧 Available Commands

```bash
npm run start:dev      # Development server
npm run build          # Build for production
npm run start:prod     # Production server
npm run db:create      # Create database
npm run lint           # Run linter
npm run test           # Run tests
```

## 🔐 Authentication

### Important: Register First!

**You must register before you can login.**

### Register Pharmacy
```bash
POST /api/v1/auth/register
{
  "pharmacyName": "My Pharmacy",
  "email": "admin@pharmacy.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",  # Optional
  "address": "123 Main St"       # Optional
}
```

**Response:** Returns `accessToken` and `refreshToken`

### Login
```bash
POST /api/v1/auth/login
{
  "email": "admin@pharmacy.com",
  "password": "Password123!"
}
```

**Note:** Use the **exact same email and password** you used during registration.

### Use JWT Token
```
Authorization: Bearer <your-access-token>
```

### Troubleshooting Login
- ❌ "Invalid credentials" → Make sure you registered first
- ❌ "User not found" → Register a pharmacy first
- ✅ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more help

## 🗄️ Database

- **19 tables** created
- **Multi-tenant** support
- **SQL files**: `src/database/sql/schema.sql`
- **Setup script**: `./scripts/setup-database-complete.sh`

## 📖 API Documentation

Interactive Swagger docs available at: http://localhost:3000/api/docs

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Documentation**: Swagger
- **Validation**: class-validator

## 🎯 What's Next?

### ✅ You've Completed Setup
1. ✅ MySQL installed and running
2. ✅ Database created with 19 tables
3. ✅ Backend server running on http://localhost:3000
4. ✅ Swagger docs available at http://localhost:3000/api/docs
5. ✅ User registered and can login

### 🚀 Next Steps

1. **Test the API**
   - Use Swagger UI: http://localhost:3000/api/docs
   - Register a pharmacy and login
   - Test protected endpoints with JWT token

2. **Setup Integrations** (Optional)
   - Firebase for push notifications
   - Google OAuth for social login
   - Stripe/PayFast for payments

3. **Deploy to Production**
   - See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for complete guide
   - Deploy to AWS Elastic Beanstalk (free tier available)
   - Get free URL without domain: `your-app.elasticbeanstalk.com`

4. **Workflow**
   - Work on `working` branch for daily development
   - Merge to `develop` for testing
   - Merge to `main` for production deployment
   - See [WORKFLOW.md](./WORKFLOW.md) for details

### 🌐 Make It Live

**Deploy to AWS (Recommended):**
- **Free tier** (12 months free, then ~$25/month)
- **No domain required** - Get free URL: `your-app.elasticbeanstalk.com`
- **Perfect for NestJS + Swagger**
- **Easy deployment** with EB CLI

**Quick Start:**
1. Install AWS CLI and EB CLI
2. Configure AWS credentials
3. Run: `eb init` and `eb create`
4. Deploy: `eb deploy`

**Full Guide:** See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)

**Workflow:** Work on `working` branch → Test in `develop` → Deploy from `main` → See [WORKFLOW.md](./WORKFLOW.md)

### 📦 What's Included

- ✅ **19 Database Tables** - Complete POS schema
- ✅ **Multi-tenant Architecture** - Support multiple pharmacies
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Push Notifications** - Firebase FCM integration
- ✅ **Payment Gateways** - Stripe & PayFast ready
- ✅ **Google OAuth** - Social login support
- ✅ **API Documentation** - Swagger/OpenAPI
- ✅ **Error Handling** - Global exception filters
- ✅ **Request Logging** - Full request/response logging
- ✅ **Validation** - DTO validation with class-validator

### 🔧 How to Add Features

1. **Work on `working` branch:**
   ```bash
   git checkout working
   # Make your changes
   ```

2. **Add New Module:**
   ```bash
   # Create module structure
   src/modules/your-module/
   ├── controllers/
   ├── services/
   ├── dto/
   └── your-module.module.ts
   ```

3. **Add Database Entity:**
   ```bash
   # Create entity
   src/database/entities/your-entity.entity.ts
   # Update schema.sql
   ```

4. **Register in App Module:**
   ```typescript
   // src/app.module.ts
   imports: [YourModule]
   ```

5. **Test and Deploy:**
   ```bash
   # Merge to develop for testing
   git checkout develop
   git merge working
   
   # Merge to main for production
   git checkout main
   git merge develop
   ```

**Workflow Guide:** See [WORKFLOW.md](./WORKFLOW.md)

## 📝 License

**Proprietary License** - View only. No download, modification, or distribution without permission.

See [LICENSE](./LICENSE) for details.
