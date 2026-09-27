def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "budi@warung.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "budi@warung.com"

def test_login_invalid_password(client):
    response = client.post("/api/auth/login", json={
        "email": "budi@warung.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_register_new_user(client):
    response = client.post("/api/auth/register", json={
        "nama": "Siti Nurhaliza",
        "email": "siti@warung.com",
        "password": "securepass123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["nama"] == "Siti Nurhaliza"
    assert data["email"] == "siti@warung.com"

def test_get_me_protected(client, auth_headers):
    # Valid token
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "budi@warung.com"

    # Missing token
    unauth_resp = client.get("/api/auth/me")
    assert unauth_resp.status_code == 401
