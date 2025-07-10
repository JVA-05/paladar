// src/app/components/menu/MenuPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { Categoria } from '@/types';
import MenuCategorySection from '@/app/components/menu/MenuCategorySection';

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        console.log("Datos del menú:", JSON.stringify(data, null, 2)); // 👈 Verifica aquí
        setCategorias(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMenu();
  }, []);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        console.log("Datos del menú:", JSON.stringify(data, null, 2));
        setCategorias(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []); // <-- Array de dependencias vacío para ejecutar solo al montar el componente

  if (loading) return <div className="text-center py-8">Cargando menú...</div>;

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-16">
          {categorias.map((categoria) => (
            <MenuCategorySection
              key={categoria.id}
              categoria={categoria}
            />
          ))}
        </div>
      </main>
    </div>
  );
}