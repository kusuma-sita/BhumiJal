import React from 'react';
import { Droplets, MapPin, ArrowLeft, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { Coordinates } from '../types';

interface HeaderProps {
  currentLocation?: Coordinates | null;
  onBackToMap?: () => void;
  onNavigateToDashboard?: () => void;
  onRefreshData?: () => void;
  onOpenGuide?: () => void;
  isDashboard?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onBackToMap,
  onNavigateToDashboard,
  onRefreshData,
  onOpenGuide,
  isDashboard = false,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {isDashboard && onBackToMap && (
            <button
              id="btn-nav-back-to-map"
              onClick={onBackToMap}
              className="p-2 -ml-1 rounded-lg hover:bg-slate-800 text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to India Map"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Change Location</span>
            </button>
          )}

          <div
            onClick={onBackToMap}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-teal-500/30 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5 text-teal-50" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-['Outfit',sans-serif]">
                  BhumiJal
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                  भूमिजल
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block leading-none">
                AI Water Security Platform • CGWB & NASA Grounded
              </span>
            </div>
          </div>
        </div>

        {/* Center: Selected Location Badge (if on Dashboard) */}
        {isDashboard && currentLocation && (
          <div
            id="header-location-badge"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-300 max-w-sm truncate"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span className="truncate font-medium text-slate-200">
              {currentLocation.displayName || `${currentLocation.lat.toFixed(3)}°N, ${currentLocation.lon.toFixed(3)}°E`}
            </span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {onOpenGuide && (
            <button
              id="btn-header-values-guide"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold border border-teal-500/40 transition cursor-pointer"
              title="Plain-language explanation of all dashboard values"
            >
              <HelpCircle className="w-4 h-4 text-teal-300" />
              <span className="hidden sm:inline">Values Guide</span>
            </button>
          )}

          {!isDashboard && onNavigateToDashboard && (
            <button
              id="btn-header-view-dashboard"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold hover:from-teal-600 hover:to-emerald-600 shadow-sm transition cursor-pointer"
              title="Open full farm water security dashboard"
            >
              <span>View Dashboard</span>
            </button>
          )}

          {isDashboard && onRefreshData && (
            <button
              id="btn-header-refresh"
              onClick={onRefreshData}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Refresh hydrological data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
            <Sparkles className="w-3 h-3" />
            <span>AI Advisory Active</span>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};

