import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def owner_headers():
    # User 3 is Owner (Darin Hilmi Azzahra, id_usaha=1)
    token = create_access_token(subject=3, role="owner", id_usaha=1)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def manager_headers():
    # User 2 is Manager (Daffa Berlliano, id_usaha=1)
    token = create_access_token(subject=2, role="manager", id_usaha=1)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def kasir_headers():
    # User 1 is Kasir (Ahmad Khairul Fatih, id_usaha=1)
    token = create_access_token(subject=1, role="kasir", id_usaha=1)
    return {"Authorization": f"Bearer {token}"}

# --- 1. AUTHENTICATION & LOGIN FOR 3 DEMO ACCOUNTS ---
def test_demo_accounts_login(client):
    # Kasir (Ahmad Khairul Fatih)
    resp1 = client.post("/api/auth/login", json={"email": "ah.khairul@gmail.com", "password": "123"})
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["user"]["role"] == "kasir"
    assert data1["user"]["nama"] == "Ahmad Khairul Fatih"
    assert data1["user"]["id_usaha"] == 1

    # Manager (Daffa Berlliano)
    resp2 = client.post("/api/auth/login", json={"email": "daf.berlliano@gmail.com", "password": "123"})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["user"]["role"] == "manager"
    assert data2["user"]["nama"] == "Daffa Berlliano"
    assert data2["user"]["id_usaha"] == 1

    # Owner (Darin Hilmi Azzahra)
    resp3 = client.post("/api/auth/login", json={"email": "dar.hilmi@gmail.com", "password": "123"})
    assert resp3.status_code == 200
    data3 = resp3.json()
    assert data3["user"]["role"] == "owner"
    assert data3["user"]["nama"] == "Darin Hilmi Azzahra"
    assert data3["user"]["id_usaha"] == 1

# --- 2. KASIR RESTRICTIONS (HTTP 403 FORBIDDEN) ---
def test_kasir_forbidden_endpoints(client, kasir_headers):
    # Kasir cannot access executive dashboard
    r_dash = client.get("/api/dashboard", headers=kasir_headers)
    assert r_dash.status_code == 403

    # Kasir cannot access expenses
    r_exp = client.get("/api/expenses", headers=kasir_headers)
    assert r_exp.status_code == 403

    # Kasir cannot create products
    r_prod_create = client.post("/api/products", headers=kasir_headers, json={
        "nama_produk": "Produk Ilegal",
        "kategori": "Snack",
        "harga_modal": 1000,
        "harga_jual": 2000,
        "satuan": "Pcs"
    })
    assert r_prod_create.status_code == 403

    # Kasir cannot delete transactions
    r_tx_del = client.delete("/api/transactions/1", headers=kasir_headers)
    assert r_tx_del.status_code == 403

    # Kasir cannot access analysis
    r_analysis = client.get("/api/analysis/price", headers=kasir_headers)
    assert r_analysis.status_code == 403

    # Kasir cannot access reports
    r_report = client.get("/api/reports", headers=kasir_headers)
    assert r_report.status_code == 403

    # Kasir cannot run simulation
    r_sim = client.post("/api/simulation", headers=kasir_headers, json={"produk_simulasi": []})
    assert r_sim.status_code == 403

    # Kasir cannot access user management
    r_users = client.get("/api/users", headers=kasir_headers)
    assert r_users.status_code == 403

# --- 3. MANAGER RESTRICTIONS & ALLOWANCES ---
def test_manager_permissions(client, manager_headers):
    # Manager CAN access dashboard
    r_dash = client.get("/api/dashboard", headers=manager_headers)
    assert r_dash.status_code == 200

    # Manager CAN access expenses
    r_exp = client.get("/api/expenses", headers=manager_headers)
    assert r_exp.status_code == 200

    # Manager CAN access analysis
    r_ana = client.get("/api/analysis/products", headers=manager_headers)
    assert r_ana.status_code == 200

    # Manager CAN access simulation
    r_sim = client.post("/api/simulation", headers=manager_headers, json={"produk_simulasi": []})
    assert r_sim.status_code == 200

    # Manager CANNOT delete products (Owner only)
    r_del_prod = client.delete("/api/products/1", headers=manager_headers)
    assert r_del_prod.status_code == 403

    # Manager CANNOT delete transactions (Owner only)
    r_del_tx = client.delete("/api/transactions/1", headers=manager_headers)
    assert r_del_tx.status_code == 403

    # Manager CANNOT access user management
    r_users = client.get("/api/users", headers=manager_headers)
    assert r_users.status_code == 403

# --- 4. OWNER FULL ACCESS ---
def test_owner_permissions(client, owner_headers):
    # Owner can access user management
    r_users = client.get("/api/users", headers=owner_headers)
    assert r_users.status_code == 200
    users_list = r_users.json()
    assert len(users_list) >= 3

    # Owner can access dashboard
    r_dash = client.get("/api/dashboard", headers=owner_headers)
    assert r_dash.status_code == 200

    # Owner can access settings
    r_settings = client.get("/api/settings", headers=owner_headers)
    assert r_settings.status_code == 200
    assert r_settings.json()["nama_usaha"] == "Kedai Berkah UMKM"

# --- 5. DATA SHARING: KASIR CREATES TRANSACTION, MANAGER & OWNER SEE IT ---
def test_multi_user_data_sharing(client, kasir_headers, manager_headers, owner_headers):
    # Kasir lists products
    r_prods = client.get("/api/products", headers=kasir_headers)
    assert r_prods.status_code == 200
    prods = r_prods.json()
    assert len(prods) > 0
    p1 = prods[0]

    # Kasir creates a transaction
    tx_payload = {
        "items": [
            {
                "product_id": p1["id"],
                "jumlah": 3,
                "harga_jual": p1["harga_jual"]
            }
        ]
    }
    r_create = client.post("/api/transactions", headers=kasir_headers, json=tx_payload)
    assert r_create.status_code == 201
    new_tx = r_create.json()
    new_tx_id = new_tx["id"]
    assert new_tx["user_id"] == 1  # Recorded by Kasir (Ahmad Khairul Fatih)

    # Manager can see the newly created transaction
    r_mgr_tx = client.get(f"/api/transactions/{new_tx_id}", headers=manager_headers)
    assert r_mgr_tx.status_code == 200
    assert r_mgr_tx.json()["id"] == new_tx_id
    assert r_mgr_tx.json()["user_id"] == 1

    # Owner can see the newly created transaction
    r_owner_tx = client.get(f"/api/transactions/{new_tx_id}", headers=owner_headers)
    assert r_owner_tx.status_code == 200
    assert r_owner_tx.json()["id"] == new_tx_id

    # Owner can clean it up (Owner-only delete)
    r_del = client.delete(f"/api/transactions/{new_tx_id}", headers=owner_headers)
    assert r_del.status_code == 200
