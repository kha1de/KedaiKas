from decimal import Decimal
from datetime import date, timedelta
from app.utils.calculator import calculate_financial_metrics, calculate_target_progress

def test_financial_calculation_logic():
    # Mock items:
    # Item 1: qty 10, subtotal 60000, product modal 2500 (HPP = 25000)
    # Item 2: qty 5, subtotal 15000, product modal 1000 (HPP = 5000)
    # Total Omzet: 75000
    # Total HPP: 30000
    # Laba Kotor: 45000
    # Expenses: 20000
    # Laba Bersih: 25000
    # Margin: (25000 / 75000) * 100 = 33.33%
    transactions = [
        {
            "items": [
                {"product_id": 1, "jumlah": 10, "subtotal": Decimal("60000.00")},
                {"product_id": 2, "jumlah": 5, "subtotal": Decimal("15000.00")}
            ]
        }
    ]
    products_map = {
        1: {"harga_modal": Decimal("2500.00")},
        2: {"harga_modal": Decimal("1000.00")}
    }
    expenses = [{"nominal": Decimal("20000.00")}]

    metrics = calculate_financial_metrics(transactions, products_map, expenses)
    assert metrics["omzet"] == Decimal("75000.00")
    assert metrics["hpp"] == Decimal("30000.00")
    assert metrics["laba_kotor"] == Decimal("45000.00")
    assert metrics["pengeluaran"] == Decimal("20000.00")
    assert metrics["laba_bersih"] == Decimal("25000.00")
    assert metrics["margin"] == 33.33

def test_target_progress_calculation():
    today = date.today()
    start = today.replace(day=1)
    end = today + timedelta(days=10) # 10 days remaining

    # Target 3.000.000, laba 1.000.000 -> Gap = 2.000.000, remaining days = 11, daily need = ~181.818
    res = calculate_target_progress(
        target_laba=Decimal("3000000.00"),
        laba_bersih=Decimal("1000000.00"),
        periode_mulai=start,
        periode_selesai=end
    )
    assert res["target_gap"] == Decimal("2000000.00")
    assert res["progress_persen"] == 33.33
    assert res["hari_tersisa"] >= 10
    assert res["kebutuhan_laba_harian"] > Decimal("0")

def test_dashboard_endpoint(client, auth_headers):
    resp = client.get("/api/dashboard", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "omzet" in data
    assert "hpp" in data
    assert "laba_kotor" in data
    assert "pengeluaran" in data
    assert "laba_bersih" in data
    assert "margin" in data
    assert "target_laba" in data
    assert "progress_target" in data
    # Basic invariants
    assert float(data["laba_kotor"]) == float(data["omzet"]) - float(data["hpp"])
    assert float(data["laba_bersih"]) == float(data["laba_kotor"]) - float(data["pengeluaran"])
