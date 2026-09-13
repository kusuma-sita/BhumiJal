"""
BhumiJal Mock Data Generators
Generates realistic, deterministic agricultural and hydrological data seeded by coordinates.
"""

import random
from datetime import datetime
from typing import Dict, Any, List

def get_seed(lat: float, lon: float) -> int:
    """Creates a stable integer seed from latitude and longitude."""
    lat_int = int(round(lat * 1000))
    lon_int = int(round(lon * 1000))
    return abs((lat_int * 73856093) ^ (lon_int * 19349663))

def generate_weather(lat: float, lon: float) -> Dict[str, Any]:
    rng = random.Random(get_seed(lat, lon) + 101)
    
    # 14 days rainfall (0 to 50 mm)
    rainfall_14days: List[float] = []
    total_rainfall = 0.0
    for _ in range(14):
        if rng.random() > 0.55:
            val = round(rng.uniform(2.0, 48.0), 1)
        else:
            val = round(rng.uniform(0.0, 3.5), 1) if rng.random() > 0.7 else 0.0
        rainfall_14days.append(val)
        total_rainfall += val

    temperature = round(rng.uniform(20.0, 40.0), 1)
    humidity = int(round(rng.uniform(40.0, 80.0)))

    return {
        "rainfall_14days": rainfall_14days,
        "temperature": temperature,
        "humidity": humidity,
        "total_rainfall": round(total_rainfall, 1),
        "source": "NASA POWER"
    }

def generate_groundwater(lat: float, lon: float) -> Dict[str, Any]:
    rng = random.Random(get_seed(lat, lon) + 202)
    
    # Groundwater level: 5–30 meters
    current_level = round(rng.uniform(5.0, 30.0), 1)

    if current_level < 10.0:
        stress_category = "Safe"
        soe_percentage = int(round(rng.uniform(42, 68)))
    elif current_level <= 15.0:
        stress_category = "Semi-Critical"
        soe_percentage = int(round(rng.uniform(70, 89)))
    elif current_level <= 20.0:
        stress_category = "Critical"
        soe_percentage = int(round(rng.uniform(90, 100)))
    else:
        stress_category = "Over-Exploited"
        soe_percentage = int(round(rng.uniform(102, 140)))

    # Forecast for next 4 months
    month_names = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    now = datetime.now()
    forecast = []
    simulated_level = current_level

    for i in range(1, 5):
        m_idx = (now.month + i - 1) % 12
        year = now.year + (1 if now.month + i > 12 else 0)
        simulated_level = round(max(3.0, min(35.0, simulated_level + rng.uniform(-0.9, 1.2))), 1)
        forecast.append({
            "month": f"{month_names[m_idx]} {year}",
            "level": simulated_level
        })

    return {
        "current_level": current_level,
        "stress_category": stress_category,
        "forecast_4months": forecast,
        "soe_percentage": soe_percentage,
        "source": "CGWB"
    }

def generate_soil(lat: float, lon: float) -> Dict[str, Any]:
    rng = random.Random(get_seed(lat, lon) + 303)
    
    # N/P/K: 20–80 kg/ha
    nitrogen = int(round(rng.uniform(20, 80)))
    phosphorus = int(round(rng.uniform(20, 80)))
    potassium = int(round(rng.uniform(20, 80)))
    ph = round(rng.uniform(5.5, 8.4), 1)

    soil_types = [
        "Black Soil",
        "Alluvial Soil",
        "Red & Yellow Soil",
        "Laterite Soil",
        "Arid / Sandy Loam",
        "Clayey Loam"
    ]
    soil_type = rng.choice(soil_types)

    return {
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium,
        "ph": ph,
        "soil_type": soil_type,
        "source": "Soil Health Card"
    }

