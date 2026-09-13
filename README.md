# BhumiJal (भूमि जल) - AI-Powered Water Security Platform for Indian Farmers

BhumiJal is a Progressive Web App (PWA) designed to empower Indian farmers, agricultural extension officers, and rural planners with hyper-local water security intelligence.

The platform provides actionable insights for any coordinate or village in India, including **Groundwater Availability**, **14-Day Rainfall Forecast**, **Soil Health Metrics**, **AI Crop Recommendations**, and **Automated Agricultural Advisories**.

---

## 🌾 Key Features

1. **Interactive India Map (OpenLayers)**:
   - Real OpenStreetMap base layer with crisp boundaries for India.
   - 3-Way Location Selection:
     - **Address / Pincode**: Geocoding via OpenStreetMap Nominatim.
     - **Latitude / Longitude**: Direct numeric coordinate search.
     - **Interactive Map Click**: Instant coordinate picking anywhere in India.
   - Quick-select chips for major agricultural hubs (Punjab, Maharashtra, Rajasthan, Andhra Pradesh, Uttar Pradesh, Madhya Pradesh, Tamil Nadu).
   - Marker placement with popups and auto-zoom to level 12 upon selection.

2. **5-Module Agricultural Dashboard**:
   - **Card 1: Groundwater Status**: Depth to water table (m bgl), Stage of Extraction (SOE %), stress categories (Safe, Semi-Critical, Critical, Over-Exploited), and 4-month trend line chart (CGWB / India-WRIS data model).
   - **Card 2: Rainfall Forecast (Next 14 Days)**: 14-day daily precipitation bar chart, cumulative rainfall, daytime temperature, relative humidity, and farmer irrigation scheduling advice (NASA POWER model).
   - **Card 3: Soil Health & Nutrients**: N, P, K macronutrient gauges (kg/ha), soil pH meter with acidity/alkalinity advice, and soil classification (Soil Health Card model).
   - **Card 4: AI Crop Recommendations**: Top 3 hydro-efficient crop varieties with water-saving percentages (e.g., Millets saving 60% water, Sorghum, Chickpea) vs. high-water crops to avoid with reasons (e.g., Paddy, Sugarcane).
   - **Card 5: Farm Alerts & Advisories**: Color-coded critical, high, and moderate notices for irrigation delay, drought adaptation, and nutrient replenishment.

3. **Progressive Web App (PWA)**:
   - Full offline readiness powered by `vite-plugin-pwa` and Workbox runtime caching for tiles, fonts, and assets.
   - In-app install button (`PWAInstallButton`) with dedicated iOS Safari step-by-step guidance.
   - Non-intrusive offline connectivity monitor (`OfflineIndicator`).
   - Compliant Web App Manifest and multi-resolution PNG icons (192x192, 512x512, maskable 512x512).

---

## 🛠️ Project Structure

```
.
├── backend/                  # FastAPI Python Backend
│   ├── data/
│   │   ├── __init__.py
│   │   └── mock_generators.py# Deterministic coordinate-seeded agro models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── alerts.py         # GET /api/alerts
│   │   ├── crops.py          # GET /api/crops
│   │   ├── groundwater.py    # GET /api/groundwater
│   │   ├── location.py       # GET /api/location/search
│   │   ├── soil.py           # GET /api/soil
│   │   └── weather.py        # GET /api/weather
│   ├── __init__.py
│   ├── main.py               # FastAPI entry point & CORS
│   └── requirements.txt      # Python dependencies
├── public/                   # Static & PWA Assets
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── icon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── pwa-maskable-512x512.png
├── src/                      # React + TypeScript Frontend
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── AlertsCard.tsx
│   │   │   ├── CropCard.tsx
│   │   │   ├── GroundwaterCard.tsx
│   │   │   ├── RainfallCard.tsx
│   │   │   └── SoilCard.tsx
│   │   ├── Map/
│   │   │   └── IndiaMap.tsx  # OpenLayers interactive India map
│   │   ├── Header.tsx
│   │   ├── OfflineIndicator.tsx
│   │   └── PWAInstallButton.tsx
│   ├── data/
│   │   ├── indiaGeoJson.ts   # India boundary & agricultural hubs
│   │   └── mockData.ts       # Client-side deterministic model generator
│   ├── hooks/
│   │   ├── useOnlineStatus.ts
│   │   └── usePWAInstall.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── LandingPage.tsx
│   ├── services/
│   │   └── api.ts            # Resilient API service with offline fallback
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Running the Application

### 1. Running the React + TypeScript Frontend

The frontend is configured with Vite on port 3000. It includes built-in API dev server middleware that automatically serves all `/api/*` endpoints with deterministic model responses, making it fully operational out-of-the-box in development and production previews.

```bash
# Install Node.js dependencies
npm install

# Start Vite dev server (binds to http://localhost:3000)
npm run dev

# Build for production
npm run build
```

Open `http://localhost:3000` in your browser.

---

### 2. Running the FastAPI Backend (Python)

To run the standalone FastAPI backend server:

```bash
# 1. Create and activate a Python virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Start the FastAPI server using Uvicorn
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The FastAPI server will be accessible at:
- API Base: `http://localhost:8000`
- Interactive Swagger Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

#### Connecting Frontend to the Standalone Backend:
In your `.env` (or environment), specify:
```env
VITE_API_BASE_URL="http://localhost:8000/api"
```
Or use the default `/api` if using reverse proxy or Vite's dev server middleware.

---

## 📡 API Endpoints Specification

All endpoints take `lat` and `lon` as query parameters:

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| `GET` | `/api/weather` | `lat={lat}&lon={lon}` | Returns 14-day rainfall array, temp, humidity (NASA POWER) |
| `GET` | `/api/groundwater` | `lat={lat}&lon={lon}` | Returns water table depth, stress category, 4-month forecast (CGWB) |
| `GET` | `/api/soil` | `lat={lat}&lon={lon}` | Returns Nitrogen, Phosphorus, Potassium, pH, soil type |
| `GET` | `/api/crops` | `lat={lat}&lon={lon}` | Returns top 3 recommended crops with water savings & crops to avoid |
| `GET` | `/api/alerts` | `lat={lat}&lon={lon}` | Returns prioritized agro-advisory & crisis notices |
| `GET` | `/api/location/search` | `q={query}` | Geocodes Indian districts, cities, or pincodes using Nominatim |

---

## 📱 Installing as a PWA

1. **Android / Chrome / Desktop**: Click the **Install App** button in the header or the browser omnibox install badge.
2. **iOS Safari**: Tap the **Share** button in Safari, scroll down, and select **Add to Home Screen**.
3. **Offline Access**: Once loaded, map tiles and agro-models are cached via Service Worker, enabling continued offline field assessments.
