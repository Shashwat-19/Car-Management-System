import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Car
from auth import get_current_user

router = APIRouter(prefix="/api/cars", tags=["Cars"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class CarCreate(BaseModel):
    owner_name: str
    car_number: str
    model: str


class CarOut(BaseModel):
    id: int
    uid: str
    owner_name: str
    car_number: str
    model: str
    registered_at: datetime.datetime

    class Config:
        from_attributes = True


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("", response_model=CarOut, status_code=status.HTTP_201_CREATED)
def register_car(
    body: CarCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Register a new car for the current user."""
    existing = db.query(Car).filter(Car.car_number == body.car_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This car number is already registered.",
        )

    car = Car(
        uid=user["uid"],
        owner_name=body.owner_name,
        car_number=body.car_number.upper(),
        model=body.model,
    )
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


@router.get("", response_model=list[CarOut])
def list_cars(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """List all cars belonging to the current user."""
    return db.query(Car).filter(Car.uid == user["uid"]).order_by(Car.registered_at.desc()).all()


@router.get("/{car_id}", response_model=CarOut)
def get_car(
    car_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get a single car by ID."""
    car = db.query(Car).filter(Car.id == car_id, Car.uid == user["uid"]).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found.")
    return car


@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(
    car_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a car and its service history."""
    car = db.query(Car).filter(Car.id == car_id, Car.uid == user["uid"]).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found.")
    db.delete(car)
    db.commit()
