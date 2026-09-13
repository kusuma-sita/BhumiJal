import {
  WeatherData,
  GroundwaterData,
  SoilData,
  CropData,
  AlertsData,
  LocationSearchResult,
  AllDashboardData,
} from '../types';
import {
  generateWeatherData,
  generateGroundwaterData,
  generateSoilData,
  generateCropData,
  generateAlertsData,
  getAllDashboardData,
} from '../data/mockData';
import { POPULAR_LOCATIONS, INDIAN_DISTRICTS_PRESETS } from '../data/indiaGeoJson';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to simulate smooth natural network latency in mock mode
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch Weather forecast with pure client-side realistic mock generator by default.
 */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API /weather unavailable, using client-side model');
    }
  }
  await wait(100);
  return generateWeatherData(lat, lon);
}

/**
 * Fetch Groundwater status with pure client-side realistic mock generator by default.
 */
export async function fetchGroundwater(lat: number, lon: number): Promise<GroundwaterData> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/groundwater?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API /groundwater unavailable, using client-side model');
    }
  }
  await wait(100);
  return generateGroundwaterData(lat, lon);
}

/**
 * Fetch Soil health metrics with pure client-side realistic mock generator by default.
 */
export async function fetchSoil(lat: number, lon: number): Promise<SoilData> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/soil?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API /soil unavailable, using client-side model');
    }
  }
  await wait(100);
  return generateSoilData(lat, lon);
}

/**
 * Fetch Crop recommendations with pure client-side realistic mock generator by default.
 */
export async function fetchCrops(lat: number, lon: number): Promise<CropData> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/crops?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API /crops unavailable, using client-side model');
    }
  }
  await wait(100);
  return generateCropData(lat, lon);
}

/**
 * Fetch Agricultural alerts with pure client-side realistic mock generator by default.
 */
export async function fetchAlerts(lat: number, lon: number): Promise<AlertsData> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API /alerts unavailable, using client-side model');
    }
  }
  await wait(100);
  return generateAlertsData(lat, lon);
}

/**
 * Geocoding search: searches in-memory Indian districts presets first, then Nominatim
 */
export async function searchLocation(query: string): Promise<LocationSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();

  // 1. Check in-memory Indian Districts Presets first (Instant matching, no internet or server needed)
  const matchedPresets = INDIAN_DISTRICTS_PRESETS.filter(
    (d) =>
      d.district.toLowerCase().includes(lower) ||
      d.state.toLowerCase().includes(lower) ||
      d.primaryCrop.toLowerCase().includes(lower)
  ).map((d) => ({
    lat: d.lat,
    lon: d.lon,
    display_name: `${d.district}, ${d.state} (${d.primaryCrop})`,
  }));

  if (matchedPresets.length > 0) {
    return matchedPresets.slice(0, 6);
  }

  // 2. Check Popular Locations
  const matchedPopular = POPULAR_LOCATIONS.filter(
    (loc) => loc.name.toLowerCase().includes(lower) || loc.note.toLowerCase().includes(lower)
  ).map((loc) => ({
    lat: loc.lat,
    lon: loc.lon,
    display_name: `${loc.name} (${loc.note})`,
  }));

  if (matchedPopular.length > 0) {
    return matchedPopular.slice(0, 6);
  }

  // 3. If API_BASE_URL configured, try backend proxy
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/location/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // Continue to Nominatim
    }
  }

  // 4. Fallback to OpenStreetMap Nominatim for Indian addresses/pincodes
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(
      trimmed
    )}`;
    const res = await fetch(nominatimUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        return items.map((item: any) => ({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          display_name: item.display_name,
        }));
      }
    }
  } catch (err) {
    console.warn('Nominatim direct search error:', err);
  }

  return [];
}

/**
 * Fetch all dashboard metrics in parallel
 */
export async function fetchAllDashboardData(
  lat: number,
  lon: number,
  displayName?: string
): Promise<AllDashboardData> {
  try {
    const [weather, groundwater, soil, crops, alerts] = await Promise.all([
      fetchWeather(lat, lon),
      fetchGroundwater(lat, lon),
      fetchSoil(lat, lon),
      fetchCrops(lat, lon),
      fetchAlerts(lat, lon),
    ]);

    return {
      location: {
        lat,
        lon,
        displayName: displayName || `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`,
      },
      weather,
      groundwater,
      soil,
      crops,
      alerts,
    };
  } catch (err) {
    return getAllDashboardData(lat, lon, displayName);
  }
}
