from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.cars import router as cars_router
from routes.services import router as services_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartCar-Care API",
    version="1.0.0",
    description="Backend API for the Car Management System",
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(cars_router)
app.include_router(services_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "SmartCar-Care"}
