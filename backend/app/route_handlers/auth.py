from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.db import get_session
from app.models import User
from app.services.auth_service import AuthService
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Request/Response schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "Common_User"

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    token: str
    expiresIn: int
    user: UserResponse

@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    session: Session = Depends(get_session)
):
    """Login with username and password"""
    
    # Validate input
    if not request.username or not request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    # Find user by username
    user = session.query(User).filter(User.username == request.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not AuthService.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    session.commit()
    
    # Generate token
    token_data = AuthService.generate_token(user.id, user.username, user.role)
    
    return AuthResponse(
        token=token_data['token'],
        expiresIn=token_data['expiresIn'],
        user=UserResponse.from_orm(user)
    )

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    session: Session = Depends(get_session),
    current_user: dict = Depends(lambda: None)  # Placeholder for admin check
):
    """Register new user (admin only)"""
    
    # Validate input
    if not request.username or not request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Check if username already exists
    existing_user = session.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    
    # Validate role
    if request.role not in ["Common_User", "Admin_User"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'Common_User' or 'Admin_User'"
        )
    
    # Hash password
    try:
        password_hash = AuthService.hash_password(request.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    # Create new user
    new_user = User(
        username=request.username,
        password_hash=password_hash,
        role=request.role,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Generate token
    token_data = AuthService.generate_token(new_user.id, new_user.username, new_user.role)
    
    return AuthResponse(
        token=token_data['token'],
        expiresIn=token_data['expiresIn'],
        user=UserResponse.from_orm(new_user)
    )

@router.post("/logout")
def logout():
    """Logout (client-side token removal)"""
    return {"message": "Logged out successfully"}
