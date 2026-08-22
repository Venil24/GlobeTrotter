from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Trip, Stop, User, City, BudgetItem, TripActivity
from app.api.auth import get_current_user
from app.api.trips import serialize_trip
from app.services.ai_planner import generate_tour_itinerary

router = APIRouter(prefix="/ai", tags=["AI Planner"])

class AIPlanTripRequest(BaseModel):
    destination: str = Field(..., example="Kyoto")
    start_date: date = Field(..., example="2026-09-01")
    end_date: date = Field(..., example="2026-09-05")
    budget: Optional[float] = Field(25000.0, example=30000.0)
    travelers: Optional[int] = Field(1, example=2)
    category: Optional[str] = Field("Leisure", example="Cultural")
    interests: Optional[List[str]] = Field(default=[], example=["Sightseeing", "Food", "Temples"])

@router.post("/plan-trip", response_model=dict, status_code=status.HTTP_201_CREATED)
async def plan_trip_with_ai(
    req: AIPlanTripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.end_date < req.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date."
        )

    # 1. Generate full-tour day-by-day plan via Gemini 2.0 Flash
    plan = await generate_tour_itinerary(
        destination=req.destination.strip(),
        start_date=req.start_date,
        end_date=req.end_date,
        budget=float(req.budget or 25000.0),
        travelers=int(req.travelers or 1),
        category=req.category or "Leisure",
        interests=req.interests or []
    )

    # 2. Check if destination matches any known seeded city for coordinates/metadata
    db_city = db.query(City).filter(City.name.ilike(req.destination.strip())).first()
    city_id = db_city.id if db_city else None

    # 3. Create persistent Trip in database under current user
    trip_title = plan.get("title") or f"{req.destination} {req.category or 'Tour'} Adventure"
    cover_image = plan.get("cover_image") or (db_city.image_url if db_city else "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200")
    
    trip = Trip(
        user_id=current_user.id,
        name=trip_title,
        destination=req.destination.strip(),
        description=plan.get("description", ""),
        cover_image=cover_image,
        start_date=req.start_date,
        end_date=req.end_date,
        total_budget=float(req.budget or 25000.0),
        travelers_count=int(req.travelers or 1),
        currency="INR",
        status="Upcoming",
        interests_raw=",".join(req.interests or [])
    )
    db.add(trip)
    db.flush()

    # 4. Create daily Stops and attach generated TripActivities
    raw_itinerary = plan.get("itinerary", [])
    for day_item in raw_itinerary:
        day_num = day_item.get("day", 1)
        day_date_str = day_item.get("date")
        day_date = date.fromisoformat(day_date_str) if day_date_str else req.start_date
        
        stop = Stop(
            trip_id=trip.id,
            city_id=city_id,
            arrival_date=day_date,
            departure_date=day_date,
            order_index=day_num,
            city_header=day_item.get("city_header") or f"Day {day_num}: {req.destination}",
            notes=day_item.get("notes", "")
        )
        db.add(stop)
        db.flush()

        activities = day_item.get("activities", [])
        for act_idx, act in enumerate(activities):
            trip_act = TripActivity(
                stop_id=stop.id,
                title=act.get("title", f"Activity {act_idx + 1}"),
                date=day_date,
                time=act.get("time", "10:00 AM"),
                order_index=act_idx + 1,
                cost=float(act.get("cost", 0.0)),
                location=act.get("location", req.destination),
                note=act.get("note", ""),
                status="Planned"
            )
            db.add(trip_act)

    # 5. Insert suggested Budget Items
    expenses = plan.get("expenses", [])
    for exp in expenses:
        b_item = BudgetItem(
            trip_id=trip.id,
            category=exp.get("category", "other"),
            title=exp.get("title", "Expense Item"),
            amount=float(exp.get("amount", 0.0)),
            date=req.start_date,
            notes="AI-generated budget estimate"
        )
        db.add(b_item)

    db.commit()
    db.refresh(trip)

    return serialize_trip(trip)
