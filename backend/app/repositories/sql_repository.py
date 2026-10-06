from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.repositories.base import BaseRepository
from app.models.business import Business
from app.models.user import User
from app.models.product import Product
from app.models.transaction import Transaction
from app.models.transaction_item import TransactionItem
from app.models.expense import Expense
from app.models.target import Target
from app.models.price_reference import PriceReference

class SqlRepository(BaseRepository):
    """
    SQLAlchemy repository implementation for PostgreSQL.
    Implements Multi-User Single-Business data scoping and RBAC support.
    """
    def __init__(self, db_session: Session):
        self.db = db_session

    # --- USERS ---
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return {
            "id": user.id,
            "id_usaha": user.business_id if user.business_id is not None else 1,
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "role": user.role if user.role else "kasir",
            "created_at": user.created_at
        }

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user = self.db.query(User).filter(User.email.ilike(email)).first()
        if not user:
            return None
        return {
            "id": user.id,
            "id_usaha": user.business_id if user.business_id is not None else 1,
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "role": user.role if user.role else "kasir",
            "created_at": user.created_at
        }

    def get_users_by_business(self, business_id: int) -> List[Dict[str, Any]]:
        users = self.db.query(User).filter(User.business_id == business_id).order_by(User.id).all()
        return [
            {
                "id": u.id,
                "id_usaha": u.business_id,
                "nama": u.nama,
                "email": u.email,
                "role": u.role,
                "created_at": u.created_at
            }
            for u in users
        ]

    def create_user(self, nama: str, email: str, password_hash: str, role: str = "kasir", id_usaha: int = 1) -> Dict[str, Any]:
        user = User(nama=nama, email=email, password=password_hash, role=role, business_id=id_usaha)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return {
            "id": user.id,
            "id_usaha": user.business_id,
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "role": user.role,
            "created_at": user.created_at
        }

    def update_user_role(self, user_id: int, role: str) -> Optional[Dict[str, Any]]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        user.role = role
        self.db.commit()
        self.db.refresh(user)
        return {
            "id": user.id,
            "id_usaha": user.business_id,
            "nama": user.nama,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at
        }

    def delete_user(self, user_id: int) -> bool:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True

    # --- BUSINESSES ---
    def get_business_by_id(self, business_id: int) -> Optional[Dict[str, Any]]:
        b = self.db.query(Business).filter(Business.id == business_id).first()
        if not b:
            return None
        return {
            "id": b.id,
            "nama_usaha": b.nama_usaha,
            "alamat": b.alamat,
            "created_at": b.created_at
        }

    def update_business(self, business_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        b = self.db.query(Business).filter(Business.id == business_id).first()
        if not b:
            return None
        if "nama_usaha" in data and data["nama_usaha"]:
            b.nama_usaha = data["nama_usaha"]
        if "alamat" in data:
            b.alamat = data["alamat"]
        self.db.commit()
        self.db.refresh(b)
        return {
            "id": b.id,
            "nama_usaha": b.nama_usaha,
            "alamat": b.alamat,
            "created_at": b.created_at
        }

    # --- PRODUCTS (Scoped by business_id) ---
    def get_products(self, business_id: int) -> List[Dict[str, Any]]:
        products = self.db.query(Product).filter(Product.business_id == business_id).order_by(Product.id).all()
        return [
            {
                "id": p.id,
                "id_usaha": p.business_id,
                "user_id": p.user_id,
                "nama_produk": p.nama_produk,
                "kategori": p.kategori,
                "harga_modal": Decimal(str(p.harga_modal)),
                "harga_jual": Decimal(str(p.harga_jual)),
                "satuan": p.satuan,
                "created_at": p.created_at
            }
            for p in products
        ]

    def get_product_by_id(self, business_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        p = self.db.query(Product).filter(Product.id == product_id, Product.business_id == business_id).first()
        if not p:
            return None
        return {
            "id": p.id,
            "id_usaha": p.business_id,
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def create_product(self, business_id: int, product_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        p = Product(
            business_id=business_id,
            user_id=user_id,
            nama_produk=product_data["nama_produk"],
            kategori=product_data.get("kategori"),
            harga_modal=product_data["harga_modal"],
            harga_jual=product_data["harga_jual"],
            satuan=product_data["satuan"]
        )
        self.db.add(p)
        self.db.commit()
        self.db.refresh(p)
        return {
            "id": p.id,
            "id_usaha": p.business_id,
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def update_product(self, business_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        p = self.db.query(Product).filter(Product.id == product_id, Product.business_id == business_id).first()
        if not p:
            return None
        if "nama_produk" in product_data and product_data["nama_produk"] is not None:
            p.nama_produk = product_data["nama_produk"]
        if "kategori" in product_data and product_data["kategori"] is not None:
            p.kategori = product_data["kategori"]
        if "harga_modal" in product_data and product_data["harga_modal"] is not None:
            p.harga_modal = product_data["harga_modal"]
        if "harga_jual" in product_data and product_data["harga_jual"] is not None:
            p.harga_jual = product_data["harga_jual"]
        if "satuan" in product_data and product_data["satuan"] is not None:
            p.satuan = product_data["satuan"]
        self.db.commit()
        self.db.refresh(p)
        return {
            "id": p.id,
            "id_usaha": p.business_id,
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def delete_product(self, business_id: int, product_id: int) -> bool:
        p = self.db.query(Product).filter(Product.id == product_id, Product.business_id == business_id).first()
        if not p:
            return False
        self.db.delete(p)
        self.db.commit()
        return True

    # --- TRANSACTIONS (Scoped by business_id, cashier recorded in user_id) ---
    def get_transactions(self, business_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        q = self.db.query(Transaction).filter(Transaction.business_id == business_id)
        if start_date:
            q = q.filter(Transaction.tanggal >= start_date)
        if end_date:
            q = q.filter(Transaction.tanggal <= end_date)
        transactions = q.order_by(desc(Transaction.tanggal)).all()

        result = []
        for t in transactions:
            items = [
                {
                    "id": item.id,
                    "transaction_id": item.transaction_id,
                    "product_id": item.product_id,
                    "nama_produk": item.product.nama_produk if item.product else "Produk",
                    "jumlah": item.jumlah,
                    "harga_jual": Decimal(str(item.harga_jual)),
                    "subtotal": Decimal(str(item.subtotal))
                }
                for item in t.items
            ]
            result.append({
                "id": t.id,
                "id_usaha": t.business_id,
                "user_id": t.user_id,
                "nama_kasir": t.user.nama if t.user else "Kasir",
                "tanggal": t.tanggal,
                "total": Decimal(str(t.total)),
                "created_at": t.created_at,
                "items": items
            })
        return result

    def get_transaction_by_id(self, business_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        t = self.db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.business_id == business_id).first()
        if not t:
            return None
        items = [
            {
                "id": item.id,
                "transaction_id": item.transaction_id,
                "product_id": item.product_id,
                "nama_produk": item.product.nama_produk if item.product else "Produk",
                "jumlah": item.jumlah,
                "harga_jual": Decimal(str(item.harga_jual)),
                "subtotal": Decimal(str(item.subtotal))
            }
            for item in t.items
        ]
        return {
            "id": t.id,
            "id_usaha": t.business_id,
            "user_id": t.user_id,
            "nama_kasir": t.user.nama if t.user else "Kasir",
            "tanggal": t.tanggal,
            "total": Decimal(str(t.total)),
            "created_at": t.created_at,
            "items": items
        }

    def create_transaction(self, business_id: int, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        tx = Transaction(business_id=business_id, user_id=user_id, tanggal=tanggal, total=total)
        self.db.add(tx)
        self.db.flush()

        created_items = []
        for it in items:
            tx_item = TransactionItem(
                transaction_id=tx.id,
                product_id=it["product_id"],
                jumlah=it["jumlah"],
                harga_jual=it["harga_jual"],
                subtotal=it["subtotal"]
            )
            self.db.add(tx_item)
            self.db.flush()
            
            p = self.db.query(Product).filter(Product.id == it["product_id"]).first()
            created_items.append({
                "id": tx_item.id,
                "transaction_id": tx.id,
                "product_id": tx_item.product_id,
                "nama_produk": p.nama_produk if p else "Produk",
                "jumlah": tx_item.jumlah,
                "harga_jual": Decimal(str(tx_item.harga_jual)),
                "subtotal": Decimal(str(tx_item.subtotal))
            })

        self.db.commit()
        self.db.refresh(tx)

        return {
            "id": tx.id,
            "id_usaha": tx.business_id,
            "user_id": tx.user_id,
            "nama_kasir": tx.user.nama if tx.user else "Kasir",
            "tanggal": tx.tanggal,
            "total": Decimal(str(tx.total)),
            "created_at": tx.created_at,
            "items": created_items
        }

    def delete_transaction(self, business_id: int, transaction_id: int) -> bool:
        t = self.db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.business_id == business_id).first()
        if not t:
            return False
        self.db.delete(t)
        self.db.commit()
        return True

    # --- EXPENSES (Scoped by business_id) ---
    def get_expenses(self, business_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        q = self.db.query(Expense).filter(Expense.business_id == business_id)
        if start_date:
            q = q.filter(Expense.tanggal >= start_date)
        if end_date:
            q = q.filter(Expense.tanggal <= end_date)
        expenses = q.order_by(desc(Expense.tanggal)).all()
        return [
            {
                "id": e.id,
                "id_usaha": e.business_id,
                "user_id": e.user_id,
                "kategori": e.kategori,
                "nominal": Decimal(str(e.nominal)),
                "tanggal": e.tanggal,
                "keterangan": e.keterangan,
                "created_at": e.created_at
            }
            for e in expenses
        ]

    def get_expense_by_id(self, business_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.business_id == business_id).first()
        if not e:
            return None
        return {
            "id": e.id,
            "id_usaha": e.business_id,
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def create_expense(self, business_id: int, expense_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        e = Expense(
            business_id=business_id,
            user_id=user_id,
            kategori=expense_data["kategori"],
            nominal=expense_data["nominal"],
            tanggal=expense_data["tanggal"],
            keterangan=expense_data.get("keterangan")
        )
        self.db.add(e)
        self.db.commit()
        self.db.refresh(e)
        return {
            "id": e.id,
            "id_usaha": e.business_id,
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def update_expense(self, business_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.business_id == business_id).first()
        if not e:
            return None
        if "kategori" in expense_data and expense_data["kategori"] is not None:
            e.kategori = expense_data["kategori"]
        if "nominal" in expense_data and expense_data["nominal"] is not None:
            e.nominal = expense_data["nominal"]
        if "tanggal" in expense_data and expense_data["tanggal"] is not None:
            e.tanggal = expense_data["tanggal"]
        if "keterangan" in expense_data:
            e.keterangan = expense_data["keterangan"]
        self.db.commit()
        self.db.refresh(e)
        return {
            "id": e.id,
            "id_usaha": e.business_id,
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def delete_expense(self, business_id: int, expense_id: int) -> bool:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.business_id == business_id).first()
        if not e:
            return False
        self.db.delete(e)
        self.db.commit()
        return True

    # --- TARGETS (Scoped by business_id) ---
    def get_targets(self, business_id: int) -> List[Dict[str, Any]]:
        targets = self.db.query(Target).filter(Target.business_id == business_id).order_by(desc(Target.created_at)).all()
        return [
            {
                "id": t.id,
                "id_usaha": t.business_id,
                "user_id": t.user_id,
                "target_laba": Decimal(str(t.target_laba)),
                "periode_mulai": t.periode_mulai,
                "periode_selesai": t.periode_selesai,
                "created_at": t.created_at
            }
            for t in targets
        ]

    def get_latest_target(self, business_id: int) -> Optional[Dict[str, Any]]:
        t = self.db.query(Target).filter(Target.business_id == business_id).order_by(desc(Target.created_at)).first()
        if not t:
            return None
        return {
            "id": t.id,
            "id_usaha": t.business_id,
            "user_id": t.user_id,
            "target_laba": Decimal(str(t.target_laba)),
            "periode_mulai": t.periode_mulai,
            "periode_selesai": t.periode_selesai,
            "created_at": t.created_at
        }

    def create_target(self, business_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date, user_id: Optional[int] = None) -> Dict[str, Any]:
        t = Target(
            business_id=business_id,
            user_id=user_id,
            target_laba=target_laba,
            periode_mulai=periode_mulai,
            periode_selesai=periode_selesai
        )
        self.db.add(t)
        self.db.commit()
        self.db.refresh(t)
        return {
            "id": t.id,
            "id_usaha": t.business_id,
            "user_id": t.user_id,
            "target_laba": Decimal(str(t.target_laba)),
            "periode_mulai": t.periode_mulai,
            "periode_selesai": t.periode_selesai,
            "created_at": t.created_at
        }

    def update_target(self, business_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        t = self.db.query(Target).filter(Target.id == target_id, Target.business_id == business_id).first()
        if not t:
            return None
        if "target_laba" in target_data and target_data["target_laba"] is not None:
            t.target_laba = target_data["target_laba"]
        if "periode_mulai" in target_data and target_data["periode_mulai"] is not None:
            t.periode_mulai = target_data["periode_mulai"]
        if "periode_selesai" in target_data and target_data["periode_selesai"] is not None:
            t.periode_selesai = target_data["periode_selesai"]
        self.db.commit()
        self.db.refresh(t)
        return {
            "id": t.id,
            "id_usaha": t.business_id,
            "user_id": t.user_id,
            "target_laba": Decimal(str(t.target_laba)),
            "periode_mulai": t.periode_mulai,
            "periode_selesai": t.periode_selesai,
            "created_at": t.created_at
        }

    # --- PRICE REFERENCES ---
    def get_price_references(self) -> List[Dict[str, Any]]:
        refs = self.db.query(PriceReference).all()
        return [
            {
                "id": r.id,
                "nama_produk": r.nama_produk,
                "kategori": r.kategori,
                "harga_min": Decimal(str(r.harga_min)),
                "harga_max": Decimal(str(r.harga_max)),
                "satuan": r.satuan,
                "sumber": r.sumber,
                "updated_at": r.updated_at
            }
            for r in refs
        ]

    def get_price_reference_by_name(self, nama_produk: str) -> Optional[Dict[str, Any]]:
        r = self.db.query(PriceReference).filter(PriceReference.nama_produk.ilike(nama_produk)).first()
        if not r:
            return None
        return {
            "id": r.id,
            "nama_produk": r.nama_produk,
            "kategori": r.kategori,
            "harga_min": Decimal(str(r.harga_min)),
            "harga_max": Decimal(str(r.harga_max)),
            "satuan": r.satuan,
            "sumber": r.sumber,
            "updated_at": r.updated_at
        }
