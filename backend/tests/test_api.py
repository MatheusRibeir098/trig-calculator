import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from app.main import app
from app.db import get_session

@pytest.fixture(name="session")
def session_fixture():
    """Create in-memory SQLite database for testing"""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create test client with test database"""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_create_calculation(client: TestClient):
    """Test creating a calculation"""
    response = client.post(
        "/api/calculations",
        json={
            "angle": 45.0,
            "opposite": 1.0,
            "adjacent": 1.0,
            "hypotenuse": 1.414,
            "sin": 0.707,
            "cos": 0.707,
            "tan": 1.0,
            "cot": 1.0,
            "sec": 1.414,
            "csc": 1.414,
            "angle_unit": "degrees",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["angle"] == 45.0
    assert data["id"] is not None

def test_list_calculations(client: TestClient):
    """Test listing calculations"""
    # Create a calculation first
    client.post(
        "/api/calculations",
        json={
            "angle": 45.0,
            "opposite": 1.0,
            "adjacent": 1.0,
            "hypotenuse": 1.414,
            "sin": 0.707,
            "cos": 0.707,
            "tan": 1.0,
            "cot": 1.0,
            "sec": 1.414,
            "csc": 1.414,
            "angle_unit": "degrees",
        },
    )

    response = client.get("/api/calculations")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1

def test_delete_calculation(client: TestClient):
    """Test deleting a calculation"""
    # Create a calculation
    create_response = client.post(
        "/api/calculations",
        json={
            "angle": 45.0,
            "opposite": 1.0,
            "adjacent": 1.0,
            "hypotenusa": 1.414,
            "sin": 0.707,
            "cos": 0.707,
            "tan": 1.0,
            "cot": 1.0,
            "sec": 1.414,
            "csc": 1.414,
            "angle_unit": "degrees",
        },
    )
    calc_id = create_response.json()["id"]

    # Delete it
    delete_response = client.delete(f"/api/calculations/{calc_id}")
    assert delete_response.status_code == 200

    # Verify it's gone
    list_response = client.get("/api/calculations")
    assert list_response.json()["total"] == 0

def test_clear_all_calculations(client: TestClient):
    """Test clearing all calculations"""
    # Create multiple calculations
    for i in range(3):
        client.post(
            "/api/calculations",
            json={
                "angle": 45.0 + i,
                "opposite": 1.0,
                "adjacent": 1.0,
                "hypotenuse": 1.414,
                "sin": 0.707,
                "cos": 0.707,
                "tan": 1.0,
                "cot": 1.0,
                "sec": 1.414,
                "csc": 1.414,
                "angle_unit": "degrees",
            },
        )

    # Clear all
    response = client.delete("/api/calculations")
    assert response.status_code == 200

    # Verify all are gone
    list_response = client.get("/api/calculations")
    assert list_response.json()["total"] == 0

def test_invalid_angle(client: TestClient):
    """Test validation of invalid angle"""
    response = client.post(
        "/api/calculations",
        json={
            "angle": 0.0,  # Invalid: must be > 0
            "opposite": 1.0,
            "adjacent": 1.0,
            "hypotenuse": 1.414,
            "sin": 0.707,
            "cos": 0.707,
            "tan": 1.0,
            "cot": 1.0,
            "sec": 1.414,
            "csc": 1.414,
            "angle_unit": "degrees",
        },
    )
    assert response.status_code == 422

def test_health_check(client: TestClient):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
