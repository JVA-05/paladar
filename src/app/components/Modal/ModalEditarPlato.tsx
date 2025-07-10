// components/ModalEditarPlato.tsx
"use client";
import React, { useState } from "react";

interface Plato {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string | null;
  subcategoriaId?: number;
  categoriaId?: number;
}

interface Subcategoria {
  id: number;
  nombre: string;
}

interface ModalEditarPlatoProps {
  plato: Plato;
  subcategorias: Subcategoria[];
  completaId: number;    // ID de la única categoría “Completa”
  onClose: () => void;
  onSaved: () => void;
}

export default function ModalEditarPlato({
  plato,
  subcategorias,
  completaId,
  onClose,
  onSaved,
}: ModalEditarPlatoProps) {
  const [nombre, setNombre] = useState(plato.nombre);
  const [precio, setPrecio] = useState<number | "">(plato.precio);
  const [descripcion, setDescripcion] = useState(plato.descripcion || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Inicializa isCompleta según si plato.categoriaId existe
  const [isCompleta, setIsCompleta] = useState(!!plato.categoriaId);
  const [subcategoriaId, setSubcategoriaId] = useState(
    plato.subcategoriaId?.toString() || ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !precio || Number(precio) <= 0) {
      setError("Nombre y precio válidos son obligatorios.");
      return;
    }
    if (!isCompleta && !subcategoriaId) {
      setError("Selecciona una subcategoría o marca como Completa.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("precio", String(precio));
      formData.append("descripcion", descripcion.trim());

      if (isCompleta) {
        formData.append("categoriaId", String(completaId));
      } else {
        formData.append("subcategoriaId", subcategoriaId);
      }

      if (imageFile) {
        formData.append("imagen", imageFile);
      }

      const res = await fetch(`/api/admin/platos/${plato.id}`, {
           method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al actualizar el plato.");
      } else {
        onSaved();
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Editar Plato</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block mb-1">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          {/* Checkbox “Completa” */}
          <div className="flex items-center gap-2">
            <input
              id="edit-completa"
              type="checkbox"
              checked={isCompleta}
              onChange={() => {
                setIsCompleta((v) => !v);
                if (!isCompleta) setSubcategoriaId("");
              }}
              className="h-4 w-4"
            />
            <label htmlFor="edit-completa" className="select-none">
              Marcar como “Completa”
            </label>
          </div>

          {/* Selector Subcategoría */}
          <div>
            <label className="block mb-1">Subcategoría</label>
            <select
              value={subcategoriaId}
              onChange={(e) => setSubcategoriaId(e.target.value)}
              disabled={isCompleta}
              className="w-full p-2 border rounded disabled:bg-gray-100"
            >
              <option value="">— Selecciona —</option>
              {subcategorias.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen */}
          <div>
            <label className="block mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Vista previa"
                className="mt-2 max-h-40 rounded"
              />
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
