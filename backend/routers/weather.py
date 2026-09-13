from fastapi import APIRouter, Query, HTTPException
from backend.data.mock_generators import generate_weather

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("")
def get_weather(
    lat: float = Query(..., description="Latitude between -90 and 90"),
    lon: float = Query(..., description="Longitude between -180 and 180")
):
    """
    Returns 14-day rainfall forecast, average temperature, and relative humidity.
    """
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        raise HTTPException(status_code=400, detail="Invalid coordinates: lat [-90, 90], lon [-180, 180]")
    
    return generate_weather(lat, lon)
