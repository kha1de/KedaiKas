from typing import List, Dict, Any, Optional
from datetime import datetime
from decimal import Decimal
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.schemas.transaction import TransactionCreate
from app.utils.calculator import round_currency

class TransactionService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def get_all(
        self, 
        business_id: int, 
        start_date: Optional[datetime] = None, 
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        return self.repo.get_transactions(business_id, start_date, end_date)

    def get_by_id(self, business_id: int, transaction_id: int) -> Dict[str, Any]:
        tx = self.repo.get_transaction_by_id(business_id, transaction_id)
        if not tx:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transaksi dengan ID {transaction_id} tidak ditemukan."
            )
        return tx

    def create(self, business_id: int, user_id: int, tx_in: TransactionCreate) -> Dict[str, Any]:
        if not tx_in.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transaksi harus memiliki minimal 1 item produk."
            )

        tanggal = tx_in.tanggal or datetime.now()
        prepared_items = []
        total = Decimal("0")

        # Fetch and validate all products for current business
        business_products = {p["id"]: p for p in self.repo.get_products(business_id)}

        for it in tx_in.items:
            product = business_products.get(it.product_id)
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Produk ID {it.product_id} tidak ditemukan pada toko Anda."
                )

            # Snap current product price if not explicitly provided
            if it.harga_jual is not None:
                harga_jual = Decimal(str(it.harga_jual))
            else:
                harga_jual = Decimal(str(product["harga_jual"]))

            jumlah = Decimal(str(it.jumlah))
            subtotal = round_currency(jumlah * harga_jual)
            total += subtotal

            prepared_items.append({
                "product_id": it.product_id,
                "jumlah": it.jumlah,
                "harga_jual": harga_jual,
                "subtotal": subtotal
            })

        total = round_currency(total)
        created_tx = self.repo.create_transaction(
            business_id=business_id,
            user_id=user_id,
            tanggal=tanggal,
            total=total,
            items=prepared_items
        )
        return created_tx

    def delete(self, business_id: int, transaction_id: int) -> Dict[str, str]:
        success = self.repo.delete_transaction(business_id, transaction_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transaksi dengan ID {transaction_id} tidak ditemukan."
            )
        return {"message": f"Transaksi {transaction_id} berhasil dihapus."}
