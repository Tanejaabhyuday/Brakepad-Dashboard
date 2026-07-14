import { rawMaterials, getStockStatus, getStatusLabel } from '../data/mockData';

const statusConfig = {
  good: {
    barColor: 'bg-green-500',
    textColor: 'text-green-700',
    badgeBg: 'bg-green-100',
    label: 'In Stock',
  },
  warning: {
    barColor: 'bg-amber-400',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    label: 'Low',
  },
  critical: {
    barColor: 'bg-red-500',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-100',
    label: 'Critical',
  },
};

function MaterialRow({ material }) {
  const percentage = material.percentage;
  const status = getStockStatus(percentage);
  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white border border-stone-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-800">{material.name}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeBg} ${config.textColor}`}>
          {config.label}
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full ${config.barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{material.current.toLocaleString()} / {material.max.toLocaleString()} {material.unit}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}

export default function InventoryPanel() {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-stone-800">Raw Material Inventory</h2>
      <div className="grid grid-cols-1 gap-2.5">
        {rawMaterials.map((material) => (
          <MaterialRow key={material.id} material={material} />
        ))}
      </div>
    </section>
  );
}
