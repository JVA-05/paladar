// app/dashboard/platos/page.tsx

import ProtectedAdmin from '@/app/components/ProtectedAdmin/ProtectedAdmin';
import PlatosSection from '@/app/components/Secciones/PlatosSection';

export default function PlatosPage() {
  return (
    <ProtectedAdmin>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Platos</h1>
        <PlatosSection />
      </div>
    </ProtectedAdmin>
  );
}
