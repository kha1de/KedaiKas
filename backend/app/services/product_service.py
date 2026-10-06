from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from app.repositories.base import BaseRepository
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.calculator import calculate_product_margin

class ProductService:
    def __init__(self, repo: BaseRepository):
        self.repo = repo

    def _enrich_margin(self, product: Dict[str, Any]) -> Dict[str, Any]:
        p = product.copy()
        p["margin_persen"] = calculate_product_margin(p["harga_modal"], p["harga_jual"])
        return p

    def get_all(self, business_id: int) -> List[Dict[str, Any]]:
        products = self.repo.get_products(business_id)
        return [self._enrich_margin(p) for p in products]

    def get_by_id(self, business_id: int, product_id: int) -> Dict[str, Any]:
        p = self.repo.get_product_by_id(business_id, product_id)
        if not p:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produk dengan ID {product_id} tidak ditemukan."
            )
        return self._enrich_margin(p)

    def create(self, business_id: int, product_in: ProductCreate, user_id: Optional[int] = None) -> Dict[str, Any]:
        data = product_in.model_dump()
        created = self.repo.create_product(business_id, data, user_id=user_id)
        return self._enrich_margin(created)

    def update(self, business_id: int, product_id: int, product_in: ProductUpdate) -> Dict[str, Any]:
        data = product_in.model_dump(exclude_unset=True)
        updated = self.repo.update_product(business_id, product_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produk dengan ID {product_id} tidak ditemukan."
            )
        return self._enrich_margin(updated)

    def delete(self, business_id: int, product_id: int) -> Dict[str, str]:
        success = self.repo.delete_product(business_id, product_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produk dengan ID {product_id} tidak ditemukan."
            )
        return {"message": f"Produk {product_id} berhasil dihapus."}
