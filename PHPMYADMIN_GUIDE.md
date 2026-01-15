# 🗄️ phpMyAdmin Setup Guide

## What is phpMyAdmin?

phpMyAdmin is a web-based tool to manage MySQL databases through a user-friendly interface. Perfect for viewing, editing, and managing your database without using command line.

---

## 📦 Installation

### macOS (Using Homebrew)

```bash
# Install phpMyAdmin
brew install phpmyadmin

# Start PHP (if not running)
brew services start php

# Or use MAMP/XAMPP (includes phpMyAdmin)
```

### macOS (Using MAMP - Easiest) ⭐ Recommended

1. **Download MAMP:**
   - Go to https://www.mamp.info/en/downloads/
   - Download MAMP (free version)
   - Install the application

2. **Start MAMP:**
   - Open MAMP application
   - Click "Start Servers"
   - Apache and MySQL will start

3. **Access phpMyAdmin:**
   - Click "Open WebStart page"
   - Or go to: http://localhost:8888/phpMyAdmin
   - Or go to: http://localhost/MAMP/phpMyAdmin

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install phpmyadmin php-mbstring php-zip php-gd php-json php-curl

# During installation:
# - Select Apache2
# - Set password for phpmyadmin user
# - Choose "Yes" to configure database
```

### Windows

**Option 1: XAMPP (Easiest)**
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL from XAMPP Control Panel
4. Access: http://localhost/phpmyadmin

**Option 2: WAMP**
1. Download WAMP: https://www.wampserver.com/
2. Install and start services
3. Access: http://localhost/phpmyadmin

---

## 🚀 Quick Setup

### Step 1: Start MySQL

**macOS (Homebrew):**
```bash
brew services start mysql
```

**macOS (MAMP):**
- Open MAMP
- Click "Start Servers"

**Linux:**
```bash
sudo systemctl start mysql
```

**Windows (XAMPP/WAMP):**
- Start MySQL from control panel

### Step 2: Access phpMyAdmin

**MAMP:**
- http://localhost:8888/phpMyAdmin
- Or: http://localhost/MAMP/phpMyAdmin

**XAMPP:**
- http://localhost/phpmyadmin

**Linux:**
- http://localhost/phpmyadmin

**Login Credentials:**
- Username: `root`
- Password: (leave empty if no password, or your MySQL root password)

### Step 3: Create Database

1. **Click "New" in left sidebar**
2. **Enter database name:** `pharmacy_pos`
3. **Select collation:** `utf8mb4_unicode_ci`
4. **Click "Create"**

### Step 4: Import SQL Schema

**Method 1: Import SQL File**

1. **Select database** `pharmacy_pos` from left sidebar
2. **Click "Import" tab** at the top
3. **Click "Choose File"**
4. **Select:** `src/database/sql/schema.sql`
5. **Click "Go"** at bottom
6. **Wait for import** (should show "Import has been successfully finished")

**Method 2: Copy & Paste SQL**

1. **Select database** `pharmacy_pos`
2. **Click "SQL" tab** at the top
3. **Open** `src/database/sql/schema.sql` in a text editor
4. **Copy all SQL code**
5. **Paste into SQL textarea**
6. **Click "Go"**

**Method 3: Run Individual SQL Files**

1. **Select database** `pharmacy_pos`
2. **Click "SQL" tab**
3. **Copy SQL from** `src/database/sql/01_create_database.sql` (if needed)
4. **Paste and click "Go"**
5. **Repeat for** `src/database/sql/schema.sql`

---

## ✅ Verify Setup

### Check Tables Created

1. **Click on** `pharmacy_pos` database in left sidebar
2. **You should see 19 tables:**
   - tenants
   - stores
   - users
   - user_stores
   - categories
   - products
   - customers
   - sales
   - sale_items
   - inventory_batches
   - suppliers
   - purchases
   - purchase_items
   - customer_addresses
   - customer_wallets
   - wallet_transactions
   - notifications
   - payment_methods
   - subscriptions

### Check Table Structure

1. **Click on any table** (e.g., `users`)
2. **Click "Structure" tab**
3. **Verify columns, indexes, foreign keys**

---

## 🛠️ Common Tasks

### View Data

1. **Select database** → **Select table**
2. **Click "Browse" tab**
3. **View all records**

### Add Data

1. **Select table**
2. **Click "Insert" tab**
3. **Fill in form fields**
4. **Click "Go"**

### Edit Data

1. **Select table** → **Browse**
2. **Click "Edit" icon** (pencil) next to row
3. **Modify values**
4. **Click "Go"**

### Delete Data

1. **Select table** → **Browse**
2. **Check boxes** next to rows to delete
3. **Click "Delete"** button
4. **Confirm deletion**

### Run SQL Queries

1. **Select database**
2. **Click "SQL" tab**
3. **Enter SQL query:**
   ```sql
   SELECT * FROM users WHERE email = 'admin@pharmacy.com';
   ```
4. **Click "Go"**

### Export Database

1. **Select database** `pharmacy_pos`
2. **Click "Export" tab**
3. **Choose format:** SQL
4. **Click "Go"**
5. **Save backup file**

### Import Database Backup

1. **Select database**
2. **Click "Import" tab**
3. **Choose backup file**
4. **Click "Go"**

---

## 🔍 Useful SQL Queries

### View All Users

```sql
SELECT id, email, firstName, lastName, role, isActive, tenantId 
FROM users;
```

### View All Tenants

```sql
SELECT id, name, email, phoneNumber, isActive 
FROM tenants;
```

### Count Records

```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_tenants FROM tenants;
SELECT COUNT(*) as total_stores FROM stores;
```

### View Users with Tenant Info

```sql
SELECT 
  u.email, 
  u.firstName, 
  u.lastName,
  t.name as tenantName
