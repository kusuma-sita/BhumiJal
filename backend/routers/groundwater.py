from fastapi import APIRouter, Query, HTTPException
from backend.data.mock_generators import generate_groundwater

router = APIRouter(prefix="/api/groundwater", tags=["Groundwater"])

@router.get("")
def get_groundwater(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Returns current groundwater level, stress category, 4-month forecast, and Stage of Extraction.
    """
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        raise HTTPException(status_code=400, detail="Invalid coordinates: lat [-90, 90], lon [-180, 180]")
    
    return generate_groundwater(lat, lon)
