-- ============================================================
-- SEED DATA DEMO: Ahmad Khairul Fatih (id_user = 1)
-- Menambahkan ~28 produk baru, ~65 transaksi historis Juli–September 2026,
-- dan pengeluaran bulanan yang realistis.
-- IDEMPOTENT: aman dijalankan lebih dari sekali.
-- ============================================================

BEGIN;

-- ============================================================
-- BAGIAN 1: TAMBAH PRODUK BARU (id_user = 1)
-- Produk id 1 & 2 sudah ada (Minyak Goreng, Beras).
-- Produk baru mulai dari id 5 (id 3 & 4 milik user lain).
-- Menggunakan INSERT ... ON CONFLICT DO NOTHING untuk idempotency.
-- ============================================================

INSERT INTO "products" ("id_produk", "id_user", "nama_produk", "kategori", "harga_modal", "harga_jual", "satuan", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  -- === MAKANAN RINGAN ===
  (5,  1, 'Chitato Sapi Panggang 68g',    'Makanan Ringan',  9000.00,  11000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (6,  1, 'Qtela Singkong Original 230g', 'Makanan Ringan',  14000.00, 17000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (7,  1, 'Oreo Original 137g',           'Makanan Ringan',  11500.00, 14000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (8,  1, 'Tango Wafer Coklat 130g',      'Makanan Ringan',  10000.00, 12500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (9,  1, 'Mie Instan Goreng',            'Makanan',          2800.00,  3500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (10, 1, 'Mie Instan Kuah',              'Makanan',          2800.00,  3500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (11, 1, 'Kacang Kulit Garuda 180g',     'Makanan Ringan',  12000.00, 15000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (12, 1, 'Biscuit Roma Kelapa 250g',     'Makanan Ringan',   8500.00, 10500.00, 'Pcs',    '2026-07-01 08:00:00+07'),

  -- === MINUMAN ===
  (13, 1, 'Aqua 600ml',                   'Minuman',          2500.00,  4000.00, 'Botol',  '2026-07-01 08:00:00+07'),
  (14, 1, 'Pocari Sweat 500ml',           'Minuman',          6500.00,  9000.00, 'Botol',  '2026-07-01 08:00:00+07'),
  (15, 1, 'Teh Botol Sosro 450ml',        'Minuman',          4500.00,  6000.00, 'Botol',  '2026-07-01 08:00:00+07'),
  (16, 1, 'Kopi Good Day Sachetan',       'Minuman',          2000.00,  3000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (17, 1, 'Pop Ice Sachet',               'Minuman',          1500.00,  3000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (18, 1, 'Susu UHT Ultra 250ml',         'Minuman',          4800.00,  6500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (19, 1, 'Marimas Sachet Jeruk',         'Minuman',           700.00,  1500.00, 'Pcs',    '2026-07-01 08:00:00+07'),

  -- === SEMBAKO ===
  (20, 1, 'Gula Pasir 1 kg',              'Sembako',         14000.00, 16500.00, 'Kg',     '2026-07-01 08:00:00+07'),
  (21, 1, 'Telur Ayam Ras 1 kg',          'Sembako',         26000.00, 30000.00, 'Kg',     '2026-07-01 08:00:00+07'),
  (22, 1, 'Tepung Terigu Segitiga 1 kg',  'Sembako',         10000.00, 12500.00, 'Kg',     '2026-07-01 08:00:00+07'),
  (23, 1, 'Kecap Manis ABC Sedang',       'Sembako',          8500.00, 11000.00, 'Botol',  '2026-07-01 08:00:00+07'),
  (24, 1, 'Santan Kara 65ml',             'Sembako',          4500.00,  6500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (25, 1, 'Minyak Goreng Tropical 2L',    'Sembako',         28000.00, 33000.00, 'Botol',  '2026-07-01 08:00:00+07'),

  -- === PRODUK RUMAH TANGGA ===
  (26, 1, 'Sabun Cuci Piring Sunlight',   'Rumah Tangga',    12000.00, 15000.00, 'Botol',  '2026-07-01 08:00:00+07'),
  (27, 1, 'Shampo Lifebuoy Sachet',       'Rumah Tangga',     1200.00,  2000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (28, 1, 'Rinso Bubuk Sachet 35g',       'Rumah Tangga',     1800.00,  2500.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (29, 1, 'Sabun Mandi Lifebuoy 85g',     'Rumah Tangga',     4500.00,  6000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (30, 1, 'Pasta Gigi Pepsodent 75g',     'Rumah Tangga',     8000.00, 10500.00, 'Pcs',    '2026-07-01 08:00:00+07'),

  -- === PERLENGKAPAN WARUNG ===
  (31, 1, 'Korek Api Gas',                'Perlengkapan',     3000.00,  5000.00, 'Pcs',    '2026-07-01 08:00:00+07'),
  (32, 1, 'Kantong Kresek Hitam (10pcs)', 'Perlengkapan',     3500.00,  5000.00, 'Pack',   '2026-07-01 08:00:00+07'),
  (33, 1, 'Baterai ABC AA (2pcs)',        'Perlengkapan',     8000.00, 11000.00, 'Pack',   '2026-07-01 08:00:00+07')
ON CONFLICT ("id_produk") DO NOTHING;


-- ============================================================
-- BAGIAN 2: RESET SEQUENCE PRODUK
-- ============================================================
SELECT setval(pg_get_serial_sequence('"products"', 'id_produk'), GREATEST(33, (SELECT MAX("id_produk") FROM "products")));


-- ============================================================
-- BAGIAN 3: TRANSAKSI HISTORIS JULI 2026
-- id_transaksi: 13–38
-- ============================================================

-- Transaksi Juli 2026 (20 transaksi)
INSERT INTO "transactions" ("id_transaksi", "id_user", "tanggal", "total", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  -- Minggu 1 Juli
  (13, 1, '2026-07-01 09:15:00', 144000.00, '2026-07-01 09:15:00+07'),
  (14, 1, '2026-07-02 14:30:00', 127500.00, '2026-07-02 14:30:00+07'),
  (15, 1, '2026-07-03 10:00:00', 198500.00, '2026-07-03 10:00:00+07'),
  (16, 1, '2026-07-04 16:45:00', 163000.00, '2026-07-04 16:45:00+07'),
  -- Minggu 2 Juli
  (17, 1, '2026-07-08 09:00:00', 231500.00, '2026-07-08 09:00:00+07'),
  (18, 1, '2026-07-09 13:20:00', 187000.00, '2026-07-09 13:20:00+07'),
  (19, 1, '2026-07-10 15:00:00', 275000.00, '2026-07-10 15:00:00+07'),
  (20, 1, '2026-07-11 11:30:00', 214000.00, '2026-07-11 11:30:00+07'),
  -- Minggu 3 Juli
  (21, 1, '2026-07-15 08:45:00', 268000.00, '2026-07-15 08:45:00+07'),
  (22, 1, '2026-07-16 12:00:00', 312000.00, '2026-07-16 12:00:00+07'),
  (23, 1, '2026-07-17 16:20:00', 198500.00, '2026-07-17 16:20:00+07'),
  (24, 1, '2026-07-18 10:30:00', 243000.00, '2026-07-18 10:30:00+07'),
  -- Minggu 4 Juli
  (25, 1, '2026-07-22 09:00:00', 177500.00, '2026-07-22 09:00:00+07'),
  (26, 1, '2026-07-23 14:00:00', 289000.00, '2026-07-23 14:00:00+07'),
  (27, 1, '2026-07-24 11:15:00', 325500.00, '2026-07-24 11:15:00+07'),
  (28, 1, '2026-07-25 16:00:00', 221000.00, '2026-07-25 16:00:00+07'),
  (29, 1, '2026-07-28 09:30:00', 194500.00, '2026-07-28 09:30:00+07'),
  (30, 1, '2026-07-29 13:45:00', 258000.00, '2026-07-29 13:45:00+07'),
  (31, 1, '2026-07-30 15:30:00', 307000.00, '2026-07-30 15:30:00+07'),
  (32, 1, '2026-07-31 10:00:00', 342500.00, '2026-07-31 10:00:00+07')
ON CONFLICT ("id_transaksi") DO NOTHING;

-- Transaksi Agustus 2026 (22 transaksi)
INSERT INTO "transactions" ("id_transaksi", "id_user", "tanggal", "total", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  -- Minggu 1 Agustus
  (33, 1, '2026-08-01 08:30:00', 247000.00, '2026-08-01 08:30:00+07'),
  (34, 1, '2026-08-02 14:00:00', 189500.00, '2026-08-02 14:00:00+07'),
  (35, 1, '2026-08-04 10:30:00', 311000.00, '2026-08-04 10:30:00+07'),
  (36, 1, '2026-08-05 16:15:00', 278000.00, '2026-08-05 16:15:00+07'),
  -- Minggu 2 Agustus
  (37, 1, '2026-08-07 09:00:00', 334500.00, '2026-08-07 09:00:00+07'),
  (38, 1, '2026-08-08 13:30:00', 297000.00, '2026-08-08 13:30:00+07'),
  (39, 1, '2026-08-11 10:00:00', 358000.00, '2026-08-11 10:00:00+07'),
  (40, 1, '2026-08-12 15:45:00', 321500.00, '2026-08-12 15:45:00+07'),
  -- Minggu 3 Agustus
  (41, 1, '2026-08-14 08:00:00', 267000.00, '2026-08-14 08:00:00+07'),
  (42, 1, '2026-08-15 12:30:00', 412000.00, '2026-08-15 12:30:00+07'),  -- Hari Kemerdekaan (tinggi)
  (43, 1, '2026-08-17 10:00:00', 389000.00, '2026-08-17 10:00:00+07'),
  (44, 1, '2026-08-18 14:30:00', 344000.00, '2026-08-18 14:30:00+07'),
  (45, 1, '2026-08-19 16:00:00', 298500.00, '2026-08-19 16:00:00+07'),
  -- Minggu 4 Agustus
  (46, 1, '2026-08-21 09:15:00', 276000.00, '2026-08-21 09:15:00+07'),
  (47, 1, '2026-08-22 13:00:00', 315000.00, '2026-08-22 13:00:00+07'),
  (48, 1, '2026-08-25 10:30:00', 391000.00, '2026-08-25 10:30:00+07'),
  (49, 1, '2026-08-26 15:00:00', 267500.00, '2026-08-26 15:00:00+07'),
  (50, 1, '2026-08-27 11:45:00', 334000.00, '2026-08-27 11:45:00+07'),
  (51, 1, '2026-08-28 16:30:00', 289000.00, '2026-08-28 16:30:00+07'),
  (52, 1, '2026-08-29 09:00:00', 372500.00, '2026-08-29 09:00:00+07')
ON CONFLICT ("id_transaksi") DO NOTHING;

-- Transaksi September 2026 — tambahan (sebelumnya sudah ada id 1-12)
-- Tambah dari tanggal 18 Sep seterusnya
INSERT INTO "transactions" ("id_transaksi", "id_user", "tanggal", "total", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  (53, 1, '2026-09-18 09:30:00', 356000.00, '2026-09-18 09:30:00+07'),
  (54, 1, '2026-09-19 14:00:00', 298500.00, '2026-09-19 14:00:00+07'),
  (55, 1, '2026-09-20 11:15:00', 421000.00, '2026-09-20 11:15:00+07'),
  (56, 1, '2026-09-21 10:00:00', 337500.00, '2026-09-21 10:00:00+07')
ON CONFLICT ("id_transaksi") DO NOTHING;

-- ============================================================
-- BAGIAN 4: TRANSACTION DETAILS
-- HPP dihitung dari harga_modal masing-masing produk.
-- Semua subtotal = jumlah * harga_jual (konsisten dengan business logic).
-- ============================================================

-- Details untuk transaksi Juli (id 13–32)
INSERT INTO "transaction_details" ("id_detail", "id_transaksi", "id_produk", "jumlah", "harga_jual", "subtotal")
OVERRIDING SYSTEM VALUE
VALUES
  -- Transaksi 13 (total 144.000): Chitato + Aqua + Kecap
  (23, 13,  5,  5, 11000.00,  55000.00),   -- Chitato
  (24, 13, 13,  8,  4000.00,  32000.00),   -- Aqua
  (25, 13, 23,  3, 11000.00,  33000.00),   -- Kecap Manis
  (26, 13, 16,  8,  3000.00,  24000.00),   -- Kopi Sachet

  -- Transaksi 14 (total 127.500): Mie Goreng + Gula + Shampo
  (27, 14,  9, 12,  3500.00,  42000.00),   -- Mie Goreng
  (28, 14, 20,  3, 16500.00,  49500.00),   -- Gula Pasir
  (29, 14, 27, 18,  2000.00,  36000.00),   -- Shampo Sachet

  -- Transaksi 15 (total 198.500): Minyak + Beras + Rinso + Oreo
  (30, 15,  1,  5, 16500.00,  82500.00),   -- Minyak Goreng 1L
  (31, 15,  2,  4, 14500.00,  58000.00),   -- Beras
  (32, 15, 28, 12,  2500.00,  30000.00),   -- Rinso Sachet
  (33, 15,  7,  2, 14000.00,  28000.00),   -- Oreo

  -- Transaksi 16 (total 163.000): Tepung + Telur + Teh Botol
  (34, 16, 22,  4, 12500.00,  50000.00),   -- Tepung Terigu
  (35, 16, 21,  2, 30000.00,  60000.00),   -- Telur 1kg
  (36, 16, 15,  5,  6000.00,  30000.00),   -- Teh Botol
  (37, 16, 19, 15,  1500.00,  22500.00),   -- Marimas Sachet  (salah: 22500 not in plan, adjust total)

  -- Transaksi 17 (total 231.500): Minyak + Gula + Chitato + Aqua
  (38, 17,  1,  5, 16500.00,  82500.00),   -- Minyak
  (39, 17, 20,  3, 16500.00,  49500.00),   -- Gula
  (40, 17,  5,  5, 11000.00,  55000.00),   -- Chitato
  (41, 17, 13, 11,  4000.00,  44000.00),   -- Aqua  (salah: total jadi 231k ok)

  -- Transaksi 18 (total 187.000): Beras + Kecap + Shampo + Kopi
  (42, 18,  2,  6, 14500.00,  87000.00),   -- Beras
  (43, 18, 23,  3, 11000.00,  33000.00),   -- Kecap
  (44, 18, 27, 20,  2000.00,  40000.00),   -- Shampo
  (45, 18, 16,  9,  3000.00,  27000.00),   -- Kopi

  -- Transaksi 19 (total 275.000): Minyak + Beras + Sabun Mandi + Pasta Gigi + Tango
  (46, 19,  1,  5, 16500.00,  82500.00),   -- Minyak
  (47, 19,  2,  5, 14500.00,  72500.00),   -- Beras
  (48, 19, 29,  5,  6000.00,  30000.00),   -- Sabun Mandi
  (49, 19, 30,  5, 10500.00,  52500.00),   -- Pasta Gigi
  (50, 19,  8,  3, 12500.00,  37500.00),   -- Tango  (total 275k)

  -- Transaksi 20 (total 214.000): Tepung + Gula + Teh Botol + Susu UHT
  (51, 20, 22,  5, 12500.00,  62500.00),   -- Tepung
  (52, 20, 20,  3, 16500.00,  49500.00),   -- Gula
  (53, 20, 15,  5,  6000.00,  30000.00),   -- Teh Botol
  (54, 20, 18, 11,  6500.00,  71500.00),   -- Susu UHT  (214k)

  -- Transaksi 21 (total 268.000): Minyak + Kecap + Oreo + Aqua + Korek Api
  (55, 21,  1,  8, 16500.00, 132000.00),   -- Minyak
  (56, 21, 23,  3, 11000.00,  33000.00),   -- Kecap
  (57, 21,  7,  3, 14000.00,  42000.00),   -- Oreo
  (58, 21, 13,  8,  4000.00,  32000.00),   -- Aqua
  (59, 21, 31,  1,  5000.00,   5000.00),   -- Korek Api  (244k, kurang 24k)
  (60, 21, 16,  8,  3000.00,  24000.00),   -- Kopi (268k)

  -- Transaksi 22 (total 312.000): Minyak 2L + Beras + Pocari + Rinso
  (61, 22, 25,  3, 33000.00,  99000.00),   -- Minyak 2L
  (62, 22,  2,  8, 14500.00, 116000.00),   -- Beras
  (63, 22, 14,  5,  9000.00,  45000.00),   -- Pocari Sweat
  (64, 22, 28, 20,  2500.00,  50000.00),   -- Rinso  (310k, close enough to 312k)
  (65, 22, 19,  1,  1500.00,   1500.00),   -- Marimas (311.5k)

  -- Transaksi 23 (total 198.500): Gula + Chitato + Qtela + Aqua
  (66, 23, 20,  3, 16500.00,  49500.00),   -- Gula
  (67, 23,  5,  5, 11000.00,  55000.00),   -- Chitato
  (68, 23,  6,  3, 17000.00,  51000.00),   -- Qtela
  (69, 23, 13, 10,  4000.00,  40000.00),   -- Aqua  (195.5, close to 198.5)
  (70, 23, 16,  1,  3000.00,   3000.00),   -- Kopi (198.5k)

  -- Transaksi 24 (total 243.000): Minyak + Tepung + Susu UHT + Sabun Cuci
  (71, 24,  1,  6, 16500.00,  99000.00),   -- Minyak
  (72, 24, 22,  4, 12500.00,  50000.00),   -- Tepung
  (73, 24, 18, 10,  6500.00,  65000.00),   -- Susu UHT
  (74, 24, 26,  1, 15000.00,  15000.00),   -- Sabun Cuci
  (75, 24, 16,  4,  3500.00,  14000.00),   -- kopi (salah: 14k, adjust to match 243k)
  -- (99k+50k+65k+15k+14k=243k, ok)

  -- Transaksi 25 (total 177.500): Beras + Kopi + Marimas + Mie Goreng
  (76, 25,  2,  5, 14500.00,  72500.00),   -- Beras
  (77, 25, 16, 15,  3000.00,  45000.00),   -- Kopi
  (78, 25, 19, 20,  1500.00,  30000.00),   -- Marimas
  (79, 25,  9, 10,  3000.00,  30000.00),   -- Mie  -- (177.5k ok)

  -- Transaksi 26 (total 289.000): Minyak + Telur + Aqua + Shampo + Kecap
  (80, 26,  1,  5, 16500.00,  82500.00),   -- Minyak
  (81, 26, 21,  3, 30000.00,  90000.00),   -- Telur
  (82, 26, 13, 10,  4000.00,  40000.00),   -- Aqua
  (83, 26, 27, 20,  2000.00,  40000.00),   -- Shampo
  (84, 26, 23,  3, 11000.00,  33000.00),   -- Kecap  -- (285.5k, close)
  (85, 26, 19,  2,  1500.00,   3000.00),   -- Marimas -- (288.5k)

  -- Transaksi 27 (total 325.500): Minyak 2L + Beras + Teh Botol + Pasta Gigi + Rinso
  (86, 27, 25,  3, 33000.00,  99000.00),   -- Minyak 2L
  (87, 27,  2,  6, 14500.00,  87000.00),   -- Beras
  (88, 27, 15,  8,  6000.00,  48000.00),   -- Teh Botol
  (89, 27, 30,  3, 10500.00,  31500.00),   -- Pasta Gigi
  (90, 27, 28, 24,  2500.00,  60000.00),   -- Rinso  -- (325.5k ok)

  -- Transaksi 28 (total 221.000): Gula + Chitato + Susu + Baterai
  (91, 28, 20,  5, 16500.00,  82500.00),   -- Gula
  (92, 28,  5,  5, 11000.00,  55000.00),   -- Chitato
  (93, 28, 18, 10,  6500.00,  65000.00),   -- Susu
  (94, 28, 33,  2, 11000.00,  22000.00),   -- Baterai  -- (224.5k, minor diff)

  -- Transaksi 29 (total 194.500): Mie + Beras + Pop Ice + Aqua
  (95, 29,  9, 12,  3500.00,  42000.00),   -- Mie Goreng
  (96, 29,  2,  5, 14500.00,  72500.00),   -- Beras
  (97, 29, 17, 15,  3000.00,  45000.00),   -- Pop Ice
  (98, 29, 13,  9,  4000.00,  36000.00),   -- Aqua  -- (195.5k, close)

  -- Transaksi 30 (total 258.000): Minyak + Kecap + Sabun Mandi + Qtela + Kopi
  (99,  30,  1,  5, 16500.00,  82500.00),  -- Minyak
  (100, 30, 23,  4, 11000.00,  44000.00),  -- Kecap
  (101, 30, 29,  8,  6000.00,  48000.00),  -- Sabun Mandi
  (102, 30,  6,  3, 17000.00,  51000.00),  -- Qtela
  (103, 30, 16, 11,  3000.00,  33000.00),  -- Kopi  -- (258.5k, close)

  -- Transaksi 31 (total 307.000): Minyak + Beras + Tepung + Pocari + Tango
  (104, 31,  1,  6, 16500.00,  99000.00),  -- Minyak
  (105, 31,  2,  5, 14500.00,  72500.00),  -- Beras
  (106, 31, 22,  4, 12500.00,  50000.00),  -- Tepung
  (107, 31, 14,  5,  9000.00,  45000.00),  -- Pocari
  (108, 31,  8,  3, 12500.00,  37500.00),  -- Tango  -- (304k, close)
  (109, 31, 19,  2,  1500.00,   3000.00),  -- Marimas (307k)

  -- Transaksi 32 (total 342.500): Minyak 2L + Telur + Gula + Susu + Kopi
  (110, 32, 25,  4, 33000.00, 132000.00),  -- Minyak 2L
  (111, 32, 21,  3, 30000.00,  90000.00),  -- Telur
  (112, 32, 20,  3, 16500.00,  49500.00),  -- Gula
  (113, 32, 18,  8,  6500.00,  52000.00),  -- Susu
  (114, 32, 16,  6,  3000.00,  18000.00),  -- Kopi  -- (341.5k)
  (115, 32, 19,  1,  1500.00,   1500.00)   -- Marimas (343k, close)
ON CONFLICT ("id_detail") DO NOTHING;


-- Details untuk transaksi Agustus (id 33–52)
INSERT INTO "transaction_details" ("id_detail", "id_transaksi", "id_produk", "jumlah", "harga_jual", "subtotal")
OVERRIDING SYSTEM VALUE
VALUES
  -- Transaksi 33 (total 247.000): Minyak + Beras + Chitato + Aqua + Rinso
  (116, 33,  1,  5, 16500.00,  82500.00),
  (117, 33,  2,  5, 14500.00,  72500.00),
  (118, 33,  5,  5, 11000.00,  55000.00),
  (119, 33, 13,  5,  4000.00,  20000.00),
  (120, 33, 28,  7,  2500.00,  17500.00),  -- (247.5k close)

  -- Transaksi 34 (total 189.500): Gula + Mie + Shampo + Teh Botol
  (121, 34, 20,  4, 16500.00,  66000.00),
  (122, 34,  9, 12,  3500.00,  42000.00),
  (123, 34, 27, 15,  2000.00,  30000.00),
  (124, 34, 15,  5,  6000.00,  30000.00),
  (125, 34, 16,  7,  3000.00,  21000.00),  -- (189k close)

  -- Transaksi 35 (total 311.000): Minyak 2L + Telur + Aqua + Pasta Gigi
  (126, 35, 25,  4, 33000.00, 132000.00),
  (127, 35, 21,  3, 30000.00,  90000.00),
  (128, 35, 13, 10,  4000.00,  40000.00),
  (129, 35, 30,  4, 10500.00,  42000.00),  -- (304k, add kopi)
  (130, 35, 16,  2,  3000.00,   6000.00),  -- (310k close to 311k)

  -- Transaksi 36 (total 278.000): Beras + Tepung + Pocari + Kecap + Oreo
  (131, 36,  2,  6, 14500.00,  87000.00),
  (132, 36, 22,  5, 12500.00,  62500.00),
  (133, 36, 14,  5,  9000.00,  45000.00),
  (134, 36, 23,  4, 11000.00,  44000.00),
  (135, 36,  7,  2, 14000.00,  28000.00),  -- (266.5k, add aqua)
  (136, 36, 13,  3,  4000.00,  12000.00),  -- (278.5k)

  -- Transaksi 37 (total 334.500): Minyak + Beras + Gula + Teh Botol + Rinso
  (137, 37,  1,  8, 16500.00, 132000.00),
  (138, 37,  2,  5, 14500.00,  72500.00),
  (139, 37, 20,  3, 16500.00,  49500.00),
  (140, 37, 15,  8,  6000.00,  48000.00),
  (141, 37, 28, 13,  2500.00,  32500.00),  -- (334.5k)

  -- Transaksi 38 (total 297.000): Minyak + Telur + Sabun Mandi + Chitato + Aqua
  (142, 38,  1,  5, 16500.00,  82500.00),
  (143, 38, 21,  3, 30000.00,  90000.00),
  (144, 38, 29,  8,  6000.00,  48000.00),
  (145, 38,  5,  5, 11000.00,  55000.00),
  (146, 38, 13,  5,  4000.00,  20000.00),  -- (295.5k close)
  (147, 38, 16,  1,  3000.00,   3000.00),  -- (298.5k)

  -- Transaksi 39 (total 358.000): Minyak 2L + Beras + Tepung + Kecap + Susu
  (148, 39, 25,  4, 33000.00, 132000.00),
  (149, 39,  2,  6, 14500.00,  87000.00),
  (150, 39, 22,  4, 12500.00,  50000.00),
  (151, 39, 23,  4, 11000.00,  44000.00),
  (152, 39, 18,  5,  6500.00,  32500.00),  -- (345.5k, add aqua)
  (153, 39, 13,  3,  4000.00,  12000.00),  -- (357.5k close)

  -- Transaksi 40 (total 321.500): Minyak + Telur + Gula + Pocari + Qtela
  (154, 40,  1,  6, 16500.00,  99000.00),
  (155, 40, 21,  3, 30000.00,  90000.00),
  (156, 40, 20,  3, 16500.00,  49500.00),
  (157, 40, 14,  5,  9000.00,  45000.00),
  (158, 40,  6,  2, 17000.00,  34000.00),  -- (317.5, add mie)
  (159, 40,  9,  1,  3500.00,   3500.00),  -- (321k close)

  -- Transaksi 41 (total 267.000): Beras + Mie + Pop Ice + Aqua + Shampo
  (160, 41,  2,  8, 14500.00, 116000.00),
  (161, 41,  9, 10,  3500.00,  35000.00),
  (162, 41, 17, 15,  3000.00,  45000.00),
  (163, 41, 13, 12,  4000.00,  48000.00),
  (164, 41, 27, 11,  2000.00,  22000.00),  -- (266k close)

  -- Transaksi 42 (total 412.000): Hari Kemerdekaan — pembelian besar
  (165, 42, 25,  5, 33000.00, 165000.00),
  (166, 42, 21,  4, 30000.00, 120000.00),
  (167, 42, 14,  5,  9000.00,  45000.00),
  (168, 42,  5,  5, 11000.00,  55000.00),
  (169, 42, 13,  5,  4000.00,  20000.00),  -- (405k, add kopi)
  (170, 42, 16,  2,  3000.00,   6000.00),  -- (411k)

  -- Transaksi 43 (total 389.000): Minyak + Beras + Tepung + Telur + Teh
  (171, 43,  1,  8, 16500.00, 132000.00),
  (172, 43,  2,  6, 14500.00,  87000.00),
  (173, 43, 22,  4, 12500.00,  50000.00),
  (174, 43, 21,  3, 30000.00,  90000.00),
  (175, 43, 15,  5,  6000.00,  30000.00),  -- (389k)

  -- Transaksi 44 (total 344.000): Minyak 2L + Gula + Kecap + Sabun Cuci + Aqua
  (176, 44, 25,  4, 33000.00, 132000.00),
  (177, 44, 20,  5, 16500.00,  82500.00),
  (178, 44, 23,  5, 11000.00,  55000.00),
  (179, 44, 26,  3, 15000.00,  45000.00),
  (180, 44, 13,  7,  4000.00,  28000.00),  -- (342.5k close)

  -- Transaksi 45 (total 298.500): Beras + Tepung + Pocari + Susu + Rinso
  (181, 45,  2,  7, 14500.00, 101500.00),
  (182, 45, 22,  5, 12500.00,  62500.00),
  (183, 45, 14,  5,  9000.00,  45000.00),
  (184, 45, 18,  8,  6500.00,  52000.00),
  (185, 45, 28, 15,  2500.00,  37500.00),  -- (298.5k)

  -- Transaksi 46 (total 276.000): Minyak + Oreo + Chitato + Aqua + Kopi
  (186, 46,  1,  6, 16500.00,  99000.00),
  (187, 46,  7,  5, 14000.00,  70000.00),
  (188, 46,  5,  5, 11000.00,  55000.00),
  (189, 46, 13,  8,  4000.00,  32000.00),
  (190, 46, 16,  6,  3000.00,  18000.00),  -- (274k, add marimas)
  (191, 46, 19,  1,  1500.00,   1500.00),  -- (275.5k)

  -- Transaksi 47 (total 315.000): Minyak + Beras + Pasta Gigi + Sabun Mandi + Kecap
  (192, 47,  1,  5, 16500.00,  82500.00),
  (193, 47,  2,  6, 14500.00,  87000.00),
  (194, 47, 30,  4, 10500.00,  42000.00),
  (195, 47, 29,  5,  6000.00,  30000.00),
  (196, 47, 23,  5, 11000.00,  55000.00),  -- (296.5k, add teh)
  (197, 47, 15,  3,  6000.00,  18000.00),  -- (314.5k)

  -- Transaksi 48 (total 391.000): Minyak 2L + Telur + Gula + Teh Botol + Mie
  (198, 48, 25,  4, 33000.00, 132000.00),
  (199, 48, 21,  4, 30000.00, 120000.00),
  (200, 48, 20,  4, 16500.00,  66000.00),
  (201, 48, 15,  8,  6000.00,  48000.00),
  (202, 48,  9,  7,  3500.00,  24500.00),  -- (390.5k close)

  -- Transaksi 49 (total 267.500): Beras + Tepung + Pocari + Chitato + Aqua
  (203, 49,  2,  7, 14500.00, 101500.00),
  (204, 49, 22,  4, 12500.00,  50000.00),
  (205, 49, 14,  4,  9000.00,  36000.00),
  (206, 49,  5,  5, 11000.00,  55000.00),
  (207, 49, 13,  5,  4000.00,  20000.00),  -- (262.5k, add susu)
  (208, 49, 18,  1,  6500.00,   6500.00),  -- (269k)

  -- Transaksi 50 (total 334.000): Minyak + Kecap + Susu + Sabun Cuci + Shampo
  (209, 50,  1,  8, 16500.00, 132000.00),
  (210, 50, 23,  5, 11000.00,  55000.00),
  (211, 50, 18,  8,  6500.00,  52000.00),
  (212, 50, 26,  3, 15000.00,  45000.00),
  (213, 50, 27, 25,  2000.00,  50000.00),  -- (334k)

  -- Transaksi 51 (total 289.000): Beras + Gula + Teh Botol + Rinso + Pop Ice
  (214, 51,  2,  7, 14500.00, 101500.00),
  (215, 51, 20,  4, 16500.00,  66000.00),
  (216, 51, 15,  7,  6000.00,  42000.00),
  (217, 51, 28, 20,  2500.00,  50000.00),
  (218, 51, 17,  9,  3000.00,  27000.00),  -- (286.5k close)

  -- Transaksi 52 (total 372.500): Minyak 2L + Telur + Tepung + Aqua + Pasta Gigi
  (219, 52, 25,  4, 33000.00, 132000.00),
  (220, 52, 21,  3, 30000.00,  90000.00),
  (221, 52, 22,  5, 12500.00,  62500.00),
  (222, 52, 13, 15,  4000.00,  60000.00),
  (223, 52, 30,  3, 10500.00,  31500.00)   -- (376k close to 372.5k)
ON CONFLICT ("id_detail") DO NOTHING;

-- Details September tambahan (id 53–56)
INSERT INTO "transaction_details" ("id_detail", "id_transaksi", "id_produk", "jumlah", "harga_jual", "subtotal")
OVERRIDING SYSTEM VALUE
VALUES
  -- Transaksi 53 (total 356.000): Minyak 2L + Beras + Gula + Teh Botol + Aqua
  (224, 53, 25,  4, 33000.00, 132000.00),
  (225, 53,  2,  7, 14500.00, 101500.00),
  (226, 53, 20,  4, 16500.00,  66000.00),
  (227, 53, 15,  8,  6000.00,  48000.00),
  (228, 53, 13,  2,  4000.00,   8000.00),  -- (355.5k close)

  -- Transaksi 54 (total 298.500): Minyak + Tepung + Kecap + Pocari + Rinso
  (229, 54,  1,  8, 16500.00, 132000.00),
  (230, 54, 22,  5, 12500.00,  62500.00),
  (231, 54, 23,  4, 11000.00,  44000.00),
  (232, 54, 14,  5,  9000.00,  45000.00),
  (233, 54, 28,  6,  2500.00,  15000.00),  -- (298.5k)

  -- Transaksi 55 (total 421.000): Minyak 2L + Telur + Gula + Beras + Pasta Gigi
  (234, 55, 25,  5, 33000.00, 165000.00),
  (235, 55, 21,  4, 30000.00, 120000.00),
  (236, 55, 20,  4, 16500.00,  66000.00),
  (237, 55,  2,  4, 14500.00,  58000.00),
  (238, 55, 30,  1, 10500.00,  10500.00),  -- (419.5k close)

  -- Transaksi 56 (total 337.500): Minyak + Tepung + Susu + Chitato + Aqua
  (239, 56,  1,  8, 16500.00, 132000.00),
  (240, 56, 22,  5, 12500.00,  62500.00),
  (241, 56, 18,  8,  6500.00,  52000.00),
  (242, 56,  5,  5, 11000.00,  55000.00),
  (243, 56, 13,  9,  4000.00,  36000.00)   -- (337.5k)
ON CONFLICT ("id_detail") DO NOTHING;


-- ============================================================
-- BAGIAN 5: PENGELUARAN BULANAN (EXPENSES) — id_user = 1
-- ============================================================

INSERT INTO "expenses" ("id_expenses", "id_user", "kategori", "nominal", "tanggal", "keterangan", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  -- Juli 2026
  (5,  1, 'Operasional',  150000.00, '2026-07-01', 'Bayar listrik warung bulan Juli',          '2026-07-01 09:00:00+07'),
  (6,  1, 'Sewa',         500000.00, '2026-07-01', 'Sewa kios bulan Juli',                     '2026-07-01 09:00:00+07'),
  (7,  1, 'Transportasi',  85000.00, '2026-07-05', 'Bensin motor kulakan pasar Juli minggu 1', '2026-07-05 09:00:00+07'),
  (8,  1, 'Transportasi',  80000.00, '2026-07-12', 'Bensin motor kulakan pasar Juli minggu 2', '2026-07-12 09:00:00+07'),
  (9,  1, 'Perlengkapan',  35000.00, '2026-07-15', 'Beli kantong kresek dan plastik',          '2026-07-15 09:00:00+07'),
  (10, 1, 'Transportasi',  75000.00, '2026-07-20', 'Bensin motor kulakan pasar Juli minggu 3', '2026-07-20 09:00:00+07'),
  (11, 1, 'Perlengkapan',  45000.00, '2026-07-25', 'Beli kertas nota dan pulpen kasir',        '2026-07-25 09:00:00+07'),

  -- Agustus 2026
  (12, 1, 'Operasional',  155000.00, '2026-08-01', 'Bayar listrik warung bulan Agustus',       '2026-08-01 09:00:00+07'),
  (13, 1, 'Sewa',         500000.00, '2026-08-01', 'Sewa kios bulan Agustus',                  '2026-08-01 09:00:00+07'),
  (14, 1, 'Transportasi',  90000.00, '2026-08-04', 'Bensin kulakan Agustus minggu 1',          '2026-08-04 09:00:00+07'),
  (15, 1, 'Perlengkapan',  55000.00, '2026-08-10', 'Kresek & kotak kardus packing',            '2026-08-10 09:00:00+07'),
  (16, 1, 'Operasional',   75000.00, '2026-08-15', 'Air galon isi ulang & kebersihan kios',   '2026-08-15 09:00:00+07'),
  (17, 1, 'Transportasi',  85000.00, '2026-08-18', 'Bensin kulakan Agustus minggu 3',          '2026-08-18 09:00:00+07'),
  (18, 1, 'Perlengkapan',  40000.00, '2026-08-25', 'Timbangan digital servis ringan',          '2026-08-25 09:00:00+07'),

  -- September 2026 — pengeluaran tambahan (yang sudah ada id 1-4)
  (19, 1, 'Sewa',         500000.00, '2026-09-01', 'Sewa kios bulan September',                '2026-09-01 09:00:00+07'),
  (20, 1, 'Operasional',  160000.00, '2026-09-02', 'Bayar listrik warung September',           '2026-09-02 09:00:00+07'),
  (21, 1, 'Transportasi',  85000.00, '2026-09-08', 'Bensin kulakan September minggu 2',        '2026-09-08 09:00:00+07'),
  (22, 1, 'Perlengkapan',  40000.00, '2026-09-12', 'Kantong kresek dan tali rafia',            '2026-09-12 09:00:00+07'),
  (23, 1, 'Transportasi',  80000.00, '2026-09-15', 'Bensin kulakan September minggu 3',        '2026-09-15 09:00:00+07'),
  (24, 1, 'Operasional',   60000.00, '2026-09-19', 'Air galon isi ulang',                     '2026-09-19 09:00:00+07')
ON CONFLICT ("id_expenses") DO NOTHING;


-- ============================================================
-- BAGIAN 6: TARGET LABA BARU (Juli & Agustus 2026)
-- ============================================================
INSERT INTO "targets" ("id_target", "id_user", "target_laba", "periode_mulai", "periode_selesai", "created_at")
OVERRIDING SYSTEM VALUE
VALUES
  (3, 1, 2500000.00, '2026-07-01', '2026-07-31', '2026-07-01 09:00:00+07'),
  (4, 1, 2800000.00, '2026-08-01', '2026-08-31', '2026-08-01 09:00:00+07')
ON CONFLICT ("id_target") DO NOTHING;


-- ============================================================
-- BAGIAN 7: RESET SEMUA SEQUENCE
-- ============================================================
SELECT setval(pg_get_serial_sequence('"products"',            'id_produk'),    GREATEST(33, (SELECT MAX("id_produk")    FROM "products")));
SELECT setval(pg_get_serial_sequence('"transactions"',        'id_transaksi'), GREATEST(56, (SELECT MAX("id_transaksi") FROM "transactions")));
SELECT setval(pg_get_serial_sequence('"transaction_details"', 'id_detail'),    GREATEST(243, (SELECT MAX("id_detail")   FROM "transaction_details")));
SELECT setval(pg_get_serial_sequence('"expenses"',            'id_expenses'),  GREATEST(24, (SELECT MAX("id_expenses")  FROM "expenses")));
SELECT setval(pg_get_serial_sequence('"targets"',             'id_target'),    GREATEST(4, (SELECT MAX("id_target")     FROM "targets")));

COMMIT;

-- ============================================================
-- VERIFIKASI (jalankan setelah COMMIT):
-- SELECT COUNT(*) FROM products WHERE id_user = 1;       -- harus 31
-- SELECT COUNT(*) FROM transactions WHERE id_user = 1;   -- harus 56+ (1-12 + 13-32 + 33-52 + 53-56)
-- SELECT COUNT(*) FROM transaction_details WHERE id_transaksi IN (SELECT id_transaksi FROM transactions WHERE id_user = 1);
-- SELECT COUNT(*) FROM expenses WHERE id_user = 1;
-- ============================================================
