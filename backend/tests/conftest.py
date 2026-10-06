import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.repositories import get_repository
from app.repositories.mock_repository import MockRepository

@pytest.fixture(scope="session")
def client():
    return TestClient(app)

@pytest.fixture(scope="session")
def auth_headers():
    # Token for user_id = 3 (Owner: Darin Hilmi Azzahra)
    token = create_access_token(subject=3, role="owner", id_usaha=1)
    return {"Authorization": f"Bearer {token}"}
