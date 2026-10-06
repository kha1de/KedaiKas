from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class Business(Base):
    __tablename__ = "businesses"

    id = Column("id_usaha", Integer, primary_key=True, index=True, autoincrement=True)
    nama_usaha = Column("nama_usaha", String(150), nullable=False)
    alamat = Column("alamat", Text, nullable=True)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms
    id_usaha = synonym("id")

    users = relationship("User", back_populates="business")
    products = relationship("Product", back_populates="business", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="business", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="business", cascade="all, delete-orphan")
    targets = relationship("Target", back_populates="business", cascade="all, delete-orphan")
