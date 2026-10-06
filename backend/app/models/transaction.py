from datetime import datetime
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    # Mapped to physical column 'id_transaksi' in project_warung.sql
    id = Column("id_transaksi", Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column("id_usaha", Integer, ForeignKey("businesses.id_usaha", ondelete="CASCADE"), default=1, index=True)
    # Mapped to physical column 'id_user' in project_warung.sql (identity of cashier/recorder)
    user_id = Column("id_user", Integer, ForeignKey("users.id_user", ondelete="SET NULL"), nullable=True, index=True)
    tanggal = Column("tanggal", DateTime, nullable=False, default=datetime.utcnow, index=True)
    total = Column("total", Numeric(12, 2), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_transaksi = synonym("id")
    id_usaha = synonym("business_id")
    id_user = synonym("user_id")

    business = relationship("Business", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    items = relationship("TransactionItem", back_populates="transaction", cascade="all, delete-orphan")
