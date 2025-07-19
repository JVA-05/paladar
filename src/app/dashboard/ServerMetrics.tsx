// app/dashboard/ServerMetrics.tsx
'use client';

import { useEffect, useState } from 'react';

type Metrics = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  loadAvg: number[];
  cpuCount: number;
};

export default function ServerMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 'use client';
useEffect(() => {
  const es = new EventSource('/api/metrics-stream'); // <— aquí

  es.onopen = () => console.log('SSE conectado');
  es.onmessage = (e) => {
    try {
      setMetrics(JSON.parse(e.data));
    } catch (err) {
      console.error('JSON SSE:', err);
    }
  };
  es.onerror = (err) => {
    console.error('SSE error', err);
    setError('No se conectó al stream');
    es.close();
  };
  return () => es.close();
}, []);


  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!metrics) return <p>Cargando métricas…</p>;

  const toMB = (b: number) => (b / 1024 / 1024).toFixed(2);

  return (
    <table className="w-full table-auto border">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Métrica</th>
          <th className="px-4 py-2 text-left">Valor</th>
        </tr>
      </thead>
      <tbody>
        {[
          ['RSS', `${toMB(metrics.rss)} MB`],
          ['Heap Total', `${toMB(metrics.heapTotal)} MB`],
          ['Heap Used', `${toMB(metrics.heapUsed)} MB`],
          ['External', `${toMB(metrics.external)} MB`],
          ['Load Avg (1m)', metrics.loadAvg[0].toFixed(2)],
          ['CPU Cores', metrics.cpuCount.toString()],
        ].map(([label, val], i) => (
          <tr key={label} className={i % 2 ? 'bg-gray-50' : ''}>
            <td className="px-4 py-2">{label}</td>
            <td className="px-4 py-2">{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
