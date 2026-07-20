import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, PackagePlus, Trash2, X } from 'lucide-react';
import { api } from '../api.js';

// ── Shared modal shell ────────────────────────────────────────────────────────
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
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Shared field component ────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200';
const selectClass = inputClass;

// ── Log Production Modal ──────────────────────────────────────────────────────
function ProductionModal({ onClose, onSuccess }) {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ batchNumber: '', materialId: '', amountUsed: '', padsProduced: '', operator: 'A. Taneja' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { api.getMaterials().then(setMaterials); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api.logProduction({
        batchNumber:  form.batchNumber,
        materialId:   form.materialId,
        amountUsed:   parseFloat(form.amountUsed),
        padsProduced: parseInt(form.padsProduced, 10),
        operator:     form.operator,
      });
      onSuccess('Production run logged successfully.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Log Production Run" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <Field label="Batch Number">
          <input className={inputClass} placeholder="e.g. A403" value={form.batchNumber} onChange={set('batchNumber')} required />
        </Field>

        <Field label="Material Used">
          <select className={selectClass} value={form.materialId} onChange={set('materialId')} required>
            <option value="">Select a material…</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.current}{m.unit} available)</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount Used (kg)">
            <input className={inputClass} type="number" min="0.1" step="0.1" placeholder="e.g. 50" value={form.amountUsed} onChange={set('amountUsed')} required />
          </Field>
          <Field label="Pads Produced">
            <input className={inputClass} type="number" min="1" placeholder="e.g. 200" value={form.padsProduced} onChange={set('padsProduced')} required />
          </Field>
        </div>

        <Field label="Operator">
          <input className={inputClass} placeholder="Name" value={form.operator} onChange={set('operator')} required />
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={busy} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {busy ? 'Logging…' : 'Log Run'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Receive Materials Modal ───────────────────────────────────────────────────
function ReceiveModal({ onClose, onSuccess }) {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ materialId: '', amount: '', poNumber: '', operator: 'A. Taneja' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { api.getMaterials().then(setMaterials); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api.receiveMaterial({
        materialId: form.materialId,
        amount:     parseFloat(form.amount),
        poNumber:   form.poNumber,
        operator:   form.operator,
      });
      onSuccess('Materials received and stock updated.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Receive Raw Materials" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <Field label="Material">
          <select className={selectClass} value={form.materialId} onChange={set('materialId')} required>
            <option value="">Select a material…</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name} (currently {m.current}{m.unit})</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount Received (kg)">
            <input className={inputClass} type="number" min="0.1" step="0.1" placeholder="e.g. 200" value={form.amount} onChange={set('amount')} required />
          </Field>
          <Field label="PO Number (optional)">
            <input className={inputClass} placeholder="e.g. 9822" value={form.poNumber} onChange={set('poNumber')} />
          </Field>
        </div>

        <Field label="Operator">
          <input className={inputClass} placeholder="Name" value={form.operator} onChange={set('operator')} required />
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={busy} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            {busy ? 'Saving…' : 'Confirm Receipt'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Log Scrap Modal ───────────────────────────────────────────────────────────
function ScrapModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ batchNumber: '', padsScrapped: '', reason: '', operator: 'A. Taneja' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api.logScrap({
        batchNumber:  form.batchNumber,
        padsScrapped: parseInt(form.padsScrapped, 10),
        reason:       form.reason,
        operator:     form.operator,
      });
      onSuccess('Scrap event logged.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reasons = ['Delamination', 'Incorrect thickness', 'Surface crack', 'Bonding failure', 'Contamination', 'Other'];

  return (
    <Modal title="Log Scrap / Defect" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Batch Number">
            <input className={inputClass} placeholder="e.g. A403" value={form.batchNumber} onChange={set('batchNumber')} required />
          </Field>
          <Field label="Pads Scrapped">
            <input className={inputClass} type="number" min="1" placeholder="e.g. 12" value={form.padsScrapped} onChange={set('padsScrapped')} required />
          </Field>
        </div>

        <Field label="Reason">
          <select className={selectClass} value={form.reason} onChange={set('reason')} required>
            <option value="">Select a reason…</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Operator">
          <input className={inputClass} placeholder="Name" value={form.operator} onChange={set('operator')} required />
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={busy} className="flex-1 rounded-lg bg-stone-700 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
            {busy ? 'Logging…' : 'Log Scrap'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
      ✓ &nbsp;{message}
    </div>
  );
}

// ── Main QuickActions ─────────────────────────────────────────────────────────
export default function QuickActions({ onActionComplete }) {
  const [openModal, setOpenModal] = useState(null); // 'production' | 'receive' | 'scrap'
  const [toast, setToast]         = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    onActionComplete?.(); // signal parent to refresh data
  }, [onActionComplete]);

  const actions = [
    { id: 'production', label: 'Log Production Run',    description: 'Record a new batch and deduct materials', icon: ClipboardList, bg: 'bg-blue-600 hover:bg-blue-700',   text: 'text-white' },
    { id: 'receive',    label: 'Receive Raw Materials',  description: 'Log incoming deliveries to inventory',   icon: PackagePlus,   bg: 'bg-green-600 hover:bg-green-700', text: 'text-white' },
    { id: 'scrap',      label: 'Log Scrap / Defect',     description: 'Report rejected pads or defects',        icon: Trash2,        bg: 'bg-stone-200 hover:bg-stone-300', text: 'text-stone-800' },
  ];

  return (
    <>
      <section>
        <h2 className="mb-3 text-base font-semibold text-stone-800">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          {actions.map(({ id, label, description, icon: Icon, bg, text }) => (
            <button
              key={id}
              onClick={() => setOpenModal(id)}
              className={`flex w-full items-center gap-5 rounded-xl p-7 text-left transition-colors md:p-8 ${bg}`}
            >
              <Icon className={`h-8 w-8 shrink-0 md:h-9 md:w-9 ${text}`} strokeWidth={2} />
              <div className="min-w-0">
                <span className={`block text-lg font-semibold md:text-xl ${text}`}>{label}</span>
                <span className={`block text-sm md:text-base ${text} opacity-70`}>{description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {openModal === 'production' && <ProductionModal onClose={() => setOpenModal(null)} onSuccess={showToast} />}
      {openModal === 'receive'    && <ReceiveModal    onClose={() => setOpenModal(null)} onSuccess={showToast} />}
      {openModal === 'scrap'      && <ScrapModal      onClose={() => setOpenModal(null)} onSuccess={showToast} />}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
