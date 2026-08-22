from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Trip, Stop, Activity, User
from app.api.auth import get_current_user
from app.services.recommendation import get_recommendations

router = APIRouter(prefix="/trips", tags=["Recommendations"])

@router.get("/{trip_id}/recommendations/{stop_id}", response_model=dict)
def get_trip_recommendations(
    trip_id: int,
    stop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    stop = db.query(Stop).filter(Stop.id == stop_id, Stop.trip_id == trip.id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    # Fetch activities in this city
    # If no city is assigned to stop yet, fallback to activities matching trip destination
    query = db.query(Activity)
    if stop.city_id:
        query = query.filter(Activity.city_id == stop.city_id)
    else:
        query = query.join(Activity.city).filter(Activity.city.name.ilike(trip.destination))

    activities = query.all()
    
    scored_recommendations = get_recommendations(trip, stop, activities)
    
    formatted_results = []
    for item in scored_recommendations:
        act = item["activity"]
        formatted_results.append({
            "id": act.id,
            "title": act.name,
            "description": act.description,
            "price": act.estimated_cost,
            "rating": act.rating,
            "reviews": int(act.popularity_score * 25), # mock review counts
            "category": act.category,
            "location": f"{act.city.name}, {act.city.country}",
            "image": act.image_url,
            "score": item["score"],
            "reason": item["reason"]
        })

    return {"recommendations": formatted_results}
