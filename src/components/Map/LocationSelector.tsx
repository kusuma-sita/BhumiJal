import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  Crosshair,
  Loader2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Coordinates, LocationSearchResult } from '../../types';
import {
  POPULAR_LOCATIONS,
  INDIAN_DISTRICTS_PRESETS,
} from '../../data/indiaGeoJson';
import { searchLocation } from '../../services/api';

interface LocationSelectorProps {
  selectedLocation: Coordinates | null;
  onSelectLocation: (coords: Coordinates) => void;
  onViewDashboard: () => void;
  onOpenGuide?: () => void;
  onSwitchToMap?: () => void;
  isCompact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
  onViewDashboard,
  onOpenGuide,
  onSwitchToMap,
  isCompact = false,
}) => {
  // Tabs: 'presets' (District & State), 'address' (Search Name / Pincode), 'latlon' (Coordinates)
  const [searchTab, setSearchTab] = useState<'presets' | 'address' | 'latlon'>('presets');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('');
  const [addressQuery, setAddressQuery] = useState('');
  const [inputLat, setInputLat] = useState('');
  const [inputLon, setInputLon] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);

  // Unique states from presets
  const availableStates = ['All States', ...Array.from(new Set(INDIAN_DISTRICTS_PRESETS.map((d) => d.state)))];

  // Filtered districts
  const filteredDistricts = INDIAN_DISTRICTS_PRESETS.filter(
    (d) => selectedState === 'All States' || d.state === selectedState
  );

  // Handle Lat/Lon form submission
  const handleLatLonSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);

    if (isNaN(lat) || isNaN(lon)) {
      setSearchError('Please enter valid numeric latitude and longitude.');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setSearchError('Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    onSelectLocation({
      lat,
      lon,
      displayName: `Target (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
    });
  };

  // Handle Address/Pincode search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const results = await searchLocation(addressQuery);
      if (results.length === 0) {
        setSearchError(`No locations found for "${addressQuery}". Try a nearby district or pincode.`);
      } else if (results.length === 1) {
        onSelectLocation({
          lat: results[0].lat,
          lon: results[0].lon,
          displayName: results[0].display_name,
        });
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setSearchError('Geocoding search failed. You can also click directly on the map.');
    } finally {
      setIsSearching(false);
    }
  };

  // Use browser GPS / geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsSearching(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        onSelectLocation({
          lat,
          lon,
          displayName: `My GPS Location (${lat}°N, ${lon}°E)`,
        });
      },
      (err) => {
        setIsSearching(false);
        setSearchError(`Location permission denied or unavailable (${err.message}).`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      id="location-selector-panel"
      className={`flex flex-col bg-white text-slate-800 ${
        isCompact ? 'p-4 sm:p-5 h-full overflow-y-auto' : 'p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/90 max-w-2xl mx-auto'
      }`}
    >
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
              Select Farming Location
            </h2>
            <p className="text-[11px] text-slate-500">
              Pick your state & district, search by town, or choose a region
            </p>
          </div>
        </div>

        <button
          id="btn-use-gps"
          onClick={handleUseCurrentLocation}
          disabled={isSearching}
          className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-teal-200/60"
          title="Detect coordinates using device GPS"
        >
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Crosshair className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Use GPS</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold mb-4">
        <button
          id="tab-search-presets"
          onClick={() => {
            setSearchTab('presets');
            setSearchError(null);
          }}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
            searchTab === 'presets'
              ? 'bg-white text-teal-800 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          District & State
        </button>
        <button
          id="tab-search-address"
          onClick={() => {
            setSearchTab('address');
            setSearchError(null);
          }}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
            searchTab === 'address'
              ? 'bg-white text-teal-800 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Search Name / Pincode
        </button>
        <button
          id="tab-search-latlon"
          onClick={() => {
            setSearchTab('latlon');
            setSearchError(null);
          }}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
            searchTab === 'latlon'
              ? 'bg-white text-teal-800 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Coordinates
        </button>
      </div>

      {/* Tab 1: District & State Selector (Zero typing needed) */}
      {searchTab === 'presets' && (
        <div className="space-y-3.5 mb-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select your Indian state and district to load tailored groundwater tables, monsoon projections, and soil health:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                1. State
              </label>
              <select
                id="select-state"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrictName('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer"
              >
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                2. District ({filteredDistricts.length})
              </label>
              <select
                id="select-district"
                value={selectedDistrictName}
                onChange={(e) => {
                  const dist = filteredDistricts.find((d) => d.district === e.target.value);
                  if (dist) {
                    setSelectedDistrictName(dist.district);
                    onSelectLocation({
                      lat: dist.lat,
                      lon: dist.lon,
                      displayName: `${dist.district}, ${dist.state} (${dist.primaryCrop})`,
                    });
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer"
              >
                <option value="">-- Choose District --</option>
                {filteredDistricts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} ({d.primaryCrop})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Address / Pincode Search */}
      {searchTab === 'address' && (
        <form onSubmit={handleAddressSearch} className="space-y-3 mb-5">
          <div className="relative">
            <input
              id="input-address-pincode"
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder="Enter district, tehsil, village, or 6-digit pincode..."
              className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              id="btn-search-address"
              type="submit"
              disabled={isSearching || !addressQuery.trim()}
              className="absolute right-1.5 top-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Sample Quick Searches */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-700">Quick searches:</span>
            {['Nagpur', 'Ludhiana', 'Jaipur', 'Varanasi', 'Karnal', 'Coimbatore'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setAddressQuery(sample);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-[11px] font-medium transition cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>
      )}

      {/* Tab 3: Latitude / Longitude Input */}
      {searchTab === 'latlon' && (
        <form onSubmit={handleLatLonSearch} className="space-y-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
            💡 <strong>Coordinates are optional!</strong> If you don't know your coordinates, simply choose your <strong>District & State</strong> or search by name.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Latitude (°N)
              </label>
              <input
                id="input-lat"
                type="number"
                step="0.0001"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                placeholder="e.g. 21.1458"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Longitude (°E)
              </label>
              <input
                id="input-lon"
                type="number"
                step="0.0001"
                value={inputLon}
                onChange={(e) => setInputLon(e.target.value)}
                placeholder="e.g. 79.0882"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>
          <button
            id="btn-search-latlon"
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition cursor-pointer"
          >
            Apply Coordinates
          </button>
        </form>
      )}

      {/* Error notification */}
      {searchError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <span>{searchError}</span>
        </div>
      )}

      {/* Multiple Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="mb-4 max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white shadow-md">
          <div className="p-2 bg-slate-50 text-[11px] font-bold text-slate-600">
            Select matching location:
          </div>
          {searchResults.map((res, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectLocation({
                  lat: res.lat,
                  lon: res.lon,
                  displayName: res.display_name,
                });
                setSearchResults([]);
              }}
              className="w-full p-2.5 text-left text-xs hover:bg-teal-50 transition flex items-start gap-2 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 line-clamp-1">{res.display_name}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {res.lat.toFixed(4)}° N, {res.lon.toFixed(4)}° E
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 1-Click Popular Agricultural Belts */}
      <div className="pt-3 border-t border-slate-100 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            1-Click Major Agricultural Zones
          </span>
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Values Guide</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() =>
                onSelectLocation({
                  lat: loc.lat,
                  lon: loc.lon,
                  displayName: `${loc.name} (${loc.note})`,
                })
              }
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-xs font-medium text-slate-700 transition cursor-pointer border border-slate-200/70 flex items-center gap-1.5"
            >
              <span>{loc.name.split(',')[0]}</span>
              <span className="text-[10px] text-slate-400">({loc.tag.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Selected Location Card & Actions */}
      {selectedLocation && (
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Ready for Analysis
              </span>
            </div>
            <p className="font-bold text-sm text-white line-clamp-1">
              {selectedLocation.displayName || `${selectedLocation.lat.toFixed(4)}° N, ${selectedLocation.lon.toFixed(4)}° E`}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Coordinates: {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lon.toFixed(4)}° E
            </p>

            <div className="mt-3.5 flex flex-col sm:flex-row gap-2">
              {onSwitchToMap && (
                <button
                  id="btn-selector-switch-map"
                  onClick={onSwitchToMap}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View on India Map</span>
                </button>
              )}

              <button
                id="btn-selector-view-dashboard"
                onClick={onViewDashboard}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
