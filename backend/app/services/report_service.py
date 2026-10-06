from typing import Dict, Any, Optional
from datetime import date, datetime
from decimal import Decimal
from app.repositories.base import BaseRepository
from app.schemas.report import ReportResponse
from app.schemas.analysis import ProductPerformanceItem
from app.utils.calculator import calculate_financial_metrics, calculate_product_margin, round_currency

class ReportService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def generate_report(
        self, 
        business_id: int, 
        start_date: Optional[date] = None, 
        end_date: Optional[date] = None
    ) -> ReportResponse:
        products = self.repo.get_products(business_id)
        products_map = {p["id"]: p for p in products}

        dt_start = datetime.combine(start_date, datetime.min.time()) if start_date else None
        dt_end = datetime.combine(end_date, datetime.max.time()) if end_date else None

        transactions = self.repo.get_transactions(business_id, dt_start, dt_end)
        expenses = self.repo.get_expenses(business_id, start_date, end_date)

        metrics = calculate_financial_metrics(transactions, products_map, expenses)

        prod_perf: Dict[int, Dict[str, Any]] = {}
        for p in products:
            prod_perf[p["id"]] = {
                "product_id": p["id"],
                "nama_produk": p["nama_produk"],
                "kategori": p.get("kategori"),
                "total_terjual": 0,
                "total_omzet": Decimal("0"),
                "total_hpp": Decimal("0"),
                "total_laba": Decimal("0"),
                "margin_persen": calculate_product_margin(p["harga_modal"], p["harga_jual"])
            }

        for tx in transactions:
            for it in tx.get("items", []):
                p_id = it["product_id"]
                if p_id not in prod_perf:
                    continue
                qty = it["jumlah"]
                subtotal = Decimal(str(it["subtotal"]))
                modal = Decimal(str(products_map[p_id]["harga_modal"]))
                item_hpp = Decimal(str(qty)) * modal
                item_laba = subtotal - item_hpp

                prod_perf[p_id]["total_terjual"] += qty
                prod_perf[p_id]["total_omzet"] += subtotal
                prod_perf[p_id]["total_hpp"] += item_hpp
                prod_perf[p_id]["total_laba"] += item_laba

        product_summary = []
        for item in prod_perf.values():
            item["total_omzet"] = round_currency(item["total_omzet"])
            item["total_hpp"] = round_currency(item["total_hpp"])
            item["total_laba"] = round_currency(item["total_laba"])
            if item["total_omzet"] > Decimal("0"):
                m = float((item["total_laba"] / item["total_omzet"]) * Decimal("100"))
                item["margin_persen"] = round(m, 2)
            product_summary.append(ProductPerformanceItem(**item))

        product_summary.sort(key=lambda x: x.total_omzet, reverse=True)

        return ReportResponse(
            periode_mulai=start_date,
            periode_selesai=end_date,
            total_transaksi=len(transactions),
            omzet=metrics["omzet"],
            hpp=metrics["hpp"],
            laba_kotor=metrics["laba_kotor"],
            pengeluaran=metrics["pengeluaran"],
            laba_bersih=metrics["laba_bersih"],
            margin_persen=metrics["margin"],
            ringkasan_produk=product_summary
        )
