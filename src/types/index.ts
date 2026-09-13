export interface Coordinates {
  lat: number;
  lon: number;
  displayName?: string;
}

export interface WeatherData {
  rainfall_14days: number[];
  temperature: number;
  humidity: number;
  total_rainfall: number;
  source: string;
}

export interface GroundwaterForecast {
  month: string;
  level: number;
}

export interface GroundwaterData {
  current_level: number;
  stress_category: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  forecast_4months: GroundwaterForecast[];
  soe_percentage: number;
  source: string;
}

export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soil_type: string;
  source: string;
}

export interface RecommendedCrop {
  name: string;
  water_saving: string;
  yield: string;
  season?: string;
  description?: string;
}

export interface AvoidCrop {
  name: string;
  reason: string;
}

export interface CropData {
  recommended: RecommendedCrop[];
  avoid: AvoidCrop[];
  source: string;
}

export interface AlertItem {
  type: string;
  severity: 'critical' | 'high' | 'moderate' | 'safe';
  message: string;
  icon: string;
  category?: 'groundwater' | 'rainfall' | 'soil' | 'crop';
}

export interface AlertsData {
  alerts: AlertItem[];
  source?: string;
}

export interface LocationSearchResult {
  lat: number;
  lon: number;
  display_name: string;
}

export interface AllDashboardData {
  location: Coordinates;
  weather: WeatherData;
  groundwater: GroundwaterData;
  soil: SoilData;
  crops: CropData;
  alerts: AlertsData;
}
