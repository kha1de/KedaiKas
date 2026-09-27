-- ============================================================
-- PostgreSQL Seed Data: project_warung
-- Dikonversi dari: database/project_warung.sql (MariaDB 10.4.32)
-- Target: PostgreSQL 18
-- Tanggal konversi: 2026-09-15
-- ============================================================
-- CATATAN:
--   - Backtick (`) diganti dengan tanda kutip ganda (") untuk identifier
--   - Nilai string tetap menggunakan tanda kutip tunggal (')
--   - Seluruh data dipertahankan 100% tanpa perubahan nilai
--   - Urutan INSERT: users -> products -> transactions ->
--     transaction_details -> expenses -> targets -> price_references
--   - INSERT menggunakan OVERRIDING SYSTEM VALUE agar ID eksplisit
--     dapat dimasukkan ke kolom SERIAL
-- ============================================================

BEGIN;

-- ============================================================
-- DATA: users  (3 baris)
-- ============================================================
INSERT INTO "users" ("id_user", "nama", "email", "pass", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'Ahmad Khairul',    'ah.khairul@gmail.com',    '123', '2026-09-14 12:13:50+00'),
    (2, 'Daffa Berlliano',  'daf.berlliano@gmail.com', '123', '2026-09-14 12:13:50+00'),
    (3, 'Darin Hilmi',      'dar.hilmi@gmail.com',     '123', '2026-09-14 12:13:50+00');

-- ============================================================
-- DATA: products  (4 baris)
-- ============================================================
INSERT INTO "products" ("id_produk", "id_user", "nama_produk", "kategori", "harga_modal", "harga_jual", "satuan", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 'Minyak Goreng 1 Liter', 'Sembako', 14000.00, 16500.00, 'Pouch',   '2026-09-14 12:23:52+00'),
    (2, 1, 'Beras Ramos 1 kg',      'Sembako', 12500.00, 14500.00, 'Kg',      '2026-09-14 12:23:52+00'),
    (3, 2, 'Mie Instan Goreng',     'Makanan',  2800.00,  3500.00, 'Pcs',     '2026-09-14 12:23:52+00'),
    (4, 2, 'Es Teh Manis Plastik',  'Minuman',  1500.00,  3000.00, 'Bungkus', '2026-09-14 12:23:52+00');

-- ============================================================
-- DATA: transactions  (12 baris)
-- ============================================================
INSERT INTO "transactions" ("id_transaksi", "id_user", "tanggal", "total", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1,  1, '2026-09-02 09:30:00',  692500.00, '2026-09-02 09:30:00+00'),
    (2,  1, '2026-09-05 14:15:00',  702500.00, '2026-09-05 14:15:00+00'),
    (3,  2, '2026-09-14 12:00:00',    6500.00, '2026-09-14 12:27:28+00'),
    (4,  2, '2026-09-14 15:45:00',   14000.00, '2026-09-14 12:27:28+00'),
    (5,  1, '2026-09-07 11:00:00',  930000.00, '2026-09-07 11:00:00+00'),
    (6,  1, '2026-09-09 15:45:00',  920000.00, '2026-09-09 15:45:00+00'),
    (7,  1, '2026-09-11 10:20:00',  940000.00, '2026-09-11 10:20:00+00'),
    (8,  1, '2026-09-13 13:30:00', 1002500.00, '2026-09-13 13:30:00+00'),
    (9,  1, '2026-09-14 08:30:00', 1012500.00, '2026-09-14 08:30:00+00'),
    (10, 1, '2026-09-15 16:00:00', 1095000.00, '2026-09-15 16:00:00+00'),
    (11, 1, '2026-09-16 11:15:00', 1075000.00, '2026-09-16 11:15:00+00'),
    (12, 1, '2026-09-17 14:45:00',  930000.00, '2026-09-17 14:45:00+00');

-- ============================================================
-- DATA: transaction_details  (22 baris)
-- ============================================================
INSERT INTO "transaction_details" ("id_detail", "id_transaksi", "id_produk", "jumlah", "harga_jual", "subtotal")
OVERRIDING SYSTEM VALUE
VALUES
    (1,  1,  1, 20, 16500.00, 330000.00),
    (2,  1,  2, 25, 14500.00, 362500.00),
    (3,  3,  3,  1,  3500.00,   3500.00),
    (4,  3,  4,  1,  3000.00,   3000.00),
    (5,  2,  1, 25, 16500.00, 412500.00),
    (6,  2,  2, 20, 14500.00, 290000.00),
    (7,  5,  1, 30, 16500.00, 495000.00),
    (8,  5,  2, 30, 14500.00, 435000.00),
    (9,  6,  1, 25, 16500.00, 412500.00),
    (10, 6,  2, 35, 14500.00, 507500.00),
    (11, 7,  1, 35, 16500.00, 577500.00),
    (12, 7,  2, 25, 14500.00, 362500.00),
    (13, 8,  1, 30, 16500.00, 495000.00),
    (14, 8,  2, 35, 14500.00, 507500.00),
    (15, 9,  1, 35, 16500.00, 577500.00),
    (16, 9,  2, 30, 14500.00, 435000.00),
    (17, 10, 1, 40, 16500.00, 660000.00),
    (18, 10, 2, 30, 14500.00, 435000.00),
    (19, 11, 1, 30, 16500.00, 495000.00),
    (20, 11, 2, 40, 14500.00, 580000.00),
    (21, 12, 1, 30, 16500.00, 495000.00),
    (22, 12, 2, 30, 14500.00, 435000.00);

-- ============================================================
-- DATA: expenses  (4 baris)
-- ============================================================
INSERT INTO "expenses" ("id_expenses", "id_user", "kategori", "nominal", "tanggal", "keterangan", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 'Operasional',  150000.00, '2026-09-01', 'Bayar listrik warung bulan September',   '2026-09-14 12:47:10+00'),
    (2, 1, 'Perlengkapan',  25000.00, '2026-09-05', 'Beli kantong kresek dan isolasi',         '2026-09-14 12:47:10+00'),
    (3, 2, 'Transportasi',  50000.00, '2026-09-10', 'Bensin motor untuk kulakan barang',       '2026-09-14 12:47:10+00'),
    (4, 2, 'Operasional',  200000.00, '2026-09-12', 'Bayar iuran kebersihan dan keamanan pasar','2026-09-14 12:47:10+00');

-- ============================================================
-- DATA: targets  (2 baris)
-- ============================================================
INSERT INTO "targets" ("id_target", "id_user", "target_laba", "periode_mulai", "periode_selesai", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 3000000.00, '2026-09-01', '2026-09-30', '2026-09-14 12:48:59+00'),
    (2, 2, 3500000.00, '2026-09-01', '2026-09-30', '2026-09-14 12:48:59+00');

-- ============================================================
-- DATA: price_references  (4 baris)
-- ============================================================
INSERT INTO "price_references" ("id_analisis", "nama_produk", "kategori", "harga_min", "harga_max", "satuan", "sumber", "updated_at")
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'Minyak Goreng 1 Liter', 'Sembako', 13500.00, 16000.00, 'Pouch',   'Pasar Induk',              '2026-09-14 12:50:57+00'),
    (2, 'Beras Ramos 1 kg',      'Sembako', 12000.00, 14000.00, 'Kg',      'Dinas Perdagangan',        '2026-09-14 12:50:57+00'),
    (3, 'Mie Instan Goreng',     'Makanan',  2700.00,  3300.00, 'Pcs',     'Warung Kompetitor A',      '2026-09-14 12:50:57+00'),
    (4, 'Es Teh Manis Plastik',  'Minuman',  2500.00,  4000.00, 'Bungkus', 'Rata-rata Lingkungan sekitar','2026-09-14 12:50:57+00');

-- ============================================================
-- Reset sequence SERIAL agar INSERT berikutnya tidak bentrok
-- ============================================================
SELECT setval(pg_get_serial_sequence('"users"',               'id_user'),      (SELECT MAX("id_user")      FROM "users"));
SELECT setval(pg_get_serial_sequence('"products"',            'id_produk'),    (SELECT MAX("id_produk")    FROM "products"));
SELECT setval(pg_get_serial_sequence('"transactions"',        'id_transaksi'), (SELECT MAX("id_transaksi") FROM "transactions"));
SELECT setval(pg_get_serial_sequence('"transaction_details"', 'id_detail'),    (SELECT MAX("id_detail")    FROM "transaction_details"));
SELECT setval(pg_get_serial_sequence('"expenses"',            'id_expenses'),  (SELECT MAX("id_expenses")  FROM "expenses"));
SELECT setval(pg_get_serial_sequence('"targets"',             'id_target'),    (SELECT MAX("id_target")    FROM "targets"));
SELECT setval(pg_get_serial_sequence('"price_references"',    'id_analisis'),  (SELECT MAX("id_analisis")  FROM "price_references"));

COMMIT;
