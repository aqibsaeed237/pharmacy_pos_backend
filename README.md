# Pharmacy POS Backend

A production-ready, multi-tenant NestJS backend for Pharmacy Point of Sale (POS) system with complete authentication, payments, notifications, and multi-store management.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Modules & Functions](#-modules--functions)
- [Available Commands](#-available-commands)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Development Workflow](#-development-workflow)

---

## ✨ Features

- ✅ **Multi-tenant Architecture** - Support multiple pharmacies with complete isolation
- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Role-Based Access Control** - Admin, Manager, Staff roles
- ✅ **Multi-Store Management** - Users can switch between stores
- ✅ **MySQL Database** - 19 tables with proper relationships and indexes
- ✅ **Push Notifications** - Firebase FCM integration
- ✅ **Payment Integration** - Stripe and PayFast support
- ✅ **Google OAuth** - Social login ready (optional)
- ✅ **Swagger API Documentation** - Interactive API docs
- ✅ **Request/Response Logging** - Complete logging with interceptors
- ✅ **Error Handling** - Global exception filters
- ✅ **Validation** - DTO validation with class-validator
- ✅ **Rate Limiting** - Built-in throttling protection
- ✅ **Caching** - Response caching support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Local Setup

```bash
# 1. Clone repository
git clone https://github.com/aqibsaeed237/pharmacy_pos_backend.git
cd pharmacy_pos_backend

# 2. Install dependencies
npm install

# 3. Setup MySQL database
# Option A: Use script (recommended)
./scripts/setup-database-complete.sh

# Option B: Manual setup
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql

# 4. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 5. Start development server
npm run start:dev
```

**Access:**
- **API:** http://localhost:3000/api/v1
- **Swagger Docs:** http://localhost:3000/api/docs

### EC2 Deployment

```bash
# Automated deployment (installs MySQL, configures DB, restarts PM2)
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

See [AWS_EC2_SETUP_GUIDE.md](./AWS_EC2_SETUP_GUIDE.md) for detailed EC2 setup instructions.

---

## 📁 Project Structure

```
pharmacy_pos_backend/
├── src/
│   ├── common/                    # Shared utilities
│   │   ├── decorators/            # Custom decorators (@Public, @CurrentUser, @Tenant, @Roles)
│   │   ├── dto/                   # Shared DTOs (Pagination, PaginatedResponse)
│   │   ├── enums/                 # Application enums (UserRole, PaymentMethod, etc.)
│   │   ├── filters/               # Exception filters (AllExceptions, HttpException)
│   │   ├── guards/                # Auth guards (JwtAuthGuard, RolesGuard)
│   │   ├── interceptors/          # Request/response interceptors
│   │   ├── middleware/            # Custom middleware (DeviceInfo)
│   │   ├── pipes/                 # Validation pipes
│   │   └── utils/                 # Utility functions
│   │
│   ├── config/                    # Configuration files
│   │   ├── app.config.ts          # Application config (port, CORS)
│   │   ├── database.config.ts     # Database connection config
│   │   └── jwt.config.ts          # JWT configuration
│   │
│   ├── database/                  # Database layer
│   │   ├── entities/              # TypeORM entities (19 entities)
│   │   └── sql/                   # SQL schema files
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/                  # Authentication module
│   │   ├── notifications/         # Push notifications module
│   │   └── payments/              # Payment processing module
│   │
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Application entry point
│
├── scripts/                       # Deployment & setup scripts
│   ├── deploy-now.sh              # Complete EC2 deployment
│   ├── setup-mysql-ec2.sh         # MySQL setup on EC2
│   ├── update-env-db.sh           # Update .env with DB credentials
│   ├── restart-and-verify.sh      # Restart PM2 and verify app
│   └── setup-database-complete.sh # Complete database setup
│
├── test/                          # Test files
└── package.json                   # Dependencies and scripts
```

---

## 🔧 Modules & Functions

### 1. Authentication Module (`src/modules/auth/`)

**Controller:** `AuthController`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/auth/register` | POST | Register new pharmacy tenant | No |
| `/api/v1/auth/login` | POST | Login user | No |
| `/api/v1/auth/refresh` | POST | Refresh access token | No |
| `/api/v1/auth/switch-store` | POST | Switch current store | Yes |
| `/api/v1/auth/stores` | GET | Get user assigned stores | Yes |

**Service:** `AuthService`

**Functions:**
- `login(loginDto: LoginDto): Promise<AuthResponseDto>` - Authenticate user
- `registerPharmacy(registerDto: RegisterPharmacyDto): Promise<AuthResponseDto>` - Register pharmacy and admin user
- `validateUser(userId: string): Promise<User>` - Validate user by ID
- `validateUserCredentials(email: string, password: string): Promise<User>` - Validate credentials
- `generateAuthResponse(user: User): Promise<AuthResponseDto>` - Generate JWT tokens
- `refreshToken(refreshToken: string): Promise<{ accessToken: string }>` - Refresh access token
- `switchStore(userId: string, storeId: string): Promise<User>` - Switch user's current store
- `getUserStores(userId: string): Promise<Store[]>` - Get stores assigned to user
- `assignStoreToUser(userId: string, storeId: string, isDefault: boolean): Promise<UserStore>` - Assign store to user
- `handleGoogleAuth(googleUser: any): Promise<AuthResponseDto>` - Handle Google OAuth

**Strategies:**
- `JwtStrategy` - JWT token validation
- `LocalStrategy` - Email/password authentication
- `GoogleStrategy` - Google OAuth (optional)

---

### 2. Payments Module (`src/modules/payments/`)

**Controller:** `PaymentController`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/payments/stripe/create-intent` | POST | Create Stripe payment intent | Yes |
| `/api/v1/payments/stripe/webhook` | POST | Handle Stripe webhooks | No |
| `/api/v1/payments/payfast/generate-url` | POST | Generate PayFast payment URL | Yes |
| `/api/v1/payments/payfast/notify` | POST | Handle PayFast ITN notifications | No |

**Services:**

#### StripeService

**Functions:**
- `createPaymentIntent(amount: number, currency?: string, metadata?: Record<string, string>): Promise<PaymentIntent>` - Create payment intent
- `createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<Customer>` - Create Stripe customer
- `retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent>` - Retrieve payment intent
- `refundPayment(paymentIntentId: string, amount?: number): Promise<Refund>` - Process refund
- `verifyWebhookSignature(payload: string | Buffer, signature: string): Event` - Verify webhook signature
- `isInitialized(): boolean` - Check if Stripe is configured

#### PayFastService

**Functions:**
- `generatePaymentUrl(params: PaymentParams): string` - Generate PayFast payment URL
- `verifyITN(data: Record<string, string>): boolean` - Verify ITN notification
- `isInitialized(): boolean` - Check if PayFast is configured

---

### 3. Notifications Module (`src/modules/notifications/`)

**Controller:** `NotificationController`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/v1/notifications` | GET | Get user notifications | Yes |
| `/api/v1/notifications/:id/read` | PATCH | Mark notification as read | Yes |
| `/api/v1/notifications/mark-all-read` | POST | Mark all as read | Yes |
| `/api/v1/notifications/register-token` | POST | Register FCM token | Yes |

**Services:**

#### NotificationService

**Functions:**
- `create(data: CreateNotificationDto): Promise<Notification>` - Create notification
- `getUserNotifications(userId: string, limit?: number, offset?: number): Promise<Notification[]>` - Get user notifications
- `markAsRead(id: string, userId: string): Promise<Notification>` - Mark notification as read
- `markAllAsRead(userId: string): Promise<void>` - Mark all notifications as read
- `sendPushNotification(token: string, title: string, body: string, data?: any): Promise<void>` - Send push notification

#### FirebaseService

**Functions:**
- `sendNotification(token: string, notification: NotificationPayload): Promise<void>` - Send FCM notification
- `sendToMultiple(tokens: string[], notification: NotificationPayload): Promise<void>` - Send to multiple devices

---

## 🛠️ Available Commands

### Development

```bash
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start with debugging enabled
npm run build          # Build for production
npm run start:prod     # Start production server
npm run lint           # Run ESLint and fix issues
npm run format         # Format code with Prettier
```

### Testing

```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

### Database

```bash
npm run db:create      # Create database (from .env)
npm run db:drop        # Drop database (from .env)
npm run migration:generate # Generate migration
npm run migration:run  # Run migrations
npm run migration:revert   # Revert last migration
```

### Utilities

```bash
npm run setup          # Install dependencies and create database
npm run clean          # Clean dist and cache
npm run logs           # View application logs
```

### Deployment Scripts

```bash
# EC2 deployment (includes MySQL setup)
./scripts/deploy-now.sh EC2_IP KEY_FILE_PATH

# MySQL setup on EC2
./scripts/setup-mysql-ec2.sh

# Update .env with database credentials
./scripts/update-env-db.sh

# Restart PM2 and verify
./scripts/restart-and-verify.sh

# Complete database setup
./scripts/setup-database-complete.sh
```

---

## 🗄️ Database

### Quick Setup

```bash
# Create database and tables
./scripts/setup-database-complete.sh

# Or manually
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

### Database Tables (19 Total)

**Core:**
- `tenants` - Multi-tenant organizations
- `stores` - Store locations
- `users` - User accounts
- `user_stores` - User-store assignments

**Products:**
- `categories` - Product categories
- `products` - Product catalog
- `inventory_batches` - Inventory tracking

**Customers:**
- `customers` - Customer records
- `customer_addresses` - Customer addresses
- `customer_wallets` - Wallet balances
- `wallet_transactions` - Wallet transactions

**Sales:**
- `sales` - Sales transactions
- `sale_items` - Sale line items

**Purchases:**
- `suppliers` - Supplier information
- `purchases` - Purchase orders
- `purchase_items` - Purchase line items

**System:**
- `notifications` - System notifications
- `payment_methods` - Payment configurations
- `subscriptions` - Tenant subscriptions

### Configuration (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false  # Never true in production!
DB_LOGGING=false      # Set false in production
```

See [DATABASE.md](./DATABASE.md) for complete database documentation.

---

## 📖 API Documentation

Interactive Swagger documentation is available at:

- **Local:** http://localhost:3000/api/docs
- **Production:** https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

### Base URL

- **Local:** `http://localhost:3000/api/v1`
- **Production:** `https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/v1`

See [API_GUIDE.md](./API_GUIDE.md) for detailed API usage examples.

---

## 🔐 Authentication

### Register Pharmacy

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "pharmacyName": "My Pharmacy",
  "email": "admin@pharmacy.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tenantId": "uuid"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@pharmacy.com",
  "password": "Password123!"
}
```

### Use JWT Token

```bash
GET /api/v1/auth/stores
Authorization: Bearer <access-token>
```

### Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh-token>"
}
```

**Important:** You must register before you can login!

---

## 🚀 Deployment

### EC2 Deployment (Automated)

```bash
# Complete deployment (installs Node.js, MySQL, PM2, configures DB)
./scripts/deploy-now.sh YOUR_EC2_IP ~/path/to/key.pem
```

This script automatically:
1. ✅ Installs Node.js 18.x
2. ✅ Installs MySQL and creates database
3. ✅ Creates `pharmacy_pos` database and `pharmacy_user`
4. ✅ Applies database schema (all 19 tables)
5. ✅ Updates `.env` with database credentials
6. ✅ Installs dependencies and builds project
7. ✅ Configures PM2 and starts application
8. ✅ Verifies everything works

### Manual EC2 Setup

```bash
# SSH into EC2
ssh -i ~/key.pem ubuntu@YOUR_EC2_IP

# Install MySQL and create database
cd ~/pharmacy_pos_backend
bash scripts/setup-mysql-ec2.sh

# Update .env with credentials
bash scripts/update-env-db.sh

# Restart and verify
bash scripts/restart-and-verify.sh
```

See [AWS_EC2_SETUP_GUIDE.md](./AWS_EC2_SETUP_GUIDE.md) for detailed EC2 setup instructions.

---

## 🔄 Development Workflow

### Branch Structure

- **`main`** - Production branch (auto-deploys)
- **`develop`** - Development/testing branch
- **`working`** - Daily development branch

### Workflow

```bash
# 1. Create feature branch from working
git checkout working
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to working
git checkout working
git merge feature/my-feature
git push origin working

# 4. Test in develop
git checkout develop
git merge working
git push origin develop

# 5. Deploy to production
git checkout main
git merge develop
git push origin main  # Auto-deploys!
```

See [WORKFLOW.md](./WORKFLOW.md) for complete workflow documentation.

---

## 🛠️ Tech Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** MySQL 8.0+
- **ORM:** TypeORM 0.3.x
- **Authentication:** JWT, Passport
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer
- **Payments:** Stripe, PayFast
- **Notifications:** Firebase Cloud Messaging
- **Process Manager:** PM2
- **Security:** Helmet, CORS, Rate Limiting

---

## 📚 Additional Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed code structure and patterns
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete developer guide
- **[DATABASE.md](./DATABASE.md)** - Database setup and schema
- **[API_GUIDE.md](./API_GUIDE.md)** - API testing and examples
- **[AWS_EC2_SETUP_GUIDE.md](./AWS_EC2_SETUP_GUIDE.md)** - EC2 deployment guide
- **[WORKFLOW.md](./WORKFLOW.md)** - Git workflow and branching strategy

---

## 📝 License

**Proprietary License** - View only. No download, modification, or distribution without permission.

See [LICENSE](./LICENSE) for details.

---

## 🆘 Troubleshooting

### MySQL Connection Error
- Check MySQL is running: `brew services list | grep mysql` (macOS)
- Verify credentials in `.env`
- Test connection: `mysql -u root -p`

### Application Won't Start
- Check logs: `npm run start:dev`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check `.env` file exists and has correct values

### PM2 Issues on EC2
- Check status: `pm2 status`
- View logs: `pm2 logs pharmacy-api`
- Restart: `pm2 restart pharmacy-api`

---

**Need Help?** Check the detailed guides above or open an issue on GitHub.