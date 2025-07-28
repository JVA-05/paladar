// src/app/components/LeafletMap.tsx
'use client';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function LeafletMap({ center, zoom }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Añade aquí más capas o marcadores */}
    </MapContainer>
  );
}

// src/app/page.tsx
import dynamic from 'next/dynamic';
import Navbar from '@/app/components/ui/Navbar';
const DynamicMap = dynamic(() => import('@/app/components/mapa/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse">
      {/* Placeholder mientras carga */}
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* El mapa se inyecta tras el primer render */}
        <DynamicMap center={[23.049, -81.440]} zoom={13} />
      </main>
    </>
  );
}
