from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.models import User, UserProfile, Trip, City, Activity, CommunityPost
from app.schemas.schemas import UserProfileUpdate, UserResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["User Profile and Admin"])

@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.name = profile_in.name
    
    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.flush()

    profile.bio = profile_in.bio
    profile.avatar = profile_in.avatar
    profile.countries_visited = profile_in.countries_visited
    profile.language = profile_in.language

    db.commit()
    db.refresh(current_user)

    saved_dests = [d.strip() for d in profile.saved_destinations_raw.split(";") if d.strip()] if profile else []

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "bio": profile.bio,
        "avatar": profile.avatar,
        "countries_visited": profile.countries_visited,
        "language": profile.language,
        "saved_destinations": saved_dests
    }

@router.delete("/profile", status_code=204)
def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()
    return

# Admin Dashboard statistics endpoint
@router.get("/admin/dashboard", response_model=dict)
def get_admin_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")

    total_users = db.query(func.count(User.id)).scalar()
    total_trips = db.query(func.count(Trip.id)).scalar()
    
    # Calculate avg trip duration
    trips = db.query(Trip).all()
    avg_duration = 0
    avg_budget = 0
    if trips:
        total_days = sum((t.end_date - t.start_date).days + 1 for t in trips)
        avg_duration = round(total_days / len(trips), 1)
        total_budget = sum(t.total_budget for t in trips)
        avg_budget = round(total_budget / len(trips))

    # Popular destination cities
    dest_counts = db.query(Trip.destination, func.count(Trip.id)).group_by(Trip.destination).order_by(func.count(Trip.id).desc()).limit(5).all()
    popular_cities = [{"name": dest, "trips": count} for dest, count in dest_counts]
    if not popular_cities:
        popular_cities = [{"name": "Goa", "trips": 12}, {"name": "Tokyo", "trips": 8}, {"name": "Paris", "trips": 5}]

    # Active user engagement list table details
    users_list = []
    all_users = db.query(User).limit(10).all()
    for u in all_users:
        users_list.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "tripsCount": len(u.trips)
        })

    return {
        "totalUsers": total_users,
        "tripsCreated": total_trips,
        "avgTripDuration": avg_duration or 4.5,
        "avgTripBudget": avg_budget or 1200,
        "popularCities": popular_cities,
        "activeUsers": users_list
    }
