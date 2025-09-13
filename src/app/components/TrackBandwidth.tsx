// components/TrackBandwidth.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrackBandwidth() {
  console.log('🏷 TrackBandwidth MONTADO', window.location.href);
  const path = usePathname();

  useEffect(() => {
    const send = () => {
      // Mide todos los recursos + navegación
      const resources = performance.getEntriesByType('resource');
      const nav = performance.getEntriesByType('navigation')[0];
      let total = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      if (nav) total += nav.transferSize || 0;

      // URL base configurable vía variable de entorno
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL  
        || 'http://localhost:3001';

      fetch(`${BACKEND_URL}/api/track-bandwidth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bytes: total, path, timestamp: Date.now() })
      }).catch(() => {});

      performance.clearResourceTimings();
    };

    window.addEventListener('load', send);
    return () => window.removeEventListener('load', send);
  }, [path]);

  return null;
}
