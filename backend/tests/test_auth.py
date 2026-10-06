import uuid

def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "dar.hilmi@gmail.com",
        "password": "123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "dar.hilmi@gmail.com"

def test_login_invalid_password(client):
    response = client.post("/api/auth/login", json={
        "email": "dar.hilmi@gmail.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_register_new_user(client):
    unique_email = f"user_{uuid.uuid4().hex[:8]}@warung.com"
    response = client.post("/api/auth/register", json={
        "nama": "Test Pegawai Baru",
        "email": unique_email,
        "password": "securepass123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["nama"] == "Test Pegawai Baru"
    assert data["email"] == unique_email

def test_get_me_protected(client, auth_headers):
    # Valid token
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "dar.hilmi@gmail.com"

    # Missing token
    unauth_resp = client.get("/api/auth/me")
    assert unauth_resp.status_code == 401
