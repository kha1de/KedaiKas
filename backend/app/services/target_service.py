from typing import List, Dict, Any, Optional
from datetime import date
from decimal import Decimal
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.schemas.target import TargetCreate, TargetUpdate
from app.utils.calculator import calculate_financial_metrics, calculate_target_progress

class TargetService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_targets(self, user_id: int) -> List[Dict[str, Any]]:
        return self.repo.get_targets(user_id)

    def get_target_progress(self, user_id: int) -> Dict[str, Any]:
        latest_target = self.repo.get_latest_target(user_id)
        if not latest_target:
            return {
                "target": None,
                "target_laba": Decimal("0"),
                "laba_saat_ini": Decimal("0"),
                "target_gap": Decimal("0"),
                "hari_tersisa": 0,
                "kebutuhan_laba_harian": Decimal("0"),
                "progress_persen": 0.0,
                "status": "Belum ada target laba aktif yang dibuat."
            }

        # Calculate current net profit within target period
        products = self.repo.get_products(user_id)
        products_map = {p["id"]: p for p in products}

        # Filter transactions and expenses within target period
        start_date = latest_target["periode_mulai"]
        end_date = latest_target["periode_selesai"]

        all_tx = self.repo.get_transactions(user_id)
        all_exp = self.repo.get_expenses(user_id)

        tx_in_period = [t for t in all_tx if start_date <= t["tanggal"].date() <= end_date]
        exp_in_period = [e for e in all_exp if start_date <= e["tanggal"] <= end_date]

        metrics = calculate_financial_metrics(tx_in_period, products_map, exp_in_period)

        prog = calculate_target_progress(
            target_laba=latest_target["target_laba"],
            laba_bersih=metrics["laba_bersih"],
            periode_mulai=latest_target["periode_mulai"],
            periode_selesai=latest_target["periode_selesai"]
        )

        return {
            "target": latest_target,
            **prog
        }

    def create_target(self, user_id: int, target_in: TargetCreate) -> Dict[str, Any]:
        if target_in.periode_selesai < target_in.periode_mulai:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Periode selesai tidak boleh lebih awal dari periode mulai."
            )
        created = self.repo.create_target(
            user_id=user_id,
            target_laba=target_in.target_laba,
            periode_mulai=target_in.periode_mulai,
            periode_selesai=target_in.periode_selesai
        )
        return created

    def update_target(self, user_id: int, target_id: int, target_in: TargetUpdate) -> Dict[str, Any]:
        data = target_in.model_dump(exclude_unset=True)
        if "periode_mulai" in data and "periode_selesai" in data:
            if data["periode_selesai"] < data["periode_mulai"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Periode selesai tidak boleh lebih awal dari periode mulai."
                )

        updated = self.repo.update_target(user_id, target_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Target dengan ID {target_id} tidak ditemukan."
            )
        return updated
