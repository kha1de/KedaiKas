from typing import List, Optional, Any
from decimal import Decimal
from pydantic import BaseModel

# Price Analysis
class PriceAnalysisItem(BaseModel):
    product_id: int
    nama_produk: str
    kategori: Optional[str] = None
    harga_jual: Decimal
    harga_modal: Decimal
    harga_min_ref: Optional[Decimal] = None
    harga_max_ref: Optional[Decimal] = None
    satuan: str
    status: str # "Di bawah referensi", "Dalam rentang wajar", "Di atas referensi", "Belum ada referensi"
    margin_persen: float
    rekomendasi: str

class PriceAnalysisResponse(BaseModel):
    items: List[PriceAnalysisItem] = []

# Product Performance
class ProductPerformanceItem(BaseModel):
    product_id: int
    nama_produk: str
    kategori: Optional[str] = None
    total_terjual: int
    total_omzet: Decimal
    total_hpp: Decimal
    total_laba: Decimal
    margin_persen: float

class ProductAnalysisResponse(BaseModel):
    produk_terlaris: List[ProductPerformanceItem] = []
    produk_omzet_tertinggi: List[ProductPerformanceItem] = []
    produk_margin_tertinggi: List[ProductPerformanceItem] = []
    produk_laris_margin_rendah: List[ProductPerformanceItem] = []
    semua_produk: List[ProductPerformanceItem] = []

# Financial Analysis
class FinancialPeriodSummary(BaseModel):
    omzet: Decimal = Decimal("0")
    hpp: Decimal = Decimal("0")
    laba_kotor: Decimal = Decimal("0")
    pengeluaran: Decimal = Decimal("0")
    laba_bersih: Decimal = Decimal("0")
    margin_persen: float = 0.0

class FinancialAnalysisResponse(BaseModel):
    periode_ini: FinancialPeriodSummary
    periode_lalu: FinancialPeriodSummary
    perubahan_omzet_persen: float = 0.0
    perubahan_laba_bersih_persen: float = 0.0
    perubahan_pengeluaran_persen: float = 0.0

# Insights & Warnings
class InsightItem(BaseModel):
    id: str
    kategori: str
    tipe: str # "positif", "perhatian", "netral"
    pesan: str

class WarningItem(BaseModel):
    id: str
    type: str # "expense_spike", "low_margin", "target_gap", "low_profit_high_volume"
    severity: str # "danger", "warning", "info"
    title: str
    message: str
    related_data: Optional[Any] = None

class InsightsResponse(BaseModel):
    insights: List[InsightItem] = []
    warnings: List[WarningItem] = []