def generate_crops(lat: float, lon: float) -> Dict[str, Any]:
    gw = generate_groundwater(lat, lon)
    category = gw["stress_category"]

    if category in ["Over-Exploited", "Critical"]:
        return {
            "recommended": [
                {"name": "Pearl Millet (Bajra)", "water_saving": "Save 65% water", "yield": "2.4 - 3.1 t/ha"},
                {"name": "Sorghum (Jowar)", "water_saving": "Save 55% water", "yield": "2.8 - 3.5 t/ha"},
                {"name": "Chickpea (Chana)", "water_saving": "Save 50% water", "yield": "1.5 - 2.0 t/ha"}
            ],
            "avoid": [
                {"name": "Paddy", "reason": "Needs 120-150 days of flood water; causes severe groundwater depletion"},
                {"name": "Sugarcane", "reason": "High water footprint (1800-2200 mm), exhausts aquifer reserve"}
            ],
            "source": "AI Recommendation"
        }
    elif category == "Semi-Critical":
        return {
            "recommended": [
                {"name": "Mustard / Rapeseed", "water_saving": "Save 45% water", "yield": "1.8 - 2.3 t/ha"},
                {"name": "Finger Millet (Ragi)", "water_saving": "Save 60% water", "yield": "2.2 - 2.9 t/ha"},
                {"name": "Groundnut", "water_saving": "Save 40% water", "yield": "2.5 - 3.2 t/ha"}
            ],
            "avoid": [
                {"name": "Summer Paddy", "reason": "High evaporation rate during dry hot months"},
                {"name": "Flood-irrigated Maize", "reason": "Shallow water stress in peak reproductive stage"}
            ],
            "source": "AI Recommendation"
        }
    else:
        return {
            "recommended": [
                {"name": "Wheat (HD-3226)", "water_saving": "Save 25% water", "yield": "4.8 - 5.5 t/ha"},
                {"name": "Groundnut", "water_saving": "Save 40% water", "yield": "2.5 - 3.2 t/ha"},
                {"name": "Pigeon Pea (Tur)", "water_saving": "Save 45% water", "yield": "1.8 - 2.4 t/ha"}
            ],
            "avoid": [
                {"name": "Excess Flood Irrigation", "reason": "Increases soil salinity and degrades topsoil nutrients"}
            ],
            "source": "AI Recommendation"
        }

def generate_alerts(lat: float, lon: float) -> Dict[str, Any]:
    gw = generate_groundwater(lat, lon)
    weather = generate_weather(lat, lon)
    soil = generate_soil(lat, lon)

    alerts = []
    category = gw["stress_category"]

    if category == "Over-Exploited":
        alerts.append({
            "type": "Groundwater Crisis",
            "severity": "critical",
            "message": f"🔴 Stage of Extraction: Over-Exploited ({gw['soe_percentage']}%). Urgent action needed: halt new borewell drilling.",
            "icon": "AlertOctagon"
        })
        alerts.append({
            "type": "Crop Adaptation",
            "severity": "high",
            "message": "⚠️ Groundwater level is LOW. Switch to drought-resistant crops.",
            "icon": "AlertTriangle"
        })
    elif category == "Critical":
        alerts.append({
            "type": "Aquifer Stress",
            "severity": "high",
            "message": f"🟠 Groundwater depth is {gw['current_level']}m. Water extraction is near maximum sustainable threshold.",
            "icon": "AlertTriangle"
        })
    elif category == "Semi-Critical":
        alerts.append({
            "type": "Water Advisory",
            "severity": "moderate",
            "message": f"🟡 Semi-Critical zone ({gw['current_level']}m). Plan micro-irrigation systems to maintain safe reserves.",
            "icon": "Info"
        })
    else:
        alerts.append({
            "type": "Aquifer Safe",
            "severity": "safe",
            "message": f"🟢 Groundwater level is healthy ({gw['current_level']}m below ground). Maintain farm ponds.",
            "icon": "CheckCircle"
        })

    # Weather alerts
    heavy_rain = any(r >= 25.0 for r in weather["rainfall_14days"][:5])
    if heavy_rain:
        alerts.append({
            "type": "Precipitation Warning",
            "severity": "high",
            "message": "🌧️ Heavy rain expected in 5 days. Delay irrigation.",
            "icon": "CloudRain"
        })
    elif weather["total_rainfall"] < 10.0:
        alerts.append({
            "type": "Dry Spell",
            "severity": "moderate",
            "message": "☀️ Low precipitation over next 14 days. Apply organic mulching.",
            "icon": "Sun"
        })

    # Soil alert
    if soil["nitrogen"] < 35:
        alerts.append({
            "type": "Soil Nutrition",
            "severity": "moderate",
            "message": f"🌱 Nitrogen deficiency detected ({soil['nitrogen']} kg/ha). Apply neem-coated urea.",
            "icon": "Leaf"
        })

    return {
        "alerts": alerts,
        "source": "CGWB / IMD"
    }
