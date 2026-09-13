"""
BhumiJal Backend API
AI-powered water security platform for Indian farmers.
Built with FastAPI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import weather, groundwater, soil, crops, alerts, location

app = FastAPI(
    title="BhumiJal API",
    description="Hydrological status, rainfall forecasts, soil testing, and crop advisories for Indian agriculture.",
    version="1.0.0"
)

# Allow Cross-Origin Requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all endpoints
app.include_router(weather.router)
app.include_router(groundwater.router)
app.include_router(soil.router)
app.include_router(crops.router)
app.include_router(alerts.router)
app.include_router(location.router)

@app.get("/")
def root():
    return {
        "app": "BhumiJal API",
        "description": "AI-powered water security platform for Indian farmers",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
