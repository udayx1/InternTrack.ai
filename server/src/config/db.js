import mongoose from 'mongoose'
import { env } from './env.js'

mongoose.set('strictQuery', true)

export async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri)
    // eslint-disable-next-line no-console
    console.log(`[db] connected → ${mongoose.connection.name}`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] connection failed:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.warn('[db] disconnected')
})
