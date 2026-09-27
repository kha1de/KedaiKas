from datetime import date
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel
from app.schemas.analysis import ProductPerformanceItem

class ReportResponse(BaseModel):
    periode_mulai: Optional[date] = None
    periode_selesai: Optional[date] = None
    total_transaksi: int = 0
    omzet: Decimal = Decimal("0")
    hpp: Decimal = Decimal("0")
    laba_kotor: Decimal = Decimal("0")
    pengeluaran: Decimal = Decimal("0")
    laba_bersih: Decimal = Decimal("0")
    margin_persen: float = 0.0
    ringkasan_produk: List[ProductPerformanceItem] = []
