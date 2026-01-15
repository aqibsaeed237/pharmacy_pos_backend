# 👨‍💻 Developer Guide - Pharmacy POS Backend

Complete guide for developers working on this project.

---

## 📋 Table of Contents

1. [What is This?](#what-is-this)
2. [Architecture](#architecture)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)
8. [Available Commands](#available-commands)
9. [Adding New Features](#adding-new-features)
10. [Deployment & Redeployment](#deployment--redeployment)
11. [API Documentation](#api-documentation)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 What is This?

**Pharmacy POS Backend** is a production-ready, multi-tenant NestJS backend for Pharmacy Point of Sale (POS) system.

### Purpose

- **Multi-tenant Architecture**: Support multiple pharmacies in a single system
- **Complete POS System**: Products, Inventory, Sales, Purchases, Customers
- **Authentication & Authorization**: JWT-based with role-based access control
- **Payment Integration**: Stripe and PayFast ready
- **Push Notifications**: Firebase FCM integration
- **API Documentation**: Swagger/OpenAPI

### Key Features

- ✅ Multi-tenant support (multiple pharmacies)
- ✅ JWT Authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ MySQL Database with 19 tables
- ✅ Swagger API Documentation
- ✅ Request/Response logging
- ✅ Error handling & validation
- ✅ Rate limiting & security
- ✅ Payment gateways (Stripe, PayFast)
- ✅ Push notifications (Firebase)

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (React/Vue/Angular)          │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST API
┌───────────────────▼─────────────────────────────┐
│         NestJS Backend (This Project)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │ Products │  │  Sales   │     │
│  │  Module  │  │  Module  │  │  Module  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Inventory │  │Customers │  │ Payments │     │
│  │  Module  │  │  Module  │  │  Module  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────┐      ┌─────────▼────────┐
│   MySQL DB   │      │  External APIs   │
│  (19 tables) │      │ Stripe, Firebase │
└──────────────┘      └──────────────────┘
```

### Multi-Tenant Architecture

- **Tenant Isolation**: Each pharmacy is a separate tenant
- **Data Segregation**: All data is tenant-scoped
- **User Management**: Users belong to tenants and can access multiple stores

### Module Structure

```
src/
├── modules/          # Feature modules
│   ├── auth/         # Authentication & Authorization
│   ├── notifications/ # Push notifications
│   └── payments/     # Payment processing
├── common/           # Shared utilities
│   ├── decorators/   # Custom decorators
│   ├── guards/       # Auth guards
│   ├── filters/      # Exception filters
│   ├── interceptors/ # Request/response interceptors
│   └── pipes/        # Validation pipes
├── config/           # Configuration files
├── database/         # Database entities & migrations
└── main.ts           # Application entry point
```

---

## 📦 Tech Stack & Dependencies

### Core Framework

- **NestJS** (v11.0.1) - Progressive Node.js framework
- **TypeScript** (v5.7.3) - Typed JavaScript
- **Node.js** (v20+) - Runtime environment

### Database

- **MySQL** (v8.0+) - Relational database
- **TypeORM** (v0.3.28) - ORM for TypeScript
- **mysql2** (v3.16.0) - MySQL driver

### Authentication & Security

- **@nestjs/jwt** (v11.0.2) - JWT implementation
- **@nestjs/passport** (v11.0.5) - Authentication middleware
- **passport-jwt** (v4.0.1) - JWT strategy
- **passport-local** (v1.0.0) - Local strategy
- **bcryptjs** (v3.0.3) - Password hashing
- **helmet** (v8.1.0) - Security headers
- **@nestjs/throttler** (v6.5.0) - Rate limiting

### API Documentation

- **@nestjs/swagger** (v11.2.5) - OpenAPI/Swagger integration

### Validation & Transformation

- **class-validator** (v0.14.3) - DTO validation
- **class-transformer** (v0.5.1) - Object transformation

### Additional Features

- **@nestjs/schedule** (v6.1.0) - Scheduled tasks
- **@nestjs/cache-manager** (v3.1.0) - Caching
- **compression** (v1.8.1) - Response compression
- **firebase-admin** (v13.6.0) - Firebase integration
- **stripe** (v20.1.2) - Stripe payments
- **uuid** (v13.0.0) - UUID generation

### Development Tools

- **@nestjs/cli** (v11.0.0) - NestJS CLI
- **eslint** (v9.18.0) - Linting
- **prettier** (v3.4.2) - Code formatting
- **jest** (v30.0.0) - Testing framework
- **typescript** (v5.7.3) - TypeScript compiler

---

## 🚀 Installation

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher
- **MySQL** v8.0 or higher
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/aqibsaeed237/pharmacy_pos_backend.git
cd pharmacy_pos_backend
```

### Step 2: Install MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Step 3: Create Database

```bash
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 6: Create Database Tables

```bash
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

### Step 7: Generate JWT Secrets

```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

Add these to your `.env` file.

---

## ⚙️ Configuration

### Environment Variables

See `.env.example` for all available environment variables.

**Required:**
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `JWT_REFRESH_SECRET` - Refresh token secret (min 32 chars)

**Optional:**
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origins
- Firebase, Stripe, PayFast credentials (if using)

### Configuration Files

- `src/config/app.config.ts` - Application configuration
- `src/config/database.config.ts` - Database configuration
- `src/config/jwt.config.ts` - JWT configuration

---

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

- Runs on: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Auto-reloads on file changes

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

### Check Application

- **API Base**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health (if implemented)

---

## 📁 Project Structure

```
pharmacy_pos_backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators (@CurrentUser, @Roles, etc.)
│   │   ├── guards/         # Auth guards (JwtAuthGuard, RolesGuard)
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Request/response interceptors
│   │   ├── pipes/          # Validation pipes
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── database/
│   │   ├── entities/       # TypeORM entities (19 tables)
│   │   └── sql/            # SQL schema files
│   ├── modules/            # Feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── notifications/ # Notifications module
│   │   └── payments/      # Payments module
│   └── main.ts            # Application entry point
├── test/                   # E2E tests
├── .github/workflows/     # GitHub Actions workflows
├── .ebextensions/         # AWS Elastic Beanstalk config
├── .env.example          # Environment variables template
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🛠️ Available Commands

### Development

```bash
npm run start:dev        # Start development server with watch mode
npm run start:debug      # Start with debugger
npm run build            # Build for production
npm run start:prod       # Start production server
```

### Database

```bash
npm run db:create        # Create database
npm run db:drop          # Drop database
npm run migration:generate # Generate migration
npm run migration:run    # Run migrations
npm run migration:revert # Revert last migration
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run test:e2e         # Run E2E tests
```

### Utilities

```bash
npm run logs             # View application logs
npm run clean            # Clean build artifacts
npm run setup            # Install deps + create database
```

---

## ➕ Adding New Features

### Step 1: Create Module Structure

```bash
# Create module directory
mkdir -p src/modules/your-module/{controllers,services,dto}
```

### Step 2: Create Module Files

**Module File** (`src/modules/your-module/your-module.module.ts`):
```typescript
import { Module } from '@nestjs/common';
import { YourModuleController } from './controllers/your-module.controller';
import { YourModuleService } from './services/your-module.service';

@Module({
  controllers: [YourModuleController],
  providers: [YourModuleService],
  exports: [YourModuleService],
})
export class YourModule {}
```

**Controller** (`src/modules/your-module/controllers/your-module.controller.ts`):
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { YourModuleService } from '../services/your-module.service';

@Controller('your-module')
export class YourModuleController {
  constructor(private readonly service: YourModuleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

**Service** (`src/modules/your-module/services/your-module.service.ts`):
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class YourModuleService {
  findAll() {
    return { message: 'Hello from your module' };
  }
}
```

### Step 3: Register Module

Add to `src/app.module.ts`:
```typescript
import { YourModule } from './modules/your-module/your-module.module';

@Module({
  imports: [
    // ... other modules
    YourModule,
  ],
})
```

### Step 4: Add Database Entity (if needed)

Create entity in `src/database/entities/your-entity.entity.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('your_table')
export class YourEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
```

### Step 5: Add to Swagger (Optional)

In your controller:
```typescript
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Your Module')
@Controller('your-module')
export class YourModuleController {
  @ApiOperation({ summary: 'Get all items' })
  @Get()
  findAll() {
    // ...
  }
}
```

---

## 🚀 Deployment & Redeployment

### Production URLs

**Live API:**
- **Base URL**: https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/v1
- **Swagger Docs**: https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

### Automatic Deployment

**Push to `main` branch** → Auto-deploys to production
**Push to `develop` branch** → Auto-deploys to development

```bash
git add .
git commit -m "Your changes"
git push origin main  # or develop
```

### Manual Deployment

```bash
# Build application
npm run build

# Deploy using script
./deploy-aws.sh pharmacy-pos-backend-prod

# Or using EB CLI
eb deploy pharmacy-pos-backend-prod
```

### Set Environment Variables in AWS

```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=your-secret \
  DB_HOST=your-db-host \
  DB_PASSWORD=your-password
```

Or via AWS Console:
1. Elastic Beanstalk → Your environment
2. Configuration → Software → Environment properties
3. Add/update variables

### Redeploy After Changes

1. **Make changes** locally
2. **Test** with `npm run start:dev`
3. **Commit** changes
4. **Push** to GitHub
5. **GitHub Actions** automatically deploys

---

## 📚 API Documentation

### Swagger UI

**Local:** http://localhost:3000/api/docs
**Production:** https://pharmacy-pos-backend-prod.eba-wdg27kyw.us-east-1.elasticbeanstalk.com/api/docs

### API Endpoints

**Base Path:** `/api/v1`

**Authentication:**
- `POST /api/v1/auth/register` - Register pharmacy
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

**Protected Endpoints:**
- Require `Authorization: Bearer <token>` header
- Token obtained from login/register

### Testing APIs

1. **Use Swagger UI** (recommended)
2. **Use Postman/Insomnia**
3. **Use curl:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharmacy.com","password":"Password123!"}'
```

---

## 🧪 Testing

### Run Tests

```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:cov       # With coverage
npm run test:e2e       # E2E tests
```

### Test Structure

```
src/
├── modules/
│   └── auth/
│       └── services/
│           └── auth.service.spec.ts  # Unit tests
test/
└── app.e2e-spec.ts                   # E2E tests
```

---

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check MySQL is running
brew services list | grep mysql  # macOS
sudo systemctl status mysql     # Linux

# Test connection
mysql -u root -p

# Verify credentials in .env
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change PORT in .env
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Additional Resources

- **[README.md](./README.md)** - Project overview
- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[API_GUIDE.md](./API_GUIDE.md)** - API usage guide
- **[DATABASE.md](./DATABASE.md)** - Database documentation
- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - AWS deployment guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed structure

---

## ✅ Quick Reference

### Start Development
```bash
npm install
cp .env.example .env
# Edit .env
npm run db:create
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
npm run start:dev
```

### Deploy Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions auto-deploys
```

### Check Logs
```bash
npm run logs              # Local
eb logs                   # AWS (if configured)
```

---

**Happy Coding! 🚀**
