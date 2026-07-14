import { recentActivity } from '../data/mockData';
import { ArrowDownUp } from 'lucide-react';

const actionStyles = {
  'Production Logged': {
    dot: 'bg-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  'Stock Received': {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  'Scrap Logged': {
    dot: 'bg-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  'Low Stock Alert': {
    dot: 'bg-red-500',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
  },
};

export default function ActivityFeed() {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-white md:text-xl">
          Recent Activity
        </h2>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface-800 px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-300">
          <ArrowDownUp className="h-3.5 w-3.5" />
          Latest First
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-surface-900/60 md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-surface-800/40">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Time
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Material / Batch
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, index) => {
                const style = actionStyles[item.action] || actionStyles['Production Logged'];
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-800/50 transition-colors hover:bg-surface-800/40 ${
                      index === recentActivity.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold tabular-nums text-slate-300">
                      {item.time}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full ${style.bg} px-3 py-1 text-xs font-bold ${style.text}`}>
                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        {item.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-300">
                      {item.detail}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-400">
                      {item.user}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {recentActivity.map((item) => {
          const style = actionStyles[item.action] || actionStyles['Production Logged'];
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-surface-900/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} px-2.5 py-1 text-[10px] font-bold ${style.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {item.action}
                </span>
                <span className="text-xs font-semibold tabular-nums text-slate-500">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-300">
                {item.detail}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {item.user}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
