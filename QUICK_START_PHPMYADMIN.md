# 🚀 Quick Start: phpMyAdmin

## ✅ Installation Complete!

phpMyAdmin is now installed and ready to use.

---

## 🌐 Access phpMyAdmin

**URL:** http://localhost:8080

**Login:**
- Username: `root`
- Password: (leave empty or your MySQL password)

---

## 🚀 Start phpMyAdmin

### Option 1: Using Start Script (Easiest)

```bash
~/phpmyadmin/start-phpmyadmin.sh
```

### Option 2: Manual Start

```bash
cd ~/phpmyadmin/phpmyadmin
php -S localhost:8080
```

### Option 3: Background Process

```bash
cd ~/phpmyadmin/phpmyadmin
php -S localhost:8080 > /dev/null 2>&1 &
```

---

## 🛑 Stop phpMyAdmin

```bash
pkill -f 'php -S localhost:8080'
```

---

## 📝 Setup Your Database

### Step 1: Create Database

1. Open http://localhost:8080
2. Click **"New"** in left sidebar
3. Enter database name: `pharmacy_pos`
4. Select collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

### Step 2: Import Schema

1. Select `pharmacy_pos` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select: `src/database/sql/schema.sql`
5. Click **"Go"**

### Step 3: Verify

You should see 19 tables created:
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

---

## 🔧 Troubleshooting

### Can't Access http://localhost:8080

**Check if phpMyAdmin is running:**
```bash
lsof -ti:8080
```

**If not running, start it:**
```bash
~/phpmyadmin/start-phpmyadmin.sh
```

### Port 8080 Already in Use

**Use different port:**
```bash
cd ~/phpmyadmin/phpmyadmin
php -S localhost:8081
```

Then access: http://localhost:8081

### Can't Login

**Check MySQL is running:**
```bash
brew services list | grep mysql
```

**Start MySQL if needed:**
```bash
brew services start mysql
```

---

## 📚 More Information

See [PHPMYADMIN_GUIDE.md](./PHPMYADMIN_GUIDE.md) for complete guide.

---

**phpMyAdmin is ready! 🎉**
