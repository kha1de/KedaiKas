from decimal import Decimal
from typing import Dict, Any
from app.repositories.base import BaseRepository
from app.schemas.simulation import SimulationRequest, MetricProjection, MetricDifference, SimulationTargetComparison, SimulationResponse
from app.services.analysis_service import AnalysisService
from app.utils.calculator import calculate_financial_metrics, round_currency
from app.utils.formatter import format_rupiah

class SimulationService:
    """
    Service CobaDulu: Menghitung proyeksi skenario 'what-if' murni di memori.
    MUTLAK TIDAK BOLEH melakukan insert, update, atau delete ke database/repository.
    """
    def __init__(self, repo: BaseRepository):
        self.repo = repo
        self.analysis_service = AnalysisService(repo)

    def run_simulation(self, user_id: int, sim_req: SimulationRequest) -> SimulationResponse:
        # 1. Ambil data kondisi saat ini
        products = self.repo.get_products(user_id)
        products_map = {p["id"]: p for p in products}

        # Hitung agregat penjualan produk historis (volume dasar)
        prod_analysis = self.analysis_service.get_product_analysis(user_id)
        current_prod_perf = {item["product_id"]: item for item in prod_analysis["semua_produk"]}

        # Ambil total pengeluaran saat ini
        expenses = self.repo.get_expenses(user_id)
        current_expenses = sum(Decimal(str(e["nominal"])) for e in expenses) if expenses else Decimal("0")

        # Metrik saat ini
        curr_omzet = sum(item["total_omzet"] for item in current_prod_perf.values())
        curr_hpp = sum(item["total_hpp"] for item in current_prod_perf.values())
        curr_laba_kotor = curr_omzet - curr_hpp
        curr_laba_bersih = curr_laba_kotor - current_expenses
        curr_margin = float((curr_laba_bersih / curr_omzet) * Decimal("100")) if curr_omzet > Decimal("0") else 0.0

        current_metrics = MetricProjection(
            omzet=round_currency(curr_omzet),
            hpp=round_currency(curr_hpp),
            laba_kotor=round_currency(curr_laba_kotor),
            pengeluaran=round_currency(current_expenses),
            laba_bersih=round_currency(curr_laba_bersih),
            margin_persen=round(curr_margin, 2)
        )

        # 2. Hitung Proyeksi Simulasi
        sim_input_map = {item.product_id: item for item in sim_req.produk_simulasi}

        sim_omzet = Decimal("0")
        sim_hpp = Decimal("0")

        for p_id, p in products_map.items():
            base_perf = current_prod_perf.get(p_id)
            base_qty = base_perf["total_terjual"] if base_perf else 10
            base_jual = p["harga_jual"]
            base_modal = p["harga_modal"]

            # Check if overridden by simulation input
            sim_input = sim_input_map.get(p_id)
            if sim_input:
                eff_jual = sim_input.harga_jual_baru if sim_input.harga_jual_baru is not None else base_jual
                eff_modal = sim_input.harga_modal_baru if sim_input.harga_modal_baru is not None else base_modal
                eff_qty = sim_input.jumlah_penjualan_baru if sim_input.jumlah_penjualan_baru is not None else base_qty
            else:
                eff_jual = base_jual
                eff_modal = base_modal
                eff_qty = base_qty

            eff_qty_dec = Decimal(str(eff_qty))
            sim_omzet += eff_qty_dec * eff_jual
            sim_hpp += eff_qty_dec * eff_modal

        # Pengeluaran simulasi
        if sim_req.pengeluaran_baru is not None:
            sim_pengeluaran = sim_req.pengeluaran_baru
        else:
            sim_pengeluaran = current_expenses

        sim_laba_kotor = sim_omzet - sim_hpp
        sim_laba_bersih = sim_laba_kotor - sim_pengeluaran
        sim_margin = float((sim_laba_bersih / sim_omzet) * Decimal("100")) if sim_omzet > Decimal("0") else 0.0

        projected_metrics = MetricProjection(
            omzet=round_currency(sim_omzet),
            hpp=round_currency(sim_hpp),
            laba_kotor=round_currency(sim_laba_kotor),
            pengeluaran=round_currency(sim_pengeluaran),
            laba_bersih=round_currency(sim_laba_bersih),
            margin_persen=round(sim_margin, 2)
        )

        # 3. Hitung Selisih (Difference)
        diff_metrics = MetricDifference(
            omzet_diff=round_currency(sim_omzet - curr_omzet),
            hpp_diff=round_currency(sim_hpp - curr_hpp),
            pengeluaran_diff=round_currency(sim_pengeluaran - current_expenses),
            laba_bersih_diff=round_currency(sim_laba_bersih - curr_laba_bersih),
            margin_diff_persen=round(sim_margin - curr_margin, 2)
        )

        # 4. Target Comparison
        latest_target = self.repo.get_latest_target(user_id)
        if sim_req.target_laba_simulasi is not None:
            eff_target = sim_req.target_laba_simulasi
        elif latest_target:
            eff_target = latest_target["target_laba"]
        else:
            eff_target = Decimal("3000000.00") # Default benchmark

        gap_saat_ini = max(Decimal("0"), eff_target - curr_laba_bersih)
        gap_proyeksi = max(Decimal("0"), eff_target - sim_laba_bersih)

        prog_saat_ini = float((curr_laba_bersih / eff_target) * Decimal("100")) if eff_target > Decimal("0") else 0.0
        prog_proyeksi = float((sim_laba_bersih / eff_target) * Decimal("100")) if eff_target > Decimal("0") else 0.0

        if sim_laba_bersih >= eff_target:
            status_proyeksi = f"Skenario ini berpotensi melampaui target laba dengan surplus {format_rupiah(sim_laba_bersih - eff_target)}! 🎉"
        else:
            status_proyeksi = f"Skenario ini berpotensi memperkecil gap target, namun estimasi masih memerlukan {format_rupiah(gap_proyeksi)} lagi."

        target_comparison = SimulationTargetComparison(
            target_laba=round_currency(eff_target),
            gap_saat_ini=round_currency(gap_saat_ini),
            gap_proyeksi=round_currency(gap_proyeksi),
            progress_saat_ini_persen=round(prog_saat_ini, 2),
            progress_proyeksi_persen=round(prog_proyeksi, 2),
            status_proyeksi=status_proyeksi
        )

        return SimulationResponse(
            saat_ini=current_metrics,
            proyeksi_simulasi=projected_metrics,
            selisih=diff_metrics,
            perbandingan_target=target_comparison,
            catatan="Hasil simulasi CobaDulu adalah estimasi proyeksi skenario bisnis dan tidak mengubah data asli toko Anda."
        )
