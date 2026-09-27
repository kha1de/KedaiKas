from decimal import Decimal
from app.utils.calculator import calculate_product_margin

def test_margin_calculation_formula():
    # modal 2500, jual 5000 -> 50%
    assert calculate_product_margin(Decimal("2500"), Decimal("5000")) == 50.0
    # modal 2500, jual 6000 -> ((6000 - 2500) / 6000) * 100 = 58.33%
    assert calculate_product_margin(Decimal("2500"), Decimal("6000")) == 58.33
    # zero selling price handling
    assert calculate_product_margin(Decimal("2500"), Decimal("0")) == 0.0

def test_list_products(client, auth_headers):
    response = client.get("/api/products", headers=auth_headers)
    assert response.status_code == 200
    products = response.json()
    assert len(products) >= 5
    assert any(p["nama_produk"] == "Indomie Goreng" for p in products)
    indomie = next(p for p in products if p["nama_produk"] == "Indomie Goreng")
    assert indomie["margin_persen"] == 58.33

def test_create_and_update_product(client, auth_headers):
    create_resp = client.post("/api/products", headers=auth_headers, json={
        "nama_produk": "Krupuk Kaleng",
        "kategori": "Makanan Ringan",
        "harga_modal": 500,
        "harga_jual": 1000,
        "satuan": "buah"
    })
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["nama_produk"] == "Krupuk Kaleng"
    assert created["margin_persen"] == 50.0
    p_id = created["id"]

    # Update product
    upd_resp = client.put(f"/api/products/{p_id}", headers=auth_headers, json={
        "harga_jual": 1200
    })
    assert upd_resp.status_code == 200
    updated = upd_resp.json()
    assert float(updated["harga_jual"]) == 1200.0
    # Margin: ((1200 - 500) / 1200) * 100 = 58.33%
    assert updated["margin_persen"] == 58.33
