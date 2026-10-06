from datetime import datetime, date
from decimal import Decimal
import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models import (
    User,
    Product,
    Transaction,
    TransactionItem,
    Expense,
    Target,
    PriceReference
)
from app.repositories.sql_repository import SqlRepository
from app.core.security import hash_password, verify_password

@pytest.fixture
def db_session():
    """Create an in-memory SQLite database session for testing SQLAlchemyRepository."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()

def test_table_and_column_names_match_project_warung(db_session):
    """Verify that mapped tables and columns match project_warung.sql exact schema."""
    engine = db_session.get_bind()
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    # Verify table names
    assert "users" in tables
    assert "products" in tables
    assert "transactions" in tables
    assert "transaction_details" in tables # Must be transaction_details, NOT transaction_items
    assert "expenses" in tables
    assert "targets" in tables
    assert "price_references" in tables

    # Verify column names in 'users'
    user_cols = {c["name"] for c in inspector.get_columns("users")}
    assert "id_user" in user_cols
    assert "pass" in user_cols

    # Verify column names in 'products'
    prod_cols = {c["name"] for c in inspector.get_columns("products")}
    assert "id_produk" in prod_cols
    assert "id_user" in prod_cols

    # Verify column names in 'transactions'
    tx_cols = {c["name"] for c in inspector.get_columns("transactions")}
    assert "id_transaksi" in tx_cols
    assert "id_user" in tx_cols

    # Verify column names in 'transaction_details'
    detail_cols = {c["name"] for c in inspector.get_columns("transaction_details")}
    assert "id_detail" in detail_cols
    assert "id_transaksi" in detail_cols
    assert "id_produk" in detail_cols

    # Verify column names in 'expenses'
    exp_cols = {c["name"] for c in inspector.get_columns("expenses")}
    assert "id_expenses" in exp_cols
    assert "id_user" in exp_cols

    # Verify column names in 'targets'
    target_cols = {c["name"] for c in inspector.get_columns("targets")}
    assert "id_target" in target_cols
    assert "id_user" in target_cols

    # Verify column names in 'price_references'
    ref_cols = {c["name"] for c in inspector.get_columns("price_references")}
    assert "id_analisis" in ref_cols

def test_sql_repository_user_and_legacy_password(db_session):
    """Verify user operations and password verification including legacy seed password '123'."""
    repo = SqlRepository(db_session)

    # 1. Create a modern user with bcrypt
    hashed = hash_password("secret456")
    user = repo.create_user(nama="Modern User", email="modern@warung.com", password_hash=hashed)
    assert user["id"] is not None
    assert user["email"] == "modern@warung.com"

    fetched = repo.get_user_by_email("modern@warung.com")
    assert fetched is not None
    assert verify_password("secret456", fetched["password"]) is True
    assert verify_password("wrongpass", fetched["password"]) is False

    # 2. Insert legacy user with plaintext password '123' (like in project_warung.sql)
    raw_user = User(
        nama="Ahmad Khairul",
        email="ah.khairul@gmail.com",
        password="123"
    )
    db_session.add(raw_user)
    db_session.commit()

    legacy_user = repo.get_user_by_email("ah.khairul@gmail.com")
    assert legacy_user is not None
    assert verify_password("123", legacy_user["password"]) is True
    assert verify_password("wrong", legacy_user["password"]) is False

def test_sql_repository_crud_products_and_transactions(db_session):
    """Verify products and transactions with transaction_details integration."""
    repo = SqlRepository(db_session)

    # Setup user
    user = repo.create_user(nama="Warung Budi", email="budi@test.com", password_hash="pass")
    user_id = user["id"]

    # 1. Product CRUD
    p1 = repo.create_product(user_id, {
        "nama_produk": "Beras Ramos 1 kg",
        "kategori": "Sembako",
        "harga_modal": Decimal("12500"),
        "harga_jual": Decimal("14500"),
        "satuan": "Kg"
    })
    assert p1["id"] is not None
    assert p1["harga_jual"] == Decimal("14500")

    p2 = repo.create_product(user_id, {
        "nama_produk": "Minyak Goreng 1 Liter",
        "kategori": "Sembako",
        "harga_modal": Decimal("14000"),
        "harga_jual": Decimal("16500"),
        "satuan": "Pouch"
    })

    products = repo.get_products(user_id)
    assert len(products) == 2

    # 2. Transaction with details
    items = [
        {
            "product_id": p1["id"],
            "jumlah": 2,
            "harga_jual": Decimal("14500"),
            "subtotal": Decimal("29000")
        },
        {
            "product_id": p2["id"],
            "jumlah": 1,
            "harga_jual": Decimal("16500"),
            "subtotal": Decimal("16500")
        }
    ]
    tx = repo.create_transaction(
        business_id=1,
        user_id=user_id,
        tanggal=datetime(2026, 9, 14, 10, 0, 0),
        total=Decimal("45500"),
        items=items
    )
    assert tx["id"] is not None
    assert tx["total"] == Decimal("45500")
    assert len(tx["items"]) == 2
    # Verify historical harga_jual and subtotal preserved
    assert tx["items"][0]["harga_jual"] == Decimal("14500")
    assert tx["items"][0]["subtotal"] == Decimal("29000")

    # Get transactions
    tx_list = repo.get_transactions(business_id=1)
    assert len(tx_list) >= 1
    assert any(t["id"] == tx["id"] for t in tx_list)

def test_sql_repository_expenses_targets_and_refs(db_session):
    """Verify expenses, targets, and price references."""
    repo = SqlRepository(db_session)
    user = repo.create_user(nama="Warung Test", email="test@warung.com", password_hash="pass")
    user_id = user["id"]

    # Expense
    exp = repo.create_expense(business_id=1, expense_data={
        "kategori": "Operasional",
        "nominal": Decimal("150000"),
        "tanggal": date(2026, 9, 1),
        "keterangan": "Bayar listrik"
    }, user_id=user_id)
    assert exp["id"] is not None
    assert exp["nominal"] == Decimal("150000")

    expenses = repo.get_expenses(business_id=1)
    assert len(expenses) >= 1

    # Target
    target = repo.create_target(
        business_id=1,
        user_id=user_id,
        target_laba=Decimal("5000000"),
        periode_mulai=date(2026, 9, 1),
        periode_selesai=date(2026, 9, 30)
    )
    assert target["id"] is not None
    latest = repo.get_latest_target(business_id=1)
    assert latest is not None
    assert latest["target_laba"] == Decimal("5000000")

    # Price Reference
    ref = PriceReference(
        nama_produk="Minyak Goreng 1 Liter",
        kategori="Sembako",
        harga_min=Decimal("13500"),
        harga_max=Decimal("16000"),
        satuan="Pouch",
        sumber="Pasar Induk"
    )
    db_session.add(ref)
    db_session.commit()

    refs = repo.get_price_references()
    assert len(refs) == 1
    assert refs[0]["nama_produk"] == "Minyak Goreng 1 Liter"
