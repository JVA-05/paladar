// components/SubcategoriasSection.tsx
"use client";

import { useEffect, useState } from "react";
import ModalCrearSubcategoria from "@/app/components/Modal/ModalCrearSubcategoria";
import ModalEditarSubcategoria from "@/app/components/Modal/ModalEditarSubcategoria";

interface Plato {
  id: number;
  nombre: string;
}

interface Subcategoria {
  id: number;
  nombre: string;
  categoriaId: number;
  categoriaNombre: string;
  platos: Plato[];
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function SubcategoriasSection() {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<Subcategoria | null>(null);

  // filtros
  const [filterName, setFilterName] = useState("");
  const [filterCatId, setFilterCatId] = useState<number | "">("");

  // obtener subcategorías
  async function obtenerSubcategorias() {
    try {
      const res = await fetch("/api/admin/platos/subcategorias");
      if (!res.ok) throw new Error();
      const { subcategorias } = await res.json();
      setSubcategorias(subcategorias);
    } catch {
      alert("Error al obtener las subcategorías.");
    }
  }

  // obtener categorías para el filtro
  async function obtenerCategorias() {
    try {
      const res = await fetch("/api/admin/platos/categorias");
      if (!res.ok) throw new Error();
      const { categorias } = await res.json();
      setCategorias(categorias);
    } catch {
      alert("Error al obtener las categorías.");
    }
  }

  useEffect(() => {
    obtenerSubcategorias();
    obtenerCategorias();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    try {
      const res = await fetch(`/api/admin/platos/subcategorias/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await obtenerSubcategorias();
    } catch {
      alert("No se pudo eliminar.");
    }
  };

  // lista filtrada
  const filtered = subcategorias.filter((s) => {
    const matchName = s.nombre
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchCat =
      filterCatId === "" ? true : s.categoriaId === filterCatId;
    return matchName && matchCat;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">
        Subcategorías
      </h2>

      {/* filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar subcategoria..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="
            px-4 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
        <select
          value={filterCatId}
          onChange={(e) =>
            setFilterCatId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="
            px-4 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* botón crear */}
        <button
        onClick={() => setCreando(true)}
        className="
         mb-6 w-48 whitespace-nowrap px-5 py-2
          bg-gradient-to-r from-violet-400 to-violet-600
          hover:from-violet-500 hover:to-violet-700
          text-white font-medium rounded-full
          shadow-lg hover:shadow-2xl
          transform hover:scale-105 active:scale-95
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-violet-500/50
          border-2 border-violet-700
        "
      >
        + Crear Subcategoría
      </button>

      {creando && (
        <ModalCrearSubcategoria
          onClose={() => setCreando(false)}
          onSaved={() => {
            setCreando(false);
            obtenerSubcategorias();
          }}
        />
      )}

      {/* listado */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filtered.map((sub) => (
          <li
            key={sub.id}
            className="
              relative z-0 hover:z-10 overflow-visible
              p-6 bg-white dark:bg-gray-800
              rounded-lg shadow-sm hover:shadow-lg
              transform hover:-translate-y-1 hover:scale-105 active:scale-100
              transition-all duration-300
              flex flex-col justify-between h-full
            "
          >
            {/* nombre + categoría */}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {sub.nombre}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white">
                Categoría: {sub.categoriaNombre}
              </p>
            </div>

            {/* popover de platos */}
            <div className="mt-4 mb-6">
              <button className="relative group px-3 py-1 bg-blue-500 text-white rounded-md">
                {sub.platos.length} platos
                <div className="absolute left-0 mt-2 w-40 bg-gray-800 text-white p-2 rounded-md shadow-lg z-50 hidden group-hover:block">
                  {sub.platos.length > 0 ? (
                    sub.platos.map((p) => (
                      <div key={p.id} className="text-sm">
                        {p.nombre}
                      </div>
                    ))
                  ) : (
                    <div className="italic">Sin platos</div>
                  )}
                </div>
              </button>
            </div>

            {/* botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditando(sub)}
                className="
                  flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700
                  text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                "
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(sub.id)}
                className="
                  flex-1 px-3 py-2 bg-red-600 hover:bg-red-700
                  text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                "
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editando && (
        <ModalEditarSubcategoria
          subcategoria={editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null);
            obtenerSubcategorias();
          }}
        />
      )}
    </div>
  );
}
