// app/dashboard/subcategorias/page.tsx

import SubcategoriasSection from '@/app/components/Secciones/SubcategoriasSection';

export default function SubcategoriasPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Gestión de Subcategorías
      </h1>
      <SubcategoriasSection />
    </div>
  );
}
