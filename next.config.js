// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    // Optimizaciones críticas para reducir memoria:
    formats: ['image/webp'], // Forzar formato webp (30% más ligero)
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 semana de caché (reduce regeneraciones)
    deviceSizes: [640, 750, 828, 1080], // Solo tamaños necesarios
    imageSizes: [16, 32, 48, 64], // Solo tamaños de iconos
    disableStaticImages: true, // Desactiva el import estático de imágenes
  },
  // Habilitar minificación con SWC (más eficiente que Terser)
  //swcMinify: true,
  
  // Desactivar source maps en producción
  productionBrowserSourceMaps: false,
  
  // Optimizar manejo de fuentes
  //optimizeFonts: true,
  
  // Comprimir assets automáticamente
  compress: true,
  
  // Configuración experimental para mejor rendimiento
  experimental: {
    // optimizeCss: true, // Optimizar CSS
    // legacyBrowsers: false, // Descomentar para eliminar soporte navegadores antiguos
    // outputStandalone: true, // Para Docker/entornos limitados (Next 12.1+)
  },
  
  // Limitar el número de páginas en memoria
  onDemandEntries: {
    maxInactiveAge: 60 * 1000 * 5, // 5 minutos
    pagesBufferLength: 5, // Solo mantener 5 páginas en memoria
  }
};