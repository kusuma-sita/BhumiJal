import React, { useState } from 'react';
import { Layers, TestTube, Sprout, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { SoilData } from '../../types';

interface SoilCardProps {
  data: SoilData;
}

export const SoilCard: React.FC<SoilCardProps> = ({ data }) => {
  const { nitrogen, phosphorus, potassium, ph, soil_type, source } = data;
  const [showPlainMeaning, setShowPlainMeaning] = useState(false);

  const getNutrientStatus = (val: number) => {
    if (val < 35) return { label: 'Low', color: 'text-amber-600', bg: 'bg-amber-500' };
    if (val <= 65) return { label: 'Medium', color: 'text-teal-600', bg: 'bg-teal-500' };
    return { label: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-500' };
  };

  const getPhStatus = (val: number) => {
    if (val < 6.5) return { label: 'Slightly Acidic', color: 'text-amber-700', advice: 'Add dolomite or lime' };
    if (val <= 7.5) return { label: 'Neutral (Optimal)', color: 'text-emerald-700', advice: 'Ideal for nutrient absorption' };
    return { label: 'Alkaline', color: 'text-indigo-700', advice: 'Add gypsum or organic matter' };
  };

  const phStatus = getPhStatus(ph);
  const nStatus = getNutrientStatus(nitrogen);
  const pStatus = getNutrientStatus(phosphorus);
  const kStatus = getNutrientStatus(potassium);

  return (
    <div
      id="card-soil-health"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Soil Health & Nutrients
              </h3>
              <p className="text-xs text-slate-500">NPK macro-nutrients & physicochemical status</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            {soil_type}
          </span>
        </div>

        {/* pH & Soil Type Highlights */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <TestTube className="w-3.5 h-3.5 text-indigo-500" /> Soil pH
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white border border-slate-200 ${phStatus.color}`}>
                {phStatus.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {ph}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 14</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">{phStatus.advice}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Soil Class
            </span>
            <span className="text-sm font-bold text-slate-900 block truncate">
              {soil_type}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              {soil_type.includes('Black')
                ? 'High water retention capacity'
                : soil_type.includes('Alluvial')
                ? 'High fertility, loam texture'
                : 'Good drainage, requires organic mulch'}
            </p>
          </div>
        </div>

        {/* N-P-K Nutrient Bars */}
        <div className="space-y-3.5 my-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Macro-Nutrient Concentration</span>
            <span className="text-[10px] text-slate-400 font-normal">Normal: 35–65 kg/ha</span>
          </div>

          {/* Nitrogen */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center">
                  N
                </span>
                <span className="font-semibold text-slate-800">Available Nitrogen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{nitrogen} kg/ha</span>
                <span className={`text-[10px] font-bold ${nStatus.color}`}>({nStatus.label})</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${nStatus.bg} transition-all duration-500`}
                style={{ width: `${Math.min(100, (nitrogen / 80) * 100)}%` }}
              />
            </div>
          </div>

          {/* Phosphorus */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center">
                  P
                </span>
                <span className="font-semibold text-slate-800">Phosphorus (P₂O₅)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{phosphorus} kg/ha</span>
                <span className={`text-[10px] font-bold ${pStatus.color}`}>({pStatus.label})</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pStatus.bg} transition-all duration-500`}
                style={{ width: `${Math.min(100, (phosphorus / 80) * 100)}%` }}
              />
            </div>
          </div>

          {/* Potassium */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-center">
                  K
                </span>
                <span className="font-semibold text-slate-800">Potassium (K₂O)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{potassium} kg/ha</span>
                <span className={`text-[10px] font-bold ${kStatus.color}`}>({kStatus.label})</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${kStatus.bg} transition-all duration-500`}
                style={{ width: `${Math.min(100, (potassium / 80) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Plain Language Interpretation for Farmers */}
        <div className="mt-4 mb-2 rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowPlainMeaning(!showPlainMeaning)}
            className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-100/80 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              What do N, P, K & pH mean for my crops?
            </span>
            {showPlainMeaning ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showPlainMeaning && (
            <div className="px-3 pb-3 pt-1 space-y-1.5 text-[11px] text-slate-600 border-t border-slate-200/60 bg-white">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 min-w-[70px]">pH ({ph}):</span>
                <span>
                  {ph < 6.5 ? (
                    <strong className="text-amber-700">Acidic. Plants have trouble taking in nutrients. Apply agricultural lime.</strong>
                  ) : ph <= 7.5 ? (
                    <strong className="text-emerald-700">Optimal neutral balance. Roots absorb water and fertilizers easily.</strong>
                  ) : (
                    <strong className="text-indigo-700">Alkaline. Add gypsum or organic compost to soften the soil.</strong>
                  )}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 min-w-[70px]">N-P-K:</span>
                <span>
                  <strong>N (Nitrogen)</strong> = leaf & stem growth; <strong>P (Phosphorus)</strong> = root depth & flowering; <strong>K (Potassium)</strong> = drought tolerance & disease resistance.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Soil Laboratory Grid</span>
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {source}
        </span>
      </div>
    </div>
  );
};
