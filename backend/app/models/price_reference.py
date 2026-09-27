from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.orm import synonym
from app.core.database import Base

class PriceReference(Base):
    __tablename__ = "price_references"

    # Mapped to physical column 'id_analisis' in project_warung.sql
    id = Column("id_analisis", Integer, primary_key=True, index=True, autoincrement=True)
    nama_produk = Column("nama_produk", String(150), nullable=False)
    kategori = Column("kategori", String(100), nullable=True)
    harga_min = Column("harga_min", Numeric(12, 2), nullable=False)
    harga_max = Column("harga_max", Numeric(12, 2), nullable=False)
    satuan = Column("satuan", String(30), nullable=False)
    sumber = Column("sumber", String(255), nullable=True)
    updated_at = Column("updated_at", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_analisis = synonym("id")
