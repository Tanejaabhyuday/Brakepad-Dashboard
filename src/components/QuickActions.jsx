import { ClipboardList, PackagePlus, Trash2 } from 'lucide-react';

const actions = [
  {
    id: 'log-production',
    label: 'Log Production Run',
    description: 'Record a new batch and deduct materials',
    icon: ClipboardList,
    bg: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-white',
  },
  {
    id: 'receive-materials',
    label: 'Receive Raw Materials',
    description: 'Log incoming deliveries to inventory',
    icon: PackagePlus,
    bg: 'bg-green-600 hover:bg-green-700',
    text: 'text-white',
  },
  {
    id: 'log-scrap',
    label: 'Log Scrap / Defect',
    description: 'Report rejected pads or defects',
    icon: Trash2,
    bg: 'bg-stone-200 hover:bg-stone-300',
    text: 'text-stone-800',
  },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-stone-800">Quick Actions</h2>
      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`flex w-full items-center gap-5 rounded-xl p-7 text-left transition-colors md:p-8 ${action.bg}`}
            >
              <Icon className={`h-8 w-8 shrink-0 md:h-9 md:w-9 ${action.text}`} strokeWidth={2} />
              <div className="min-w-0">
                <span className={`block text-lg font-semibold md:text-xl ${action.text}`}>
                  {action.label}
                </span>
                <span className={`block text-sm md:text-base ${action.text} opacity-70`}>
                  {action.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
