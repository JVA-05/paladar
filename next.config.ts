import type { NextConfig } from "next";

// 1) Leer la variable de entorno
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
if (!cloudName) {
  throw new Error("Falta la variable CLOUDINARY_CLOUD_NAME en el entorno");
}

const nextConfig: NextConfig = {
  // 2) Ignorar errores de ESLint al hacer build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3) Ignorar errores de TypeScript al hacer build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 4) Modo servidor para soportar APIs (quitar export estático)
  // elimina o comenta la línea `output: "export"`
  // output: "export",

  experimental: {
    // turbopack: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: `/${cloudName}/image/upload/**`,
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
