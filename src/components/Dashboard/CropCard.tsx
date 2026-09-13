import React from 'react';
import { Sprout, AlertTriangle, CheckCircle2, Droplet, Sparkles, TrendingUp } from 'lucide-react';
import { CropData } from '../../types';

interface CropCardProps {
  data: CropData;
}

export const CropCard: React.FC<CropCardProps> = ({ data }) => {
  const { recommended, avoid, source } = data;

  return (
    <div
      id="card-crop-recommendations"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Crop Recommendations
              </h3>
              <p className="text-xs text-slate-500">Hydro-adaptive agricultural cropping guide</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Advisory</span>
          </div>
        </div>

        {/* Top 3 Recommended Crops */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recommended High-Efficiency Crops
            </span>
            <span className="text-[10px] text-slate-400">Top 3 Varieties</span>
          </div>

          <div className="space-y-2.5">
            {recommended.map((crop, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{crop.name}</h4>
                    {crop.season && (
                      <span className="text-[10px] font-semibold text-slate-500">
                        Season: {crop.season}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold whitespace-nowrap shadow-2xs flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-emerald-200" />
                    {crop.water_saving}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-100/70 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    Est. Yield: <strong className="text-slate-800">{crop.yield}</strong>
                  </span>
                </div>

                {crop.description && (
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                    {crop.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Crops to Avoid */}
        {avoid && avoid.length > 0 && (
          <div className="my-3">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Crops to Avoid for this Zone
            </span>

            <div className="space-y-2">
              {avoid.map((crop, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold text-rose-950 block">{crop.name}</strong>
                    <span className="text-[11px] text-rose-800 leading-tight block mt-0.5">
                      {crop.reason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Agri-intelligence Engine</span>
        <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
          {source}
        </span>
      </div>
    </div>
  );
};
