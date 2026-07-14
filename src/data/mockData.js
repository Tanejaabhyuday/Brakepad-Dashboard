// Mock data for the BrakePad Hub dashboard

export const rawMaterials = [
  {
    id: 'resin',
    name: 'Resin',
    unit: 'kg',
    current: 820,
    max: 1000,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '07:15 AM',
  },
  {
    id: 'steel-wool',
    name: 'Steel Wool',
    unit: 'kg',
    current: 640,
    max: 800,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '06:50 AM',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    unit: 'kg',
    current: 450,
    max: 600,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '07:00 AM',
  },
  {
    id: 'silica',
    name: 'Silica',
    unit: 'kg',
    current: 110,
    max: 500,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '06:30 AM',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    unit: 'kg',
    current: 380,
    max: 500,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '07:10 AM',
  },
  {
    id: 'aluminum-oxide',
    name: 'Aluminum Oxide',
    unit: 'kg',
    current: 35,
    max: 400,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '05:45 AM',
  },
  {
    id: 'fibers',
    name: 'Fibers',
    unit: 'kg',
    current: 520,
    max: 700,
    get percentage() { return Math.round((this.current / this.max) * 100); },
    lastUpdated: '07:05 AM',
  },
];

export const recentActivity = [
  {
    id: 1,
    time: '10:30 AM',
    action: 'Production Logged',
    detail: 'Deducted 50kg Steel Wool — Batch #A402',
    user: 'A. Taneja',
  },
  {
    id: 2,
    time: '10:15 AM',
    action: 'Stock Received',
    detail: 'Received 200kg Resin — PO #9821',
    user: 'M. Patel',
  },
  {
    id: 3,
    time: '09:45 AM',
    action: 'Scrap Logged',
    detail: '12 pads rejected — Batch #A401 (delamination)',
    user: 'K. Singh',
  },
  {
    id: 4,
    time: '09:20 AM',
    action: 'Production Logged',
    detail: 'Deducted 30kg Graphite — Batch #A400',
    user: 'A. Taneja',
  },
  {
    id: 5,
    time: '08:50 AM',
    action: 'Low Stock Alert',
    detail: 'Aluminum Oxide below 10% — Reorder triggered',
    user: 'System',
  },
];

export function getStockStatus(percentage) {
  if (percentage < 10) return 'critical';
  if (percentage < 25) return 'warning';
  return 'good';
}

export function getStatusLabel(status) {
  switch (status) {
    case 'critical': return 'CRITICAL LOW';
    case 'warning': return 'WARNING';
    default: return 'IN STOCK';
  }
}
