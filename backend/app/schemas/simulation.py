from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel, Field

class SimulationProductInput(BaseModel):
    product_id: int
    nama_produk: Optional[str] = None
    harga_jual_baru: Optional[Decimal] = Field(None, ge=0)
    jumlah_penjualan_baru: Optional[int] = Field(None, ge=0)
    harga_modal_baru: Optional[Decimal] = Field(None, ge=0)

class SimulationRequest(BaseModel):
    # What-if adjustments per product or global
    produk_simulasi: List[SimulationProductInput] = []
    pengeluaran_baru: Optional[Decimal] = Field(None, ge=0)
    # Optional target override for what-if target check
    target_laba_simulasi: Optional[Decimal] = Field(None, ge=0)

class MetricProjection(BaseModel):
    omzet: Decimal
    hpp: Decimal
    laba_kotor: Decimal
    pengeluaran: Decimal
    laba_bersih: Decimal
    margin_persen: float

class MetricDifference(BaseModel):
    omzet_diff: Decimal
    hpp_diff: Decimal
    pengeluaran_diff: Decimal
    laba_bersih_diff: Decimal
    margin_diff_persen: float

class SimulationTargetComparison(BaseModel):
    target_laba: Decimal
    gap_saat_ini: Decimal
    gap_proyeksi: Decimal
    progress_saat_ini_persen: float
    progress_proyeksi_persen: float
    status_proyeksi: str # e.g. "Berpotensi Tercapai", "Estimasi Masih Memerlukan Rp..."

class SimulationResponse(BaseModel):
    saat_ini: MetricProjection
    proyeksi_simulasi: MetricProjection
    selisih: MetricDifference
    perbandingan_target: SimulationTargetComparison
    catatan: str = "Hasil simulasi ini adalah estimasi proyeksi dan tidak mengubah data asli toko Anda."
