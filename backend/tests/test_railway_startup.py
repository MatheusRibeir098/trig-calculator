"""
Bug Condition Exploration Test for Railway libpq.so.5 ImportError

This test validates Property 1: Bug Condition - Railway Backend Startup Failure

CRITICAL: This test MUST FAIL on unfixed code (nixpacks.toml with generic postgresql)
The failure confirms the bug exists and validates our root cause analysis.

When the fix is implemented (postgresql_15 in nixpacks.toml), this test should PASS.
"""
import os
import subprocess
import pytest


def test_psycopg2_import_succeeds():
    """
    Property 1: Bug Condition - Backend Startup Success
    
    WHEN backend is deployed on Railway with nixpacks.toml containing postgresql_15
    THEN psycopg2 SHALL import successfully without ImportError for libpq.so.5
    
    This test simulates the Railway environment by attempting to import psycopg2.
    
    EXPECTED OUTCOME ON UNFIXED CODE: FAIL with ImportError: libpq.so.5 not found
    EXPECTED OUTCOME ON FIXED CODE: PASS (psycopg2 imports successfully)
    
    Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3
    """
    try:
        # Attempt to import psycopg2 - this is where the bug manifests
        import psycopg2
        
        # If we get here, psycopg2 imported successfully
        # This means libpq.so.5 is available
        assert psycopg2 is not None, "psycopg2 should be imported"
        
        # Additional check: verify we can access psycopg2 internals
        assert hasattr(psycopg2, '__version__'), "psycopg2 should have __version__"
        
        print(f"✓ psycopg2 imported successfully (version: {psycopg2.__version__})")
        
    except ImportError as e:
        # This is the bug condition - libpq.so.5 not found
        error_msg = str(e)
        
        # Document the counterexample
        print(f"✗ ImportError encountered: {error_msg}")
        
        # Verify this is the specific bug we're testing for
        if "libpq.so.5" in error_msg or "libpq" in error_msg:
            pytest.fail(
                f"BUG CONFIRMED: psycopg2 cannot import due to missing libpq library.\n"
                f"Error: {error_msg}\n"
                f"Root Cause: nixpacks.toml uses generic 'postgresql' instead of 'postgresql_15'\n"
                f"Fix Required: Update nixpacks.toml to use postgresql_15"
            )
        else:
            # Different import error - re-raise for investigation
            raise


def test_database_connection_with_postgresql():
    """
    Property 1: Bug Condition - Database Connection Success
    
    WHEN backend attempts to create SQLAlchemy engine with PostgreSQL
    THEN the engine SHALL be created successfully without ImportError
    
    This test validates that the database connection can be established,
    which requires psycopg2 to be working correctly.
    
    EXPECTED OUTCOME ON UNFIXED CODE: FAIL (psycopg2 import fails)
    EXPECTED OUTCOME ON FIXED CODE: PASS (engine created successfully)
    
    Requirements: 2.1, 2.2, 2.3
    """
    try:
        from sqlalchemy import create_engine
        
        # Use a dummy PostgreSQL URL - we're not actually connecting,
        # just testing that the driver can be loaded
        test_url = "postgresql://user:pass@localhost:5432/testdb"
        
        # This will fail if psycopg2 cannot be imported
        engine = create_engine(test_url, echo=False)
        
        assert engine is not None, "SQLAlchemy engine should be created"
        
        print("✓ SQLAlchemy engine created successfully with PostgreSQL driver")
        
    except ImportError as e:
        error_msg = str(e)
        
        print(f"✗ ImportError encountered: {error_msg}")
        
        if "libpq" in error_msg or "psycopg2" in error_msg:
            pytest.fail(
                f"BUG CONFIRMED: Cannot create PostgreSQL engine due to missing libpq.\n"
                f"Error: {error_msg}\n"
                f"This confirms the bug exists in the current environment."
            )
        else:
            raise


def test_uvicorn_can_import_app():
    """
    Property 1: Bug Condition - Uvicorn Startup Success
    
    WHEN uvicorn attempts to import app.main:app
    THEN the import SHALL succeed without ImportError
    
    This simulates what happens when Railway starts the backend.
    
    EXPECTED OUTCOME ON UNFIXED CODE: FAIL (app.db imports psycopg2, which fails)
    EXPECTED OUTCOME ON FIXED CODE: PASS (app imports successfully)
    
    Requirements: 2.1, 2.2
    """
    try:
        # This is what uvicorn does when starting: import app.main:app
        from app.main import app
        
        assert app is not None, "FastAPI app should be imported"
        
        print("✓ FastAPI app imported successfully (uvicorn would start)")
        
    except ImportError as e:
        error_msg = str(e)
        
        print(f"✗ ImportError encountered during app import: {error_msg}")
        
        # Check if this is related to our bug
        if "libpq" in error_msg or "psycopg2" in error_msg:
            pytest.fail(
                f"BUG CONFIRMED: Cannot import FastAPI app due to psycopg2/libpq issue.\n"
                f"Error: {error_msg}\n"
                f"This is exactly what causes the Railway crash.\n"
                f"Stack trace shows: app.main → app.db → psycopg2 → libpq.so.5 missing"
            )
        else:
            raise


@pytest.mark.skipif(
    os.getenv("RAILWAY_ENVIRONMENT") is None,
    reason="This test only runs on Railway to verify the actual deployment environment"
)
def test_railway_environment_has_libpq():
    """
    Property 1: Bug Condition - Railway Environment Validation
    
    WHEN running on Railway with fixed nixpacks.toml
    THEN libpq.so.5 SHALL be present in the system
    
    This test only runs on Railway (detected by RAILWAY_ENVIRONMENT variable).
    It validates that the fix actually installs libpq in the Railway environment.
    
    EXPECTED OUTCOME ON UNFIXED CODE: FAIL (libpq.so.5 not found)
    EXPECTED OUTCOME ON FIXED CODE: PASS (libpq.so.5 found)
    
    Requirements: 2.3
    """
    try:
        # Try to find libpq.so.5 in the system
        result = subprocess.run(
            ["find", "/nix/store", "-name", "libpq.so.5", "-type", "f"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0 and result.stdout.strip():
            libpq_paths = result.stdout.strip().split('\n')
            print(f"✓ libpq.so.5 found in Railway environment:")
            for path in libpq_paths:
                print(f"  - {path}")
        else:
            pytest.fail(
                "BUG CONFIRMED: libpq.so.5 not found in Railway /nix/store.\n"
                "This confirms that nixpacks.toml with generic 'postgresql' "
                "does not install the required libraries.\n"
                "Fix: Update nixpacks.toml to use postgresql_15"
            )
            
    except subprocess.TimeoutExpired:
        pytest.fail("Timeout while searching for libpq.so.5")
    except FileNotFoundError:
        pytest.skip("'find' command not available (not on Railway)")
