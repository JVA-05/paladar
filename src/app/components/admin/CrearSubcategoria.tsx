'use client';
import { useEffect, useState } from 'react';

interface Categoria {
  id: number;
  nombre: string;
}

interface CrearSubcategoriaProps {
  onUpdate: () => void; // Función para refrescar la lista de subcategorías o categorías en el componente padre
  onClose: () => void;  // Función para cerrar el modal o formulario
}

export default function CrearSubcategoria({ onUpdate, onClose }: CrearSubcategoriaProps) {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Obtener la lista de categorías para el dropdown
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoriaId === '') {
      alert('Debes seleccionar una categoría.');
      return;
    }
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          categoriaId
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al crear la subcategoría');
      alert('Subcategoría creada exitosamente.');
      onUpdate(); // Actualiza la lista en el componente padre
      onClose();   // Cierra el modal o formulario
    } catch (error: any) {
      alert(error.message || 'Error desconocido');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Crear Nueva Subcategoría</h3>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Nombre de la Subcategoría</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
