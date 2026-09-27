from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.repositories.base import BaseRepository
from app.models.user import User
from app.models.product import Product
from app.models.transaction import Transaction
from app.models.transaction_item import TransactionItem
from app.models.expense import Expense
from app.models.target import Target
from app.models.price_reference import PriceReference

class SqlRepository(BaseRepository):
    """
    SQLAlchemy repository implementation for MySQL/MariaDB.
    Follows identical interface with MockRepository.
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
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "created_at": user.created_at
        }

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user = self.db.query(User).filter(User.email.ilike(email)).first()
        if not user:
            return None
        return {
            "id": user.id,
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "created_at": user.created_at
        }

    def create_user(self, nama: str, email: str, password_hash: str) -> Dict[str, Any]:
        user = User(nama=nama, email=email, password=password_hash)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return {
            "id": user.id,
            "nama": user.nama,
            "email": user.email,
            "password": user.password,
            "created_at": user.created_at
        }

    # --- PRODUCTS ---
    def get_products(self, user_id: int) -> List[Dict[str, Any]]:
        products = self.db.query(Product).filter(Product.user_id == user_id).all()
        return [
            {
                "id": p.id,
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

    def get_product_by_id(self, user_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        p = self.db.query(Product).filter(Product.id == product_id, Product.user_id == user_id).first()
        if not p:
            return None
        return {
            "id": p.id,
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def create_product(self, user_id: int, product_data: Dict[str, Any]) -> Dict[str, Any]:
        p = Product(
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
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def update_product(self, user_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        p = self.db.query(Product).filter(Product.id == product_id, Product.user_id == user_id).first()
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
            "user_id": p.user_id,
            "nama_produk": p.nama_produk,
            "kategori": p.kategori,
            "harga_modal": Decimal(str(p.harga_modal)),
            "harga_jual": Decimal(str(p.harga_jual)),
            "satuan": p.satuan,
            "created_at": p.created_at
        }

    def delete_product(self, user_id: int, product_id: int) -> bool:
        p = self.db.query(Product).filter(Product.id == product_id, Product.user_id == user_id).first()
        if not p:
            return False
        self.db.delete(p)
        self.db.commit()
        return True

    # --- TRANSACTIONS ---
    def get_transactions(self, user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        q = self.db.query(Transaction).filter(Transaction.user_id == user_id)
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
                "user_id": t.user_id,
                "tanggal": t.tanggal,
                "total": Decimal(str(t.total)),
                "created_at": t.created_at,
                "items": items
            })
        return result

    def get_transaction_by_id(self, user_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        t = self.db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user_id).first()
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
            "user_id": t.user_id,
            "tanggal": t.tanggal,
            "total": Decimal(str(t.total)),
            "created_at": t.created_at,
            "items": items
        }

    def create_transaction(self, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        tx = Transaction(user_id=user_id, tanggal=tanggal, total=total)
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
            "user_id": tx.user_id,
            "tanggal": tx.tanggal,
            "total": Decimal(str(tx.total)),
            "created_at": tx.created_at,
            "items": created_items
        }

    def delete_transaction(self, user_id: int, transaction_id: int) -> bool:
        t = self.db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user_id).first()
        if not t:
            return False
        self.db.delete(t)
        self.db.commit()
        return True

    # --- EXPENSES ---
    def get_expenses(self, user_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        q = self.db.query(Expense).filter(Expense.user_id == user_id)
        if start_date:
            q = q.filter(Expense.tanggal >= start_date)
        if end_date:
            q = q.filter(Expense.tanggal <= end_date)
        expenses = q.order_by(desc(Expense.tanggal)).all()
        return [
            {
                "id": e.id,
                "user_id": e.user_id,
                "kategori": e.kategori,
                "nominal": Decimal(str(e.nominal)),
                "tanggal": e.tanggal,
                "keterangan": e.keterangan,
                "created_at": e.created_at
            }
            for e in expenses
        ]

    def get_expense_by_id(self, user_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
        if not e:
            return None
        return {
            "id": e.id,
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def create_expense(self, user_id: int, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        e = Expense(
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
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def update_expense(self, user_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
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
            "user_id": e.user_id,
            "kategori": e.kategori,
            "nominal": Decimal(str(e.nominal)),
            "tanggal": e.tanggal,
            "keterangan": e.keterangan,
            "created_at": e.created_at
        }

    def delete_expense(self, user_id: int, expense_id: int) -> bool:
        e = self.db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
        if not e:
            return False
        self.db.delete(e)
        self.db.commit()
        return True

    # --- TARGETS ---
    def get_targets(self, user_id: int) -> List[Dict[str, Any]]:
        targets = self.db.query(Target).filter(Target.user_id == user_id).order_by(desc(Target.created_at)).all()
        return [
            {
                "id": t.id,
                "user_id": t.user_id,
                "target_laba": Decimal(str(t.target_laba)),
                "periode_mulai": t.periode_mulai,
                "periode_selesai": t.periode_selesai,
                "created_at": t.created_at
            }
            for t in targets
        ]

    def get_latest_target(self, user_id: int) -> Optional[Dict[str, Any]]:
        t = self.db.query(Target).filter(Target.user_id == user_id).order_by(desc(Target.created_at)).first()
        if not t:
            return None
        return {
            "id": t.id,
            "user_id": t.user_id,
            "target_laba": Decimal(str(t.target_laba)),
            "periode_mulai": t.periode_mulai,
            "periode_selesai": t.periode_selesai,
            "created_at": t.created_at
        }

    def create_target(self, user_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date) -> Dict[str, Any]:
        t = Target(
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
            "user_id": t.user_id,
            "target_laba": Decimal(str(t.target_laba)),
            "periode_mulai": t.periode_mulai,
            "periode_selesai": t.periode_selesai,
            "created_at": t.created_at
        }

    def update_target(self, user_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        t = self.db.query(Target).filter(Target.id == target_id, Target.user_id == user_id).first()
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
        ref = self.db.query(PriceReference).filter(
            PriceReference.nama_produk.ilike(f"%{nama_produk}%")
        ).first()
        if not ref:
            return None
        return {
            "id": ref.id,
            "nama_produk": ref.nama_produk,
            "kategori": ref.kategori,
            "harga_min": Decimal(str(ref.harga_min)),
            "harga_max": Decimal(str(ref.harga_max)),
            "satuan": ref.satuan,
            "sumber": ref.sumber,
            "updated_at": ref.updated_at
        }
