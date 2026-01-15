# Database SQL Files

This directory contains SQL scripts for database setup and management.

## Files

### 1. `schema.sql`
Complete database schema with all tables, indexes, and foreign keys.
**Run this to create the entire database structure.**

### 2. `01_create_database.sql`
Creates the database only.

### 3. `02_create_tables.sql`
Placeholder - points to schema.sql

## How to Use

### Option 1: Run Complete Schema (Recommended)

```bash
# Method 1: Using MySQL command line
mysql -u root -p < src/database/sql/schema.sql

# Method 2: Login first, then source
mysql -u root -p
source src/database/sql/schema.sql
```

### Option 2: Step by Step

```bash
# Step 1: Create database
mysql -u root -p < src/database/sql/01_create_database.sql

# Step 2: Create tables
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

### Option 3: Using npm script

```bash
# Create database
npm run db:create

# Then run schema
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql
```

## Database Structure

The schema includes:

- **tenants** - Multi-tenant support
- **stores** - Store management
- **users** - User accounts
- **user_stores** - User-store relationships
- **categories** - Product categories
- **products** - Product catalog
- **inventory_batches** - Inventory tracking
- **customers** - Customer management
- **customer_addresses** - Customer addresses
- **customer_wallets** - Customer wallet system
- **wallet_transactions** - Wallet transactions
- **sales** - Sales/POS transactions
- **sale_items** - Sale line items
- **suppliers** - Supplier management
- **purchases** - Purchase orders
- **purchase_items** - Purchase line items
- **notifications** - System notifications
- **payment_methods** - Payment method configuration
- **subscriptions** - Tenant subscriptions

## Notes

- All tables use `CHAR(36)` for UUID primary keys
- All tables have `createdAt` and `updatedAt` timestamps
- Foreign keys are properly indexed
- Multi-tenant isolation via `tenantId` on all relevant tables
- Character set: `utf8mb4` for full Unicode support

## Verification

After running the schema, verify tables were created:

```sql
USE pharmacy_pos;
SHOW TABLES;
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'pharmacy_pos';
```

Expected: 18 tables
