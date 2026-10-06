from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from decimal import Decimal

class BaseRepository(ABC):
    # --- USERS ---
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_users_by_business(self, business_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_user(self, nama: str, email: str, password_hash: str, role: str = "kasir", id_usaha: int = 1) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_user_role(self, user_id: int, role: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        pass

    # --- BUSINESSES ---
    @abstractmethod
    def get_business_by_id(self, business_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def update_business(self, business_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    # --- PRODUCTS (Scoped to business_id) ---
    @abstractmethod
    def get_products(self, business_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_product_by_id(self, business_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_product(self, business_id: int, product_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_product(self, business_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_product(self, business_id: int, product_id: int) -> bool:
        pass

    # --- TRANSACTIONS (Scoped to business_id, tracks cashier user_id) ---
    @abstractmethod
    def get_transactions(self, business_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_transaction_by_id(self, business_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_transaction(self, business_id: int, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def delete_transaction(self, business_id: int, transaction_id: int) -> bool:
        pass

    # --- EXPENSES (Scoped to business_id) ---
    @abstractmethod
    def get_expenses(self, business_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_expense_by_id(self, business_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_expense(self, business_id: int, expense_data: Dict[str, Any], user_id: Optional[int] = None) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_expense(self, business_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_expense(self, business_id: int, expense_id: int) -> bool:
        pass

    # --- TARGETS (Scoped to business_id) ---
    @abstractmethod
    def get_targets(self, business_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_latest_target(self, business_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_target(self, business_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date, user_id: Optional[int] = None) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_target(self, business_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    # --- PRICE REFERENCES (Benchmark Umum) ---
    @abstractmethod
    def get_price_references(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_price_reference_by_name(self, nama_produk: str) -> Optional[Dict[str, Any]]:
        pass
