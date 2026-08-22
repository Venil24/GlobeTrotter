from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import BudgetItem, Trip, User
from app.schemas.schemas import BudgetItemCreate, BudgetItemResponse
from app.api.auth import get_current_user
from app.api.trips import serialize_trip

router = APIRouter(tags=["Budget tracker"])

@router.post("/trips/{trip_id}/budget-items", response_model=dict)
def add_budget_item(
    trip_id: int,
    item_in: BudgetItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    expense = BudgetItem(
        trip_id=trip.id,
        category=item_in.category,
        title=item_in.title,
        amount=item_in.amount,
        date=item_in.date or trip.start_date,
        notes=item_in.notes or ""
    )
    db.add(expense)
    db.commit()
    
    # Return full serialized trip state to keep frontend react budget charts in sync
    return serialize_trip(trip)

@router.delete("/budget-items/{item_id}", response_model=dict)
def delete_budget_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expense = db.query(BudgetItem).join(Trip).filter(
        BudgetItem.id == item_id,
        Trip.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense log not found")

    trip = expense.trip
    db.delete(expense)
    db.commit()
    
    return serialize_trip(trip)
