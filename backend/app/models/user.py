from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    # Mapped to physical column 'id_user' in project_warung.sql
    id = Column("id_user", Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column("nama", String(100), nullable=False)
    email = Column("email", String(100), unique=True, index=True, nullable=False)
    # Mapped to physical column 'pass' in project_warung.sql
    password = Column("pass", String(255), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_user = synonym("id")
    pass_ = synonym("password")

    products = relationship("Product", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    targets = relationship("Target", back_populates="user", cascade="all, delete-orphan")
