from fastapi import APIRouter, Query, HTTPException
from backend.data.mock_generators import generate_soil

router = APIRouter(prefix="/api/soil", tags=["Soil"])

@router.get("")
def get_soil(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Returns soil macro-nutrients (N, P, K), pH, and soil classification.
    """
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        raise HTTPException(status_code=400, detail="Invalid coordinates: lat [-90, 90], lon [-180, 180]")
    
    return generate_soil(lat, lon)
