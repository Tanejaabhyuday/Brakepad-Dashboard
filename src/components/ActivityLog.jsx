import { useState, useEffect, useCallback } from 'react';
import { Trash2, Eraser } from 'lucide-react';
import { api } from '../api.js';

const actionStyles = {
  'Production Logged': { dot: 'bg-blue-500',  text: 'text-blue-700',  bg: 'bg-blue-50'  },
  'Stock Received':    { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  'Scrap Logged':      { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  'Low Stock Alert':   { dot: 'bg-red-500',   text: 'text-red-700',   bg: 'bg-red-50'   },
};
const fallback = { dot: 'bg-stone-400', text: 'text-stone-600', bg: 'bg-stone-100' };

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-sm font-medium text-stone-700">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActivityLog({ refreshSignal, onActionComplete }) {
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [deleting, setDeleting] = useState(null);   // id being deleted, or 'all'
  const [confirm, setConfirm]   = useState(null);   // { type: 'one'|'all', id? }

  const load = useCallback(() => {
    setLoading(true);
    api.getActivity(50)
      .then((data) => { setLogs(data); setError(null); })
      .catch((e)   => setError(e.message))
      .finally(()  => setLoading(false));
  }, []);

  useEffect(load, [load, refreshSignal]);

  // Delete single entry
  async function handleDeleteOne(id) {
    setDeleting(id);
    setConfirm(null);
    try {
      await api.deleteActivity(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      onActionComplete?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  // Clear all logs
  async function handleClearAll() {
    setDeleting('all');
    setConfirm(null);
    try {
      await api.clearActivity();
      setLogs([]);
      onActionComplete?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting('all');
      setDeleting(null);
    }
  }

  return (
    <>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-stone-800">Activity Log</h2>
            <span className="text-xs text-stone-400">{logs.length} entries</span>
          </div>
          {logs.length > 0 && (
            <button
              onClick={() => setConfirm({ type: 'all' })}
              disabled={deleting === 'all'}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-stone-100">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-stone-200 animate-pulse" style={{ width: j === 2 ? '80%' : '55%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : logs.length === 0
                ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-stone-400 text-sm">
                        No activity yet. Use the Quick Actions to get started.
                      </td>
                    </tr>
                  )
                : logs.map((log, i) => {
                    const style    = actionStyles[log.action] || fallback;
                    const isDeleting = deleting === log.id;
                    return (
                      <tr
                        key={log.id}
                        className={`border-b border-stone-100 last:border-0 transition-opacity ${isDeleting ? 'opacity-40' : ''} ${i % 2 === 0 ? '' : 'bg-stone-50/50'}`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-stone-400">
                          {log.logged_at}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-700">{log.detail}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-600">{log.operator}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setConfirm({ type: 'one', id: log.id })}
                            disabled={!!deleting}
                            className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="flex flex-col gap-2.5 md:hidden">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-stone-200 animate-pulse" />
              ))
            : logs.length === 0
            ? <p className="py-6 text-center text-sm text-stone-400">No activity yet.</p>
            : logs.map((log) => {
                const style = actionStyles[log.action] || fallback;
                const isDeleting = deleting === log.id;
                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-3.5 transition-opacity ${isDeleting ? 'opacity-40' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {log.action}
                        </span>
                        <span className="text-xs tabular-nums text-stone-400">{log.logged_at}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-stone-700">{log.detail}</p>
                      <p className="mt-0.5 text-xs text-stone-400">By {log.operator}</p>
                    </div>
                    <button
                      onClick={() => setConfirm({ type: 'one', id: log.id })}
                      disabled={!!deleting}
                      className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
        </div>
      </section>

      {/* Confirm modals */}
      {confirm?.type === 'one' && (
        <ConfirmModal
          message="Delete this log entry? This cannot be undone."
          onConfirm={() => handleDeleteOne(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'all' && (
        <ConfirmModal
          message={`Clear all ${logs.length} log entries? This cannot be undone.`}
          onConfirm={handleClearAll}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
