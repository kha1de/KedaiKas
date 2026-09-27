-- ============================================================
-- DATABASE SEED DATA: UMKM DECISION SUPPORT
-- Contoh Usaha: "Warung Berkah Budi"
-- Akun Demo: budi@warung.com | Password: password123
-- ============================================================

USE `umkm_decision_support`;

-- 1. USERS
-- Password hash untuk 'password123'
INSERT INTO `users` (`id`, `nama`, `email`, `password`, `created_at`) VALUES
(1, 'Budi Santoso', 'budi@warung.com', '$2b$12$e868N8H1.bOtw5p8xU8m1.Y7q3fE0GfM0hX9U2W/bM38GqB1k2XpW', NOW())
ON DUPLICATE KEY UPDATE `nama`=VALUES(`nama`);

-- 2. PRICE REFERENCES (Benchmark Pasar Umum)
INSERT INTO `price_references` (`id`, `nama_produk`, `kategori`, `harga_min`, `harga_max`, `satuan`, `sumber`, `updated_at`) VALUES
(1, 'Indomie Goreng', 'Makanan', 5000.00, 7000.00, 'porsi', 'Survei Pasar Warung Sekitar', NOW()),
(2, 'Es Teh Manis', 'Minuman', 2500.00, 4000.00, 'gelas', 'Survei Pasar Warung Sekitar', NOW()),
(3, 'Kopi Hitam', 'Minuman', 3000.00, 5000.00, 'cangkir', 'Survei Pasar Warung Sekitar', NOW()),
(4, 'Gorengan Bakwan', 'Makanan Ringan', 1000.00, 1500.00, 'biji', 'Survei Pasar Warung Sekitar', NOW()),
(5, 'Air Mineral 600ml', 'Minuman', 3000.00, 4500.00, 'botol', 'Harga Eceran Rata-rata Toko', NOW())
ON DUPLICATE KEY UPDATE `harga_min`=VALUES(`harga_min`), `harga_max`=VALUES(`harga_max`);

-- 3. PRODUCTS (Milik Budi / user_id = 1)
INSERT INTO `products` (`id`, `user_id`, `nama_produk`, `kategori`, `harga_modal`, `harga_jual`, `satuan`, `created_at`) VALUES
(1, 1, 'Indomie Goreng', 'Makanan', 2500.00, 6000.00, 'porsi', NOW() - INTERVAL 14 DAY),
(2, 1, 'Es Teh Manis', 'Minuman', 1000.00, 3000.00, 'gelas', NOW() - INTERVAL 14 DAY),
(3, 1, 'Kopi Hitam', 'Minuman', 1500.00, 4000.00, 'cangkir', NOW() - INTERVAL 14 DAY),
(4, 1, 'Gorengan Bakwan', 'Makanan Ringan', 500.00, 1200.00, 'biji', NOW() - INTERVAL 14 DAY),
(5, 1, 'Air Mineral 600ml', 'Minuman', 2000.00, 3500.00, 'botol', NOW() - INTERVAL 14 DAY)
ON DUPLICATE KEY UPDATE `nama_produk`=VALUES(`nama_produk`), `harga_modal`=VALUES(`harga_modal`), `harga_jual`=VALUES(`harga_jual`);

