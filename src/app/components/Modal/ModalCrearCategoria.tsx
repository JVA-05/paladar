// components/Modal/ModalCrearCategoria.tsx
"use client";

import { useState, FormEvent } from "react";
import { apiFetch } from "@/lib/apiClient";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ModalCrearCategoria({ onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    try {
      await apiFetch("/api/admin/categorias", {
        method: "POST",
        body: JSON.stringify({ nombre: nombre.trim() }),
      });

      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error creando categoría:", err);
      setError(err.message || "Error desconocido");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-sm"
      >
        <h3 className="text-xl font-bold mb-4">Crear Categoría</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-4">
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
          />
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
