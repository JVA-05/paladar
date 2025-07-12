/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // continúa el build aunque haya errores o avisos de ESLint
      ignoreDuringBuilds: true,
    },
    typescript: {
      // continúa el build aunque haya errores de TypeScript
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  