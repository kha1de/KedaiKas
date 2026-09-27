from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class TransactionItem(Base):
    # Physical table name in project_warung.sql is 'transaction_details'
    __tablename__ = "transaction_details"

    # Mapped to physical column 'id_detail' in project_warung.sql
    id = Column("id_detail", Integer, primary_key=True, index=True, autoincrement=True)
    # Mapped to physical column 'id_transaksi' in project_warung.sql
    transaction_id = Column("id_transaksi", Integer, ForeignKey("transactions.id_transaksi", ondelete="CASCADE"), nullable=True, index=True)
    # Mapped to physical column 'id_produk' in project_warung.sql
    product_id = Column("id_produk", Integer, ForeignKey("products.id_produk", ondelete="CASCADE"), nullable=True, index=True)
    jumlah = Column("jumlah", Integer, nullable=False)
    harga_jual = Column("harga_jual", Numeric(12, 2), nullable=False)
    subtotal = Column("subtotal", Numeric(12, 2), nullable=False)

    # Synonyms for bidirectional attribute access
    id_detail = synonym("id")
    id_transaksi = synonym("transaction_id")
    id_produk = synonym("product_id")

    transaction = relationship("Transaction", back_populates="items")
    product = relationship("Product", back_populates="transaction_items")
