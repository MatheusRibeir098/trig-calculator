from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, create_engine, SQLModel
from app.db import create_db_and_tables, engine
from app import routes
from app.route_handlers.auth import router as auth_router
from app.route_handlers.admin import router as admin_router

app = FastAPI(
    title="Trigonometry Calculator API",
    description="API for trigonometric calculations with history",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routes
app.include_router(routes.router)
app.include_router(auth_router)
app.include_router(admin_router)

@app.get("/")
def read_root():
    return {"message": "Trigonometry Calculator API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
