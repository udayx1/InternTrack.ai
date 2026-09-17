import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

async function main() {
  await connectDB()
  const app = createApp()

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] InternTrack.ai backend listening on http://localhost:${env.port}`)
    // eslint-disable-next-line no-console
    console.log(`[server] CORS allowed origin: ${env.clientUrl}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] fatal startup error:', err)
  process.exit(1)
})
