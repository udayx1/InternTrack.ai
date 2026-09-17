import { ApiError } from '../utils/ApiError.js'
import { isProd } from '../config/env.js'

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`No route matches ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err

  // Normalize known non-ApiError failure modes into ApiError so the
  // response shape sent to the frontend is always consistent.
  if (err.name === 'ValidationError') {
    error = ApiError.badRequest(Object.values(err.errors)[0]?.message ?? 'Validation failed.', 'VALIDATION_ERROR')
  } else if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid identifier: ${err.value}`, 'INVALID_ID')
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field'
    error = ApiError.conflict(`An account with this ${field} already exists.`, 'DUPLICATE_KEY')
  } else if (err.name === 'MulterError') {
    error = ApiError.badRequest(err.message, 'UPLOAD_ERROR')
  } else if (!(err instanceof ApiError)) {
    // Unexpected/programmer error — never leak internals to the client.
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', err)
    error = ApiError.internal()
  }

  if (!isProd && !(err instanceof ApiError)) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  res.status(error.status).json({
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    ...(isProd ? {} : { details: error.details }),
  })
}
