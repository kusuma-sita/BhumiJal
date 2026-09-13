import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { CloudRain, Thermometer, Droplet, SunMedium, Calendar } from 'lucide-react';
import { WeatherData } from '../../types';

interface RainfallCardProps {
  data: WeatherData;
}

export const RainfallCard: React.FC<RainfallCardProps> = ({ data }) => {
  const { rainfall_14days, temperature, humidity, total_rainfall, source } = data;

  // Format 14 days as Day 1, Day 2, ...
  const chartData = rainfall_14days.map((val, idx) => ({
    day: `D${idx + 1}`,
    fullDay: `Day ${idx + 1}`,
    rainfall: val,
  }));

  const maxRain = Math.max(...rainfall_14days);
  const heavyRainDays = rainfall_14days.filter((r) => r >= 20).length;

  return (
    <div
      id="card-rainfall-forecast"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Rainfall Forecast (Next 14 Days)
              </h3>
              <p className="text-xs text-slate-500">Daily precipitation & atmospheric indices</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>14-Day Cycle</span>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-sky-500" /> Total Rain
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {total_rainfall}
              </span>
              <span className="text-xs font-semibold text-slate-600">mm</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">cumulative volume</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-500" /> Temp
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {temperature}
              </span>
              <span className="text-xs font-semibold text-slate-600">°C</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">average daytime</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Droplet className="w-3 h-3 text-teal-500" /> Humidity
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {humidity}
              </span>
              <span className="text-xs font-semibold text-slate-600">%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">relative moisture</p>
          </div>
        </div>

        {/* Dynamic Farmer Irrigation Guidance Note */}
        <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-900 text-xs font-medium leading-relaxed mb-4 flex items-start gap-2">
          <SunMedium className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <span>
            {heavyRainDays > 0
              ? `Significant showers expected (${maxRain} mm peak). Suspend irrigation 24-48 hrs prior to save diesel & electricity.`
              : total_rainfall < 10
              ? 'Minimal rainfall forecast over 14 days. Irrigate crops during evening or early morning to cut evaporative loss.'
              : 'Moderate showers scattered across 14 days. Ideal for root establishment in millets, oilseeds, and pulses.'}
          </span>
        </div>

        {/* 14-Day Bar Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daily Precipitation (mm)
            </span>
            <span className="text-[10px] text-slate-400">Peak: {maxRain} mm</span>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  unit="mm"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-md border border-slate-700">
                          <p className="font-semibold text-sky-300">{item.fullDay}</p>
                          <p className="text-slate-200">
                            Rainfall: <span className="font-bold">{item.rainfall} mm</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rainfall" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rainfall >= 20 ? '#0284c7' : entry.rainfall >= 5 ? '#38bdf8' : '#cbd5e1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Meteorological Feed</span>
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {source}
        </span>
      </div>
    </div>
  );
};
