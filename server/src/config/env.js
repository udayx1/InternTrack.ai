import dotenv from 'dotenv'

dotenv.config()

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    // Fail loudly at boot rather than deep inside a request handler.
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

export const env = {
  port: process.env.PORT ?? 5000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  requestyApiKey: process.env.REQUESTY_API_KEY,
  requestyModel: process.env.REQUESTY_MODEL,
}

export const isProd = env.nodeEnv === 'production'
