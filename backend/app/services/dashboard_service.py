from decimal import Decimal
from typing import Dict, Any
from app.repositories.base import BaseRepository
from app.utils.calculator import calculate_financial_metrics, calculate_target_progress

class DashboardService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_dashboard_data(self, user_id: int) -> Dict[str, Any]:
        products = self.repo.get_products(user_id)
        products_map = {p["id"]: p for p in products}

        transactions = self.repo.get_transactions(user_id)
        expenses = self.repo.get_expenses(user_id)

        # Calculate metrics using business calculator
        metrics = calculate_financial_metrics(transactions, products_map, expenses)

        # Target calculation
        latest_target = self.repo.get_latest_target(user_id)
        if latest_target:
            target_prog = calculate_target_progress(
                target_laba=latest_target["target_laba"],
                laba_bersih=metrics["laba_bersih"],
                periode_mulai=latest_target["periode_mulai"],
                periode_selesai=latest_target["periode_selesai"]
            )
            target_laba = target_prog["target_laba"]
            progress_target = target_prog["progress_persen"]
        else:
            target_laba = Decimal("0")
            progress_target = 0.0

        return {
            "omzet": metrics["omzet"],
            "hpp": metrics["hpp"],
            "laba_kotor": metrics["laba_kotor"],
            "pengeluaran": metrics["pengeluaran"],
            "laba_bersih": metrics["laba_bersih"],
            "margin": metrics["margin"],
            "target_laba": target_laba,
            "progress_target": progress_target
        }
