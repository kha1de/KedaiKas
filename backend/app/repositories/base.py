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
    def create_user(self, nama: str, email: str, password_hash: str) -> Dict[str, Any]:
        pass

    # --- PRODUCTS ---
    @abstractmethod
    def get_products(self, user_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_product_by_id(self, user_id: int, product_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_product(self, user_id: int, product_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_product(self, user_id: int, product_id: int, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_product(self, user_id: int, product_id: int) -> bool:
        pass

    # --- TRANSACTIONS ---
    @abstractmethod
    def get_transactions(self, user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_transaction_by_id(self, user_id: int, transaction_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_transaction(self, user_id: int, tanggal: datetime, total: Decimal, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def delete_transaction(self, user_id: int, transaction_id: int) -> bool:
        pass

    # --- EXPENSES ---
    @abstractmethod
    def get_expenses(self, user_id: int, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_expense_by_id(self, user_id: int, expense_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_expense(self, user_id: int, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_expense(self, user_id: int, expense_id: int, expense_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_expense(self, user_id: int, expense_id: int) -> bool:
        pass

    # --- TARGETS ---
    @abstractmethod
    def get_targets(self, user_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_latest_target(self, user_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_target(self, user_id: int, target_laba: Decimal, periode_mulai: date, periode_selesai: date) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update_target(self, user_id: int, target_id: int, target_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    # --- PRICE REFERENCES ---
    @abstractmethod
    def get_price_references(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_price_reference_by_name(self, nama_produk: str) -> Optional[Dict[str, Any]]:
        pass
