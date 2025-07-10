// app/api/me/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Si deseas puedes retornar más datos; aquí solo indicamos que es admin.
    return NextResponse.json({ isAdmin: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}
