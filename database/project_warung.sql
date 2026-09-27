-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Sep 2026 pada 14.52
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_warung`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `expenses`
--

CREATE TABLE `expenses` (
  `id_expenses` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `kategori` varchar(100) NOT NULL,
  `nominal` decimal(12,2) NOT NULL,
  `tanggal` date NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `expenses`
--

INSERT INTO `expenses` (`id_expenses`, `id_user`, `kategori`, `nominal`, `tanggal`, `keterangan`, `created_at`) VALUES
(1, 1, 'Operasional', 150000.00, '2026-09-01', 'Bayar listrik warung bulan September', '2026-09-14 12:47:10'),
(2, 1, 'Perlengkapan', 25000.00, '2026-09-05', 'Beli kantong kresek dan isolasi', '2026-09-14 12:47:10'),
(3, 2, 'Transportasi', 50000.00, '2026-09-10', 'Bensin motor untuk kulakan barang', '2026-09-14 12:47:10'),
(4, 2, 'Operasional', 200000.00, '2026-09-12', 'Bayar iuran kebersihan dan keamanan pasar', '2026-09-14 12:47:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `price_references`
--

CREATE TABLE `price_references` (
  `id_analisis` int(11) NOT NULL,
  `nama_produk` varchar(150) NOT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `harga_min` decimal(12,2) NOT NULL,
  `harga_max` decimal(12,2) NOT NULL,
  `satuan` varchar(30) NOT NULL,
  `sumber` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `price_references`
--

INSERT INTO `price_references` (`id_analisis`, `nama_produk`, `kategori`, `harga_min`, `harga_max`, `satuan`, `sumber`, `updated_at`) VALUES
(1, 'Minyak Goreng 1 Liter', 'Sembako', 13500.00, 16000.00, 'Pouch', 'Pasar Induk', '2026-09-14 12:50:57'),
(2, 'Beras Ramos 1 kg', 'Sembako', 12000.00, 14000.00, 'Kg', 'Dinas Perdagangan', '2026-09-14 12:50:57'),
(3, 'Mie Instan Goreng', 'Makanan', 2700.00, 3300.00, 'Pcs', 'Warung Kompetitor A', '2026-09-14 12:50:57'),
(4, 'Es Teh Manis Plastik', 'Minuman', 2500.00, 4000.00, 'Bungkus', 'Rata-rata Lingkungan sekitar', '2026-09-14 12:50:57');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id_produk` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `nama_produk` varchar(150) NOT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `harga_modal` decimal(12,2) NOT NULL,
  `harga_jual` decimal(12,2) NOT NULL,
  `satuan` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id_produk`, `id_user`, `nama_produk`, `kategori`, `harga_modal`, `harga_jual`, `satuan`, `created_at`) VALUES
(1, 1, 'Minyak Goreng 1 Liter', 'Sembako', 14000.00, 16500.00, 'Pouch', '2026-09-14 12:23:52'),
(2, 1, 'Beras Ramos 1 kg', 'Sembako', 12500.00, 14500.00, 'Kg', '2026-09-14 12:23:52'),
(3, 2, 'Mie Instan Goreng', 'Makanan', 2800.00, 3500.00, 'Pcs', '2026-09-14 12:23:52'),
(4, 2, 'Es Teh Manis Plastik', 'Minuman', 1500.00, 3000.00, 'Bungkus', '2026-09-14 12:23:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `targets`
--

CREATE TABLE `targets` (
  `id_target` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `target_laba` decimal(12,2) NOT NULL,
  `periode_mulai` date NOT NULL,
  `periode_selesai` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `targets`
--

INSERT INTO `targets` (`id_target`, `id_user`, `target_laba`, `periode_mulai`, `periode_selesai`, `created_at`) VALUES
(1, 1, 3000000.00, '2026-09-01', '2026-09-30', '2026-09-14 12:48:59'),
(2, 2, 3500000.00, '2026-09-01', '2026-09-30', '2026-09-14 12:48:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `tanggal` datetime NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id_transaksi`, `id_user`, `tanggal`, `total`, `created_at`) VALUES
(1, 1, '2026-09-02 09:30:00', 692500.00, '2026-09-02 09:30:00'),
(2, 1, '2026-09-05 14:15:00', 702500.00, '2026-09-05 14:15:00'),
(3, 2, '2026-09-14 12:00:00', 6500.00, '2026-09-14 12:27:28'),
(4, 2, '2026-09-14 15:45:00', 14000.00, '2026-09-14 12:27:28'),
(5, 1, '2026-09-07 11:00:00', 930000.00, '2026-09-07 11:00:00'),
(6, 1, '2026-09-09 15:45:00', 920000.00, '2026-09-09 15:45:00'),
(7, 1, '2026-09-11 10:20:00', 940000.00, '2026-09-11 10:20:00'),
(8, 1, '2026-09-13 13:30:00', 1002500.00, '2026-09-13 13:30:00'),
(9, 1, '2026-09-14 08:30:00', 1012500.00, '2026-09-14 08:30:00'),
(10, 1, '2026-09-15 16:00:00', 1095000.00, '2026-09-15 16:00:00'),
(11, 1, '2026-09-16 11:15:00', 1075000.00, '2026-09-16 11:15:00'),
(12, 1, '2026-09-17 14:45:00', 930000.00, '2026-09-17 14:45:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id_detail` int(11) NOT NULL,
  `id_transaksi` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `jumlah` int(11) NOT NULL,
  `harga_jual` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaction_details`
--

INSERT INTO `transaction_details` (`id_detail`, `id_transaksi`, `id_produk`, `jumlah`, `harga_jual`, `subtotal`) VALUES
(1, 1, 1, 20, 16500.00, 330000.00),
(2, 1, 2, 25, 14500.00, 362500.00),
(3, 3, 3, 1, 3500.00, 3500.00),
(4, 3, 4, 1, 3000.00, 3000.00),
(5, 2, 1, 25, 16500.00, 412500.00),
(6, 2, 2, 20, 14500.00, 290000.00),
(7, 5, 1, 30, 16500.00, 495000.00),
(8, 5, 2, 30, 14500.00, 435000.00),
(9, 6, 1, 25, 16500.00, 412500.00),
(10, 6, 2, 35, 14500.00, 507500.00),
(11, 7, 1, 35, 16500.00, 577500.00),
(12, 7, 2, 25, 14500.00, 362500.00),
(13, 8, 1, 30, 16500.00, 495000.00),
(14, 8, 2, 35, 14500.00, 507500.00),
(15, 9, 1, 35, 16500.00, 577500.00),
(16, 9, 2, 30, 14500.00, 435000.00),
(17, 10, 1, 40, 16500.00, 660000.00),
(18, 10, 2, 30, 14500.00, 435000.00),
(19, 11, 1, 30, 16500.00, 495000.00),
(20, 11, 2, 40, 14500.00, 580000.00),
(21, 12, 1, 30, 16500.00, 495000.00),
(22, 12, 2, 30, 14500.00, 435000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `nama`, `email`, `pass`, `created_at`) VALUES
(1, 'Ahmad Khairul', 'ah.khairul@gmail.com', '123', '2026-09-14 12:13:50'),
(2, 'Daffa Berlliano', 'daf.berlliano@gmail.com', '123', '2026-09-14 12:13:50'),
(3, 'Darin Hilmi', 'dar.hilmi@gmail.com', '123', '2026-09-14 12:13:50');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id_expenses`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `price_references`
--
ALTER TABLE `price_references`
  ADD PRIMARY KEY (`id_analisis`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `targets`
--
ALTER TABLE `targets`
  ADD PRIMARY KEY (`id_target`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_transaksi` (`id_transaksi`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id_expenses` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `price_references`
--
ALTER TABLE `price_references`
  MODIFY `id_analisis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `targets`
--
ALTER TABLE `targets`
  MODIFY `id_target` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `targets`
--
ALTER TABLE `targets`
  ADD CONSTRAINT `targets_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD CONSTRAINT `transaction_details_ibfk_1` FOREIGN KEY (`id_transaksi`) REFERENCES `transactions` (`id_transaksi`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_details_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `products` (`id_produk`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
