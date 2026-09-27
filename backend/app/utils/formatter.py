from decimal import Decimal
from typing import Union

def format_rupiah(val: Union[Decimal, float, int]) -> str:
    """Format numeric value as Indonesian Rupiah."""
    num = int(round(float(val)))
    formatted = f"{num:,}".replace(",", ".")
    return f"Rp {formatted}"

def format_percentage(val: Union[Decimal, float]) -> str:
    """Format percentage with 2 decimals."""
    return f"{float(val):.2f}%"
