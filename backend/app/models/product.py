from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    # Mapped to physical column 'id_produk' in project_warung.sql
    id = Column("id_produk", Integer, primary_key=True, index=True, autoincrement=True)
    # Mapped to physical column 'id_user' in project_warung.sql
    user_id = Column("id_user", Integer, ForeignKey("users.id_user", ondelete="CASCADE"), nullable=True, index=True)
    nama_produk = Column("nama_produk", String(150), nullable=False)
    kategori = Column("kategori", String(100), nullable=True)
    harga_modal = Column("harga_modal", Numeric(12, 2), nullable=False)
    harga_jual = Column("harga_jual", Numeric(12, 2), nullable=False)
    satuan = Column("satuan", String(30), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_produk = synonym("id")
    id_user = synonym("user_id")

    user = relationship("User", back_populates="products")
    transaction_items = relationship("TransactionItem", back_populates="product")
