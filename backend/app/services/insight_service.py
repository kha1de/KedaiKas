from typing import List, Dict, Any
from decimal import Decimal
from app.repositories.base import BaseRepository
from app.services.analysis_service import AnalysisService
from app.utils.calculator import calculate_financial_metrics, calculate_target_progress
from app.utils.formatter import format_rupiah

class InsightService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo
        self.analysis_service = AnalysisService(repo)

    def generate_insights_and_warnings(self, business_id: int) -> Dict[str, Any]:
        insights = []
        warnings = []

        # 1. Analyze Financial Growth & Expenses
        fin_analysis = self.analysis_service.get_financial_analysis(business_id)
        curr_fin = fin_analysis["periode_ini"]
        prev_fin = fin_analysis["periode_lalu"]
        pct_omzet = fin_analysis["perubahan_omzet_persen"]
        pct_laba = fin_analysis["perubahan_laba_bersih_persen"]
        pct_exp = fin_analysis["perubahan_pengeluaran_persen"]

        # Rule 1: Pengeluaran meningkat > 20%
        if pct_exp > 20.0 and prev_fin["pengeluaran"] > Decimal("0"):
            insights.append({
                "id": "ins-exp-spike",
                "kategori": "Pengeluaran",
                "tipe": "perhatian",
                "pesan": f"Pengeluaran meningkat sebesar {pct_exp:.1f}% dibanding periode sebelumnya ({format_rupiah(prev_fin['pengeluaran'])} → {format_rupiah(curr_fin['pengeluaran'])})."
            })
            warnings.append({
                "id": "warn-exp-spike",
                "type": "expense_spike",
                "severity": "danger" if pct_exp > 40 else "warning",
                "title": "Lonjakan Pengeluaran Operasional",
                "message": f"Biaya pengeluaran naik {pct_exp:.1f}%. Evaluasi pengeluaran bahan baku atau operasional yang tidak mendesak.",
                "related_data": {"pengeluaran_saat_ini": float(curr_fin["pengeluaran"]), "persentase_kenaikan": pct_exp}
            })

        # Rule 2: Omzet & Laba Bersih Meningkat
        if pct_omzet > 0 and pct_laba > 0:
            insights.append({
                "id": "ins-growth-positive",
                "kategori": "Pertumbuhan Usaha",
                "tipe": "positif",
                "pesan": f"Pertumbuhan positif! Omzet naik {pct_omzet:.1f}% dan Laba Bersih tumbuh {pct_laba:.1f}% dibanding periode sebelumnya."
            })
        elif pct_omzet > 0 and pct_laba < 0:
            insights.append({
                "id": "ins-revenue-up-profit-down",
                "kategori": "Profitabilitas",
                "tipe": "perhatian",
                "pesan": "Omzet meningkat, namun laba bersih mengalami penurunan akibat peningkatan beban biaya/HPP."
            })
            warnings.append({
                "id": "warn-profit-compression",
                "type": "low_margin",
                "severity": "warning",
                "title": "Penurunan Laba Meski Omzet Naik",
                "message": "Terjadi tekanan profitabilitas. Periksa kenaikan harga beli modal bahan baku warung Anda.",
                "related_data": {"perubahan_laba_persen": pct_laba}
            })

        # 2. Analyze Product Performance & Thin Margins
        prod_analysis = self.analysis_service.get_product_analysis(business_id)
        laris_tipis = prod_analysis.get("produk_laris_margin_rendah", [])
        for item in laris_tipis:
            insights.append({
                "id": f"ins-prod-thin-{item['product_id']}",
                "kategori": "Performa Produk",
                "tipe": "perhatian",
                "pesan": f"Produk '{item['nama_produk']}' memiliki volume penjualan tinggi ({item['total_terjual']} terjual) namun margin keuntungan relatif tipis ({item['margin_persen']:.1f}%)."
            })
            warnings.append({
                "id": f"warn-prod-thin-{item['product_id']}",
                "type": "low_profit_high_volume",
                "severity": "warning",
                "title": f"Margin Tipis Produk Laris: {item['nama_produk']}",
                "message": f"Produk banyak terjual tapi menyumbang keuntungan kecil per porsi/item. Pertimbangkan penyesuaian harga kecil atau paket bundling.",
                "related_data": {"product_id": item["product_id"], "margin_persen": item["margin_persen"]}
            })

        # Produk Terlaris Utama
        if prod_analysis.get("produk_terlaris"):
            top_prod = prod_analysis["produk_terlaris"][0]
            if top_prod["total_terjual"] > 0:
                insights.append({
                    "id": "ins-top-seller",
                    "kategori": "Produk Unggulan",
                    "tipe": "positif",
                    "pesan": f"'{top_prod['nama_produk']}' merupakan produk terlaris dengan total {top_prod['total_terjual']} terjual dan omzet {format_rupiah(top_prod['total_omzet'])}."
                })

        # 3. Analyze Target Progress
        latest_target = self.repo.get_latest_target(business_id)
        if latest_target:
            products_map = {p["id"]: p for p in self.repo.get_products(business_id)}
            all_tx = self.repo.get_transactions(business_id)
            all_exp = self.repo.get_expenses(business_id)
            all_metrics = calculate_financial_metrics(all_tx, products_map, all_exp)

            t_prog = calculate_target_progress(
                target_laba=latest_target["target_laba"],
                laba_bersih=all_metrics["laba_bersih"],
                periode_mulai=latest_target["periode_mulai"],
                periode_selesai=latest_target["periode_selesai"]
            )

            if t_prog["target_gap"] > Decimal("0"):
                insights.append({
                    "id": "ins-target-gap",
                    "kategori": "Target Usaha",
                    "tipe": "netral",
                    "pesan": f"Target laba belum tercapai ({t_prog['progress_persen']:.1f}%). Anda masih membutuhkan sekitar {format_rupiah(t_prog['target_gap'])} dalam {t_prog['hari_tersisa']} hari tersisa (rata-rata {format_rupiah(t_prog['kebutuhan_laba_harian'])}/hari)."
                })
                if t_prog["hari_tersisa"] <= 5 and t_prog["progress_persen"] < 70:
                    warnings.append({
                        "id": "warn-target-risk",
                        "type": "target_gap",
                        "severity": "warning",
                        "title": "Mendekati Akhir Periode Target",
                        "message": f"Sisa waktu {t_prog['hari_tersisa']} hari lagi dan target baru tercapai {t_prog['progress_persen']:.1f}%. Coba simulasi CobaDulu untuk mengejar target!",
                        "related_data": {"gap": float(t_prog["target_gap"]), "hari_tersisa": t_prog["hari_tersisa"]}
                    })
            else:
                insights.append({
                    "id": "ins-target-achieved",
                    "kategori": "Target Usaha",
                    "tipe": "positif",
                    "pesan": f"Selamat! Target laba sebesar {format_rupiah(latest_target['target_laba'])} telah berhasil tercapai dengan perolehan laba {format_rupiah(all_metrics['laba_bersih'])}."
                })

        return {
            "insights": insights,
            "warnings": warnings
        }
