import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

async function createAdmin() {
  // Verifica si el usuario "admin" ya existe en la base de datos.
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log("El usuario 'admin' ya existe:", existingAdmin);
    return;
  }

  // Hashea la contraseña "admin" usando bcrypt.
  const hashedPassword = await bcrypt.hash('admin', 10);

  // Crea el registro del usuario admin en la base de datos.
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log("Cuenta admin creada con éxito:", admin);
}

createAdmin()
  .catch((error) => {
    console.error("Error al crear la cuenta admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
