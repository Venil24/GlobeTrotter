from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import City, Activity
from app.schemas.schemas import CityResponse, ActivityResponse

router = APIRouter(tags=["Cities and Activities Search"])

@router.get("/cities/search", response_model=List[CityResponse])
def search_cities(
    q: Optional[str] = Query(None, description="Search query for city name or country"),
    db: Session = Depends(get_db)
):
    query = db.query(City)
    if q:
        query = query.filter(
            City.name.ilike(f"%{q}%") | 
            City.country.ilike(f"%{q}%") |
            City.region.ilike(f"%{q}%")
        )
    return query.limit(15).all()

@router.get("/cities/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@router.get("/activities/search", response_model=List[ActivityResponse])
def search_activities(
    q: Optional[str] = Query(None, description="Search query for activity name"),
    city_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    max_cost: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if q:
        query = query.filter(
            Activity.name.ilike(f"%{q}%") | 
            Activity.description.ilike(f"%{q}%")
        )
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if category and category != "All":
        query = query.filter(Activity.category.ilike(category))
    if max_cost is not None:
        query = query.filter(Activity.estimated_cost <= max_cost)
        
    return query.limit(20).all()

@router.get("/activities/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    return act
