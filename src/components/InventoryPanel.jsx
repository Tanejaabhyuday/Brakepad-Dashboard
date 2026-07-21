import { useState, useEffect } from 'react';
import { X, History, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../api.js';

// ── Shared Modal Shell ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-6 py-4">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
}

// ── Material History Modal ────────────────────────────────────────────────────
function HistoryModal({ material, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMaterialHistory(material.id)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, [material.id]);

  return (
    <Modal title={`${material.name} — Stock History`} onClose={onClose}>
      <div className="mb-4 rounded-xl bg-stone-50 p-4 border border-stone-200 flex justify-between items-center">
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase">Current Stock</p>
          <p className="text-xl font-bold text-stone-900">{material.current.toLocaleString()} {material.unit}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-stone-500 uppercase">Capacity</p>
          <p className="text-xl font-bold text-stone-900">{material.percentage}%</p>
        </div>
      </div>

      <h4 className="mb-3 text-sm font-semibold text-stone-700 flex items-center gap-2">
        <History className="h-4 w-4" /> Recent Transactions
      </h4>
      
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-stone-100 animate-pulse" />)}
        </div>
      ) : history.length === 0 ? (
        <p className="text-sm text-stone-500 text-center py-6">No recent transactions found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((log) => {
            const isReceive = log.type === 'receive';
            return (
              <div key={`${log.type}-${log.id}`} className="flex items-center justify-between rounded-lg border border-stone-200 p-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isReceive ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isReceive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {isReceive ? 'Stock Received' : 'Production Deduction'}
                    </p>
                    <p className="text-xs text-stone-500">{log.logged_at} • By {log.operator}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${isReceive ? 'text-green-600' : 'text-blue-600'}`}>
                  {isReceive ? '+' : '-'}{isReceive ? log.amount : log.amount_used} {material.unit}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

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

function MaterialRow({ material, onClick }) {
  const pct    = material.percentage;
  const status = getStatus(pct);
  const config = statusConfig[status];

  return (
    <button
      onClick={() => onClick(material)}
      className="flex flex-col gap-2 rounded-lg bg-white border border-stone-200 p-4 text-left transition-colors hover:border-stone-400 hover:shadow-sm"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-stone-800">{material.name}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeBg} ${config.textColor}`}>
          {config.label}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div className={`h-full rounded-full ${config.barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-stone-400 w-full">
        <span>{material.current.toLocaleString()} / {material.max_stock.toLocaleString()} {material.unit}</span>
        <span>{pct}%</span>
      </div>
    </button>
  );
}

export default function InventoryPanel({ refreshSignal }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [selectedMat, setSelected] = useState(null);

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
          : materials.map((m) => (
              <MaterialRow key={m.id} material={m} onClick={setSelected} />
            ))
        }
      </div>
      {selectedMat && <HistoryModal material={selectedMat} onClose={() => setSelected(null)} />}
    </section>
  );
}
