import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import engine, Base
from routes.cars import router as cars_router
from routes.services import router as services_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Car Management System API",
    version="1.0.0",
    description="Backend API for the Car Management System",
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(cars_router)
app.include_router(services_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Car Management System"}


# ─── Serve built frontend in production (Docker) ────────────────────────
STATIC_DIR = Path(__file__).parent / "static"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    # Serve static files (images, etc.)
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        # SPA fallback — serve index.html for all non-API routes
        return FileResponse(STATIC_DIR / "index.html")
