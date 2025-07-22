// components/Modal/ModalCrearSubcategoria.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { apiFetch } from "@/lib/apiClient";

interface Categoria {
  id: number;
  nombre: string;
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ModalCrearSubcategoria({ onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Carga categorías para el select usando apiFetch
  useEffect(() => {
    apiFetch("/api/admin/categorias")
      .then(res => {
        setCategorias(res.categorias || []);
      })
      .catch(err => {
        console.error("Error cargando categorías:", err);
        setError("No se pudieron cargar las categorías");
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || categoriaId === "") {
      setError("Nombre y categoría son requeridos");
      return;
    }

    try {
      await apiFetch("/api/admin/subcategorias", {
        method: "POST",
        body: JSON.stringify({
          nombre: nombre.trim(),
          categoriaId,
        }),
      });
      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error creando subcategoría:", err);
      setError(err.message || "Error desconocido");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-sm"
      >
        <h3 className="text-xl font-bold mb-4">Crear Subcategoría</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-2">
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
        </label>

        <label className="block mb-4">
          Categoría Padre
          <select
            value={categoriaId}
            onChange={e =>
              setCategoriaId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">Seleccione categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
