import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt with salt factor 12"""
        if not password or len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify password against hash using bcrypt"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except Exception:
            return False
    
    @staticmethod
    def generate_token(user_id: int, username: str, role: str) -> Dict[str, Any]:
        """Generate JWT token with 24h expiration"""
        now = datetime.utcnow()
        expiration = now + timedelta(hours=JWT_EXPIRATION_HOURS)
        
        payload = {
            'user_id': user_id,
            'username': username,
            'role': role,
            'iat': now,
            'exp': expiration
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return {
            'token': token,
            'expiresIn': JWT_EXPIRATION_HOURS * 3600,  # in seconds
            'user': {
                'id': user_id,
                'username': username,
                'role': role
            }
        }
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
