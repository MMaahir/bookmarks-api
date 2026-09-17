import { serve } from '@hono/node-server'
import { app } from './app.js'

serve({
  fetch: app.fetch,
  port: process.env.PORT ? Number(process.env.PORT) : 3000
}, (info) => {
  console.log(`healthz listening on port ${info.port}`)
})
