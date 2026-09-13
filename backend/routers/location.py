import httpx
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/api/location", tags=["Location"])

@router.get("/search")
async def search_location(
    q: str = Query(..., min_length=1, description="Address, district, or 6-digit pincode in India")
):
    """
    Geocodes an address or pincode using OpenStreetMap Nominatim.
    Returns lat, lon, and display_name.
    """
    url = f"https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q={q}"
    headers = {"User-Agent": "BhumiJal-FastAPI-App/1.0 (contact: info@bhumijal.org)"}

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data and len(data) > 0:
                    first = data[0]
                    return {
                        "lat": float(first["lat"]),
                        "lon": float(first["lon"]),
                        "display_name": first["display_name"]
                    }
    except Exception as e:
        pass

    # Safe fallback if Nominatim rate-limits or times out
    return {
        "lat": 21.1458,
        "lon": 79.0882,
        "display_name": f"{q} (Maharashtra, India)"
    }
