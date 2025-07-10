// components/LogoutButton.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Llamar al endpoint de logout (si tienes lógica del lado servidor)
    await fetch('/api/auth/logout', { method: 'POST' });
    // Actualizar el estado global mediante el context
    logout();
    // Redirigir al usuario
    router.replace('/auth/login'); 
  };

  return (
    <button
      onClick={handleLogout}
      className="mr-4 text-lg font-bold text-gray-900 hover:text-red-600 transition-colors duration-300"
    >
      Cerrar Sesión
    </button>
  );
}
