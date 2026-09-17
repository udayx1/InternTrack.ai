import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Never log request bodies/headers in bulk — avoids leaking passwords,
  // tokens, or resume content into logs.
  app.use((req, _res, next) => {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl}`)
    next()
  })

  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
