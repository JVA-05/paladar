// src/app/api/metrics-stream/route.ts
import os from 'os';

export const GET = async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const mem = process.memoryUsage();
          const payload = JSON.stringify({
            rss: mem.rss,
            heapTotal: mem.heapTotal,
            heapUsed: mem.heapUsed,
            external: mem.external,
            loadAvg: os.loadavg(),
            cpuCount: os.cpus().length,
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          // envía cada 1s
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};
