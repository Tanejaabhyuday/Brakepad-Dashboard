import Header from './components/Header';
import KPICards from './components/KPICards';
import InventoryPanel from './components/InventoryPanel';
import QuickActions from './components/QuickActions';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
          <InventoryPanel />
          <QuickActions />
        </div>
      </main>

      <footer className="mt-12 border-t border-stone-200 bg-white px-6 py-4 text-center">
        <p className="text-xs text-stone-400">
          BrakePad Hub · © 2026 Abhyuday Taneja
        </p>
      </footer>
    </div>
  );
}
