import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine, Base, SessionLocal
from app.services.seeder import seed_database

# Include API Routers
from app.api.auth import router as auth_router
from app.api.trips import router as trips_router
from app.api.stops import router as stops_router
from app.api.activities import router as activities_router
from app.api.itinerary import router as itinerary_router
from app.api.budget import router as budget_router
from app.api.recommendations import router as recommendations_router
from app.api.profile import router as profile_router
from app.api.posts import router as posts_router
from app.api.ai_planner import router as ai_planner_router
from app.api.admin import router as admin_router

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

# Seed database parameters
db_session = SessionLocal()
try:
    seed_database(db_session)
finally:
    db_session.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack Travel Planner & Itinerary Builder backend API built with FastAPI, SQLAlchemy, and Pydantic.",
    version="1.0.0"
)

# CORS setup for the React client uploader
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Routers
app.include_router(auth_router, prefix="/api")
app.include_router(trips_router, prefix="/api")
app.include_router(stops_router, prefix="/api")
app.include_router(activities_router, prefix="/api")
app.include_router(itinerary_router, prefix="/api")
app.include_router(budget_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(posts_router, prefix="/api")
app.include_router(ai_planner_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "active",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
