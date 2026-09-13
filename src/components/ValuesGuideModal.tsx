import React from 'react';
import {
  X,
  Droplet,
  CloudRain,
  Layers,
  Sprout,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface ValuesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValuesGuideModal: React.FC<ValuesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="values-guide-modal"
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Beginner's Guide to Agricultural Values
              </h2>
              <p className="text-xs text-slate-500">
                Simple, plain-language explanations of all numbers on your dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Cards */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm">
          {/* Section 1: Groundwater Depth & Categories */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
            <div className="flex items-center gap-2 mb-2 font-bold text-teal-900">
              <Droplet className="w-4 h-4 text-teal-600" />
              <span>1. Groundwater Depth & Stress Categories</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              Groundwater is water stored naturally inside soil rocks deep underground.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-teal-100">
                <span className="font-semibold text-slate-800 min-w-[90px]">m bgl:</span>
                <span className="text-slate-600">
                  Stands for <strong>"Meters Below Ground Level"</strong>. It means how many meters deep you must drill before you reach water.
                  <span className="block text-slate-500 mt-0.5">
                    • <strong>Less than 10m</strong>: Shallow, easy and cheap to pump.
                    • <strong>More than 20m</strong>: Very deep, high electricity/diesel bills, borewells risk running dry.
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-teal-100">
                <span className="font-semibold text-slate-800 min-w-[90px]">SOE (%):</span>
                <span className="text-slate-600">
                  Stands for <strong>"Stage of Extraction"</strong>. It compares how much water farmers pull out against how much rain replenishes it.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[11px]">
                <span className="p-1.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-center">
                  Safe (&lt;70%)
                </span>
                <span className="p-1.5 rounded bg-amber-100 text-amber-800 font-semibold text-center">
                  Semi-Critical (70-90%)
                </span>
                <span className="p-1.5 rounded bg-orange-100 text-orange-800 font-semibold text-center">
                  Critical (90-100%)
                </span>
                <span className="p-1.5 rounded bg-rose-100 text-rose-800 font-semibold text-center">
                  Over-Exploited (&gt;100%)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Rainfall & Irrigation Delay */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
            <div className="flex items-center gap-2 mb-2 font-bold text-sky-900">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <span>2. Rainfall Forecast (in mm)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              Rain is measured in <strong>millimeters (mm)</strong> of water depth on flat ground.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="p-2 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                <span><strong>0 to 5 mm</strong>: Light drizzle or dry day</span>
                <span className="text-slate-500 font-semibold">Normal irrigation</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                <span><strong>10 to 25 mm</strong>: Moderate rainfall</span>
                <span className="text-emerald-700 font-semibold">Reduce tube-well hours</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-sky-100 flex items-center justify-between">
                <span><strong>25 mm or higher</strong>: Heavy rain shower</span>
                <span className="text-rose-700 font-semibold">Turn off pumps! Save electricity</span>
              </div>
            </div>
          </div>

          {/* Section 3: Soil Nutrients (NPK & pH) */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-900">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>3. Soil Nutrients (N-P-K & pH)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-amber-100">
                <strong className="text-slate-800">N (Nitrogen):</strong>
                <span className="text-slate-600 ml-1">
                  Builds green leaves and tall plant stems. If low (&lt;35), leaves turn yellow.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-amber-100">
                <strong className="text-slate-800">P (Phosphorus):</strong>
                <span className="text-slate-600 ml-1">
                  Builds strong deep roots, helps early flowering and seed setting.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-amber-100">
                <strong className="text-slate-800">K (Potassium):</strong>
                <span className="text-slate-600 ml-1">
                  Acts like a plant's immune system. Protects crops against pest diseases and heat stress.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-amber-100">
                <strong className="text-slate-800">Soil pH (scale 1 to 14):</strong>
                <span className="text-slate-600 ml-1">
                  Measures whether the soil is sour (acidic) or sweet (alkaline).
                  <strong> 6.5 to 7.5 is neutral/optimal</strong>, where crop roots can absorb all fertilizers easily.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Recommended vs Avoid Crops */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-900">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>4. Crop Water Savings</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              In water-stressed zones, flood crops like Paddy require 1,200 to 1,500 liters of water per kilogram of grain. 
              Drought-hardy crops like <strong>Millets (Bajra/Jowar/Ragi)</strong> and <strong>Pulses (Chana/Moong)</strong> save <strong>50% to 65% water</strong> while guaranteeing good market prices.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Based on ICAR & CGWB National Agricultural Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
};
