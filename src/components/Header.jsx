import { useState, useEffect } from 'react';
import { Disc3, User } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="bg-white border-b border-stone-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800">
            <Disc3 className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-900">BrakePad Hub</h1>
            <p className="text-xs text-stone-400">Plant Dashboard</p>
          </div>
        </div>

        {/* Time */}
        <p className="hidden text-sm text-stone-500 tabular-nums md:block">
          {formattedTime} &nbsp;·&nbsp; {formattedDate}
        </p>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100">
            <User className="h-4 w-4 text-stone-500" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-stone-800">Abhyuday Taneja</p>
            <p className="text-xs text-stone-400">Shift 1 Operator</p>
          </div>
        </div>

      </div>
    </header>
  );
}
