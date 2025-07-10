// components/ProtectedAdmin.tsx
'use client';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // cuando termine la validación y NO sea admin, redirige
    if (!loading && !isAdmin) {
      router.replace('/');
    }
  }, [loading, isAdmin, router]);

  // opcional: mientras carga, muestra null o un spinner
  if (loading || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
