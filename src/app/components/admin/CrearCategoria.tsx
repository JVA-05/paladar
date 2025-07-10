// Ejemplo básico de CrearCategoria.tsx
'use client';
import { useState } from 'react';

interface CrearCategoriaProps {
  onUpdate: () => void;
  onClose: () => void;
}

export default function CrearCategoria({ onUpdate, onClose }: CrearCategoriaProps) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Debes ingresar un nombre para la categoría.');
      return;
    }
    try {
      // Llama al endpoint para crear categorías
      const response = await fetch('/api/admin/platos/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al crear la categoría');
      alert('Categoría creada exitosamente.');
      onUpdate(); 
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      alert(err.message || 'Error desconocido');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Crear Nueva Categoría</h3>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Nombre de la Categoría</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
