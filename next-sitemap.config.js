/** next-sitemap.config.js */
module.exports = {
    siteUrl: 'https://ranchon-la-trocha.onrender.com',
    changefreq: 'daily',
    priority: 0.7,
    generateRobotsTxt: true,      // genera robots.txt automáticamente
    exclude: [
      '/admin/*',
      '/dashboard',
      '/auth/*'
    ],
  };
  