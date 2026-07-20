const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Materials
  getMaterials:    ()             => request('/materials'),
  getMaterial:     (id)           => request(`/materials/${id}`),

  // KPI
  getKpi:          ()             => request('/kpi'),

  // Activity
  getActivity:     (limit = 20)   => request(`/activity?limit=${limit}`),

  // Production
  getProduction:   ()             => request('/production'),
  logProduction:   (body)         => request('/production', { method: 'POST', body: JSON.stringify(body) }),

  // Receive materials
  getReceiveLogs:  ()             => request('/receive'),
  receiveMaterial: (body)         => request('/receive', { method: 'POST', body: JSON.stringify(body) }),

  // Scrap
  getScrapLogs:    ()             => request('/scrap'),
  logScrap:        (body)         => request('/scrap', { method: 'POST', body: JSON.stringify(body) }),

  // Activity — delete
  deleteActivity:  (id)           => request(`/activity/${id}`, { method: 'DELETE' }),
  clearActivity:   ()             => request('/activity', { method: 'DELETE' }),
};
