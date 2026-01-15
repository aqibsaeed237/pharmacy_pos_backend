# 🗄️ Database Guide

## Quick Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Create all tables
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

**Or use script:**
```bash
./scripts/setup-database-complete.sh
```

---

## 📁 Database Files

### SQL Files Location
`src/database/sql/`

- **`schema.sql`** - Complete database schema (all 19 tables)
- **`01_create_database.sql`** - Create database only
- **`README.md`** - SQL files documentation

### Entities Location
`src/database/entities/`

All TypeORM entities for database tables.

---

## 📊 Database Structure

### Tables (19 Total)

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

---

## 🔧 Database Configuration

### Connection Settings (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=          # Leave empty if no password
DB_DATABASE=pharmacy_pos
DB_SYNCHRONIZE=false  # Set to true only in development
DB_LOGGING=true       # Set to false in production
```

### Connection File
`src/config/database.config.ts`

---

## 🛠️ Database Commands

### Create Database
```bash
npm run db:create
# OR
mysql -u root -p < src/database/sql/01_create_database.sql
```

### Create Tables
```bash
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

### Verify Tables
```bash
mysql -u root -p pharmacy_pos -e "SHOW TABLES;"
mysql -u root -p pharmacy_pos -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'pharmacy_pos';"
```

### Backup Database
```bash
mysqldump -u root -p pharmacy_pos > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u root -p pharmacy_pos < backup_20260115.sql
```

---

## 🔍 Database Features

- ✅ **Multi-tenant** - All tables support tenant isolation
- ✅ **UUID Primary Keys** - CHAR(36) for all IDs
- ✅ **Foreign Keys** - Proper referential integrity
- ✅ **Indexes** - Optimized for queries
- ✅ **Timestamps** - Automatic createdAt/updatedAt
- ✅ **UTF8MB4** - Full Unicode support

---

## 📝 SQL Schema File

Complete schema: `src/database/sql/schema.sql`

**Contains:**
- All 19 table definitions
- All indexes
- All foreign keys
- Proper data types
- Default values

**Run it:**
```bash
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

---

## 🆘 Troubleshooting

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

### Connection Error
- Check MySQL is running: `brew services list | grep mysql`
- Verify credentials in `.env`
- Test connection: `mysql -u root -p`

---

## 🚀 Next Steps

### ✅ Database Setup Complete

Your database is ready with:
- ✅ Database `pharmacy_pos` created
- ✅ 19 tables created
- ✅ All indexes and foreign keys configured
- ✅ Multi-tenant support enabled

### 📝 What's Next?

1. **Add Data**
   - Register pharmacies (creates tenants)
   - Create stores
   - Add products, categories
   - Create customers

2. **Backup Strategy**
   - Setup automated backups
   - Test restore process
   - See backup script in deployment guide

3. **Production Database**
   - Use managed database (Railway, Heroku, AWS RDS)
   - Setup replication for high availability
   - Configure monitoring

4. **Add New Tables**
   - Create entity in `src/database/entities/`
   - Add SQL to `schema.sql`
   - Run migration or apply SQL
   - See [DEVELOPMENT.md](./DEVELOPMENT.md)

### 📚 Related Guides

- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production database setup
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - How to add new entities

---

**All database files are in `src/database/sql/`** 📁
