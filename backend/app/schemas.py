from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class CalculationCreate(BaseModel):
    """Schema for creating a calculation"""
    angle: Optional[float] = None
    opposite: Optional[float] = None
    adjacent: Optional[float] = None
    hypotenuse: Optional[float] = None
    sin: float
    cos: float
    tan: float
    cot: float
    sec: float
    csc: float
    angle_unit: str = "degrees"

class CalculationResponse(CalculationCreate):
    """Schema for calculation response"""
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PaginatedResponse(BaseModel):
    """Schema for paginated responses"""
    items: List[CalculationResponse]
    total: int
    limit: int
    offset: int
