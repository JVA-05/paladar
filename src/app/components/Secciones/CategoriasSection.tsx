// components/CategoriasSection.tsx
"use client";

import { useEffect, useState } from "react";
import ModalCrearCategoria from "@/app/components/Modal/ModalCrearCategoria";
import ModalEditarCategoria from "@/app/components/Modal/ModalEditarCategoria";

interface Categoria {
  id: number;
  nombre: string;
}

export default function CategoriasSection() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [filterName, setFilterName] = useState("");

  // Carga todas las categorías
  const obtenerCategorias = async () => {
    try {
      const res = await fetch("/api/admin/platos/categorias");
      if (!res.ok) throw new Error();
      const { categorias } = await res.json();
      setCategorias(categorias);
    } catch {
      alert("Error al obtener las categorías.");
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // Detecta si ya existe la categoría “Completas”
  const existeCompletas = categorias.some((c) => c.nombre === "Completas");

  // Crear la categoría “Completas” si no existe
  const crearCompletas = async () => {
    try {
      const res = await fetch("/api/admin/platos/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Completas" }),
      });
      if (!res.ok) throw new Error();
      obtenerCategorias();
    } catch {
      alert("No se pudo crear la categoría ‘Completas’.");
    }
  };

  // Eliminar cualquier categoría
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      const res = await fetch(`/api/admin/platos/categorias/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      obtenerCategorias();
    } catch {
      alert("No se pudo eliminar la categoría.");
    }
  };

  // Filtra por nombre
  const filtered = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div>
      <h2
        className="
          text-3xl font-extrabold
          text-transparent bg-clip-text
          bg-gradient-to-r text-black
          mb-6
        "
      >
        Categorías
      </h2>

      {/* Filtro por nombre */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar categoría…"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="
            px-4 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
      </div>

      {/* Botones de Crear */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => setCreando(true)}
          className="
            w-48 px-5 py-2
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
          + Crear Categoría
        </button>

        {!existeCompletas && (
          <button
            onClick={crearCompletas}
            className="
              w-48 px-5 py-2
              bg-gradient-to-r from-yellow-500 to-yellow-700
              hover:from-yellow-600 hover:to-yellow-800
              text-white font-medium rounded-full
              shadow-lg hover:shadow-2xl
              transform hover:scale-105 active:scale-95
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-yellow-500/50
              border-2 border-yellow-700
            "
          >
            + Crear “Completas”
          </button>
        )}
      </div>

      {creando && (
        <ModalCrearCategoria
          onClose={() => setCreando(false)}
          onSaved={() => {
            setCreando(false);
            obtenerCategorias();
          }}
        />
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filtered.map((cat) => (
          <li
            key={cat.id}
            className="
              relative z-0 hover:z-10 overflow-visible
              p-6 bg-white dark:bg-gray-800
              rounded-lg shadow-sm hover:shadow-lg
              transform hover:-translate-y-1 hover:scale-105 active:scale-100
              transition-all duration-300
              flex flex-col justify-between h-full
            "
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {cat.nombre}
            </h3>

            <div className="flex gap-3">
              <button
                onClick={() => setEditando(cat)}
                className="
                  flex-1 px-3 py-2 bg-blue-600 text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                  hover:bg-blue-700
                "
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(cat.id)}
                className="
                  flex-1 px-3 py-2 bg-red-600 text-white font-medium rounded-md
                  shadow-sm hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200 ease-in-out
                  hover:bg-red-700
                "
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editando && (
        <ModalEditarCategoria
          categoria={editando}
          onClose={() => setEditando(null)}
          onSaved={() => {
            setEditando(null);
            obtenerCategorias();
          }}
        />
      )}
    </div>
  );
}
