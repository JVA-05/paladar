// components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Logout invoca el POST a /api/auth/logout y actualiza el estado
    await logout();
    // Redirige al login tras limpiar estado
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
