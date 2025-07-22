// hooks/useUser.ts
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiClient';

export function useUser() {
  const [user, setUser] = useState<{ isAdmin: boolean; user?: any } | null>(null);

  useEffect(() => {
    apiFetch('/api/me')
      .then(data => setUser(data))
      .catch(() => setUser({ isAdmin: false }));
  }, []);

  return user;
}
