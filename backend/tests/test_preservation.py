"""
Preservation Property Tests for Railway libpq Fix

These tests validate Property 2: Preservation - Database Operations and Business Logic

IMPORTANT: These tests capture the baseline behavior that MUST be preserved after the fix.
They should PASS on unfixed code (in local environment where startup succeeds).
They should CONTINUE to PASS after the fix is implemented.

Requirements: 3.1, 3.2, 3.3, 3.4
"""
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


class TestDatabaseConnectionPreservation:
    """
    Property 2: Preservation - Database Connections
    
    Validates Requirement 3.1: Database connections SHALL CONTINUE TO work correctly
    """
    
    def test_database_session_creation(self, session: Session):
        """Database sessions should be created successfully"""
        assert session is not None
        assert session.is_active
        
    def test_database_transaction_commit(self, session: Session):
        """Database transactions should commit successfully"""
        # This validates that basic DB operations work
        session.begin()
        session.commit()
        assert True  # If we get here, commit worked


class TestQueryExecutionPreservation:
    """
    Property 2: Preservation - SQL Query Execution
    
    Validates Requirement 3.2: SQL queries SHALL CONTINUE TO execute without errors
    """
    
    def test_health_endpoint_responds(self, client: TestClient):
        """Health check endpoint should continue to work"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
    
    def test_create_calculation_works(self, client: TestClient):
        """Creating calculations should continue to work"""
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
    
    def test_list_calculations_works(self, client: TestClient):
        """Listing calculations should continue to work"""
        # Create a calculation first
        client.post(
            "/api/calculations",
            json={
                "angle": 30.0,
                "opposite": 1.0,
                "adjacent": 1.732,
                "hypotenuse": 2.0,
                "sin": 0.5,
                "cos": 0.866,
                "tan": 0.577,
                "cot": 1.732,
                "sec": 1.155,
                "csc": 2.0,
                "angle_unit": "degrees",
            },
        )
        
        response = client.get("/api/calculations")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1
        assert len(data["items"]) >= 1
    
    def test_delete_calculation_works(self, client: TestClient):
        """Deleting calculations should continue to work"""
        # Create a calculation
        create_response = client.post(
            "/api/calculations",
            json={
                "angle": 60.0,
                "opposite": 1.732,
                "adjacent": 1.0,
                "hypotenuse": 2.0,
                "sin": 0.866,
                "cos": 0.5,
                "tan": 1.732,
                "cot": 0.577,
                "sec": 2.0,
                "csc": 1.155,
                "angle_unit": "degrees",
            },
        )
        calc_id = create_response.json()["id"]
        
        # Delete it
        delete_response = client.delete(f"/api/calculations/{calc_id}")
        assert delete_response.status_code == 200


class TestBusinessLogicPreservation:
    """
    Property 2: Preservation - Business Logic
    
    Validates Requirement 3.3: Business logic SHALL CONTINUE TO function normally
    """
    
    def test_trigonometric_calculations_preserved(self, client: TestClient):
        """Trigonometric calculation logic should be preserved"""
        # Test with known angle (45 degrees)
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
        
        # Verify the calculation values are preserved
        assert abs(data["sin"] - 0.707) < 0.01
        assert abs(data["cos"] - 0.707) < 0.01
        assert abs(data["tan"] - 1.0) < 0.01
    
    def test_validation_logic_preserved(self, client: TestClient):
        """Input validation should continue to work"""
        # Test with invalid angle (0 or negative)
        response = client.post(
            "/api/calculations",
            json={
                "angle": 0.0,
                "opposite": 1.0,
                "adjacent": 1.0,
                "hypotenuse": 1.414,
                "sin": 0.0,
                "cos": 1.0,
                "tan": 0.0,
                "cot": 0.0,
                "sec": 1.0,
                "csc": 1.0,
                "angle_unit": "degrees",
            },
        )
        
        # Should return validation error
        assert response.status_code == 422


class TestDatabaseURLProcessingPreservation:
    """
    Property 2: Preservation - DATABASE_URL Processing
    
    Validates Requirement 3.4: DATABASE_URL processing SHALL CONTINUE TO work correctly
    """
    
    def test_postgresql_url_format_supported(self):
        """PostgreSQL URL format should continue to be supported"""
        from sqlalchemy import create_engine
        
        # Test that both URL formats are supported
        test_urls = [
            "postgresql://user:pass@localhost:5432/db",
            "postgresql+psycopg2://user:pass@localhost:5432/db",
        ]
        
        for url in test_urls:
            try:
                engine = create_engine(url, echo=False)
                assert engine is not None
                # We're not actually connecting, just verifying the URL is parsed
            except Exception as e:
                # If it fails, it should not be due to URL parsing
                assert "Invalid" not in str(e)
                assert "format" not in str(e).lower()


class TestLocalDevelopmentPreservation:
    """
    Property 2: Preservation - Local Development Environment
    
    Validates Requirement 3.3: Local development SHALL CONTINUE TO function normally
    """
    
    def test_sqlite_database_still_works(self, session: Session):
        """SQLite (used in local dev) should continue to work"""
        # This test uses SQLite fixture, confirming local dev is unaffected
        assert session is not None
        assert session.bind.url.drivername == "sqlite"
    
    def test_app_imports_successfully(self):
        """App should import successfully in local environment"""
        from app.main import app
        assert app is not None
        assert hasattr(app, "routes")
    
    def test_database_module_imports(self):
        """Database module should import successfully"""
        from app.db import get_session, create_db_and_tables
        assert get_session is not None
        assert create_db_and_tables is not None


# Property-Based Test Examples (using hypothesis if available)
try:
    from hypothesis import given, strategies as st
    
    class TestPropertyBasedPreservation:
        """
        Property-Based Tests for stronger preservation guarantees
        
        These tests generate many random inputs to verify behavior is preserved
        across a wide range of scenarios.
        """
        
        @given(
            angle=st.floats(min_value=0.1, max_value=89.9),
            opposite=st.floats(min_value=0.1, max_value=100.0),
            adjacent=st.floats(min_value=0.1, max_value=100.0),
        )
        def test_calculation_creation_preserved_for_random_inputs(
            self, client: TestClient, angle: float, opposite: float, adjacent: float
        ):
            """Calculation creation should work for any valid random inputs"""
            import math
            
            # Calculate expected values
            hypotenuse = math.sqrt(opposite**2 + adjacent**2)
            sin_val = opposite / hypotenuse
            cos_val = adjacent / hypotenuse
            tan_val = opposite / adjacent
            
            response = client.post(
                "/api/calculations",
                json={
                    "angle": angle,
                    "opposite": opposite,
                    "adjacent": adjacent,
                    "hypotenuse": hypotenuse,
                    "sin": sin_val,
                    "cos": cos_val,
                    "tan": tan_val,
                    "cot": 1 / tan_val if tan_val != 0 else 0,
                    "sec": 1 / cos_val if cos_val != 0 else 0,
                    "csc": 1 / sin_val if sin_val != 0 else 0,
                    "angle_unit": "degrees",
                },
            )
            
            # Should succeed for all valid inputs
            assert response.status_code == 200

except ImportError:
    # hypothesis not installed, skip property-based tests
    pass
