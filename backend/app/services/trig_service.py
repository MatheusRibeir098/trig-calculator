import math
from typing import Optional

TOLERANCE = 1e-6

def validate_calculation(angle: Optional[float], opposite: Optional[float], adjacent: Optional[float]) -> None:
    """Validate trigonometric calculation consistency if all three are provided"""
    if angle is not None and opposite is not None and adjacent is not None:
        angle_rad = math.radians(angle)
        expected_tan = opposite / adjacent
        actual_tan = math.tan(angle_rad)
        
        if abs(expected_tan - actual_tan) > TOLERANCE:
            raise ValueError(
                f"Inconsistency: tan({angle}°) = {actual_tan:.6f}, "
                f"but opposite/adjacent = {expected_tan:.6f}"
            )

def calculate_hypotenuse(opposite: float, adjacent: float) -> float:
    """Calculate hypotenuse from opposite and adjacent sides"""
    return math.sqrt(opposite ** 2 + adjacent ** 2)

def calculate_trigonometric_ratios(opposite: float, adjacent: float, hypotenuse: float) -> dict:
    """Calculate all trigonometric ratios"""
    return {
        "sin": opposite / hypotenuse,
        "cos": adjacent / hypotenuse,
        "tan": opposite / adjacent,
        "cot": adjacent / opposite,
        "sec": hypotenuse / adjacent,
        "csc": hypotenuse / opposite,
    }
