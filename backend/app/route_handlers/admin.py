from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.db import get_session
from app.models import User
from app.middleware.auth import require_admin
from app.services.auth_service import AuthService
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    limit: int
    offset: int

class UpdateUserRoleRequest(BaseModel):
    role: str

@router.get("/users", response_model=UserListResponse)
def list_users(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """List all users (admin only)"""
    
    # Get total count
    total = session.query(func.count(User.id)).scalar()
    
    # Get paginated results
    users = session.query(User).offset(offset).limit(limit).all()
    
    return UserListResponse(
        users=[UserResponse.from_orm(user) for user in users],
        total=total,
        limit=limit,
        offset=offset
    )

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    request: UpdateUserRoleRequest,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """Update user role (admin only)"""
    
    # Validate role
    if request.role not in ["Common_User", "Admin_User"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'Common_User' or 'Admin_User'"
        )
    
    # Find user
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update role
    user.role = request.role
    user.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(user)
    
    return UserResponse.from_orm(user)

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_admin)
):
    """Delete user (admin only)"""
    
    # Find user
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting self
    if user.id == current_user['user_id']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    username = user.username
    session.delete(user)
    session.commit()
    
    return {"message": f"User '{username}' deleted successfully"}
