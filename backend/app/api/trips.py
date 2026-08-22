import uuid
from datetime import timedelta, date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import Trip, Stop, User, City, BudgetItem, TripActivity
from app.schemas.schemas import TripCreate, TripUpdate, TripResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])

# Custom serializer to map relational Stops and Activities to matching frontend JSON shape
def serialize_trip(trip: Trip) -> dict:
    itinerary_list = []
    for stop in sorted(trip.stops, key=lambda s: s.order_index):
        activities_list = []
        for ta in sorted(stop.activities, key=lambda a: a.order_index):
            activities_list.append({
                "id": ta.id,
                "title": ta.title,
                "time": ta.time,
                "location": ta.location,
                "cost": ta.cost,
                "note": ta.note,
                "status": ta.status
            })
        itinerary_list.append({
            "day": stop.order_index,
            "date": stop.arrival_date.isoformat() if stop.arrival_date else "",
            "city_header": stop.city_header or trip.destination,
            "id": stop.id,
            "notes": stop.notes,
            "activities": activities_list
        })

    expense_list = []
    for exp in trip.budget_items:
        expense_list.append({
            "id": exp.id,
            "title": exp.title,
            "category": exp.category,
            "amount": exp.amount,
            "date": exp.date.isoformat() if exp.date else ""
        })

    interests_list = [i.strip() for i in trip.interests_raw.split(",") if i.strip()]

    return {
        "id": trip.id,
        "title": trip.name,
        "destination": trip.destination,
        "description": trip.description,
        "image": trip.cover_image or "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "startDate": trip.start_date.isoformat(),
        "endDate": trip.end_date.isoformat(),
        "budget": trip.total_budget,
        "travelers": trip.travelers_count,
        "currency": trip.currency,
        "status": trip.status,
        "is_public": trip.is_public,
        "share_token": trip.share_token,
        "interests": interests_list,
        "itinerary": itinerary_list,
        "expenses": expense_list
    }

