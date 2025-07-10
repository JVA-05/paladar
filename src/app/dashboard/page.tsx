// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import ProtectedAdmin from '@/app/components/ProtectedAdmin/ProtectedAdmin';
import PlatosSection from "@/app/components/Secciones/PlatosSection";
import SubcategoriasSection from "@/app/components/Secciones/SubcategoriasSection";
import CategoriasSection from "@/app/components/Secciones/CategoriasSection";

export default function Dashboard() {
  // Estado que controla la sección activa: "platos", "subcategorias" o "categorias"
  const [activeSection, setActiveSection] = useState<"platos" | "subcategorias" | "categorias">("platos");

  return (
    <ProtectedAdmin>
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveSection("platos")}
          className={`px-4 py-2 rounded-lg ${activeSection === "platos" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Platos
        </button>
        <button
          onClick={() => setActiveSection("subcategorias")}
          className={`px-4 py-2 rounded-lg ${activeSection === "subcategorias" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Subcategorías
        </button>
        <button
          onClick={() => setActiveSection("categorias")}
          className={`px-4 py-2 rounded-lg ${activeSection === "categorias" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Categorías
        </button>
      </div>

      {/* Renderizamos la sección activa */}
      {activeSection === "platos" && <PlatosSection />}
      {activeSection === "subcategorias" && <SubcategoriasSection />}
      {activeSection === "categorias" && <CategoriasSection />}
    </div>
    </ProtectedAdmin>
  );
}
