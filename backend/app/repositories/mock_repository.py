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
    Supports Multi-User Single-Business scoping and RBAC roles.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._init_data()

    def _init_data(self):
        today = date.today()
        now = datetime.now()

        # 1. Businesses
        self.businesses: List[Dict[str, Any]] = [
            {
                "id": 1,
                "nama_usaha": "Kedai Berkah UMKM",
                "alamat": "Jl. Merdeka No. 45, Jakarta",
                "created_at": now - timedelta(days=60)
            }
        ]

        # 2. Users (3 Demo Accounts for 1 Business + Legacy Test Users)
        pwd_123 = hash_password("123")
        pwd_budi = hash_password("password123")

        self.users: List[Dict[str, Any]] = [
            {
                "id": 1,
                "id_usaha": 1,
                "nama": "Ahmad Khairul Fatih",
                "email": "ah.khairul@gmail.com",
                "password": pwd_123,
                "role": "kasir",
                "created_at": now - timedelta(days=60)
            },
            {
                "id": 2,
                "id_usaha": 1,
                "nama": "Daffa Berlliano",
                "email": "daf.berlliano@gmail.com",
                "password": pwd_123,
                "role": "manager",
                "created_at": now - timedelta(days=50)
            },
            {
                "id": 3,
                "id_usaha": 1,
                "nama": "Darin Hilmi Azzahra",
                "email": "dar.hilmi@gmail.com",
                "password": pwd_123,
                "role": "owner",
                "created_at": now - timedelta(days=40)
            },
            {
                "id": 4,
                "id_usaha": 1,
                "nama": "Budi Santoso",
                "email": "budi@warung.com",
                "password": pwd_budi,
                "role": "owner",
                "created_at": now - timedelta(days=30)
            }
        ]

        # 3. Products (Scoped to id_usaha = 1)
        self.products: List[Dict[str, Any]] = [
            {
                "id": 1,
                "id_usaha": 1,
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
                "id_usaha": 1,
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
                "id_usaha": 1,
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
                "id_usaha": 1,
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
                "id_usaha": 1,
                "user_id": 1,
                "nama_produk": "Air Mineral 600ml",
                "kategori": "Minuman",
                "harga_modal": Decimal("2000.00"),
                "harga_jual": Decimal("3500.00"),
                "satuan": "botol",
                "created_at": now - timedelta(days=14)
            }
        ]

        # 4. Price References
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

        # 5. Expenses (Scoped to id_usaha = 1)
        self.expenses: List[Dict[str, Any]] = [
            {
                "id": 1,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Listrik & Token",
                "nominal": Decimal("150000.00"),
                "tanggal": today - timedelta(days=12),
                "keterangan": "Token listrik warung",
                "created_at": now - timedelta(days=12)
            },
            {
                "id": 2,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Bahan Baku",
                "nominal": Decimal("350000.00"),
                "tanggal": today - timedelta(days=10),
                "keterangan": "Belanja minyak goreng, tepung, dan bumbu pelengkap",
                "created_at": now - timedelta(days=10)
            },
            {
                "id": 3,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Air Bersih & Gas",
                "nominal": Decimal("80000.00"),
                "tanggal": today - timedelta(days=8),
                "keterangan": "Isi ulang gas elpiji 3kg x2 dan galon air",
                "created_at": now - timedelta(days=8)
            },
            {
                "id": 4,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Transportasi",
                "nominal": Decimal("40000.00"),
                "tanggal": today - timedelta(days=6),
                "keterangan": "Bensin motor kulakan ke pasar induk",
                "created_at": now - timedelta(days=6)
            },
            {
                "id": 5,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Operasional & Plastik",
                "nominal": Decimal("35000.00"),
                "tanggal": today - timedelta(days=3),
                "keterangan": "Kantong kresek, sedotan, dan tissue makan",
                "created_at": now - timedelta(days=3)
            },
            {
                "id": 6,
                "id_usaha": 1,
                "user_id": 1,
                "kategori": "Bahan Baku",
                "nominal": Decimal("200000.00"),
                "tanggal": today - timedelta(days=1),
                "keterangan": "Belanja tambahan mie instan & kopi",
                "created_at": now - timedelta(days=1)
            }
        ]

        # 6. Targets (Scoped to id_usaha = 1)
        first_day_month = today.replace(day=1)
        next_month = first_day_month.replace(day=28) + timedelta(days=4)
        last_day_month = next_month - timedelta(days=next_month.day)

        self.targets: List[Dict[str, Any]] = [
            {
                "id": 1,
                "id_usaha": 1,
                "user_id": 1,
                "target_laba": Decimal("3000000.00"),
                "periode_mulai": first_day_month,
                "periode_selesai": last_day_month,
                "created_at": now - timedelta(days=10)
            }
        ]

        # 7. Transactions & Transaction Items (Scoped to id_usaha = 1)
        self.transactions: List[Dict[str, Any]] = []
        self.transaction_items: List[Dict[str, Any]] = []

        tx_data = [
            (1, 7, 3, [
                {"product_id": 1, "jumlah": 5, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("30000.00")},
                {"product_id": 2, "jumlah": 5, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("15000.00")}
            ]),
            (2, 6, 3, [
                {"product_id": 1, "jumlah": 6, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("36000.00")},
                {"product_id": 4, "jumlah": 10, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("12000.00")},
                {"product_id": 2, "jumlah": 6, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("18000.00")}
            ]),
            (3, 5, 1, [
                {"product_id": 3, "jumlah": 8, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("32000.00")},
                {"product_id": 4, "jumlah": 20, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("24000.00")},
                {"product_id": 1, "jumlah": 4, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("24000.00")},
                {"product_id": 5, "jumlah": 1, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("4000.00")}
            ]),
            (4, 4, 2, [
                {"product_id": 1, "jumlah": 10, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("60000.00")},
                {"product_id": 2, "jumlah": 10, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("30000.00")},
                {"product_id": 4, "jumlah": 15, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("18000.00")},
                {"product_id": 3, "jumlah": 1, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("4000.00")}
            ]),
            (5, 3, 3, [
                {"product_id": 1, "jumlah": 8, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("48000.00")},
                {"product_id": 2, "jumlah": 9, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("27000.00")},
                {"product_id": 3, "jumlah": 5, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("20000.00")}
            ]),
            (6, 2, 3, [
                {"product_id": 1, "jumlah": 12, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("72000.00")},
                {"product_id": 2, "jumlah": 12, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("36000.00")},
                {"product_id": 4, "jumlah": 25, "harga_jual": Decimal("1200.00"), "subtotal": Decimal("30000.00")}
            ]),
            (7, 1, 3, [
                {"product_id": 1, "jumlah": 10, "harga_jual": Decimal("6000.00"), "subtotal": Decimal("60000.00")},
                {"product_id": 2, "jumlah": 8, "harga_jual": Decimal("3000.00"), "subtotal": Decimal("24000.00")},
                {"product_id": 5, "jumlah": 3, "harga_jual": Decimal("4000.00"), "subtotal": Decimal("12000.00")}
            ])
        ]

        item_id_counter = 1
        for tx_id, days_ago, cashier_id, items in tx_data:
            tx_time = now - timedelta(days=days_ago)
            total = sum(i["subtotal"] for i in items)
            self.transactions.append({
                "id": tx_id,
                "id_usaha": 1,
                "user_id": cashier_id,
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

    def get_users_by_business(self, business_id: int) -> List[Dict[str, Any]]:
        with self._lock:
            return [
                {
                    "id": u["id"],
                    "id_usaha": u["id_usaha"],
                    "nama": u["nama"],
                    "email": u["email"],
                    "role": u.get("role", "kasir"),
                    "created_at": u["created_at"]
                }
                for u in self.users
                if u.get("id_usaha") == business_id
            ]

    def create_user(self, nama: str, email: str, password_hash: str, role: str = "kasir", id_usaha: int = 1) -> Dict[str, Any]:
        with self._lock:
            new_id = max([u["id"] for u in self.users], default=0) + 1
            user = {
                "id": new_id,
                "id_usaha": id_usaha,
                "nama": nama,
                "email": email,
                "password": password_hash,
                "role": role,
                "created_at": datetime.now()
            }
            self.users.append(user)
            return user.copy()

    def update_user_role(self, user_id: int, role: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            for u in self.users:
                if u["id"] == user_id:
                    u["role"] = role
                    return u.copy()
            return None

    def delete_user(self, user_id: int) -> bool:
        with self._lock:
            for i, u in enumerate(self.users):
                if u["id"] == user_id:
                    self.users.pop(i)
                    return True
            return False

    # --- BUSINESSES ---
    def get_business_by_id(self, business_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for b in self.businesses:
                if b["id"] == business_id:
                    return b.copy()
            return None

    def update_business(self, business_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for b in self.businesses:
                if b["id"] == business_id:
                    if "nama_usaha" in data:
                        b["nama_usaha"] = data["nama_usaha"]
                    if "alamat" in data:
                        b["alamat"] = data["alamat"]
                    return b.copy()
            return None

    # --- PRODUCTS (Scoped by business_id) ---
    def get_products(self, business_id: int) -> List[Dict[str, Any]]:
        with self._lock:
            return [p.copy() for p in self.products if p.get("id_usaha", 1) == business_id]

    def get_product_by_id(self, business_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for p in self.products:
                if p["id"] == product_id and p.get("id_usaha", 1) == business_id:
                    return p.copy()
            return None

    def create_product(self, business_id: int, product_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        with self._lock:
            new_id = max([p["id"] for p in self.products], default=0) + 1
            product = {
                "id": new_id,
                "id_usaha": business_id,
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

    def update_product(self, business_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for p in self.products:
                if p["id"] == product_id and p.get("id_usaha", 1) == business_id:
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

    def delete_product(self, business_id: int, product_id: int) -> bool:
        with self._lock:
            for i, p in enumerate(self.products):
                if p["id"] == product_id and p.get("id_usaha", 1) == business_id:
                    self.products.pop(i)
                    return True
            return False

    # --- TRANSACTIONS (Scoped by business_id) ---
    def get_transactions(self, business_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        with self._lock:
            result = []
            prod_map = {p["id"]: p["nama_produk"] for p in self.products}
            user_map = {u["id"]: u["nama"] for u in self.users}
            
            for tx in sorted(self.transactions, key=lambda x: x["tanggal"], reverse=True):
                if tx.get("id_usaha", 1) == business_id:
                    if start_date and tx["tanggal"] < start_date:
                        continue
                    if end_date and tx["tanggal"] > end_date:
                        continue
                    tx_dict = tx.copy()
                    tx_dict["nama_kasir"] = user_map.get(tx.get("user_id"), "Kasir")
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

    def get_transaction_by_id(self, business_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            prod_map = {p["id"]: p["nama_produk"] for p in self.products}
            user_map = {u["id"]: u["nama"] for u in self.users}
            for tx in self.transactions:
                if tx["id"] == transaction_id and tx.get("id_usaha", 1) == business_id:
                    tx_dict = tx.copy()
                    tx_dict["nama_kasir"] = user_map.get(tx.get("user_id"), "Kasir")
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

    def create_transaction(self, business_id: int, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        with self._lock:
            new_tx_id = max([t["id"] for t in self.transactions], default=0) + 1
            user_map = {u["id"]: u["nama"] for u in self.users}
            tx = {
                "id": new_tx_id,
                "id_usaha": business_id,
                "user_id": user_id,
                "nama_kasir": user_map.get(user_id, "Kasir"),
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

    def delete_transaction(self, business_id: int, transaction_id: int) -> bool:
        with self._lock:
            tx_found = None
            for i, tx in enumerate(self.transactions):
                if tx["id"] == transaction_id and tx.get("id_usaha", 1) == business_id:
                    tx_found = i
                    break
            if tx_found is not None:
                self.transactions.pop(tx_found)
                self.transaction_items = [it for it in self.transaction_items if it["transaction_id"] != transaction_id]
                return True
            return False

    # --- EXPENSES (Scoped by business_id) ---
    def get_expenses(self, business_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        with self._lock:
            result = []
            for exp in sorted(self.expenses, key=lambda x: x["tanggal"], reverse=True):
                if exp.get("id_usaha", 1) == business_id:
                    if start_date and exp["tanggal"] < start_date:
                        continue
                    if end_date and exp["tanggal"] > end_date:
                        continue
                    result.append(exp.copy())
            return result

    def get_expense_by_id(self, business_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            for exp in self.expenses:
                if exp["id"] == expense_id and exp.get("id_usaha", 1) == business_id:
                    return exp.copy()
            return None

    def create_expense(self, business_id: int, expense_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        with self._lock:
            new_id = max([e["id"] for e in self.expenses], default=0) + 1
            exp = {
                "id": new_id,
                "id_usaha": business_id,
                "user_id": user_id,
                "kategori": expense_data["kategori"],
                "nominal": Decimal(str(expense_data["nominal"])),
                "tanggal": expense_data["tanggal"],
                "keterangan": expense_data.get("keterangan"),
                "created_at": datetime.now()
            }
            self.expenses.append(exp)
            return exp.copy()

    def update_expense(self, business_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for exp in self.expenses:
                if exp["id"] == expense_id and exp.get("id_usaha", 1) == business_id:
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

    def delete_expense(self, business_id: int, expense_id: int) -> bool:
        with self._lock:
            for i, exp in enumerate(self.expenses):
                if exp["id"] == expense_id and exp.get("id_usaha", 1) == business_id:
                    self.expenses.pop(i)
                    return True
            return False

    # --- TARGETS (Scoped by business_id) ---
    def get_targets(self, business_id: int) -> List[Dict[str, Any]]:
        with self._lock:
            return [t.copy() for t in self.targets if t.get("id_usaha", 1) == business_id]

    def get_latest_target(self, business_id: int) -> Optional[Dict[str, Any]]:
        with self._lock:
            b_targets = [t for t in self.targets if t.get("id_usaha", 1) == business_id]
            if not b_targets:
                return None
            return sorted(b_targets, key=lambda x: x["created_at"], reverse=True)[0].copy()

    def create_target(self, business_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date, user_id: Optional[int] = None) -> Dict[str, Any]:
        with self._lock:
            new_id = max([t["id"] for t in self.targets], default=0) + 1
            t = {
                "id": new_id,
                "id_usaha": business_id,
                "user_id": user_id,
                "target_laba": target_laba,
                "periode_mulai": periode_mulai,
                "periode_selesai": periode_selesai,
                "created_at": datetime.now()
            }
            self.targets.append(t)
            return t.copy()

    def update_target(self, business_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self._lock:
            for t in self.targets:
                if t["id"] == target_id and t.get("id_usaha", 1) == business_id:
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