FROM users u
LEFT JOIN tenants t ON u.tenantId = t.id;
```

### Check Table Sizes

```sql
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'pharmacy_pos'
ORDER BY (data_length + index_length) DESC;
```

---

## 🆘 Troubleshooting

### Can't Access phpMyAdmin

**MAMP:**
- Check MAMP is running
- Try: http://localhost:8888/phpMyAdmin
- Check Apache is started in MAMP

**XAMPP:**
- Check Apache is running
- Try: http://localhost/phpmyadmin
- Check port 80 is not in use

**Linux:**
```bash
# Check Apache is running
sudo systemctl status apache2

# Restart Apache
sudo systemctl restart apache2
```

### Can't Login to phpMyAdmin

**Error: "Access denied for user 'root'@'localhost'"**

**Solution:**
1. **Reset MySQL root password:**
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   FLUSH PRIVILEGES;
   EXIT;
   ```

2. **Or create new user:**
   ```bash
   mysql -u root
   CREATE USER 'phpmyadmin'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Import Fails

**Error: "SQL syntax error"**

**Solutions:**
1. **Check file encoding** (should be UTF-8)
2. **Increase upload size limit:**
   - Edit php.ini: `upload_max_filesize = 50M`
   - Edit php.ini: `post_max_size = 50M`
   - Restart Apache

3. **Import in smaller chunks:**
   - Split large SQL file
   - Import tables one by one

### Tables Not Showing

1. **Refresh page** (F5)
2. **Check you selected correct database**
3. **Verify import completed successfully**
4. **Check for errors in import log**

---

## 🔐 Security Tips

### Change Default Settings

1. **Rename phpMyAdmin folder** (if using standalone)
2. **Use strong password** for MySQL root
3. **Limit access** to localhost only
4. **Use HTTPS** in production

### Create Database User (Recommended)

Instead of using root, create dedicated user:

```sql
-- In phpMyAdmin SQL tab
CREATE USER 'pharmacy_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON pharmacy_pos.* TO 'pharmacy_user'@'localhost';
FLUSH PRIVILEGES;
```

Then login to phpMyAdmin with:
- Username: `pharmacy_user`
- Password: `strong_password`

---

## 📱 Alternative: MySQL Workbench

If you prefer a desktop app instead of web interface:

**Download:** https://www.mysql.com/products/workbench/

**Features:**
- Visual database design
- SQL editor
- Data modeling
- Server administration

---

## 🎯 Quick Reference

| Task | Steps |
|------|-------|
| **Access phpMyAdmin** | http://localhost/phpmyadmin (or :8888 for MAMP) |
| **Create Database** | New → Enter name → Create |
| **Import SQL** | Select DB → Import → Choose file → Go |
| **View Data** | Select table → Browse |
| **Edit Data** | Select table → Browse → Edit icon |
| **Run SQL** | Select DB → SQL tab → Enter query → Go |
| **Export** | Select DB → Export → Go |
| **Backup** | Select DB → Export → Save file |

---

## ✅ Setup Complete!

Your database is now accessible through phpMyAdmin web interface.

**Next Steps:**
1. Import your schema: `src/database/sql/schema.sql`
2. Verify 19 tables are created
3. Start using the visual interface!

**Related Guides:**
- [DATABASE.md](./DATABASE.md) - Database setup
- [SETUP.md](./SETUP.md) - Complete setup guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Add new tables

---

**Need Help?** Check phpMyAdmin documentation or MySQL logs.
