from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    # Mapped to physical column 'id_expenses' in project_warung.sql
    id = Column("id_expenses", Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column("id_usaha", Integer, ForeignKey("businesses.id_usaha", ondelete="CASCADE"), default=1, index=True)
    # Mapped to physical column 'id_user' in project_warung.sql
    user_id = Column("id_user", Integer, ForeignKey("users.id_user", ondelete="SET NULL"), nullable=True, index=True)
    kategori = Column("kategori", String(100), nullable=False)
    nominal = Column("nominal", Numeric(12, 2), nullable=False)
    tanggal = Column("tanggal", Date, nullable=False, index=True)
    keterangan = Column("keterangan", Text, nullable=True)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_expenses = synonym("id")
    id_usaha = synonym("business_id")
    id_user = synonym("user_id")

    business = relationship("Business", back_populates="expenses")
    user = relationship("User", back_populates="expenses")
