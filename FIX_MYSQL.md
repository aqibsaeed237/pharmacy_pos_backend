# 🔧 Fix MySQL Database Corruption

## ⚠️ Issue
MySQL database is crashing due to corrupted data files.

## ✅ Solution: Reset MySQL Database

### Option 1: Delete and Recreate MySQL Service (Recommended)

1. **Go to Railway Dashboard:**
   https://railway.com/project/ccbc5797-f24c-45dc-8505-700d19e32896

2. **Click on MySQL service** (`mysql-production-d55e`)

3. **Go to Settings tab**

4. **Click "Delete Service"** (this will delete the corrupted MySQL)

5. **Add new MySQL:**
   - Click "+ New" button
   - Select "Database" → "MySQL"
   - This creates a fresh MySQL instance

6. **Update environment variables:**
   ```bash
   railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
   railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
   railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
   railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
   railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
   ```

### Option 2: Reset MySQL Volume (Keep Service)

1. **Go to MySQL service** in Railway dashboard
2. **Settings** → **Volumes**
3. **Delete the volume** (this will reset the database)
4. **Restart the service**

---

**After fixing MySQL, setup the database schema:**
```bash
railway connect mysql
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_pos;
SOURCE src/database/sql/schema.sql;
```