@router.get("", response_model=List[dict])
def list_trips(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trips = db.query(Trip).filter(Trip.user_id == current_user.id).all()
    return [serialize_trip(t) for t in trips]

@router.post("", response_model=dict, status_code=201)
def create_trip(trip_in: TripCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Resolve City from DB if it matches destination
    db_city = db.query(City).filter(City.name.ilike(trip_in.destination)).first()
    city_id = db_city.id if db_city else None
    
    # Check default images
    cover = trip_in.cover_image
    if not cover and db_city:
        cover = db_city.image_url
    if not cover:
        cover = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600"

    # Create primary trip record
    interests_str = ",".join(trip_in.interests)
    trip = Trip(
        user_id=current_user.id,
        name=trip_in.name,
        destination=trip_in.destination,
        description=trip_in.description,
        cover_image=cover,
        start_date=trip_in.start_date,
        end_date=trip_in.end_date,
        total_budget=trip_in.total_budget,
        travelers_count=trip_in.travelers_count,
        currency=trip_in.currency,
        is_public=trip_in.is_public,
        interests_raw=interests_str
    )
    db.add(trip)
    db.flush()

    # 2. Automatically generate chronological Stops (1 Stop = 1 Day)
    duration = (trip_in.end_date - trip_in.start_date).days + 1
    for day_idx in range(1, duration + 1):
        day_date = trip_in.start_date + timedelta(days=day_idx - 1)
        stop = Stop(
            trip_id=trip.id,
            city_id=city_id,
            arrival_date=day_date,
            departure_date=day_date,
            order_index=day_idx,
            city_header=trip_in.destination
        )
        db.add(stop)

    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)

@router.get("/{trip_id}", response_model=dict)
def get_trip(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return serialize_trip(trip)

@router.put("/{trip_id}", response_model=dict)
def update_trip(trip_id: int, trip_in: TripUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if trip_in.name is not None:
        trip.name = trip_in.name
    if trip_in.destination is not None:
        trip.destination = trip_in.destination
    if trip_in.description is not None:
        trip.description = trip_in.description
    if trip_in.cover_image is not None:
        trip.cover_image = trip_in.cover_image
    if trip_in.total_budget is not None:
        trip.total_budget = trip_in.total_budget
    if trip_in.travelers_count is not None:
        trip.travelers_count = trip_in.travelers_count
    if trip_in.is_public is not None:
        trip.is_public = trip_in.is_public
    if trip_in.interests is not None:
        trip.interests_raw = ",".join(trip_in.interests)
    
    # Handle dates adjustments if dates changed
    if trip_in.start_date is not None or trip_in.end_date is not None:
        new_start = trip_in.start_date or trip.start_date
        new_end = trip_in.end_date or trip.end_date
        if new_start <= new_end:
            trip.start_date = new_start
            trip.end_date = new_end
            
            # Re-generate stops based on new date ranges if necessary
            # For simplicity, we adjust existing stop dates chronologically
            duration = (new_end - new_start).days + 1
            existing_stops = sorted(trip.stops, key=lambda s: s.order_index)
            
            # Add or remove stops to match duration
            if len(existing_stops) < duration:
                for idx in range(len(existing_stops) + 1, duration + 1):
                    day_date = new_start + timedelta(days=idx - 1)
                    new_stop = Stop(
                        trip_id=trip.id,
                        arrival_date=day_date,
                        departure_date=day_date,
                        order_index=idx,
                        city_header=trip.destination
                    )
                    db.add(new_stop)
            elif len(existing_stops) > duration:
                # delete trailing stops
                for s in existing_stops[duration:]:
                    db.delete(s)
            
            # Update dates on remaining stops
            db.flush()
            updated_stops = sorted(trip.stops, key=lambda s: s.order_index)
            for idx, stop in enumerate(updated_stops):
                day_date = new_start + timedelta(days=idx)
                stop.arrival_date = day_date
                stop.departure_date = day_date

    # Handle itinerary reorders and updates
    if trip_in.itinerary is not None:
        for idx, item in enumerate(trip_in.itinerary):
            stop_id = item.get("id")
            if stop_id:
                stop = db.query(Stop).filter(Stop.id == stop_id, Stop.trip_id == trip.id).first()
                if stop:
                    stop.order_index = item.get("day")
                    stop.city_header = item.get("city_header")
                    stop.notes = item.get("notes") or ""

    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return

@router.post("/{trip_id}/share", response_model=dict)
def share_trip(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if not trip.share_token:
        trip.share_token = f"shared-{uuid.uuid4().hex[:12]}"
    trip.is_public = True
    db.commit()
    return {"share_token": trip.share_token, "is_public": trip.is_public}

@router.get("/shared/{share_token}", response_model=dict)
def get_shared_trip(share_token: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.share_token == share_token, Trip.is_public == True).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Shared trip not found")
    return serialize_trip(trip)

@router.post("/shared/{share_token}/clone", response_model=dict)
def clone_shared_trip(
    share_token: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    source_trip = db.query(Trip).filter(Trip.share_token == share_token, Trip.is_public == True).first()
    if not source_trip:
        raise HTTPException(status_code=404, detail="Shared trip not found")

    # Clone the trip
    cloned = Trip(
        user_id=current_user.id,
        name=f"Copy of {source_trip.name}",
        destination=source_trip.destination,
        description=source_trip.description,
        cover_image=source_trip.cover_image,
        start_date=source_trip.start_date,
        end_date=source_trip.end_date,
        total_budget=source_trip.total_budget,
        travelers_count=source_trip.travelers_count,
        currency=source_trip.currency,
        interests_raw=source_trip.interests_raw
    )
    db.add(cloned)
    db.flush()

    # Clone stops and activities
    for stop in source_trip.stops:
        cloned_stop = Stop(
            trip_id=cloned.id,
            city_id=stop.city_id,
            arrival_date=stop.arrival_date,
            departure_date=stop.departure_date,
            order_index=stop.order_index,
            city_header=stop.city_header,
            notes=stop.notes
        )
        db.add(cloned_stop)
        db.flush()

        for ta in stop.activities:
            cloned_act = TripActivity(
                stop_id=cloned_stop.id,
                activity_id=ta.activity_id,
                title=ta.title,
                date=ta.date,
                time=ta.time,
                order_index=ta.order_index,
                cost=ta.cost,
                location=ta.location,
                note=ta.note
            )
            db.add(cloned_act)

    # Clone budget items
    for item in source_trip.budget_items:
        cloned_item = BudgetItem(
            trip_id=cloned.id,
            category=item.category,
            title=item.title,
            amount=item.amount,
            date=item.date,
            notes=item.notes
        )
        db.add(cloned_item)

    db.commit()
    db.refresh(cloned)
    return serialize_trip(cloned)

