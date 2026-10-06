def test_list_transactions(client, auth_headers):
    response = client.get("/api/transactions", headers=auth_headers)
    assert response.status_code == 200
    tx_list = response.json()
    assert len(tx_list) >= 7
    first_tx = tx_list[0]
    assert "total" in first_tx
    assert "items" in first_tx
    assert len(first_tx["items"]) > 0

def test_create_transaction_calculation(client, auth_headers):
    # Fetch available products dynamically
    products_resp = client.get("/api/products", headers=auth_headers)
    assert products_resp.status_code == 200
    products = products_resp.json()
    assert len(products) >= 2
    p1 = products[0]
    p2 = products[1]

    expected_total = (float(p1["harga_jual"]) * 3) + (float(p2["harga_jual"]) * 2)

    resp = client.post("/api/transactions", headers=auth_headers, json={
        "items": [
            {"product_id": p1["id"], "jumlah": 3},
            {"product_id": p2["id"], "jumlah": 2}
        ]
    })
    assert resp.status_code == 201
    data = resp.json()
    assert float(data["total"]) == expected_total
    assert len(data["items"]) == 2
    
    item1 = next(it for it in data["items"] if it["product_id"] == p1["id"])
    assert float(item1["harga_jual"]) == float(p1["harga_jual"])
    assert float(item1["subtotal"]) == float(p1["harga_jual"]) * 3

    item2 = next(it for it in data["items"] if it["product_id"] == p2["id"])
    assert float(item2["harga_jual"]) == float(p2["harga_jual"])
    assert float(item2["subtotal"]) == float(p2["harga_jual"]) * 2
