import { useState, useEffect } from 'react';
import { Factory, AlertTriangle, PackageX, X, ArrowRight } from 'lucide-react';
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

// ── Alerts Modal ──────────────────────────────────────────────────────────────
function AlertsModal({ type, onClose }) {
  const [materials, setMaterials] = useState([]);
  const [scrap, setScrap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getMaterials(), api.getScrapLogs()])
      .then(([m, s]) => { setMaterials(m); setScrap(s); })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const shortages = materials.filter(m => m.percentage < 25);
  const critical = materials.filter(m => m.percentage < 10);
  const scrapToday = scrap.filter(s => new Date(s.logged_at).toDateString() === today);

  const title = type === 'shortages' ? 'Active Material Shortages' : 'Pending Alerts';

  return (
    <Modal title={title} onClose={onClose}>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-stone-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {type === 'shortages' && (
            <>
              {shortages.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-4">No materials are currently running low.</p>
              ) : (
                shortages.map(m => (
                  <div key={m.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div>
                      <p className="text-sm font-bold text-amber-900">{m.name} is Low</p>
                      <p className="text-xs text-amber-700">Only {m.percentage}% remaining ({m.current} {m.unit})</p>
                    </div>
                    <div className="rounded-full bg-amber-100 p-2 text-amber-600"><PackageX className="h-5 w-5" /></div>
                  </div>
                ))
              )}
            </>
          )}

          {type === 'alerts' && (
            <>
              {critical.length === 0 && scrapToday.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-4">No critical alerts or scrap recorded today.</p>
              )}
              {critical.map(m => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                  <div>
                    <p className="text-sm font-bold text-red-900">CRITICAL: {m.name} Empty</p>
                    <p className="text-xs text-red-700">Stock at {m.percentage}% — Immediate refill required</p>
                  </div>
                  <div className="rounded-full bg-red-100 p-2 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
                </div>
              ))}
              {scrapToday.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <div>
                    <p className="text-sm font-bold text-orange-900">Scrap Alert: Batch {s.batch_number}</p>
                    <p className="text-xs text-orange-700">{s.pads_scrapped} pads rejected ({s.reason}) by {s.operator}</p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-2 text-orange-600"><Factory className="h-5 w-5" /></div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

const iconConfig = {
  production: { icon: Factory,        iconBg: 'bg-blue-50',  iconColor: 'text-blue-600',  label: 'Total Production Today', unit: 'pads' },
  alerts:     { icon: AlertTriangle,  iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Pending Alerts',          unit: 'active' },
  shortages:  { icon: PackageX,       iconBg: 'bg-red-50',   iconColor: 'text-red-600',   label: 'Active Shortages',        unit: 'materials' },
};

export default function KPICards() {
  const [kpi, setKpi] = useState(null);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(null);

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
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ id, value, note }) => {
          const { icon: Icon, iconBg, iconColor, label, unit } = iconConfig[id];
          const isClickable = id === 'alerts' || id === 'shortages';
          const Wrapper = isClickable ? 'button' : 'div';
          return (
            <Wrapper
              key={id}
              onClick={isClickable ? () => setOpenModal(id) : undefined}
              className={`rounded-xl bg-white border border-stone-200 p-5 text-left flex flex-col justify-between ${isClickable ? 'hover:border-stone-400 hover:shadow-sm transition-all cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between w-full">
                <p className="text-sm text-stone-500 font-medium">{label}</p>
                <div className={`rounded-lg ${iconBg} p-2 flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
                </div>
              </div>
              <div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-stone-900 tabular-nums">{value}</span>
                  {value !== '—' && <span className="text-sm font-medium text-stone-400">{unit}</span>}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-stone-400">{note}</p>
                  {isClickable && <ArrowRight className="h-4 w-4 text-stone-300" />}
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
      
      {openModal && <AlertsModal type={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
}
