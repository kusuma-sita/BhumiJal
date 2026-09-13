from fastapi import APIRouter, Query, HTTPException
from backend.data.mock_generators import generate_crops

router = APIRouter(prefix="/api/crops", tags=["Crops"])

@router.get("")
def get_crops(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Returns AI-recommended crops with water-saving percentages and crops to avoid.
    """
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        raise HTTPException(status_code=400, detail="Invalid coordinates: lat [-90, 90], lon [-180, 180]")
    
    return generate_crops(lat, lon)
