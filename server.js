// server.js
const { createServer } = require('http')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Usa la variable de entorno PORT o 3001 si no está definida
const PORT = parseInt(process.env.PORT) || 3001

app.prepare().then(() => {
  setInterval(() => {
    const m = process.memoryUsage()
    console.log(
      `[MEM] RSS ${(m.rss/1024/1024).toFixed(1)}MB  HeapUsed ${(m.heapUsed/1024/1024).toFixed(1)}MB`
    )
  }, 30_000)

  createServer((req, res) => handle(req, res)).listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Servidor Next listo en http://localhost:${PORT}`)
  })
})
