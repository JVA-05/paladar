// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('auth-token', '', {
    path: '/',
    expires: new Date(0), // Esto la expira inmediatamente
    // Incluye 'domain' o cualquier otro atributo si es necesario, según cómo se haya configurado la cookie.
  });
  return response;
}
