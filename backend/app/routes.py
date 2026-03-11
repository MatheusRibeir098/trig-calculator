from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models import Calculation
from app.db import get_session
from app.middleware.auth import get_current_user, require_admin
from app.schemas import CalculationCreate, CalculationResponse
from datetime import datetime
from typing import Any, Dict

router = APIRouter(prefix="/api", tags=["calculations"])

@router.post("/calculations", response_model=CalculationResponse)
def create_calculation(
    data: CalculationCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Create a new calculation record (authenticated users only)"""
    try:
        # Create and save with user_id
        db_calc = Calculation(
            user_id=current_user['user_id'],
            angle=data.angle,
            opposite=data.opposite,
            adjacent=data.adjacent,
            hypotenuse=data.hypotenuse,
            sin=data.sin,
            cos=data.cos,
            tan=data.tan,
            cot=data.cot,
            sec=data.sec,
            csc=data.csc,
            angle_unit=data.angle_unit,
            created_at=datetime.utcnow(),
        )
        session.add(db_calc)
        session.commit()
        session.refresh(db_calc)
        return db_calc
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.get("/calculations")
def list_calculations(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """List current user's calculations with pagination"""
    # Get total count for current user
    total = session.query(func.count(Calculation.id)).filter(
        Calculation.user_id == current_user['user_id']
    ).scalar()
    
    # Get paginated results (ordered by newest first)
    items = session.query(Calculation).filter(
        Calculation.user_id == current_user['user_id']
    ).order_by(desc(Calculation.created_at)).offset(offset).limit(limit).all()
    
    return {
        "items": [
            {
                "id": item.id,
                "user_id": item.user_id,
                "angle": item.angle,
                "opposite": item.opposite,
                "adjacent": item.adjacent,
                "hypotenuse": item.hypotenuse,
                "sin": item.sin,
                "cos": item.cos,
                "tan": item.tan,
                "cot": item.cot,
                "sec": item.sec,
                "csc": item.csc,
                "angle_unit": item.angle_unit,
                "created_at": item.created_at,
            }
            for item in items
        ],
        "total": total,
        "limit": limit,
        "offset": offset,
    }

@router.delete("/calculations/{calc_id}")
def delete_calculation(
    calc_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """Delete a specific calculation (admin only)"""
    calc = session.query(Calculation).filter(Calculation.id == calc_id).first()
    if not calc:
        raise HTTPException(status_code=404, detail="Calculation not found")
    
    session.delete(calc)
    session.commit()
    return {"message": "Calculation deleted"}

@router.delete("/users/{user_id}/calculations")
def delete_user_calculations(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """Delete all calculations for a user (admin only)"""
    # Check if user exists
    from app.models import User
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete all calculations for this user
    deleted_count = session.query(Calculation).filter(
        Calculation.user_id == user_id
    ).delete()
    session.commit()
    
    return {
        "message": f"Deleted {deleted_count} calculations for user {user.username}",
        "deletedCount": deleted_count
    }

@router.delete("/calculations")
def clear_all_calculations(
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """Clear all calculations (admin only)"""
    deleted_count = session.query(Calculation).delete()
    session.commit()
    return {
        "message": "All calculations cleared",
        "deletedCount": deleted_count
    }
