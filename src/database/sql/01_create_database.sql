-- ============================================
-- Create Database Script
-- ============================================
-- Run this script first to create the database
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS pharmacy_pos 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Select Database
USE pharmacy_pos;

-- Show confirmation
SELECT 'Database pharmacy_pos created successfully!' AS message;
