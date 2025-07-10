
// scripts/generateHash.js
import bcrypt from "bcrypt"

// 1. Define tu contraseña en texto plano (ej: "admin123")
const password = "admin";

// 2. Genera el hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("❌ Error:", err);
    return;
  }
  
  // 3. Muestra el hash en la consola (cópialo para la BD)
  console.log("🔑 Hash generado:", hash);
});