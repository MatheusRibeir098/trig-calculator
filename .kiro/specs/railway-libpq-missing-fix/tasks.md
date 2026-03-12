# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Railway Backend Startup Failure
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that backend startup on Railway with nixpacks.toml containing `nixPkgs = ["postgresql"]` results in ImportError for libpq.so.5
  - The test assertions should match the Expected Behavior Properties from design: uvicorn starts successfully, no ImportError in logs, health endpoint responds
  - Simulate Railway environment locally using Docker with Nix or test directly on Railway
  - Run test on UNFIXED code (current nixpacks.toml with generic postgresql)
  - **EXPECTED OUTCOME**: Test FAILS with ImportError: libpq.so.5: cannot open shared object file (this is correct - it proves the bug exists)
  - Document counterexamples found: specific error message, stack trace, missing library path
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Database Operations and Business Logic
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (operations after successful startup in local environment)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Database connections establish correctly
    - SQL queries execute without errors
    - Authentication and JWT generation work correctly
    - Trigonometric calculations produce correct results
    - User management operations function properly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code in local development environment (where startup succeeds)
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [-] 3. Fix for Railway libpq.so.5 ImportError

  - [-] 3.1 Implement the fix
    - Update backend/nixpacks.toml to use postgresql_15 instead of generic postgresql
    - Change line `nixPkgs = ["postgresql"]` to `nixPkgs = ["postgresql_15"]`
    - Commit changes to Git repository
    - Push to GitHub to trigger Railway automatic deployment
    - Monitor Railway deployment logs for successful build and startup
    - Verify that libpq.so.5 is now available in the Nix environment
    - _Bug_Condition: isBugCondition(input) where input.environment == "Railway" AND input.nixpacks_config.nixPkgs CONTAINS "postgresql" (generic) AND NOT systemHasLibrary("libpq.so.5")_
    - _Expected_Behavior: Backend starts successfully on Railway without ImportError, uvicorn runs, health endpoint responds, psycopg2 imports correctly_
    - _Preservation: Database connections, SQL queries, authentication, business logic, local development environment behavior remain unchanged_
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Railway Backend Startup Success
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1 on Railway with fixed nixpacks.toml
    - Verify that uvicorn starts successfully without ImportError
    - Verify that health endpoint responds correctly
    - Verify that logs do not contain "libpq.so.5" or "ImportError"
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Database Operations and Business Logic
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2 on Railway with fixed backend
    - Verify database connections work correctly
    - Verify SQL queries execute without errors
    - Verify authentication and JWT generation work
    - Verify trigonometric calculations produce correct results
    - Verify user management operations function properly
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run all tests (bug condition + preservation) on Railway production environment
  - Verify backend is accessible at https://trig-calculator-production.up.railway.app
  - Verify health endpoint responds: GET /health
  - Verify login works: POST /api/auth/login
  - Verify calculator works: POST /api/calculate
  - Verify no errors in Railway logs
  - Ask the user if questions arise or if additional verification is needed
