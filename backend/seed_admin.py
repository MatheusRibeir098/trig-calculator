"""
Script to seed the database with an initial admin user
Run this once to create the first admin account
"""

from app.db import SessionLocal, create_db_and_tables
from app.models import User
from app.services.auth_service import AuthService
from datetime import datetime

def seed_admin():
    # Create tables first
    create_db_and_tables()
    
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin_password = "admin123"  # Change this in production!
        password_hash = AuthService.hash_password(admin_password)
        
        admin_user = User(
            username="admin",
            password_hash=password_hash,
            role="Admin_User",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        
        print("✓ Admin user created successfully!")
        print(f"  Username: admin")
        print(f"  Password: {admin_password}")
        print("  Role: Admin_User")
        print("\n⚠️  IMPORTANT: Change the password in production!")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
