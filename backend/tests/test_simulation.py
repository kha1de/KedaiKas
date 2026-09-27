def test_cobadulu_simulation_non_mutating(client, auth_headers):
    # 1. Fetch initial products and dashboard
    initial_products = client.get("/api/products", headers=auth_headers).json()
    initial_tx = client.get("/api/transactions", headers=auth_headers).json()
    initial_exp = client.get("/api/expenses", headers=auth_headers).json()
    initial_dash = client.get("/api/dashboard", headers=auth_headers).json()

    # 2. Run simulation with what-if pricing and volume:
    # Change Indomie (id=1) price from 6000 to 7000, volume to 100
    sim_request = {
        "produk_simulasi": [
            {
                "product_id": 1,
                "harga_jual_baru": 7000,
                "jumlah_penjualan_baru": 100
            }
        ],
        "pengeluaran_baru": 500000,
        "target_laba_simulasi": 3500000
    }

    sim_resp = client.post("/api/simulation", headers=auth_headers, json=sim_request)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()

    # Validate simulation payload structure
    assert "saat_ini" in sim_data
    assert "proyeksi_simulasi" in sim_data
    assert "selisih" in sim_data
    assert "perbandingan_target" in sim_data
    assert "catatan" in sim_data

    # Check that projections are non-trivial
    assert float(sim_data["proyeksi_simulasi"]["omzet"]) > 0
    assert float(sim_data["proyeksi_simulasi"]["laba_bersih"]) > 0
    assert "status_proyeksi" in sim_data["perbandingan_target"]

    # 3. CRITICAL VERIFICATION: Ensure original database/mock data was NOT mutated
    after_products = client.get("/api/products", headers=auth_headers).json()
    after_tx = client.get("/api/transactions", headers=auth_headers).json()
    after_exp = client.get("/api/expenses", headers=auth_headers).json()
    after_dash = client.get("/api/dashboard", headers=auth_headers).json()

    # Product prices must be unchanged
    indomie_init = next(p for p in initial_products if p["id"] == 1)
    indomie_after = next(p for p in after_products if p["id"] == 1)
    assert indomie_init["harga_jual"] == indomie_after["harga_jual"]
    assert float(indomie_after["harga_jual"]) == 6000.0

    # Number of transactions and expenses must be unchanged
    assert len(initial_tx) == len(after_tx)
    assert len(initial_exp) == len(after_exp)
    assert initial_dash["omzet"] == after_dash["omzet"]
    assert initial_dash["laba_bersih"] == after_dash["laba_bersih"]
