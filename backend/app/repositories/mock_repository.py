import threading
from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import List, Optional, Dict, Any
from app.repositories.base import BaseRepository
from app.core.security import hash_password

class MockRepository(BaseRepository):
    """
    In-memory repository pre-seeded with realistic UMKM Warung data.
    Ensures the system is 100% runnable without external database dependencies.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._init_data()

    def _init_data(self):
        today = date.today()
        now = datetime.now()

        # 1. Users
        # Pre-hashed 'password123'
        hashed_pwd = hash_password("password123")
        self.users: List[Dict[str, Any]] = [
            {
                "id": 1,
                "nama": "Budi Santoso",
                "email": "budi@warung.com",
                "password": hashed_pwd,
                "created_at": now - timedelta(days=30)
            }
        ]

        # 2. Products (user_id = 1)
        self.products: List[Dict[str, Any]] = [
            {
                "id": 1,
                "user_id": 1,
                "nama_produk": "Indomie Goreng",
                "kategori": "Makanan",
                "harga_modal": Decimal("2500.00"),
                "harga_jual": Decimal("6000.00"),
                "satuan": "porsi",
                "created_at": now - timedelta(days=14)
            },
            {
                "id": 2,
                "user_id": 1,
                "nama_produk": "Es Teh Manis",
                "kategori": "Minuman",
                "harga_modal": Decimal("1000.00"),
                "harga_jual": Decimal("3000.00"),
                "satuan": "gelas",
                "created_at": now - timedelta(days=14)
            },
            {
                "id": 3,
                "user_id": 1,
                "nama_produk": "Kopi Hitam",
                "kategori": "Minuman",
                "harga_modal": Decimal("1500.00"),
                "harga_jual": Decimal("4000.00"),
                "satuan": "cangkir",
                "created_at": now - timedelta(days=14)
            },
            {
                "id": 4,
                "user_id": 1,
                "nama_produk": "Gorengan Bakwan",
                "kategori": "Makanan Ringan",
                "harga_modal": Decimal("500.00"),
                "harga_jual": Decimal("1200.00"),
                "satuan": "biji",
                "created_at": now - timedelta(days=14)
            },
            {
                "id": 5,
                "user_id": 1,
                "nama_produk": "Air Mineral 600ml",
                "kategori": "Minuman",
                "harga_modal": Decimal("2000.00"),
                "harga_jual": Decimal("3500.00"),
                "satuan": "botol",
                "created_at": now - timedelta(days=14)
            }
        ]

        # 3. Price References
        self.price_references: List[Dict[str, Any]] = [
            {
                "id": 1,
                "nama_produk": "Indomie Goreng",
                "kategori": "Makanan",
                "harga_min": Decimal("5000.00"),
                "harga_max": Decimal("7000.00"),
                "satuan": "porsi",
                "sumber": "Survei Pasar Warung Sekitar",
                "updated_at": now
            },
            {
                "id": 2,
                "nama_produk": "Es Teh Manis",
                "kategori": "Minuman",
                "harga_min": Decimal("2500.00"),
                "harga_max": Decimal("4000.00"),
                "satuan": "gelas",
                "sumber": "Survei Pasar Warung Sekitar",
                "updated_at": now
            },
            {
                "id": 3,
                "nama_produk": "Kopi Hitam",
                "kategori": "Minuman",
                "harga_min": Decimal("3000.00"),
                "harga_max": Decimal("5000.00"),
                "satuan": "cangkir",
                "sumber": "Survei Pasar Warung Sekitar",
                "updated_at": now
            },
            {
                "id": 4,
                "nama_produk": "Gorengan Bakwan",
                "kategori": "Makanan Ringan",
                "harga_min": Decimal("1000.00"),
                "harga_max": Decimal("1500.00"),
                "satuan": "biji",
                "sumber": "Survei Pasar Warung Sekitar",
                "updated_at": now
            },
            {
                "id": 5,
                "nama_produk": "Air Mineral 600ml",
                "kategori": "Minuman",
                "harga_min": Decimal("3000.00"),
                "harga_max": Decimal("4500.00"),
                "satuan": "botol",
                "sumber": "Harga Eceran Rata-rata Toko",
                "updated_at": now
            }
        ]

        # 4. Expenses
        self.expenses: List[Dict[str, Any]] = [
            {
                "id": 1,
                "user_id": 1,
                "kategori": "Listrik & Token",
                "nominal": Decimal("150000.00"),
                "tanggal": today - timedelta(days=12),
                "keterangan": "Token listrik warung",
                "created_at": now - timedelta(days=12)
            },
            {
                "id": 2,
                "user_id": 1,
                "kategori": "Bahan Baku",
                "nominal": Decimal("350000.00"),
                "tanggal": today - timedelta(days=10),
                "keterangan": "Belanja minyak goreng, tepung, dan bumbu pelengkap",
                "created_at": now - timedelta(days=10)
            },
            {
                "id": 3,
                "user_id": 1,
                "kategori": "Air Bersih & Gas",
                "nominal": Decimal("80000.00"),
                "tanggal": today - timedelta(days=8),
                "keterangan": "Isi ulang gas elpiji 3kg x2 dan galon air",
                "created_at": now - timedelta(days=8)
            },
            {
                "id": 4,
                "user_id": 1,
                "kategori": "Transportasi",
                "nominal": Decimal("40000.00"),
                "tanggal": today - timedelta(days=6),
                "keterangan": "Bensin motor kulakan ke pasar induk",
                "created_at": now - timedelta(days=6)
            },
            {
                "id": 5,
                "user_id": 1,
                "kategori": "Operasional & Plastik",
                "nominal": Decimal("35000.00"),
                "tanggal": today - timedelta(days=3),
                "keterangan": "Kantong kresek, sedotan, dan tissue makan",
                "created_at": now - timedelta(days=3)
            },
            {
                "id": 6,
                "user_id": 1,
                "kategori": "Bahan Baku",
                "nominal": Decimal("200000.00"),
                "tanggal": today - timedelta(days=1),
                "keterangan": "Belanja tambahan mie instan & kopi",
                "created_at": now - timedelta(days=1)
            }
        ]

        # 5. Targets
        first_day_month = today.replace(day=1)
        # End of current month
        next_month = first_day_month.replace(day=28) + timedelta(days=4)
        last_day_month = next_month - timedelta(days=next_month.day)

        self.targets: List[Dict[str, Any]] = [
            {
                "id": 1,
                "user_id": 1,
                "target_laba": Decimal("3000000.00"),
                "periode_mulai": first_day_month,
                "periode_selesai": last_day_month,
                "created_at": now - timedelta(days=10)
            }
        ]

        # 6. Transactions & Transaction Items
        self.transactions: List[Dict[str, Any]] = []
        self.transaction_items: List[Dict[str, Any]] = []

        tx_data = [
            (1, 7, [
                {"product_id": 1, "jumlah": 5, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("30000.00")},
                {"product_id": 2, "jumlah": 5, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("15000.00")}
            ]),
            (2, 6, [
                {"product_id": 1, "jumlah": 6, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("36000.00")},
                {"product_id": 4, "jumlah": 10, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("12000.00")},
                {"product_id": 2, "jumlah": 6, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("18000.00")}
            ]),
            (3, 5, [
                {"product_id": 3, "jumlah": 8, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("32000.00")},
                {"product_id": 4, "jumlah": 20, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("24000.00")},
                {"product_id": 1, "jumlah": 4, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("24000.00")},
                {"product_id": 5, "jumlah": 1, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("4000.00")}
            ]),
            (4, 4, [
                {"product_id": 1, "jumlah": 10, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("60000.00")},
                {"product_id": 2, "jumlah": 10, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("30000.00")},
                {"product_id": 4, "jumlah": 15, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("18000.00")},
                {"product_id": 3, "jumlah": 1, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("4000.00")}
            ]),
            (5, 3, [
                {"product_id": 1, "jumlah": 8, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("48000.00")},
                {"product_id": 2, "jumlah": 9, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("27000.00")},
                {"product_id": 3, "jumlah": 5, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("20000.00")}
            ]),
            (6, 2, [
                {"product_id": 1, "jumlah": 12, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("72000.00")},
                {"product_id": 2, "jumlah": 12, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("36000.00")},
                {"product_id": 4, "jumlah": 25, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("30000.00")}
            ]),
            (7, 1, [
                {"product_id": 1, "jumlah": 15, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("90000.00")},
                {"product_id": 2, "jumlah": 15, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("45000.00")},
                {"product_id": 4, "jumlah": 15, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("18000.00")},
                {"product_id": 5, "jumlah": 2, "harga_jual": Decimal("3500.00"), "subtotal": Decimal("7000.00")}
            ]),
            (8, 0, [
                {"product_id": 1, "jumlah": 6, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("36000.00")},
                {"product_id": 2, "jumlah": 5, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("15000.00")},
                {"product_id": 3, "jumlah": 4, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("16000.00")},
                {"product_id": 5, "jumlah": 2, "harga_jual": Decimal("3500.00"), "subtotal": Decimal("7000.00")},
                {"product_id": 4, "jumlah": 1, "harga_jual": Decimal("1000.00"), "subtotal": Decimal("1000.00")}
            ])
        ]

        item_id_counter = 1
        for tx_id, days_ago, items in tx_data:
            tx_time = now - timedelta(days=days_ago)
            total = sum(i["subtotal"] for i in items)
            self.transactions.append({
                "id": tx_id,
                "user_id": 1,
                "tanggal": tx_time,
                "total": total,
                "created_at": tx_time
            })
            for item in items:
                self.transaction_items.append({
                    "id": item_id_counter,
                    "transaction_id": tx_id,
                    "product_id": item["product_id"],
                    "jumlah": item["jumlah"],
                    "harga_jual": item["harga_jual"],
                    "subtotal": item["subtotal"]
                })
                item_id_counter += 1

    # --- USERS ---
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for u in self.users:
                if u["id"] == user_id:
                    return u.copy()
            return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            for u in self.users:
                if u["email"].lower() == email.lower():
                    return u.copy()
            return None

    def create_user(self, nama: str, email: str, password_hash: str) -> Dict[str, Any]:
        with self._lock:
            new_id = max([u["id"] for u in self.users], default=0) + 1
            user = {
                "id": new_id,
                "nama": nama,
                "email": email,
                "password": password_hash,
                "created_at": datetime.now()
            }
            self.users.append(user)
            return user.copy()

    # --- PRODUCTS ---
    def get_products(self, user_id: int) -> List[Dict[str, Any]]:
        with self._lock:
            return [p.copy() for p in self.products if p["user_id"] == user_id]

    def get_product_by_id(self, user_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for p in self.products:
                if p["id"] == product_id and p["user_id"] == user_id:
                    return p.copy()
            return None

    def create_product(self, user_id: int, product_data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            new_id = max([p["id"] for p in self.products], default=0) + 1
            product = {
                "id": new_id,
                "user_id": user_id,
                "nama_produk": product_data["nama_produk"],
                "kategori": product_data.get("kategori"),
                "harga_modal": Decimal(str(product_data["harga_modal"])),
                "harga_jual": Decimal(str(product_data["harga_jual"])),
                "satuan": product_data["satuan"],
                "created_at": datetime.now()
            }
            self.products.append(product)
            return product.copy()

    def update_product(self, user_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for p in self.products:
                if p["id"] == product_id and p["user_id"] == user_id:
                    if "nama_produk" in product_data and product_data["nama_produk"] is not None:
                        p["nama_produk"] = product_data["nama_produk"]
                    if "kategori" in product_data and product_data["kategori"] is not None:
                        p["kategori"] = product_data["kategori"]
                    if "harga_modal" in product_data and product_data["harga_modal"] is not None:
                        p["harga_modal"] = Decimal(str(product_data["harga_modal"]))
                    if "harga_jual" in product_data and product_data["harga_jual"] is not None:
                        p["harga_jual"] = Decimal(str(product_data["harga_jual"]))
                    if "satuan" in product_data and product_data["satuan"] is not None:
                        p["satuan"] = product_data["satuan"]
                    return p.copy()
            return None

    def delete_product(self, user_id: int, product_id: int) -> bool:
        with self._lock:
            for i, p in enumerate(self.products):
                if p["id"] == product_id and p["user_id"] == user_id:
                    self.products.pop(i)
                    return True
            return False

    # --- TRANSACTIONS ---
    def get_transactions(self, user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        with self._lock:
            result = []
            # Map products by id for name lookup
            prod_map = {p["id"]: p["nama_produk"] for p in self.products}
            
            for tx in sorted(self.transactions, key=lambda x: x["tanggal"], reverse=True):
                if tx["user_id"] == user_id:
                    if start_date and tx["tanggal"] < start_date:
                        continue
                    if end_date and tx["tanggal"] > end_date:
                        continue
                    tx_dict = tx.copy()
                    # attach items
                    items = [
                        {
                            **it.copy(),
                            "nama_produk": prod_map.get(it["product_id"], "Produk")
                        }
                        for it in self.transaction_items
                        if it["transaction_id"] == tx["id"]
                    ]
                    tx_dict["items"] = items
                    result.append(tx_dict)
            return result

    def get_transaction_by_id(self, user_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            prod_map = {p["id"]: p["nama_produk"] for p in self.products}
            for tx in self.transactions:
                if tx["id"] == transaction_id and tx["user_id"] == user_id:
                    tx_dict = tx.copy()
                    items = [
                        {
                            **it.copy(),
                            "nama_produk": prod_map.get(it["product_id"], "Produk")
                        }
                        for it in self.transaction_items
                        if it["transaction_id"] == tx["id"]
                    ]
                    tx_dict["items"] = items
                    return tx_dict
            return None

    def create_transaction(self, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        with self._lock:
            new_tx_id = max([t["id"] for t in self.transactions], default=0) + 1
            tx = {
                "id": new_tx_id,
                "user_id": user_id,
                "tanggal": tanggal,
                "total": total,
                "created_at": datetime.now()
            }
            self.transactions.append(tx)

            created_items = []
            item_id_counter = max([it["id"] for it in self.transaction_items], default=0) + 1
            prod_map = {p["id"]: p["nama_produk"] for p in self.products}

            for item in items:
                it = {
                    "id": item_id_counter,
                    "transaction_id": new_tx_id,
                    "product_id": item["product_id"],
                    "jumlah": item["jumlah"],
                    "harga_jual": item["harga_jual"],
                    "subtotal": item["subtotal"]
                }
                self.transaction_items.append(it)
                item_dict = it.copy()
                item_dict["nama_produk"] = prod_map.get(item["product_id"], "Produk")
                created_items.append(item_dict)
                item_id_counter += 1

            res = tx.copy()
            res["items"] = created_items
            return res

    def delete_transaction(self, user_id: int, transaction_id: int) -> bool:
        with self._lock:
            tx_found = None
            for i, tx in enumerate(self.transactions):
                if tx["id"] == transaction_id and tx["user_id"] == user_id:
                    tx_found = i
                    break
            if tx_found is not None:
                self.transactions.pop(tx_found)
                self.transaction_items = [it for it in self.transaction_items if it["transaction_id"] != transaction_id]
                return True
            return False

    # --- EXPENSES ---
    def get_expenses(self, user_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        with self._lock:
            result = []
            for exp in sorted(self.expenses, key=lambda x: x["tanggal"], reverse=True):
                if exp["user_id"] == user_id:
                    if start_date and exp["tanggal"] < start_date:
                        continue
                    if end_date and exp["tanggal"] > end_date:
                        continue
                    result.append(exp.copy())
            return result

    def get_expense_by_id(self, user_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for exp in self.expenses:
                if exp["id"] == expense_id and exp["user_id"] == user_id:
                    return exp.copy()
            return None

    def create_expense(self, user_id: int, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            new_id = max([e["id"] for e in self.expenses], default=0) + 1
            exp = {
                "id": new_id,
                "user_id": user_id,
                "kategori": expense_data["kategori"],
                "nominal": Decimal(str(expense_data["nominal"])),
                "tanggal": expense_data["tanggal"],
                "keterangan": expense_data.get("keterangan"),
                "created_at": datetime.now()
            }
            self.expenses.append(exp)
            return exp.copy()

    def update_expense(self, user_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for exp in self.expenses:
                if exp["id"] == expense_id and exp["user_id"] == user_id:
                    if "kategori" in expense_data and expense_data["kategori"] is not None:
                        exp["kategori"] = expense_data["kategori"]
                    if "nominal" in expense_data and expense_data["nominal"] is not None:
                        exp["nominal"] = Decimal(str(expense_data["nominal"]))
                    if "tanggal" in expense_data and expense_data["tanggal"] is not None:
                        exp["tanggal"] = expense_data["tanggal"]
                    if "keterangan" in expense_data:
                        exp["keterangan"] = expense_data["keterangan"]
                    return exp.copy()
            return None

    def delete_expense(self, user_id: int, expense_id: int) -> bool:
        with self._lock:
            for i, exp in enumerate(self.expenses):
                if exp["id"] == expense_id and exp["user_id"] == user_id:
                    self.expenses.pop(i)
                    return True
            return False

    # --- TARGETS ---
    def get_targets(self, user_id: int) -> List[Dict[str, Any]]:
        with self._lock:
            return [t.copy() for t in self.targets if t["user_id"] == user_id]

    def get_latest_target(self, user_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            user_targets = [t for t in self.targets if t["user_id"] == user_id]
            if not user_targets:
                return None
            return sorted(user_targets, key=lambda x: x["created_at"], reverse=True)[0].copy()

    def create_target(self, user_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date) -> Dict[str, Any]:
        with self._lock:
            new_id = max([t["id"] for t in self.targets], default=0) + 1
            t = {
                "id": new_id,
                "user_id": user_id,
                "target_laba": target_laba,
                "periode_mulai": periode_mulai,
                "periode_selesai": periode_selesai,
                "created_at": datetime.now()
            }
            self.targets.append(t)
            return t.copy()

    def update_target(self, user_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for t in self.targets:
                if t["id"] == target_id and t["user_id"] == user_id:
                    if "target_laba" in target_data and target_data["target_laba"] is not None:
                        t["target_laba"] = Decimal(str(target_data["target_laba"]))
                    if "periode_mulai" in target_data and target_data["periode_mulai"] is not None:
                        t["periode_mulai"] = target_data["periode_mulai"]
                    if "periode_selesai" in target_data and target_data["periode_selesai"] is not None:
                        t["periode_selesai"] = target_data["periode_selesai"]
                    return t.copy()
            return None

    # --- PRICE REFERENCES ---
    def get_price_references(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [r.copy() for r in self.price_references]

    def get_price_reference_by_name(self, nama_produk: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            norm_target = nama_produk.strip().lower()
            for r in self.price_references:
                norm_ref = r["nama_produk"].strip().lower()
                if norm_target in norm_ref or norm_ref in norm_target:
                    return r.copy()
            return None
