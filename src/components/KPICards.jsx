import { Factory, AlertTriangle, PackageX } from 'lucide-react';

const kpiData = [
  {
    id: 'production',
    label: 'Total Production Today',
    value: '1,248',
    unit: 'pads',
    note: '+12% vs yesterday',
    icon: Factory,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'alerts',
    label: 'Pending Alerts',
    value: '3',
    unit: 'active',
    note: '+1 since last hour',
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'shortages',
    label: 'Active Shortages',
    value: '2',
    unit: 'materials',
    note: 'Action needed',
    icon: PackageX,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="rounded-xl bg-white border border-stone-200 p-5"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-stone-500">{kpi.label}</p>
              <div className={`rounded-lg ${kpi.iconBg} p-2`}>
                <Icon className={`h-4 w-4 ${kpi.iconColor}`} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-stone-900 tabular-nums">{kpi.value}</span>
              <span className="text-sm text-stone-400">{kpi.unit}</span>
            </div>
            <p className="mt-1 text-xs text-stone-400">{kpi.note}</p>
          </div>
        );
      })}
    </div>
  );
}
