from decimal import Decimal
from pydantic import BaseModel

class DashboardResponse(BaseModel):
    omzet: Decimal = Decimal("0")
    hpp: Decimal = Decimal("0")
    laba_kotor: Decimal = Decimal("0")
    pengeluaran: Decimal = Decimal("0")
    laba_bersih: Decimal = Decimal("0")
    margin: float = 0.0
    target_laba: Decimal = Decimal("0")
    progress_target: float = 0.0
