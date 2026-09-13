import React, { useState } from 'react';
import { IndiaMap } from '../components/Map/IndiaMap';
import { LocationSelector } from '../components/Map/LocationSelector';
import { Coordinates } from '../types';
import {
  MapPin,
  Map as MapIcon,
  Columns,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface LandingPageProps {
  selectedLocation: Coordinates | null;
  onSelectLocation: (coords: Coordinates) => void;
  onNavigateToDashboard: () => void;
  onOpenGuide?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  selectedLocation,
  onSelectLocation,
  onNavigateToDashboard,
  onOpenGuide,
}) => {
  // Default to 'both' so that the India Map is ALWAYS visible alongside the location selector!
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'selector'>('both');

  return (
    <main id="landing-page" className="w-full flex-1 flex flex-col bg-slate-100 min-h-0">
      {/* Top Method Bar: Clear options without overlap */}
      <section
        id="location-method-bar"
        className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs z-20 flex-shrink-0"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Guidance text */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] bg-teal-50 text-teal-800 border border-teal-200/60 px-2 py-0.5 rounded-md">
              Choose View:
            </span>
            <span className="text-slate-600">
              Select via District dropdowns or click directly on the India Map
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              id="mode-btn-both"
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View India Map and Location Selector together without overlapping"
            >
              <Columns className="w-3.5 h-3.5 text-teal-600" />
              <span>Map & Selector</span>
            </button>

            <button
              id="mode-btn-map"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full screen view of India Map"
            >
              <MapIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Full Map</span>
            </button>

            <button
              id="mode-btn-selector"
              onClick={() => setViewMode('selector')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'selector'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Focus on district and state selector"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Selector Only</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col min-h-0 relative">
        {/* Mode 1: 'both' (Default!) - Map and Selector together with ZERO overlap! */}
        {viewMode === 'both' && (
          <div className="flex-1 w-full flex flex-col lg:flex-row min-h-[600px] h-full overflow-hidden">
            {/* Left Column: Location Selection (400px - 440px on desktop) */}
            <div className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-10 shadow-xs flex flex-col max-h-[48vh] lg:max-h-full overflow-y-auto">
              <LocationSelector
                selectedLocation={selectedLocation}
                onSelectLocation={onSelectLocation}
                onViewDashboard={onNavigateToDashboard}
                onOpenGuide={onOpenGuide}
                onSwitchToMap={() => setViewMode('map')}
                isCompact={true}
              />
            </div>

            {/* Right Column: Interactive India Map */}
            <div className="flex-1 w-full h-[460px] lg:h-full min-h-[420px] relative bg-[#dbeafe]">
              <IndiaMap
                selectedLocation={selectedLocation}
                onSelectLocation={onSelectLocation}
                onViewDashboard={onNavigateToDashboard}
                onOpenGuide={onOpenGuide}
                onOpenSelector={() => setViewMode('selector')}
                isSplitView={true}
              />
            </div>
          </div>
        )}

        {/* Mode 2: 'map' - 100% Full Screen India Map */}
        {viewMode === 'map' && (
          <div className="flex-1 w-full h-full min-h-[550px] relative bg-[#dbeafe]">
            <IndiaMap
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
              onViewDashboard={onNavigateToDashboard}
              onOpenGuide={onOpenGuide}
              onOpenSelector={() => setViewMode('both')}
              isSplitView={false}
            />
          </div>
        )}

        {/* Mode 3: 'selector' - Pure Form Selector */}
        {viewMode === 'selector' && (
          <div className="flex-1 w-full overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-2xl my-auto">
              <LocationSelector
                selectedLocation={selectedLocation}
                onSelectLocation={onSelectLocation}
                onViewDashboard={onNavigateToDashboard}
                onOpenGuide={onOpenGuide}
                onSwitchToMap={() => setViewMode('both')}
                isCompact={false}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
