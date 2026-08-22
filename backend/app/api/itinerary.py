from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Stop, TripActivity, Trip, User
from app.schemas.schemas import TripActivityCreate, TripActivityUpdate, TripActivityResponse
from app.api.auth import get_current_user
from app.api.trips import serialize_trip

router = APIRouter(tags=["Itinerary Planner"])

@router.post("/stops/{stop_id}/activities", response_model=dict)
def add_activity_to_stop(
    stop_id: int, 
    activity_in: TripActivityCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    order_idx = len(stop.activities) + 1
    ta = TripActivity(
        stop_id=stop.id,
        title=activity_in.title,
        time=activity_in.time,
        location=activity_in.location,
        cost=activity_in.cost,
        note=activity_in.note,
        order_index=order_idx,
        date=stop.arrival_date
    )
    db.add(ta)
    db.commit()
    db.refresh(ta)
    
    # Return full serialized trip state to keep frontend react in sync
    return serialize_trip(stop.trip)

@router.put("/trip-activities/{activity_id}", response_model=dict)
def update_trip_activity(
    activity_id: int,
    activity_in: TripActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ta = db.query(TripActivity).join(Stop).join(Trip).filter(
        TripActivity.id == activity_id, 
        Trip.user_id == current_user.id
    ).first()
    
    if not ta:
        raise HTTPException(status_code=404, detail="Scheduled activity not found")

    if activity_in.title is not None:
        ta.title = activity_in.title
    if activity_in.time is not None:
        ta.time = activity_in.time
    if activity_in.location is not None:
        ta.location = activity_in.location
    if activity_in.cost is not None:
        ta.cost = activity_in.cost
    if activity_in.note is not None:
        ta.note = activity_in.note
    if activity_in.status is not None:
        ta.status = activity_in.status

    db.commit()
    return serialize_trip(ta.stop.trip)

@router.delete("/trip-activities/{activity_id}", response_model=dict)
def delete_trip_activity(
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ta = db.query(TripActivity).join(Stop).join(Trip).filter(
        TripActivity.id == activity_id, 
        Trip.user_id == current_user.id
    ).first()
    
    if not ta:
        raise HTTPException(status_code=404, detail="Scheduled activity not found")

    trip = ta.stop.trip
    stop = ta.stop
    db.delete(ta)
    
    # Re-sequence remaining activities index order
    db.flush()
    remaining = sorted(stop.activities, key=lambda a: a.order_index)
    for idx, act in enumerate(remaining):
        act.order_index = idx + 1

    db.commit()
    return serialize_trip(trip)
