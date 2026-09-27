from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from typing import List, Dict, Any, Tuple

def round_currency(val: Decimal) -> Decimal:
    """Safely round decimal to 2 decimal places."""
    return val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def calculate_product_margin(harga_modal: Decimal, harga_jual: Decimal) -> float:
    """
    Margin produk: ((harga_jual - harga_modal) / harga_jual) * 100
    Handles zero division safely.
    """
    if harga_jual <= Decimal("0"):
        return 0.0
    margin = ((harga_jual - harga_modal) / harga_jual) * Decimal("100")
    return round(float(margin), 2)

def calculate_financial_metrics(
    transactions: List[Dict[str, Any]],
    products_map: Dict[int, Dict[str, Any]],
    expenses: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Kalkulasi finansial inti UMKM:
    OMZET: SUM(transaction_items.subtotal)
    HPP: SUM(transaction_items.jumlah * products.harga_modal)
    LABA KOTOR: Omzet - HPP
    PENGELUARAN: SUM(expenses.nominal)
    LABA BERSIH: Laba Kotor - Total Pengeluaran
    MARGIN: (Laba Bersih / Omzet) * 100
    """
    omzet = Decimal("0")
    hpp = Decimal("0")

    for tx in transactions:
        for it in tx.get("items", []):
            subtotal = Decimal(str(it["subtotal"]))
            jumlah = Decimal(str(it["jumlah"]))
            prod_id = it["product_id"]

            omzet += subtotal
            
            # Modal lookup
            prod = products_map.get(prod_id)
            if prod:
                modal = Decimal(str(prod["harga_modal"]))
                hpp += jumlah * modal
            else:
                # If product not found in map, assume item price or zero
                hpp += Decimal("0")

    pengeluaran = sum(Decimal(str(e["nominal"])) for e in expenses) if expenses else Decimal("0")
    laba_kotor = omzet - hpp
    laba_bersih = laba_kotor - pengeluaran

    if omzet > Decimal("0"):
        margin = float((laba_bersih / omzet) * Decimal("100"))
        margin = round(margin, 2)
    else:
        margin = 0.0

    return {
        "omzet": round_currency(omzet),
        "hpp": round_currency(hpp),
        "laba_kotor": round_currency(laba_kotor),
        "pengeluaran": round_currency(pengeluaran),
        "laba_bersih": round_currency(laba_bersih),
        "margin": margin
    }

def calculate_target_progress(
    target_laba: Decimal,
    laba_bersih: Decimal,
    periode_mulai: date,
    periode_selesai: date
) -> Dict[str, Any]:
    """
    Kalkulasi progress target laba UMKM.
    Handles target 0, hari tersisa 0, target sudah tercapai, target terlewati, periode berakhir.
    """
    today = date.today()
    target_laba = Decimal(str(target_laba))
    laba_bersih = Decimal(str(laba_bersih))

    # Gap laba
    target_gap = target_laba - laba_bersih
    target_gap_positive = max(Decimal("0"), target_gap)

    # Remaining days calculation
    if today > periode_selesai:
        hari_tersisa = 0
    else:
        hari_tersisa = max(0, (periode_selesai - today).days + 1)

    # Kebutuhan laba harian
    if hari_tersisa > 0 and target_gap_positive > Decimal("0"):
        kebutuhan_laba_harian = target_gap_positive / Decimal(str(hari_tersisa))
    else:
        kebutuhan_laba_harian = Decimal("0")

    # Progress percentage
    if target_laba > Decimal("0"):
        progress_persen = float((laba_bersih / target_laba) * Decimal("100"))
        progress_persen = round(progress_persen, 2)
    else:
        progress_persen = 0.0

    # Status determination
    if today > periode_selesai:
        if laba_bersih >= target_laba:
            status = "Target Tercapai di Akhir Periode"
        else:
            status = "Periode Berakhir (Target Belum Tercapai)"
    elif laba_bersih >= target_laba:
        status = "Target Sudah Tercapai! 🎉"
    elif hari_tersisa == 0:
        status = "Hari Terakhir Target"
    else:
        status = "Sedang Berjalan"

    return {
        "target_laba": round_currency(target_laba),
        "laba_saat_ini": round_currency(laba_bersih),
        "target_gap": round_currency(target_gap_positive),
        "hari_tersisa": hari_tersisa,
        "kebutuhan_laba_harian": round_currency(kebutuhan_laba_harian),
        "progress_persen": progress_persen,
        "status": status
    }
