import pytest
import math
from app.services.trig_service import (
    validate_calculation,
    calculate_hypotenuse,
    calculate_trigonometric_ratios,
)

def test_validate_calculation_valid():
    """Test validation with valid values"""
    # 45-45-90 triangle
    validate_calculation(45, 1, 1)  # Should not raise

def test_validate_calculation_invalid():
    """Test validation with inconsistent values"""
    with pytest.raises(ValueError):
        validate_calculation(45, 3, 4)  # Inconsistent

def test_calculate_hypotenuse():
    """Test hypotenuse calculation"""
    # 3-4-5 triangle
    result = calculate_hypotenuse(3, 4)
    assert result == 5.0

    # 1-1-sqrt(2) triangle
    result = calculate_hypotenuse(1, 1)
    assert abs(result - math.sqrt(2)) < 1e-6

def test_calculate_trigonometric_ratios():
    """Test trigonometric ratios calculation"""
    # 3-4-5 triangle
    ratios = calculate_trigonometric_ratios(3, 4, 5)
    
    assert abs(ratios["sin"] - 0.6) < 1e-6
    assert abs(ratios["cos"] - 0.8) < 1e-6
    assert abs(ratios["tan"] - 0.75) < 1e-6
    assert abs(ratios["cot"] - 1.333333) < 1e-5
    assert abs(ratios["sec"] - 1.25) < 1e-6
    assert abs(ratios["csc"] - 1.666666) < 1e-5
