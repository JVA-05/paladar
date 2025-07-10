// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateAdmin = async (username: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    throw new Error('Usuario no encontrado');
  }

  // Comparar contraseñas (usa bcrypt.compare en producción)
  const passwordValid = process.env.NODE_ENV === 'development'
    ? password === admin.password
    : bcrypt.compareSync(password, admin.password);

  if (!passwordValid) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      createdAt: admin.createdAt
    }
  };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};