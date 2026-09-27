from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from decimal import Decimal
from app.repositories.base import BaseRepository
from app.utils.calculator import calculate_product_margin, calculate_financial_metrics, round_currency
from app.utils.formatter import format_rupiah

class AnalysisService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_price_analysis(self, user_id: int) -> Dict[str, Any]:
        products = self.repo.get_products(user_id)
        price_refs = self.repo.get_price_references()

        # Build reference lookup map by normalized name
        ref_map = {}
        for r in price_refs:
            ref_map[r["nama_produk"].strip().lower()] = r

        items = []
        for p in products:
            p_name = p["nama_produk"].strip().lower()
            # Match reference: exact or partial
            matched_ref = None
            for r_name, ref in ref_map.items():
                if r_name in p_name or p_name in r_name:
                    matched_ref = ref
                    break

            harga_jual = p["harga_jual"]
            harga_modal = p["harga_modal"]
            margin = calculate_product_margin(harga_modal, harga_jual)

            if matched_ref:
                h_min = matched_ref["harga_min"]
                h_max = matched_ref["harga_max"]

                if harga_jual < h_min:
                    status = "Di bawah referensi"
                    selisih = h_min - harga_jual
                    rekomendasi = (
                        f"Harga jual produk saat ini berada di bawah rentang referensi pasar ({format_rupiah(h_min)} - {format_rupiah(h_max)}). "
                        f"Anda berpotensi menaikkan harga sekitar {format_rupiah(selisih)} untuk meningkatkan margin keuntungan tanpa melebihi rata-rata pasar."
                    )
                elif harga_jual > h_max:
                    status = "Di atas referensi"
                    rekomendasi = (
                        f"Harga jual produk berada di atas rentang referensi pasar ({format_rupiah(h_min)} - {format_rupiah(h_max)}). "
                        f"Pastikan keunggulan kualitas, porsi, atau layanan tetap terjaga agar loyalitas pelanggan tetap tinggi."
                    )
                else:
                    status = "Dalam rentang wajar"
                    rekomendasi = (
                        f"Harga jual produk berada dalam rentang kompetitif pasar ({format_rupiah(h_min)} - {format_rupiah(h_max)}). "
                        f"Pertahankan stabilitas harga dan kualitas pelayanan."
                    )
            else:
                h_min = None
                h_max = None
                status = "Belum ada referensi"
                rekomendasi = "Belum ada data referensi harga pasar untuk produk ini. Pantau harga warung sekitar secara berkala."

            items.append({
                "product_id": p["id"],
                "nama_produk": p["nama_produk"],
                "kategori": p.get("kategori"),
                "harga_jual": harga_jual,
                "harga_modal": harga_modal,
                "harga_min_ref": h_min,
                "harga_max_ref": h_max,
                "satuan": p["satuan"],
                "status": status,
                "margin_persen": margin,
                "rekomendasi": rekomendasi
            })

        return {"items": items}

    def get_product_analysis(self, user_id: int) -> Dict[str, Any]:
        products = self.repo.get_products(user_id)
        products_map = {p["id"]: p for p in products}
        transactions = self.repo.get_transactions(user_id)

        # Aggregate sales by product
        sales_agg: Dict[int, Dict[str, Any]] = {}
        for p in products:
            sales_agg[p["id"]] = {
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
                if p_id not in sales_agg:
                    continue
                qty = it["jumlah"]
                subtotal = Decimal(str(it["subtotal"]))
                modal = Decimal(str(products_map[p_id]["harga_modal"]))
                item_hpp = Decimal(str(qty)) * modal
                item_laba = subtotal - item_hpp

                sales_agg[p_id]["total_terjual"] += qty
                sales_agg[p_id]["total_omzet"] += subtotal
                sales_agg[p_id]["total_hpp"] += item_hpp
                sales_agg[p_id]["total_laba"] += item_laba

        all_items = list(sales_agg.values())

        # Format currency & roundings
        for item in all_items:
            item["total_omzet"] = round_currency(item["total_omzet"])
            item["total_hpp"] = round_currency(item["total_hpp"])
            item["total_laba"] = round_currency(item["total_laba"])
            # Recalculate realized margin
            if item["total_omzet"] > Decimal("0"):
                m = float((item["total_laba"] / item["total_omzet"]) * Decimal("100"))
                item["margin_persen"] = round(m, 2)

        # 1. Produk Terlaris (Qty)
        produk_terlaris = sorted(all_items, key=lambda x: x["total_terjual"], reverse=True)

        # 2. Produk Omzet Tertinggi
        produk_omzet = sorted(all_items, key=lambda x: x["total_omzet"], reverse=True)

        # 3. Produk Margin Tertinggi
        produk_margin = sorted(all_items, key=lambda x: x["margin_persen"], reverse=True)

        # 4. Produk Laris tapi Margin Rendah:
        # Terjual di atas rata-rata ATAU >= 10 unit, tapi margin <= 30% atau di bawah rata-rata
        avg_terjual = sum(i["total_terjual"] for i in all_items) / max(1, len(all_items))
        avg_margin = sum(i["margin_persen"] for i in all_items) / max(1, len(all_items))

        laris_margin_rendah = [
            i for i in all_items
            if (i["total_terjual"] >= avg_terjual or i["total_terjual"] >= 10)
            and (i["margin_persen"] <= 30.0 or i["margin_persen"] < avg_margin)
        ]

        return {
            "produk_terlaris": produk_terlaris,
            "produk_omzet_tertinggi": produk_omzet,
            "produk_margin_tertinggi": produk_margin,
            "produk_laris_margin_rendah": laris_margin_rendah,
            "semua_produk": all_items
        }

    def get_financial_analysis(self, user_id: int) -> Dict[str, Any]:
        now = datetime.now()
        products = self.repo.get_products(user_id)
        products_map = {p["id"]: p for p in products}

        # Divide into current period (last 7 days) and previous period (prior 7 days)
        split_date = now - timedelta(days=7)
        start_prev_date = now - timedelta(days=14)

        all_tx = self.repo.get_transactions(user_id)
        all_exp = self.repo.get_expenses(user_id)

        # Filter current period
        tx_current = [t for t in all_tx if t["tanggal"] >= split_date]
        exp_current = [e for e in all_exp if e["tanggal"] >= split_date.date()]

        # Filter previous period
        tx_prev = [t for t in all_tx if start_prev_date <= t["tanggal"] < split_date]
        exp_prev = [e for e in all_exp if start_prev_date.date() <= e["tanggal"] < split_date.date()]

        m_current = calculate_financial_metrics(tx_current, products_map, exp_current)
        m_prev = calculate_financial_metrics(tx_prev, products_map, exp_prev)

        # Calculate percentage changes safely
        def calc_pct_change(curr: Decimal, prev: Decimal) -> float:
            if prev == Decimal("0"):
                return 100.0 if curr > Decimal("0") else 0.0
            diff = curr - prev
            pct = float((diff / abs(prev)) * Decimal("100"))
            return round(pct, 2)

        change_omzet = calc_pct_change(m_current["omzet"], m_prev["omzet"])
        change_laba = calc_pct_change(m_current["laba_bersih"], m_prev["laba_bersih"])
        change_exp = calc_pct_change(m_current["pengeluaran"], m_prev["pengeluaran"])

        return {
            "periode_ini": {
                "omzet": m_current["omzet"],
                "hpp": m_current["hpp"],
                "laba_kotor": m_current["laba_kotor"],
                "pengeluaran": m_current["pengeluaran"],
                "laba_bersih": m_current["laba_bersih"],
                "margin_persen": m_current["margin"]
            },
            "periode_lalu": {
                "omzet": m_prev["omzet"],
                "hpp": m_prev["hpp"],
                "laba_kotor": m_prev["laba_kotor"],
                "pengeluaran": m_prev["pengeluaran"],
                "laba_bersih": m_prev["laba_bersih"],
                "margin_persen": m_prev["margin"]
            },
            "perubahan_omzet_persen": change_omzet,
            "perubahan_laba_bersih_persen": change_laba,
            "perubahan_pengeluaran_persen": change_exp
        }
