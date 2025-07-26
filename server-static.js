// server-static.js
const { createServer } = require('http');
const handler = require('serve-handler');

const PORT = process.env.PORT || 3000;

// Cada 10 s mostramos memoria
setInterval(() => {
  const m = process.memoryUsage();
  console.log(
    `[MEM] RSS ${(m.rss/1024/1024).toFixed(1)}MB`, 
    `HeapUsed ${(m.heapUsed/1024/1024).toFixed(1)}MB`
  );
}, 10_000);

createServer((req, res) => {
  return handler(req, res, { public: 'out' });
}).listen(PORT, () => {
  console.log(`Servidor estático corriendo en http://localhost:${PORT}`);
});
