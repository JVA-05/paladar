// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiClient';

type AuthContextType = {
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al montar: pregunto al backend si la sesión (cookie) sigue viva
  useEffect(() => {
    apiFetch('/api/me')
      .then(data => {
        setIsAdmin(data.isAdmin);
      })
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login: llamo a tu endpoint, el cookie se establece en HttpOnly
  const login = async (username: string, password: string) => {
    await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    // Si no lanza error es que token llegó en la cookie
    setIsAdmin(true);
  };

  // Logout: opcional llamar a un /api/auth/logout o simplemente limpiar estado
  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // incluso si falla el fetch, limpiamos el estado
    }
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
