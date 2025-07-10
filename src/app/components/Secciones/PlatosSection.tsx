// components/PlatosSection.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import ModalCrearPlato from "@/app/components/Modal/ModalCrearPlato";
import ModalEditarPlato from "@/app/components/Modal/ModalEditarPlato";

interface Plato {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  subcategoriaId?: number;
  categoriaId?: number;
}

interface Subcategoria {
  id: number;
  nombre: string;
}

export default function PlatosSection() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [subcats, setSubcats] = useState<Subcategoria[]>([]);
  const [catsDir, setCatsDir] = useState<Subcategoria[]>([]);
  const [showCompletas, setShowCompletas] = useState(false);
  const [filtroSub, setFiltroSub] = useState<number | "">("");
  const [search, setSearch] = useState<string>("");
  const [creando, setCreando] = useState(false);
  const [platoEditando, setPlatoEditando] = useState<Plato | null>(null);

  // Carga inicial
  useEffect(() => {
    obtenerPlatos();

    fetch("/api/admin/platos/subcategorias")
      .then((res) => res.json())
      .then((d) => setSubcats(d.subcategorias))
      .catch(console.error);

    fetch("/api/admin/platos/categorias/directas")
      .then((res) => res.json())
      .then((d) => setCatsDir(d.categorias))
      .catch(console.error);
  }, []);

  const obtenerPlatos = () =>
    fetch("/api/admin/platos")
      .then((res) => res.json())
      .then((d) => setPlatos(d.platos))
      .catch(console.error);

  // Filtrado combinado
  const platosFiltrados = useMemo(() => {
    return platos
      .filter((p) => {
        if (showCompletas) return p.categoriaId != null;
        if (filtroSub !== "") return p.subcategoriaId === filtroSub;
        return true;
      })
      .filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
  }, [platos, filtroSub, search, showCompletas]);

  // Eliminar plato
  const handleEliminarPlato = async (id: number) => {
    if (!confirm("¿Eliminar este plato?")) return;
    await fetch(`/api/admin/platos/${id}`, {
      method: "DELETE",
      // opcional, si tu auth-token está en cookie HttpOnly:
      credentials: "same-origin",
    });
    obtenerPlatos();
  };

  // ID de la categoría “Completa”
  const completaId = catsDir[0]?.id ?? 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Platos</h2>

      {/* Filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar plato..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filtroSub}
          onChange={(e) => {
            setFiltroSub(e.target.value === "" ? "" : Number(e.target.value));
            setShowCompletas(false);
          }}
          className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas las subcategorías</option>
          {subcats.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setShowCompletas((v) => !v);
            setFiltroSub("");
          }}
          className={`px-4 py-2 rounded ${
            showCompletas
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {showCompletas ? "Ver Todos" : "Ver Completas"}
        </button>
      </div>

      {/* Crear */}
      <button
        onClick={() => setCreando(true)}
        className="mb-6 w-48 px-5 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full shadow hover:scale-105 transition"
      >
        + Crear nuevo plato
      </button>

      {creando && (
        <ModalCrearPlato
          subcategorias={subcats}
          completaId={completaId}
          onClose={() => setCreando(false)}
          onSaved={() => {
            setCreando(false);
            obtenerPlatos();
          }}
        />
      )}

      {platoEditando && (
        <ModalEditarPlato
          plato={platoEditando}
          subcategorias={subcats}
          completaId={completaId}
          onClose={() => setPlatoEditando(null)}
          onSaved={() => {
            setPlatoEditando(null);
            obtenerPlatos();
          }}
        />
      )}

      {/* Listado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {platosFiltrados.map((plato) => (
          <div
            key={plato.id}
            className="p-4 border rounded shadow hover:shadow-lg transform hover:scale-105 transition"
          >
            {plato.imagen ? (
              <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
                <Image
                  src={plato.imagen}
                  alt={plato.nombre}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-200 mb-2 rounded flex items-center justify-center">
                Sin Imagen
              </div>
            )}

            <h3 className="text-xl font-semibold">{plato.nombre}</h3>
            <p className="text-gray-700">
              Precio: ${plato.precio.toFixed(2)}
            </p>
            {plato.descripcion && (
              <p className="text-gray-600">{plato.descripcion}</p>
            )}

            <div className="mt-auto flex gap-2">
              <button
                onClick={() => setPlatoEditando(plato)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarPlato(plato.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
