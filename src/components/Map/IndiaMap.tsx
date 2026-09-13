import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import Overlay from 'ol/Overlay';
import {
  MapPin,
  ArrowRight,
  Crosshair,
  Layers,
  HelpCircle,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { Coordinates } from '../../types';
import { INDIA_BOUNDARY_GEOJSON } from '../../data/indiaGeoJson';

interface IndiaMapProps {
  selectedLocation: Coordinates | null;
  onSelectLocation: (coords: Coordinates) => void;
  onViewDashboard: () => void;
  onOpenGuide?: () => void;
  onOpenSelector?: () => void;
  isSplitView?: boolean;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedLocation,
  onSelectLocation,
  onViewDashboard,
  onOpenGuide,
  onOpenSelector,
  isSplitView = false,
}) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerSourceRef = useRef<VectorSource>(new VectorSource());
  const overlayRef = useRef<Overlay | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapElement.current) return;

    // Vector source for India boundary GeoJSON
    const boundarySource = new VectorSource({
      features: new GeoJSON().readFeatures(INDIA_BOUNDARY_GEOJSON, {
        featureProjection: 'EPSG:3857',
      }),
    });

    // High-visibility styling for India Boundary
    const boundaryLayer = new VectorLayer({
      source: boundarySource,
      zIndex: 2,
      style: (feature) => {
        const isCountry = feature.get('type') === 'Country';
        if (isCountry) {
          return new Style({
            stroke: new Stroke({
              color: '#0f766e', // Teal-700
              width: 3.5,
            }),
            fill: new Fill({
              color: 'rgba(13, 148, 136, 0.08)',
            }),
          });
        }
        // Sub-zones
        return new Style({
          stroke: new Stroke({
            color: '#14b8a6', // Teal-500
            width: 1.5,
            lineDash: [4, 4],
          }),
          fill: new Fill({
            color: 'rgba(20, 184, 166, 0.05)',
          }),
        });
      },
    });

    // Marker Layer with red pin style
    const markerLayer = new VectorLayer({
      source: markerSourceRef.current,
      zIndex: 10,
      style: new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: '#e11d48' }),
          stroke: new Stroke({ color: '#ffffff', width: 3.5 }),
        }),
      }),
    });

    // Base Tile Layer using high-performance CartoDB Voyager (with CORS anonymous)
    const baseTileLayer = new TileLayer({
      zIndex: 1,
      source: new XYZ({
        url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap contributors, © CARTO',
        crossOrigin: 'anonymous',
        maxZoom: 19,
      }),
    });

    // Overlay popup
    const overlay = new Overlay({
      element: popupElement.current || undefined,
      autoPan: {
        animation: { duration: 250 },
      },
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -20],
    });
    overlayRef.current = overlay;

    // Geographic center of India
    const indiaCenter = fromLonLat([78.9629, 22.5937]);

    const initialView = new View({
      center: indiaCenter,
      zoom: 4.6, // Shows whole country of India
      minZoom: 3.5,
      maxZoom: 18,
    });

    const map = new Map({
      target: mapElement.current,
      layers: [baseTileLayer, boundaryLayer, markerLayer],
      overlays: [overlay],
      view: initialView,
      controls: [], // clean custom UI controls
    });

    mapRef.current = map;

    // Map Click Handler: Click anywhere on India to drop pin
    map.on('click', (evt) => {
      const coords = toLonLat(evt.coordinate);
      const lon = parseFloat(coords[0].toFixed(4));
      const lat = parseFloat(coords[1].toFixed(4));

      // Check if coordinates are in India approximate bounding box (6°-38°N, 67°-98°E)
      const isInIndia = lat >= 6 && lat <= 38 && lon >= 67 && lon <= 98;

      onSelectLocation({
        lat,
        lon,
        displayName: isInIndia
          ? `Pinned Farm (${lat}° N, ${lon}° E)`
          : `Selected Pin (${lat}° N, ${lon}° E)`,
      });
    });

    // Set initial marker if selectedLocation exists
    if (selectedLocation) {
      const coordinate = fromLonLat([selectedLocation.lon, selectedLocation.lat]);
      const markerFeature = new Feature({
        geometry: new Point(coordinate),
        name: selectedLocation.displayName || 'Selected Location',
      });
      markerSourceRef.current.addFeature(markerFeature);
      overlay.setPosition(coordinate);
    }

    // Force OpenLayers to recalculate size on mount and after render cycles
    const updateSize = () => {
      if (mapRef.current) {
        mapRef.current.updateSize();
      }
    };

    updateSize();
    const timer1 = setTimeout(updateSize, 100);
    const timer2 = setTimeout(updateSize, 350);

    // ResizeObserver ensures canvas always matches container
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (mapElement.current) {
      resizeObserver.observe(mapElement.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      map.setTarget(undefined);
    };
  }, []);

  // Update marker position whenever selectedLocation changes
  useEffect(() => {
    if (!selectedLocation || !mapRef.current) return;

    const { lat, lon } = selectedLocation;
    const coordinate = fromLonLat([lon, lat]);

    // Update marker feature
    markerSourceRef.current.clear();
    const markerFeature = new Feature({
      geometry: new Point(coordinate),
      name: selectedLocation.displayName || 'Selected Location',
    });
    markerSourceRef.current.addFeature(markerFeature);

    // Update overlay popup position
    if (overlayRef.current) {
      overlayRef.current.setPosition(coordinate);
    }

    // Smoothly pan to location without overly aggressive zoom
    const view = mapRef.current.getView();
    const currentZoom = view.getZoom() || 5;
    // Keep at good regional zoom (level 6.5 to 8) so the surrounding state and India are visible
    const targetZoom = Math.max(currentZoom, 6.5);

    view.animate({
      center: coordinate,
      zoom: targetZoom,
      duration: 600,
    });
  }, [selectedLocation]);

  // Use browser GPS / geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        onSelectLocation({
          lat,
          lon,
          displayName: `My GPS Farm Location (${lat}°N, ${lon}°E)`,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 8000 }
    );
  };

  // Reset to full whole view of India
  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.getView().animate({
      center: fromLonLat([78.9629, 22.5937]),
      zoom: 4.6,
      duration: 600,
    });
  };

  // Zoom in
  const handleZoomIn = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.animate({
      zoom: (view.getZoom() || 5) + 1,
      duration: 250,
    });
  };

  // Zoom out
  const handleZoomOut = () => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.animate({
      zoom: (view.getZoom() || 5) - 1,
      duration: 250,
    });
  };

  return (
    <div
      id="india-map-canvas-container"
      className="relative w-full h-full min-h-[480px] bg-[#dbeafe] overflow-hidden select-none border border-slate-200"
      style={{ minHeight: '480px', height: '100%', width: '100%', position: 'relative' }}
    >
      {/* Map Target Canvas - explicitly styled for OpenLayers */}
      <div
        ref={mapElement}
        id="ol-india-map"
        className="absolute inset-0 w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
      />

      {/* Map Popup Element (Managed by OpenLayers Overlay) */}
      <div
        ref={popupElement}
        id="map-location-popup"
        className="bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 pointer-events-auto backdrop-blur-md min-w-[200px] text-xs transition-all z-30"
      >
        <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-0.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Selected Location</span>
        </div>
        <div className="font-mono text-slate-200 text-xs">
          {selectedLocation ? `${selectedLocation.lat.toFixed(4)}° N, ${selectedLocation.lon.toFixed(4)}° E` : ''}
        </div>
        <p className="text-[10px] text-slate-400 truncate max-w-[220px] mt-0.5">
          {selectedLocation?.displayName}
        </p>
      </div>

      {/* Floating Top Control Bar (Clean, Unobtrusive, No Overlap!) */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Side: India Map indicator badge & click instruction */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 text-xs font-semibold shadow-md">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive India Map</span>
            <span className="hidden sm:inline text-[10px] text-slate-300 font-normal ml-1">
              (Click anywhere to pin)
            </span>
          </div>

          <button
            id="btn-map-use-gps"
            onClick={handleUseCurrentLocation}
            className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 backdrop-blur-md border border-slate-300 text-xs font-semibold shadow-md flex items-center gap-1.5 transition cursor-pointer"
            title="Use current GPS location"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">My GPS</span>
          </button>
        </div>

        {/* Right Side: Whole India / Values Guide */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="btn-map-whole-india"
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 backdrop-blur-md border border-slate-300 text-xs font-semibold shadow-md flex items-center gap-1.5 transition cursor-pointer"
            title="Reset to whole India view"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
            <span>Whole India</span>
          </button>

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 backdrop-blur-md border border-slate-700 text-xs font-semibold shadow-md items-center gap-1 transition cursor-pointer"
              title="Open Values Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Zoom Controls (+ and - buttons) on bottom left */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white/95 text-slate-800 hover:bg-white shadow-md border border-slate-300 flex items-center justify-center transition cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white/95 text-slate-800 hover:bg-white shadow-md border border-slate-300 flex items-center justify-center transition cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Bottom Action Bar: Appears when a location is selected */}
      {selectedLocation && (
        <div
          id="map-floating-bottom-bar"
          className="absolute bottom-4 left-16 right-4 sm:left-auto sm:right-6 sm:max-w-md z-20 pointer-events-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="min-w-0 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Location Selected
                </span>
              </div>
              <p className="font-semibold text-xs sm:text-sm text-white truncate max-w-[280px]">
                {selectedLocation.displayName || `${selectedLocation.lat.toFixed(4)}° N, ${selectedLocation.lon.toFixed(4)}° E`}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lon.toFixed(4)}° E
              </p>
            </div>

            <button
              id="btn-map-view-dashboard"
              onClick={onViewDashboard}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:from-teal-600 hover:to-emerald-600 transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
