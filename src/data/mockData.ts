import {
  WeatherData,
  GroundwaterData,
  SoilData,
  CropData,
  AlertsData,
  AllDashboardData,
  Coordinates,
} from '../types';

/**
 * Deterministic pseudo-random generator (Mulberry32)
 * Ensures that for any given lat/lon coordinate, the exact same realistic data is returned.
 */
function createPRNG(seed: number) {
  let s = Math.floor(Math.abs(seed));
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getSeedFromCoords(lat: number, lon: number): number {
  // Quantize slightly to 3 decimal places (~100m) for consistent regional data
  const latInt = Math.round(lat * 1000);
  const lonInt = Math.round(lon * 1000);
  return (latInt * 73856093) ^ (lonInt * 19349663);
}

export function generateWeatherData(lat: number, lon: number): WeatherData {
  const rand = createPRNG(getSeedFromCoords(lat, lon) + 101);

  // 14 days rainfall (0 to 50 mm/day)
  const rainfall_14days: number[] = [];
  let totalRainfall = 0;

  for (let i = 0; i < 14; i++) {
    // 60% chance of dry or light rain, 40% chance of significant rain
    const isRainy = rand() > 0.55;
    let rain = 0;
    if (isRainy) {
      rain = Math.round(rand() * 48 * 10) / 10;
    } else {
      rain = rand() > 0.7 ? Math.round(rand() * 4 * 10) / 10 : 0;
    }
    rainfall_14days.push(rain);
    totalRainfall += rain;
  }

  // Temperature: 20-40 °C
  const temperature = Math.round((20 + rand() * 20) * 10) / 10;
  // Humidity: 40-80 %
  const humidity = Math.round(40 + rand() * 40);

  return {
    rainfall_14days,
    temperature,
    humidity,
    total_rainfall: Math.round(totalRainfall * 10) / 10,
    source: 'NASA POWER',
  };
}

export function generateGroundwaterData(lat: number, lon: number): GroundwaterData {
  const rand = createPRNG(getSeedFromCoords(lat, lon) + 202);

  // Groundwater level: 5–30 meters
  const current_level = Math.round((5 + rand() * 25) * 10) / 10;

  // Stress category based on groundwater level:
  // < 10m: Safe (Green)
  // 10–15m: Semi-Critical (Yellow)
  // 15–20m: Critical (Orange)
  // > 20m: Over-Exploited (Red)
  let stress_category: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  let soe_percentage: number;

  if (current_level < 10) {
    stress_category = 'Safe';
    soe_percentage = Math.round(42 + rand() * 25);
  } else if (current_level <= 15) {
    stress_category = 'Semi-Critical';
    soe_percentage = Math.round(71 + rand() * 18);
  } else if (current_level <= 20) {
    stress_category = 'Critical';
    soe_percentage = Math.round(91 + rand() * 9);
  } else {
    stress_category = 'Over-Exploited';
    soe_percentage = Math.round(102 + rand() * 38);
  }

  // Next 4 months forecast
  const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const now = new Date();
  const forecast_4months = [];
  let simulatedLevel = current_level;

  for (let i = 1; i <= 4; i++) {
    const monthIndex = (now.getMonth() + i) % 12;
    // Slight fluctuation (seasonal drop or recovery)
    const delta = (rand() - 0.45) * 1.8;
    simulatedLevel = Math.max(3.5, Math.min(35, Math.round((simulatedLevel + delta) * 10) / 10));
    forecast_4months.push({
      month: `${monthNames[monthIndex]} ${now.getFullYear() + (now.getMonth() + i >= 12 ? 1 : 0)}`,
      level: simulatedLevel,
    });
  }

  return {
    current_level,
    stress_category,
    forecast_4months,
    soe_percentage,
    source: 'CGWB / India-WRIS',
  };
}

export function generateSoilData(lat: number, lon: number): SoilData {
  const rand = createPRNG(getSeedFromCoords(lat, lon) + 303);

  // Soil N/P/K: 20–80 kg/ha
  const nitrogen = Math.round(20 + rand() * 60);
  const phosphorus = Math.round(20 + rand() * 60);
  const potassium = Math.round(20 + rand() * 60);

  // pH level: 5.5 to 8.4
  const ph = Math.round((5.5 + rand() * 2.9) * 10) / 10;

  // Realistic Indian soil types
  const soilTypes = [
    'Black Soil (Regur)',
    'Alluvial Soil',
    'Red & Yellow Soil',
    'Laterite Soil',
    'Arid / Sandy Loam',
    'Clayey Loam',
  ];
  const soil_type = soilTypes[Math.floor(rand() * soilTypes.length)];

  return {
    nitrogen,
    phosphorus,
    potassium,
    ph,
    soil_type,
    source: 'Soil Health Card',
  };
}

export function generateCropData(lat: number, lon: number): CropData {
  const rand = createPRNG(getSeedFromCoords(lat, lon) + 404);
  const gw = generateGroundwaterData(lat, lon);

  // Crop recommendations dynamically adapted to groundwater stress
  if (gw.stress_category === 'Over-Exploited' || gw.stress_category === 'Critical') {
    return {
      recommended: [
        {
          name: 'Pearl Millet (Bajra)',
          water_saving: 'Save 65% water',
          yield: '2.4 - 3.1 t/ha',
          season: 'Kharif / Zaid',
          description: 'Highly drought tolerant, thrives in semi-arid zones with minimal irrigation.',
        },
        {
          name: 'Sorghum (Jowar)',
          water_saving: 'Save 55% water',
          yield: '2.8 - 3.5 t/ha',
          season: 'Kharif / Rabi',
          description: 'Deep rooting system taps moisture efficiently; excellent for food and fodder.',
        },
        {
          name: 'Chickpea (Gram / Chana)',
          water_saving: 'Save 50% water',
          yield: '1.5 - 2.0 t/ha',
          season: 'Rabi',
          description: 'Pulse crop that fixes nitrogen into soil while requiring only 1-2 life-saving waterings.',
        },
      ],
      avoid: [
        {
          name: 'Paddy (Water-intensive Rice)',
          reason: 'Needs 120-150 days of flood irrigation (1,400 mm water); causes rapid water table collapse.',
        },
        {
          name: 'Sugarcane',
          reason: 'Perennial crop requiring 1,800-2,200 mm water, leading to severe aquifer depletion.',
        },
      ],
      source: 'AI Recommendation',
    };
  } else if (gw.stress_category === 'Semi-Critical') {
    return {
      recommended: [
        {
          name: 'Mustard / Rapeseed',
          water_saving: 'Save 45% water',
          yield: '1.8 - 2.3 t/ha',
          season: 'Rabi',
          description: 'Requires moderate water, yields high economic value with 2-3 controlled irrigations.',
        },
        {
          name: 'Finger Millet (Ragi)',
          water_saving: 'Save 60% water',
          yield: '2.2 - 2.9 t/ha',
          season: 'Kharif',
          description: 'Nutri-cereal with climate resilience; high resistance to heat waves.',
        },
        {
          name: 'Soybean',
          water_saving: 'Save 35% water',
          yield: '2.0 - 2.7 t/ha',
          season: 'Kharif',
          description: 'Optimum with furrow irrigation and mulching; improves soil fertility naturally.',
        },
      ],
      avoid: [
        {
          name: 'Summer Paddy',
          reason: 'High evapotranspiration during hot months stresses local borewells severely.',
        },
        {
          name: 'Banana Plantation (Flood irrigated)',
          reason: 'High transpiration rate drains local ground reservoirs unless drip is installed.',
        },
      ],
      source: 'AI Recommendation',
    };
  } else {
    // Safe category
    return {
      recommended: [
        {
          name: 'Wheat (HD-3226 / PBW)',
          water_saving: 'Save 25% water (via Drip)',
          yield: '4.8 - 5.6 t/ha',
          season: 'Rabi',
          description: 'High yielding variety with optimum soil moisture conditions.',
        },
        {
          name: 'Groundnut (Peanut)',
          water_saving: 'Save 40% water',
          yield: '2.5 - 3.2 t/ha',
          season: 'Kharif / Rabi',
          description: 'Oilseed crop providing robust market returns and soil aeration.',
        },
        {
          name: 'Pigeon Pea (Arhar / Tur)',
          water_saving: 'Save 45% water',
          yield: '1.8 - 2.5 t/ha',
          season: 'Kharif',
          description: 'Deep taproot extracts deep moisture, leaving topsoil available for intercrops.',
        },
      ],
      avoid: [
        {
          name: 'Unregulated Flood Irrigation',
          reason: 'Encourages salt deposition and reduces long-term aquifer recharge efficiency.',
        },
      ],
      source: 'AI Recommendation',
    };
  }
}

export function generateAlertsData(lat: number, lon: number): AlertsData {
  const gw = generateGroundwaterData(lat, lon);
  const weather = generateWeatherData(lat, lon);
  const soil = generateSoilData(lat, lon);

  const alerts = [];

  // Groundwater Alert
  if (gw.stress_category === 'Over-Exploited') {
    alerts.push({
      type: 'Groundwater Crisis',
      severity: 'critical' as const,
      message: `🔴 Stage of Extraction: Over-Exploited (${gw.soe_percentage}%). Urgent action needed: halt new borewell drilling.`,
      icon: 'AlertOctagon',
      category: 'groundwater' as const,
    });
    alerts.push({
      type: 'Crop Planning',
      severity: 'high' as const,
      message: '⚠️ Groundwater level is critical (>20m below ground). Switch immediately to drought-resistant millets or pulses.',
      icon: 'AlertTriangle',
      category: 'crop' as const,
    });
  } else if (gw.stress_category === 'Critical') {
    alerts.push({
      type: 'Aquifer Stress',
      severity: 'high' as const,
      message: `🟠 Groundwater depth is ${gw.current_level}m. Water extraction is near critical capacity (${gw.soe_percentage}%).`,
      icon: 'AlertTriangle',
      category: 'groundwater' as const,
    });
  } else if (gw.stress_category === 'Semi-Critical') {
    alerts.push({
      type: 'Precautionary Advisory',
      severity: 'moderate' as const,
      message: `🟡 Semi-Critical zone (${gw.current_level}m). Plan micro-irrigation or drip systems to avoid entering critical levels.`,
      icon: 'Info',
      category: 'groundwater' as const,
    });
  } else {
    alerts.push({
      type: 'Safe Groundwater Zone',
      severity: 'safe' as const,
      message: `🟢 Groundwater level is healthy (${gw.current_level}m below ground). Maintain recharge ponds for monsoon storage.`,
      icon: 'CheckCircle',
      category: 'groundwater' as const,
    });
  }

  // Rainfall Alert (check next 5 days)
  const maxNearRain = Math.max(...weather.rainfall_14days.slice(0, 5));
  const heavyRainDayIndex = weather.rainfall_14days.slice(0, 7).findIndex((r) => r >= 25);

  if (heavyRainDayIndex !== -1) {
    alerts.push({
      type: 'Heavy Rainfall Warning',
      severity: 'high' as const,
      message: `🌧️ Heavy rain expected in ${heavyRainDayIndex + 1} day${heavyRainDayIndex > 0 ? 's' : ''} (${weather.rainfall_14days[heavyRainDayIndex]} mm). Delay fertilizer broadcast & canal irrigation.`,
      icon: 'CloudRain',
      category: 'rainfall' as const,
    });
  } else if (weather.total_rainfall < 10) {
    alerts.push({
      type: 'Dry Spell Advisory',
      severity: 'moderate' as const,
      message: '☀️ Low precipitation forecast (<10mm over 14 days). Apply organic mulch to retain topsoil moisture.',
      icon: 'Sun',
      category: 'rainfall' as const,
    });
  }

  // Soil Nutrient Alert
  if (soil.nitrogen < 35) {
    alerts.push({
      type: 'Soil Nutrition',
      severity: 'moderate' as const,
      message: `🌱 Low soil Nitrogen (${soil.nitrogen} kg/ha). Apply neem-coated urea or incorporate green manure legume crops.`,
      icon: 'Leaf',
      category: 'soil' as const,
    });
  } else if (soil.ph < 6.0 || soil.ph > 8.0) {
    alerts.push({
      type: 'Soil pH Advisory',
      severity: 'moderate' as const,
      message: `🧪 Soil pH is ${soil.ph} (${soil.ph < 6.0 ? 'Acidic' : 'Alkaline'}). Add ${soil.ph < 6.0 ? 'agricultural lime' : 'gypsum'} before the next sowing cycle.`,
      icon: 'TestTube',
      category: 'soil' as const,
    });
  }

  return {
    alerts,
    source: 'National Agro-Advisory System & CGWB',
  };
}

export function getAllDashboardData(lat: number, lon: number, displayName?: string): AllDashboardData {
  return {
    location: {
      lat,
      lon,
      displayName: displayName || `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`,
    },
    weather: generateWeatherData(lat, lon),
    groundwater: generateGroundwaterData(lat, lon),
    soil: generateSoilData(lat, lon),
    crops: generateCropData(lat, lon),
    alerts: generateAlertsData(lat, lon),
  };
}
