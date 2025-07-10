// updateAdminPassword.ts
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta de prisma sea la correcta

(async () => {
  try {
    const plainPassword = "admin";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const updatedAdmin = await prisma.admin.update({
      where: { username: "admin" },
      data: { password: hashedPassword },
    });

    console.log("Usuario admin actualizado con hash correcto:", updatedAdmin);
    process.exit(0);
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    process.exit(1);
  }
})();
