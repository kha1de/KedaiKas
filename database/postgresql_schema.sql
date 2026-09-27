-- ============================================================
-- PostgreSQL Schema: project_warung
-- Dikonversi dari: database/project_warung.sql (MariaDB 10.4.32)
-- Target: PostgreSQL 18
-- Tanggal konversi: 2026-09-15
-- ============================================================
-- CATATAN KONVERSI (MariaDB -> PostgreSQL):
--   1. Backtick (`) diganti dengan tanda kutip ganda (") untuk identifier
--   2. ENGINE=InnoDB, CHARSET, COLLATE dihapus (tidak relevan di PostgreSQL)
--   3. AUTO_INCREMENT diganti dengan SERIAL
--   4. int(11) -> INTEGER (lebar tampilan tidak dikenal di PostgreSQL)
--   5. timestamp DEFAULT current_timestamp() -> TIMESTAMPTZ DEFAULT NOW()
--   6. ON UPDATE current_timestamp() -> ditangani lewat trigger
--   7. ADD KEY (non-unique index) -> CREATE INDEX
--   8. PRIMARY KEY / FOREIGN KEY digabung langsung ke CREATE TABLE
--   9. SET SQL_MODE, phpMyAdmin comment blocks -> dihapus
-- ============================================================

BEGIN;

-- ============================================================
-- TABEL: users
-- ============================================================
CREATE TABLE "users" (
    "id_user"    SERIAL          NOT NULL,
    "nama"       VARCHAR(100)    NOT NULL,
    "email"      VARCHAR(100)    NOT NULL,
    "pass"       VARCHAR(255)    NOT NULL,
    "created_at" TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "users_pkey"         PRIMARY KEY ("id_user"),
    CONSTRAINT "users_email_unique" UNIQUE ("email")
);

-- ============================================================
-- TABEL: products
-- ============================================================
CREATE TABLE "products" (
    "id_produk"   SERIAL          NOT NULL,
    "id_user"     INTEGER         DEFAULT NULL,
    "nama_produk" VARCHAR(150)    NOT NULL,
    "kategori"    VARCHAR(100)    DEFAULT NULL,
    "harga_modal" DECIMAL(12,2)   NOT NULL,
    "harga_jual"  DECIMAL(12,2)   NOT NULL,
    "satuan"      VARCHAR(30)     NOT NULL,
    "created_at"  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "products_pkey"   PRIMARY KEY ("id_produk"),
    CONSTRAINT "products_ibfk_1" FOREIGN KEY ("id_user")
        REFERENCES "users" ("id_user") ON DELETE CASCADE
);

CREATE INDEX "idx_products_id_user" ON "products" ("id_user");

-- ============================================================
-- TABEL: transactions
-- ============================================================
CREATE TABLE "transactions" (
    "id_transaksi" SERIAL          NOT NULL,
    "id_user"      INTEGER         DEFAULT NULL,
    "tanggal"      TIMESTAMP       NOT NULL,
    "total"        DECIMAL(12,2)   NOT NULL,
    "created_at"   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "transactions_pkey"   PRIMARY KEY ("id_transaksi"),
    CONSTRAINT "transactions_ibfk_1" FOREIGN KEY ("id_user")
        REFERENCES "users" ("id_user") ON DELETE CASCADE
);

CREATE INDEX "idx_transactions_id_user" ON "transactions" ("id_user");

-- ============================================================
-- TABEL: transaction_details
-- ============================================================
CREATE TABLE "transaction_details" (
    "id_detail"    SERIAL          NOT NULL,
    "id_transaksi" INTEGER         DEFAULT NULL,
    "id_produk"    INTEGER         DEFAULT NULL,
    "jumlah"       INTEGER         NOT NULL,
    "harga_jual"   DECIMAL(12,2)   NOT NULL,
    "subtotal"     DECIMAL(12,2)   NOT NULL,

    CONSTRAINT "transaction_details_pkey"   PRIMARY KEY ("id_detail"),
    CONSTRAINT "transaction_details_ibfk_1" FOREIGN KEY ("id_transaksi")
        REFERENCES "transactions" ("id_transaksi") ON DELETE CASCADE,
    CONSTRAINT "transaction_details_ibfk_2" FOREIGN KEY ("id_produk")
        REFERENCES "products" ("id_produk") ON DELETE CASCADE
);

CREATE INDEX "idx_td_id_transaksi" ON "transaction_details" ("id_transaksi");
CREATE INDEX "idx_td_id_produk"    ON "transaction_details" ("id_produk");

-- ============================================================
-- TABEL: expenses
-- ============================================================
CREATE TABLE "expenses" (
    "id_expenses" SERIAL          NOT NULL,
    "id_user"     INTEGER         DEFAULT NULL,
    "kategori"    VARCHAR(100)    NOT NULL,
    "nominal"     DECIMAL(12,2)   NOT NULL,
    "tanggal"     DATE            NOT NULL,
    "keterangan"  TEXT            DEFAULT NULL,
    "created_at"  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "expenses_pkey"   PRIMARY KEY ("id_expenses"),
    CONSTRAINT "expenses_ibfk_1" FOREIGN KEY ("id_user")
        REFERENCES "users" ("id_user") ON DELETE CASCADE
);

CREATE INDEX "idx_expenses_id_user" ON "expenses" ("id_user");

-- ============================================================
-- TABEL: targets
-- ============================================================
CREATE TABLE "targets" (
    "id_target"       SERIAL          NOT NULL,
    "id_user"         INTEGER         DEFAULT NULL,
    "target_laba"     DECIMAL(12,2)   NOT NULL,
    "periode_mulai"   DATE            NOT NULL,
    "periode_selesai" DATE            NOT NULL,
    "created_at"      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "targets_pkey"   PRIMARY KEY ("id_target"),
    CONSTRAINT "targets_ibfk_1" FOREIGN KEY ("id_user")
        REFERENCES "users" ("id_user") ON DELETE CASCADE
);

CREATE INDEX "idx_targets_id_user" ON "targets" ("id_user");

-- ============================================================
-- TABEL: price_references
-- ============================================================
-- CATATAN: Kolom "updated_at" menggunakan ON UPDATE current_timestamp() di MariaDB.
-- PostgreSQL tidak mendukung sintaks tersebut secara native pada kolom definition.
-- Solusi: gunakan trigger BEFORE UPDATE untuk memperbarui kolom ini secara otomatis.
-- ============================================================
CREATE TABLE "price_references" (
    "id_analisis" SERIAL          NOT NULL,
    "nama_produk" VARCHAR(150)    NOT NULL,
    "kategori"    VARCHAR(100)    DEFAULT NULL,
    "harga_min"   DECIMAL(12,2)   NOT NULL,
    "harga_max"   DECIMAL(12,2)   NOT NULL,
    "satuan"      VARCHAR(30)     NOT NULL,
    "sumber"      VARCHAR(255)    DEFAULT NULL,
    "updated_at"  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "price_references_pkey" PRIMARY KEY ("id_analisis")
);

-- Trigger function untuk mengemulasi ON UPDATE current_timestamp()
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_price_references_updated_at
BEFORE UPDATE ON "price_references"
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- Reset sequence SERIAL setelah seed data dimasukkan.
-- Jalankan blok berikut SETELAH mengeksekusi postgresql_seed.sql:
-- ============================================================
-- SELECT setval(pg_get_serial_sequence('"users"',               'id_user'),      (SELECT MAX("id_user")      FROM "users"));
-- SELECT setval(pg_get_serial_sequence('"products"',            'id_produk'),    (SELECT MAX("id_produk")    FROM "products"));
-- SELECT setval(pg_get_serial_sequence('"transactions"',        'id_transaksi'), (SELECT MAX("id_transaksi") FROM "transactions"));
-- SELECT setval(pg_get_serial_sequence('"transaction_details"', 'id_detail'),    (SELECT MAX("id_detail")    FROM "transaction_details"));
-- SELECT setval(pg_get_serial_sequence('"expenses"',            'id_expenses'),  (SELECT MAX("id_expenses")  FROM "expenses"));
-- SELECT setval(pg_get_serial_sequence('"targets"',             'id_target'),    (SELECT MAX("id_target")    FROM "targets"));
-- SELECT setval(pg_get_serial_sequence('"price_references"',    'id_analisis'),  (SELECT MAX("id_analisis")  FROM "price_references"));

COMMIT;
