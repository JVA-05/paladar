// src/lib/guards.ts
import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function requireAdmin(req: NextRequest) {
  // 1) Extrae token de header o cookie
  const authHeader = req.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  const token = tokenFromHeader || req.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  // 2) Verifícalo
  const payload = verifyToken(token) as { id: number; username: string };
  if (!payload?.id) {
    throw new Error('Token inválido');
  }

  // opcional: aquí podrías verificar un campo isAdmin en tu payload
  // if (!payload.isAdmin) throw new Error('No tienes permiso de admin');
}
