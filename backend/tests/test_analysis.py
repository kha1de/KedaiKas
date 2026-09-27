def test_price_analysis(client, auth_headers):
    resp = client.get("/api/analysis/price", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert len(data["items"]) >= 5
    for item in data["items"]:
        assert "status" in item
        assert item["status"] in ["Di bawah referensi", "Dalam rentang wajar", "Di atas referensi", "Belum ada referensi"]
        assert "rekomendasi" in item
        assert len(item["rekomendasi"]) > 0

def test_product_analysis(client, auth_headers):
    resp = client.get("/api/analysis/products", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "produk_terlaris" in data
    assert "produk_omzet_tertinggi" in data
    assert "produk_margin_tertinggi" in data
    assert "produk_laris_margin_rendah" in data
    assert len(data["produk_terlaris"]) > 0

def test_financial_analysis(client, auth_headers):
    resp = client.get("/api/analysis/finance", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "periode_ini" in data
    assert "periode_lalu" in data
    assert "perubahan_omzet_persen" in data
    assert "perubahan_laba_bersih_persen" in data

def test_insights_and_warnings(client, auth_headers):
    resp = client.get("/api/analysis/insights", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "insights" in data
    assert "warnings" in data
    assert len(data["insights"]) > 0
    # Every insight must have category, type, and clear message
    for ins in data["insights"]:
        assert "kategori" in ins
        assert "pesan" in ins
