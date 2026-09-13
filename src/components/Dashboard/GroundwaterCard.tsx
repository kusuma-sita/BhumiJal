import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Droplets, TrendingDown, AlertCircle, ShieldCheck, Gauge, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { GroundwaterData } from '../../types';

interface GroundwaterCardProps {
  data: GroundwaterData;
}

export const GroundwaterCard: React.FC<GroundwaterCardProps> = ({ data }) => {
  const { current_level, stress_category, forecast_4months, soe_percentage, source } = data;
  const [showPlainMeaning, setShowPlainMeaning] = useState(false);

  const categoryStyles = {
    Safe: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'bg-emerald-600 text-white',
      accent: '#059669',
      border: 'border-emerald-200',
      icon: ShieldCheck,
      desc: 'Groundwater extraction is within natural replenishment limits. Water table is healthy.',
    },
    'Semi-Critical': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'bg-amber-500 text-white',
      accent: '#d97706',
      border: 'border-amber-200',
      icon: Gauge,
      desc: 'Extraction is nearing annual recharge capacity (70-90%). Caution and water budgeting advised.',
    },
    Critical: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      badge: 'bg-orange-600 text-white',
      accent: '#ea580c',
      border: 'border-orange-200',
      icon: AlertCircle,
      desc: 'Aquifer extraction rate is between 90-100%. Shift to low-water crops and drip irrigation.',
    },
    'Over-Exploited': {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      badge: 'bg-rose-600 text-white',
      accent: '#e11d48',
      border: 'border-rose-200',
      icon: AlertCircle,
      desc: 'Annual extraction exceeds recharge (>100%). Water table is depleting rapidly.',
    },
  }[stress_category] || {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    badge: 'bg-slate-600 text-white',
    accent: '#0f766e',
    border: 'border-slate-200',
    icon: Droplets,
    desc: '',
  };

  const StatusIcon = categoryStyles.icon;

  // Chart data formatting: include current level as starting point
  const chartData = [
    { month: 'Current', level: current_level },
    ...forecast_4months.map((item) => ({
      month: item.month.split(' ')[0], // just month name e.g. "Oct"
      level: item.level,
    })),
  ];

  return (
    <div
      id="card-groundwater-status"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Groundwater Status
              </h3>
              <p className="text-xs text-slate-500">Current aquifer depth & 4-month forecast</p>
            </div>
          </div>
          <span
            id="badge-groundwater-stress"
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${categoryStyles.badge}`}
          >
            {stress_category}
          </span>
        </div>

        {/* Big Metric Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Water Table Depth
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                {current_level}
              </span>
              <span className="text-sm font-semibold text-slate-600">m bgl</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">meters below ground level</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Stage of Extraction (SOE)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif] ${
                  soe_percentage > 100
                    ? 'text-rose-600'
                    : soe_percentage > 90
                    ? 'text-orange-600'
                    : 'text-slate-900'
                }`}
              >
                {soe_percentage}%
              </span>
              <span className="text-xs font-medium text-slate-500">of annual recharge</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {soe_percentage > 100 ? 'Overdraft condition' : 'Sustainable recharge capacity'}
            </p>
          </div>
        </div>

        {/* Advisory alert note */}
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 mb-3 ${categoryStyles.bg}`}>
          <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed font-medium">{categoryStyles.desc}</p>
        </div>

        {/* Plain Language Interpretation for Farmers */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowPlainMeaning(!showPlainMeaning)}
            className="w-full px-3 py-2 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-100/80 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-teal-800 font-bold text-[11px]">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              What do these groundwater numbers mean for my farm?
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
                <span className="font-bold text-slate-800 min-w-[70px]">Water Depth:</span>
                <span>
                  {current_level <= 10 ? (
                    <strong className="text-emerald-700">Shallow water table ({current_level}m). Easy & cheap to pump.</strong>
                  ) : current_level <= 20 ? (
                    <strong className="text-amber-700">Moderate depth ({current_level}m). Pumping takes more diesel/electricity.</strong>
                  ) : (
                    <strong className="text-rose-700">Very deep water ({current_level}m). Borewells risk failing; switch to micro-irrigation.</strong>
                  )}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-slate-800 min-w-[70px]">Extraction:</span>
                <span>
                  {soe_percentage <= 70 ? (
                    <strong className="text-emerald-700">Safe ({soe_percentage}%). Nature refills more water than is taken out.</strong>
                  ) : soe_percentage <= 90 ? (
                    <strong className="text-amber-700">Semi-critical ({soe_percentage}%). Village water use is near the recharge limit.</strong>
                  ) : (
                    <strong className="text-rose-700">Over-extracted ({soe_percentage}%). Pumping faster than rain can refill the aquifer!</strong>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4-Month Forecast Line Chart */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-teal-600" />
              Predicted Water Depth Trend (m bgl)
            </span>
            <span className="text-[10px] text-slate-400">Lower line = deeper water</span>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  unit="m"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-md border border-slate-700">
                          <p className="font-semibold text-teal-300">{payload[0].payload.month}</p>
                          <p className="text-slate-200">
                            Depth: <span className="font-bold">{payload[0].value} m</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke={categoryStyles.accent}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: categoryStyles.accent, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Hydrological Model</span>
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {source}
        </span>
      </div>
    </div>
  );
};
