-- ============================================================
-- DATABASE SCHEMA: UMKM DECISION SUPPORT
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB (XAMPP / phpMyAdmin)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `umkm_decision_support` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `umkm_decision_support`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `nama_produk` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(100) DEFAULT NULL,
  `harga_modal` DECIMAL(12,2) NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `satuan` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tanggal` DATETIME NOT NULL,
  `total` DECIMAL(12,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TRANSACTION_ITEMS TABLE
CREATE TABLE IF NOT EXISTS `transaction_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  CONSTRAINT `fk_items_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `kategori` VARCHAR(100) NOT NULL,
  `nominal` DECIMAL(12,2) NOT NULL,
  `tanggal` DATE NOT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_expenses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TARGETS TABLE
CREATE TABLE IF NOT EXISTS `targets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `target_laba` DECIMAL(12,2) NOT NULL,
  `periode_mulai` DATE NOT NULL,
  `periode_selesai` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_targets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PRICE_REFERENCES TABLE (Independent benchmark reference)
CREATE TABLE IF NOT EXISTS `price_references` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_produk` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(100) DEFAULT NULL,
  `harga_min` DECIMAL(12,2) NOT NULL,
  `harga_max` DECIMAL(12,2) NOT NULL,
  `satuan` VARCHAR(30) NOT NULL,
  `sumber` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INDEXES FOR QUERY OPTIMIZATION
CREATE INDEX `idx_products_user` ON `products` (`user_id`);
CREATE INDEX `idx_transactions_user_date` ON `transactions` (`user_id`, `tanggal`);
CREATE INDEX `idx_transaction_items_tx` ON `transaction_items` (`transaction_id`);
CREATE INDEX `idx_expenses_user_date` ON `expenses` (`user_id`, `tanggal`);
CREATE INDEX `idx_targets_user` ON `targets` (`user_id`);
