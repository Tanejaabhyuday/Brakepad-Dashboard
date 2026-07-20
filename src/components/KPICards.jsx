import { useState, useEffect } from 'react';
import { Factory, AlertTriangle, PackageX } from 'lucide-react';
import { api } from '../api.js';

const iconConfig = {
  production: { icon: Factory,        iconBg: 'bg-blue-50',  iconColor: 'text-blue-600',  label: 'Total Production Today', unit: 'pads' },
  alerts:     { icon: AlertTriangle,  iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Pending Alerts',          unit: 'active' },
  shortages:  { icon: PackageX,       iconBg: 'bg-red-50',   iconColor: 'text-red-600',   label: 'Active Shortages',        unit: 'materials' },
};

export default function KPICards() {
  const [kpi, setKpi] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getKpi()
      .then(setKpi)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load KPIs: {error}
      </div>
    );
  }

  const cards = kpi
    ? [
        { id: 'production', value: kpi.totalProduction.toLocaleString(), note: 'Pads produced today' },
        { id: 'alerts',     value: String(kpi.pendingAlerts),            note: 'Scrap events + critical stock' },
        { id: 'shortages',  value: String(kpi.activeShortages),          note: 'Materials below 25% stock' },
      ]
    : [
        { id: 'production', value: '—', note: '' },
        { id: 'alerts',     value: '—', note: '' },
        { id: 'shortages',  value: '—', note: '' },
      ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ id, value, note }) => {
        const { icon: Icon, iconBg, iconColor, label, unit } = iconConfig[id];
        return (
          <div key={id} className="rounded-xl bg-white border border-stone-200 p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm text-stone-500">{label}</p>
              <div className={`rounded-lg ${iconBg} p-2`}>
                <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-stone-900 tabular-nums">{value}</span>
              {value !== '—' && <span className="text-sm text-stone-400">{unit}</span>}
            </div>
            <p className="mt-1 text-xs text-stone-400">{note}</p>
          </div>
        );
      })}
    </div>
  );
}
