import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Car, Service
from auth import get_current_user

router = APIRouter(prefix="/api/services", tags=["Services"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class ServiceCreate(BaseModel):
    car_id: int
    service_type: str
    notes: str = ""


class ServiceOut(BaseModel):
    id: int
    car_id: int
    service_type: str
    notes: str
    serviced_at: datetime.datetime

    class Config:
        from_attributes = True


class ServiceWithCar(ServiceOut):
    car_number: str = ""
    car_model: str = ""


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def book_service(
    body: ServiceCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Book a service for one of the user's cars."""
    car = db.query(Car).filter(Car.id == body.car_id, Car.uid == user["uid"]).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found or not yours.")

    svc = Service(
        car_id=body.car_id,
        service_type=body.service_type,
        notes=body.notes,
    )
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc


@router.get("/{car_id}", response_model=list[ServiceOut])
def service_history(
    car_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get service history for a specific car."""
    car = db.query(Car).filter(Car.id == car_id, Car.uid == user["uid"]).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found or not yours.")
    return db.query(Service).filter(Service.car_id == car_id).order_by(Service.serviced_at.desc()).all()


@router.get("", response_model=list[ServiceWithCar])
def all_services(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get all services across all of the user's cars."""
    cars = db.query(Car).filter(Car.uid == user["uid"]).all()
    result = []
    for car in cars:
        for svc in car.services:
            result.append(ServiceWithCar(
                id=svc.id,
                car_id=svc.car_id,
                service_type=svc.service_type,
                notes=svc.notes,
                serviced_at=svc.serviced_at,
                car_number=car.car_number,
                car_model=car.model,
            ))
    result.sort(key=lambda s: s.serviced_at, reverse=True)
    return result
