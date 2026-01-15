-- ============================================
-- Pharmacy POS Backend - Complete Database Schema
-- ============================================
-- Database: pharmacy_pos
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- ============================================

-- Create Database (run this first)
CREATE DATABASE IF NOT EXISTS pharmacy_pos 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE pharmacy_pos;

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(50) NULL,
    address TEXT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    subscriptionExpiresAt DATE NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenants_email (email),
    INDEX idx_tenants_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stores (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NULL,
    phoneNumber VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    tenantId CHAR(36) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_stores_tenantId (tenantId),
    INDEX idx_stores_tenantId_name (tenantId, name),
    INDEX idx_stores_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'cashier', 'pharmacist') DEFAULT 'cashier',
    phoneNumber VARCHAR(50) NULL,
    avatarUrl VARCHAR(500) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    tenantId CHAR(36) NOT NULL,
    lastLoginAt TIMESTAMP NULL,
    lastLoginIp VARCHAR(45) NULL,
    currentStoreId CHAR(36) NULL,
    fcmToken TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (currentStoreId) REFERENCES stores(id) ON DELETE SET NULL,
    UNIQUE KEY uk_users_tenant_email (tenantId, email),
    INDEX idx_users_tenantId (tenantId),
    INDEX idx_users_email (email),
    INDEX idx_users_isActive (isActive),
    INDEX idx_users_currentStoreId (currentStoreId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER_STORES TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS user_stores (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    storeId CHAR(36) NOT NULL,
    isDefault BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_stores (userId, storeId),
    INDEX idx_user_stores_userId (userId),
    INDEX idx_user_stores_storeId (storeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    imageUrl VARCHAR(500) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    parentId CHAR(36) NULL,
    tenantId CHAR(36) NOT NULL,
    note TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY uk_categories_tenant_name (tenantId, name),
    INDEX idx_categories_tenantId (tenantId),
    INDEX idx_categories_parentId (parentId),
    INDEX idx_categories_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    barcode VARCHAR(100) NULL,
    sku VARCHAR(100) NULL,
    price DECIMAL(10, 2) NOT NULL,
    costPrice DECIMAL(10, 2) NULL,
    categoryId CHAR(36) NULL,
    imageUrl VARCHAR(500) NULL,
    tenantId CHAR(36) NOT NULL,
    storeId CHAR(36) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    isAddonItem BOOLEAN DEFAULT FALSE,
    availability VARCHAR(50) NULL,
    sort INT NULL,
    allergyNotes TEXT NULL,
    ingredientIds TEXT NULL,
    percentageDiscount DECIMAL(5, 2) NULL,
    productSizes TEXT NULL,
    deliveryRateId CHAR(36) NULL,
    riderId CHAR(36) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE SET NULL,
    INDEX idx_products_tenantId (tenantId),
    INDEX idx_products_storeId (storeId),
    INDEX idx_products_categoryId (categoryId),
    INDEX idx_products_barcode (barcode),
    INDEX idx_products_sku (sku),
    INDEX idx_products_tenant_barcode (tenantId, barcode),
    INDEX idx_products_tenant_sku (tenantId, sku),
    INDEX idx_products_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INVENTORY_BATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_batches (
    id CHAR(36) PRIMARY KEY,
    productId CHAR(36) NOT NULL,
    batchNumber VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    costPrice DECIMAL(10, 2) NULL,
    expiryDate DATE NULL,
    manufactureDate DATE NULL,
    tenantId CHAR(36) NOT NULL,
    storeId CHAR(36) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE SET NULL,
    INDEX idx_inventory_batches_productId (productId),
    INDEX idx_inventory_batches_tenantId (tenantId),
    INDEX idx_inventory_batches_storeId (storeId),
    INDEX idx_inventory_batches_expiryDate (expiryDate),
    INDEX idx_inventory_batches_batchNumber (batchNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id CHAR(36) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL,
    phoneNumber VARCHAR(50) NULL,
    dateOfBirth DATE NULL,
    gender ENUM('male', 'female', 'other') NULL,
    tenantId CHAR(36) NOT NULL,
    storeId CHAR(36) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE SET NULL,
    INDEX idx_customers_tenantId (tenantId),
    INDEX idx_customers_storeId (storeId),
    INDEX idx_customers_email (email),
    INDEX idx_customers_phoneNumber (phoneNumber),
    INDEX idx_customers_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CUSTOMER_ADDRESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id CHAR(36) PRIMARY KEY,
    customerId CHAR(36) NOT NULL,
    addressLine1 VARCHAR(255) NOT NULL,
    addressLine2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NULL,
    zipCode VARCHAR(20) NULL,
    country VARCHAR(100) DEFAULT 'USA',
    isDefault BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_addresses_customerId (customerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CUSTOMER_WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_wallets (
    id CHAR(36) PRIMARY KEY,
    customerId CHAR(36) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    tenantId CHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY uk_customer_wallets_customer (customerId),
    INDEX idx_customer_wallets_tenantId (tenantId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WALLET_TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id CHAR(36) PRIMARY KEY,
    walletId CHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    description VARCHAR(255) NULL,
    referenceId VARCHAR(100) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (walletId) REFERENCES customer_wallets(id) ON DELETE CASCADE,
    INDEX idx_wallet_transactions_walletId (walletId),
    INDEX idx_wallet_transactions_type (type),
    INDEX idx_wallet_transactions_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id CHAR(36) PRIMARY KEY,
    saleNumber VARCHAR(50) NOT NULL,
    customerId CHAR(36) NULL,
    storeId CHAR(36) NOT NULL,
    tenantId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    paidAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    changeAmount DECIMAL(10, 2) DEFAULT 0.00,
    paymentMethod ENUM('cash', 'card', 'wallet', 'stripe', 'payfast', 'other') DEFAULT 'cash',
    status ENUM('pending', 'completed', 'cancelled', 'refunded') DEFAULT 'completed',
    notes TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_sales_tenantId (tenantId),
    INDEX idx_sales_storeId (storeId),
    INDEX idx_sales_customerId (customerId),
    INDEX idx_sales_userId (userId),
    INDEX idx_sales_saleNumber (saleNumber),
    INDEX idx_sales_status (status),
    INDEX idx_sales_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SALE_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sale_items (
    id CHAR(36) PRIMARY KEY,
    saleId CHAR(36) NOT NULL,
    productId CHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unitPrice DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale_items_saleId (saleId),
    INDEX idx_sale_items_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SUPPLIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phoneNumber VARCHAR(50) NULL,
    address TEXT NULL,
    contactPerson VARCHAR(255) NULL,
    tenantId CHAR(36) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_suppliers_tenantId (tenantId),
    INDEX idx_suppliers_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
    id CHAR(36) PRIMARY KEY,
    purchaseNumber VARCHAR(50) NOT NULL,
    supplierId CHAR(36) NOT NULL,
    storeId CHAR(36) NOT NULL,
    tenantId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
    purchaseDate DATE NOT NULL,
    expectedDeliveryDate DATE NULL,
    notes TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_purchases_tenantId (tenantId),
    INDEX idx_purchases_storeId (storeId),
    INDEX idx_purchases_supplierId (supplierId),
    INDEX idx_purchases_userId (userId),
    INDEX idx_purchases_status (status),
    INDEX idx_purchases_purchaseDate (purchaseDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PURCHASE_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_items (
    id CHAR(36) PRIMARY KEY,
    purchaseId CHAR(36) NOT NULL,
    productId CHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unitCost DECIMAL(10, 2) NOT NULL,
    totalCost DECIMAL(10, 2) NOT NULL,
    receivedQuantity INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_purchase_items_purchaseId (purchaseId),
    INDEX idx_purchase_items_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NULL,
    tenantId CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('system', 'low_stock', 'expiry_alert', 'sale', 'purchase', 'payment', 'other') DEFAULT 'system',
    isRead BOOLEAN DEFAULT FALSE,
    readAt TIMESTAMP NULL,
    metadata JSON NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_notifications_userId (userId),
    INDEX idx_notifications_tenantId (tenantId),
    INDEX idx_notifications_tenant_createdAt (tenantId, createdAt),
    INDEX idx_notifications_isRead (isRead),
    INDEX idx_notifications_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAYMENT_METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('cash', 'card', 'wallet', 'stripe', 'payfast', 'other') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    tenantId CHAR(36) NOT NULL,
    storeId CHAR(36) NULL,
    config JSON NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE SET NULL,
    INDEX idx_payment_methods_tenantId (tenantId),
    INDEX idx_payment_methods_storeId (storeId),
    INDEX idx_payment_methods_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY,
    tenantId CHAR(36) NOT NULL,
    planName VARCHAR(100) NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'trial') DEFAULT 'trial',
    startDate DATE NOT NULL,
    endDate DATE NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paymentMethod VARCHAR(50) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_subscriptions_tenantId (tenantId),
    INDEX idx_subscriptions_status (status),
    INDEX idx_subscriptions_endDate (endDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- END OF SCHEMA
-- ============================================
