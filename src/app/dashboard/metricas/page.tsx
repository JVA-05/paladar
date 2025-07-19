'use client';

import ServerMetrics from '../ServerMetrics';

export default function MetricsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Métricas de Memoria y CPU
      </h1>
      <ServerMetrics />
    </div>
  );
}
