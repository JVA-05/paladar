// src/context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAdmin: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading]   = useState(true);

  const logout = () => {
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAdmin(false);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/me', {
          headers: { 
            Authorization: `Bearer ${getCookie('auth-token')}` 
          }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (token: string) => {
    document.cookie = `auth-token=${token}; path=/`;
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// helper para extraer cookie (puedes usar tu librería favorita)
function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] ?? '';
}
