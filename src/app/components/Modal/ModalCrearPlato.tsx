// components/ModalCrearPlato.tsx
"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/apiClient";

interface Subcategoria {
  id: number;
  nombre: string;
}

interface ModalCrearPlatoProps {
  subcategorias: Subcategoria[];
  completaId: number;       // ID de la única categoría “Completa”
  onClose: () => void;
  onSaved: () => void;
}

export default function ModalCrearPlato({
  subcategorias,
  completaId,
  onClose,
  onSaved,
}: ModalCrearPlatoProps) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState<string>("");
  const [isCompleta, setIsCompleta] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar campos
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
      if (imageFile) formData.append("imagen", imageFile);

      // Llamada al backend usando apiFetch (incluye API_URL y credentials)
      await apiFetch("/api/admin/platos", {
        method: "POST",
        body: formData,
      });

      onSaved();
    } catch (err: any) {
      setError(err.message || "Error al crear el plato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Crear Nuevo Plato</h3>
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

          {/* Toggle “Completa” */}
          <div className="flex items-center gap-2">
            <input
              id="completa"
              type="checkbox"
              checked={isCompleta}
              onChange={() => {
                setIsCompleta((v) => !v);
                setSubcategoriaId("");
              }}
              className="h-4 w-4"
            />
            <label htmlFor="completa" className="select-none">
              Marca como “Completa”
            </label>
          </div>

          {/* Selector de Subcategoría */}
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
