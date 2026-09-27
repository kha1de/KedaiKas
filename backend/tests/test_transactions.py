def test_list_transactions(client, auth_headers):
    response = client.get("/api/transactions", headers=auth_headers)
    assert response.status_code == 200
    tx_list = response.json()
    assert len(tx_list) >= 8
    first_tx = tx_list[0]
    assert "total" in first_tx
    assert "items" in first_tx
    assert len(first_tx["items"]) > 0

def test_create_transaction_calculation(client, auth_headers):
    # Indomie (id=1, jual 6000) qty 3 = 18000
    # Es Teh (id=2, jual 3000) qty 2 = 6000
    # Total = 24000
    resp = client.post("/api/transactions", headers=auth_headers, json={
        "items": [
            {"product_id": 1, "jumlah": 3},
            {"product_id": 2, "jumlah": 2}
        ]
    })
    assert resp.status_code == 201
    data = resp.json()
    assert float(data["total"]) == 24000.0
    assert len(data["items"]) == 2
    
    item1 = next(it for it in data["items"] if it["product_id"] == 1)
    assert float(item1["harga_jual"]) == 6000.0
    assert float(item1["subtotal"]) == 18000.0

    item2 = next(it for it in data["items"] if it["product_id"] == 2)
    assert float(item2["harga_jual"]) == 3000.0
    assert float(item2["subtotal"]) == 6000.0
