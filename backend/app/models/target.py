from datetime import datetime
from sqlalchemy import Column, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, synonym
from app.core.database import Base

class Target(Base):
    __tablename__ = "targets"

    # Mapped to physical column 'id_target' in project_warung.sql
    id = Column("id_target", Integer, primary_key=True, index=True, autoincrement=True)
    business_id = Column("id_usaha", Integer, ForeignKey("businesses.id_usaha", ondelete="CASCADE"), default=1, index=True)
    # Mapped to physical column 'id_user' in project_warung.sql
    user_id = Column("id_user", Integer, ForeignKey("users.id_user", ondelete="SET NULL"), nullable=True, index=True)
    target_laba = Column("target_laba", Numeric(12, 2), nullable=False)
    periode_mulai = Column("periode_mulai", Date, nullable=False)
    periode_selesai = Column("periode_selesai", Date, nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)

    # Synonyms for bidirectional attribute access
    id_target = synonym("id")
    id_usaha = synonym("business_id")
    id_user = synonym("user_id")

    business = relationship("Business", back_populates="targets")
    user = relationship("User", back_populates="targets")