-- 4. EXPENSES (Pengeluaran Operasional Warung)
INSERT INTO `expenses` (`id`, `user_id`, `kategori`, `nominal`, `tanggal`, `keterangan`, `created_at`) VALUES
(1, 1, 'Listrik & Token', 150000.00, CURDATE() - INTERVAL 12 DAY, 'Token listrik warung', NOW() - INTERVAL 12 DAY),
(2, 1, 'Bahan Baku', 350000.00, CURDATE() - INTERVAL 10 DAY, 'Belanja minyak goreng, tepung, dan bumbu pelengkap', NOW() - INTERVAL 10 DAY),
(3, 1, 'Air Bersih & Gas', 80000.00, CURDATE() - INTERVAL 8 DAY, 'Isi ulang gas elpiji 3kg x2 dan galon air', NOW() - INTERVAL 8 DAY),
(4, 1, 'Transportasi', 40000.00, CURDATE() - INTERVAL 6 DAY, 'Bensin motor kulakan ke pasar induk', NOW() - INTERVAL 6 DAY),
(5, 1, 'Operasional & Plastik', 35000.00, CURDATE() - INTERVAL 3 DAY, 'Kantong kresek, sedotan, dan tissue makan', NOW() - INTERVAL 3 DAY),
(6, 1, 'Bahan Baku', 200000.00, CURDATE() - INTERVAL 1 DAY, 'Belanja tambahan mie instan & kopi', NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE `nominal`=VALUES(`nominal`);

-- 5. TARGETS (Target Laba Bulanan)
INSERT INTO `targets` (`id`, `user_id`, `target_laba`, `periode_mulai`, `periode_selesai`, `created_at`) VALUES
(1, 1, 3000000.00, DATE_FORMAT(NOW(), '%Y-%m-01'), LAST_DAY(NOW()), NOW())
ON DUPLICATE KEY UPDATE `target_laba`=VALUES(`target_laba`);

-- 6. TRANSACTIONS
-- Transaksi 1 (7 hari lalu) - Total 45.000
INSERT INTO `transactions` (`id`, `user_id`, `tanggal`, `total`, `created_at`) VALUES
(1, 1, NOW() - INTERVAL 7 DAY + INTERVAL 9 HOUR, 45000.00, NOW() - INTERVAL 7 DAY),
(2, 1, NOW() - INTERVAL 6 DAY + INTERVAL 11 HOUR, 66000.00, NOW() - INTERVAL 6 DAY),
(3, 1, NOW() - INTERVAL 5 DAY + INTERVAL 14 HOUR, 84000.00, NOW() - INTERVAL 5 DAY),
(4, 1, NOW() - INTERVAL 4 DAY + INTERVAL 18 HOUR, 112000.00, NOW() - INTERVAL 4 DAY),
(5, 1, NOW() - INTERVAL 3 DAY + INTERVAL 12 HOUR, 95000.00, NOW() - INTERVAL 3 DAY),
(6, 1, NOW() - INTERVAL 2 DAY + INTERVAL 16 HOUR, 138000.00, NOW() - INTERVAL 2 DAY),
(7, 1, NOW() - INTERVAL 1 DAY + INTERVAL 10 HOUR, 160000.00, NOW() - INTERVAL 1 DAY),
(8, 1, NOW() - INTERVAL 2 HOUR, 75000.00, NOW())
ON DUPLICATE KEY UPDATE `total`=VALUES(`total`);

-- 7. TRANSACTION_ITEMS
-- Tx 1: 5 Indomie (30rb) + 5 Es Teh (15rb) = 45rb
INSERT INTO `transaction_items` (`transaction_id`, `product_id`, `jumlah`, `harga_jual`, `subtotal`) VALUES
(1, 1, 5, 6000.00, 30000.00),
(1, 2, 5, 3000.00, 15000.00),

-- Tx 2: 6 Indomie (36rb) + 10 Gorengan (12rb) + 6 Es Teh (18rb) = 66rb
(2, 1, 6, 6000.00, 36000.00),
(2, 4, 10, 1200.00, 12000.00),
(2, 2, 6, 3000.00, 18000.00),

-- Tx 3: 8 Kopi (32rb) + 20 Gorengan (24rb) + 4 Indomie (24rb) + 1 Air Mineral (4rb -> harga tersimpan 3500, tx 4rb subtotal) = 84rb
(3, 3, 8, 4000.00, 32000.00),
(3, 4, 20, 1200.00, 24000.00),
(3, 1, 4, 6000.00, 24000.00),
(3, 5, 1, 4000.00, 4000.00),

-- Tx 4: 10 Indomie (60rb) + 10 Es Teh (30rb) + 15 Gorengan (18rb) + 1 Kopi (4rb) = 112rb
(4, 1, 10, 6000.00, 60000.00),
(4, 2, 10, 3000.00, 30000.00),
(4, 4, 15, 1200.00, 18000.00),
(4, 3, 1, 4000.00, 4000.00),

-- Tx 5: 8 Indomie (48rb) + 9 Es Teh (27rb) + 5 Kopi (20rb) = 95rb
(5, 1, 8, 6000.00, 48000.00),
(5, 2, 9, 3000.00, 27000.00),
(5, 3, 5, 4000.00, 20000.00),

-- Tx 6: 12 Indomie (72rb) + 12 Es Teh (36rb) + 25 Gorengan (30rb) = 138rb
(6, 1, 12, 6000.00, 72000.00),
(6, 2, 12, 3000.00, 36000.00),
(6, 4, 25, 1200.00, 30000.00),

-- Tx 7: 15 Indomie (90rb) + 15 Es Teh (45rb) + 15 Gorengan (18rb) + 2 Air Mineral (7rb) = 160rb
(7, 1, 15, 6000.00, 90000.00),
(7, 2, 15, 3000.00, 45000.00),
(7, 4, 15, 1200.00, 18000.00),
(7, 5, 2, 3500.00, 7000.00),

-- Tx 8: 6 Indomie (36rb) + 5 Es Teh (15rb) + 4 Kopi (16rb) + 2 Air Mineral (7rb) + 1 Gorengan (1.2rb rounded 1rb) = 75rb
(8, 1, 6, 6000.00, 36000.00),
(8, 2, 5, 3000.00, 15000.00),
(8, 3, 4, 4000.00, 16000.00),
(8, 5, 2, 3500.00, 7000.00),
(8, 4, 1, 1000.00, 1000.00);
