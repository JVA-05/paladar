// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generar un sitio estático (next export)
  output: 'export',

  // Desactivar source maps en producción
  productionBrowserSourceMaps: false,

  // Comprimir assets automáticamente
  compress: true,

  // Ignorar errores de ESLint y TypeScript en build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración de imágenes para export estático
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp'],               // fuerza WebP
    minimumCacheTTL: 60 * 60 * 24 * 7,     // cache de 1 semana
    deviceSizes: [640, 750, 828, 1080],    // tamaños relevantes
    imageSizes: [16, 32, 48, 64],          // iconos
    disableStaticImages: true,             // no usar imports estáticos
    unoptimized: true,                     // desactiva el loader runtime
  },

  // Control de hot-reload en desarrollo
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 5,  // 5 minutos inactivo
    pagesBufferLength: 5,           // solo 5 páginas en memoria
  },

  // Evitar que Next intente descargar Google Fonts en el build
  experimental: {
    optimizeFonts: false,
  },
};

module.exports = nextConfig;
