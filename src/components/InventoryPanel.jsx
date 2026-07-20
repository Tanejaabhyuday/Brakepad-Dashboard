import { useState, useEffect } from 'react';
import { api } from '../api.js';

const statusConfig = {
  good:     { barColor: 'bg-green-500', textColor: 'text-green-700', badgeBg: 'bg-green-100',  label: 'In Stock' },
  warning:  { barColor: 'bg-amber-400', textColor: 'text-amber-700', badgeBg: 'bg-amber-100',  label: 'Low'      },
  critical: { barColor: 'bg-red-500',   textColor: 'text-red-700',   badgeBg: 'bg-red-100',    label: 'Critical' },
};

function getStatus(pct) {
  if (pct < 10)  return 'critical';
  if (pct < 25)  return 'warning';
  return 'good';
}

function MaterialRow({ material }) {
  const pct    = material.percentage;
  const status = getStatus(pct);
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
        <div className={`h-full rounded-full ${config.barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>{material.current.toLocaleString()} / {material.max_stock.toLocaleString()} {material.unit}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

export default function InventoryPanel({ refreshSignal }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getMaterials()
      .then((data) => { setMaterials(data); setError(null); })
      .catch((e)   => setError(e.message))
      .finally(()  => setLoading(false));
  }, [refreshSignal]);

  if (error) {
    return (
      <section>
        <h2 className="mb-3 text-base font-semibold text-stone-800">Raw Material Inventory</h2>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load inventory: {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-stone-800">Raw Material Inventory</h2>
      <div className="grid grid-cols-1 gap-2.5">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-stone-200 animate-pulse" />
            ))
          : materials.map((m) => <MaterialRow key={m.id} material={m} />)
        }
      </div>
    </section>
  );
}
