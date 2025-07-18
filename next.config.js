// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // No hacer fail build por lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // No hacer fail build por errores de TS
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    // tu resto de configuración…
  },
};
