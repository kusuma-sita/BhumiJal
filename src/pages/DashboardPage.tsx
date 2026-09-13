import React, { useEffect, useState } from 'react';
import {
  MapPin,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Printer,
  Sparkles,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { Coordinates, AllDashboardData } from '../types';
import { fetchAllDashboardData } from '../services/api';
import { GroundwaterCard } from '../components/Dashboard/GroundwaterCard';
import { RainfallCard } from '../components/Dashboard/RainfallCard';
import { SoilCard } from '../components/Dashboard/SoilCard';
import { CropCard } from '../components/Dashboard/CropCard';
import { AlertsCard } from '../components/Dashboard/AlertsCard';

interface DashboardPageProps {
  location: Coordinates;
  onBackToMap: () => void;
  onOpenGuide?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ location, onBackToMap, onOpenGuide }) => {
  const [data, setData] = useState<AllDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    // Validate coordinates
    if (
      isNaN(location.lat) ||
      isNaN(location.lon) ||
      location.lat < -90 ||
      location.lat > 90 ||
      location.lon < -180 ||
      location.lon > 180
    ) {
      setError('Invalid geographic coordinates provided. Please select a valid point on the map.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await fetchAllDashboardData(location.lat, location.lon, location.displayName);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve hydrological and soil data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [location.lat, location.lon]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="dashboard-page" className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Location Action Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-map"
              onClick={onBackToMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to India Map</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <div>
                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate max-w-[280px] sm:max-w-md">
                  {location.displayName || `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`}
                </h1>
                <p className="text-[11px] text-slate-500 font-mono">
                  {location.lat.toFixed(4)}° N, {location.lon.toFixed(4)}° E • WGS 84 Coordinates
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-dashboard-refresh"
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              title="Refresh real-time model data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Print Advisory Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Loading State with custom spinner */}
        {isLoading && (
          <div
            id="dashboard-loading-state"
            className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Querying Hydro-Geological & Satellite Feeds...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Synthesizing CGWB aquifer depth, NASA POWER 14-day rainfall models, and soil nutrient registries for this location.
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            id="dashboard-error-state"
            className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 max-w-lg mx-auto my-12 text-center"
          >
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-950">Data Retrieval Error</h3>
            <p className="text-xs text-rose-800 mt-1">{error}</p>
            <button
              onClick={onBackToMap}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
            >
              Return to Map & Reselect
            </button>
          </div>
        )}

        {/* Dashboard 5 Cards Grid */}
        {!isLoading && data && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Context Notice Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Farmer Water Security Briefing • {location.displayName?.split('(')[0] || 'Selected Farm'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Calculated for Kharif & Rabi season water conservation. All data synchronized.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-200 bg-white/10 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                <span>Season 2026-27</span>
              </div>
            </div>

            {/* Beginner-Friendly Values Guide Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-teal-950">
                    Don't know what these agricultural values mean?
                  </p>
                  <p className="text-[11px] text-teal-800">
                    Learn what <em>m bgl</em> (water depth), <em>SOE %</em> (stress level), <em>Rainfall mm</em>, and <em>Soil N-P-K</em> mean in simple, plain language.
                  </p>
                </div>
              </div>
              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shadow-xs flex-shrink-0"
                >
                  Open Plain-Language Guide
                </button>
              )}
            </div>

            {/* Grid of the 5 Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Groundwater Status */}
              <GroundwaterCard data={data.groundwater} />

              {/* Card 2: Rainfall Forecast (Next 14 Days) */}
              <RainfallCard data={data.weather} />

              {/* Card 3: Soil Data */}
              <SoilCard data={data.soil} />

              {/* Card 4: Crop Recommendation */}
              <CropCard data={data.crops} />
            </div>

            {/* Card 5: Agricultural Alerts (Spans full width) */}
            <div className="w-full">
              <AlertsCard data={data.alerts} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
