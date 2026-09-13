import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle,
  CloudRain,
  Droplet,
  Leaf,
  Filter,
} from 'lucide-react';
import { AlertsData, AlertItem } from '../../types';

interface AlertsCardProps {
  data: AlertsData;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ data }) => {
  const { alerts, source } = data;
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts =
    filterSeverity === 'all'
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity);

  const getAlertVisuals = (severity: AlertItem['severity'], iconName?: string) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-50 border-rose-200 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          label: 'Critical Warning',
          icon: AlertOctagon,
          iconColor: 'text-rose-600',
        };
      case 'high':
        return {
          cardBg: 'bg-orange-50 border-orange-200 text-orange-950',
          badgeBg: 'bg-orange-600 text-white',
          label: 'High Priority',
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
        };
      case 'moderate':
        return {
          cardBg: 'bg-amber-50 border-amber-200 text-amber-950',
          badgeBg: 'bg-amber-500 text-white',
          label: 'Advisory',
          icon: Info,
          iconColor: 'text-amber-600',
        };
      case 'safe':
      default:
        return {
          cardBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          label: 'Safe Condition',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
        };
    }
  };

  const getCategoryIcon = (category?: string, defaultIcon?: any) => {
    if (category === 'rainfall') return CloudRain;
    if (category === 'groundwater') return Droplet;
    if (category === 'crop' || category === 'soil') return Leaf;
    return defaultIcon || Bell;
  };

  return (
    <div
      id="card-agricultural-alerts"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Farm Alerts & Advisories
              </h3>
              <p className="text-xs text-slate-500">Real-time risk warnings & irrigation scheduling</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
            {alerts.length} Active Notice{alerts.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          {['critical', 'high', 'moderate', 'safe'].map((sev) => {
            const count = alerts.filter((a) => a.severity === sev).length;
            if (count === 0) return null;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev} ({count})
              </button>
            );
          })}
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5 my-2">
          {filteredAlerts.map((alert, idx) => {
            const visuals = getAlertVisuals(alert.severity, alert.icon);
            const IconComp = getCategoryIcon(alert.category, visuals.icon);

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${visuals.cardBg}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/90 border border-black/5 flex items-center justify-center flex-shrink-0 ${visuals.iconColor}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs tracking-tight">{alert.type}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${visuals.badgeBg}`}
                      >
                        {visuals.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Advisory Source</span>
        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {source || 'National Agro-Advisory & IMD'}
        </span>
      </div>
    </div>
  );
};
