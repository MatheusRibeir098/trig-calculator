from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    """Database model for users"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Common_User")  # Common_User or Admin_User
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationship
    calculations = relationship("Calculation", back_populates="user", cascade="all, delete-orphan")

class Calculation(Base):
    """Database model for trigonometric calculations"""
    __tablename__ = "calculation"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    angle = Column(Float, nullable=False)
    opposite = Column(Float, nullable=False)
    adjacent = Column(Float, nullable=False)
    hypotenuse = Column(Float, nullable=False)
    sin = Column(Float, nullable=False)
    cos = Column(Float, nullable=False)
    tan = Column(Float, nullable=False)
    cot = Column(Float, nullable=False)
    sec = Column(Float, nullable=False)
    csc = Column(Float, nullable=False)
    angle_unit = Column(String, default="degrees")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="calculations")
