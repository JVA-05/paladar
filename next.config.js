// next.config.js
/** @type {import('next').NextConfig} */
console.log("🛠 Cargando next.config.js"); 

module.exports = {
  images: {
    // Basta con listar el dominio:
    domains: ["res.cloudinary.com"],
    // Si quieres usar remotePatterns, hazlo así:
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "res.cloudinary.com",
    //     port: "",
    //     pathname: "/dfbwtcyem/image/upload/**",
    //   },
    // ],
  },
};
