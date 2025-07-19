// app/dashboard/categorias/page.tsx

import CategoriasSection from '@/app/components/Secciones/CategoriasSection';

export default function CategoriasPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Gestión de Categorías
      </h1>
      <CategoriasSection />
    </div>
  );
}
