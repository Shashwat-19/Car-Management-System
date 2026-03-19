import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, index=True, nullable=False)          # Firebase user ID
    owner_name = Column(String, nullable=False)
    car_number = Column(String, unique=True, nullable=False)
    model = Column(String, nullable=False)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

    services = relationship("Service", back_populates="car", cascade="all, delete-orphan")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    service_type = Column(String, nullable=False)
    notes = Column(String, default="")
    serviced_at = Column(DateTime, default=datetime.datetime.utcnow)

    car = relationship("Car", back_populates="services")
