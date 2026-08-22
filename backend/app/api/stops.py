from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from app.database.connection import get_db
from app.models.models import Stop, Trip, City, User
from app.schemas.schemas import StopCreate, StopUpdate, StopResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["Stops"])

@router.get("/trips/{trip_id}/stops", response_model=List[StopResponse])
def get_stops(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip.stops

@router.post("/trips/{trip_id}/stops", response_model=StopResponse)
def add_stop(trip_id: int, stop_in: StopCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    city = db.query(City).filter(City.id == stop_in.city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    # Increment trip dates by 1 day as stops are added
    new_end_date = trip.end_date + timedelta(days=1)
    trip.end_date = new_end_date

    order_idx = len(trip.stops) + 1
    new_stop = Stop(
        trip_id=trip.id,
        city_id=city.id,
        arrival_date=new_end_date,
        departure_date=new_end_date,
        order_index=order_idx,
        city_header=city.name
    )
    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)
    return new_stop

@router.put("/stops/{stop_id}", response_model=StopResponse)
def update_stop(stop_id: int, stop_in: StopUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    if stop_in.city_header is not None:
        stop.city_header = stop_in.city_header
    if stop_in.notes is not None:
        stop.notes = stop_in.notes
    if stop_in.order_index is not None:
        stop.order_index = stop_in.order_index

    db.commit()
    db.refresh(stop)
    return stop

@router.delete("/stops/{stop_id}", status_code=204)
def delete_stop(stop_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    trip = stop.trip
    db.delete(stop)
    
    # Adjust remaining stops indices chronologically
    db.flush()
    remaining_stops = sorted(trip.stops, key=lambda s: s.order_index)
    for idx, s in enumerate(remaining_stops):
        s.order_index = idx + 1

    db.commit()
    return
