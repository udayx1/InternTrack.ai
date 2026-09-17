/**
 * Standard operational error thrown anywhere in the app.
 * Caught by middleware/errorHandler.js and turned into the
 * { success: false, message, errorCode } shape the frontend understands
 * (it only ever reads `.message`, so errorCode is additive/optional).
 */
export class ApiError extends Error {
  constructor(status, message, errorCode = 'ERROR', details) {
    super(message)
    this.status = status
    this.errorCode = errorCode
    this.details = details
    Error.captureStackTrace?.(this, ApiError)
  }

  static badRequest(message, errorCode = 'BAD_REQUEST', details) {
    return new ApiError(400, message, errorCode, details)
  }

  static unauthorized(message = 'Not authenticated.', errorCode = 'UNAUTHORIZED') {
    return new ApiError(401, message, errorCode)
  }

  static forbidden(message = 'You do not have access to this resource.', errorCode = 'FORBIDDEN') {
    return new ApiError(403, message, errorCode)
  }

  static notFound(message = 'Resource not found.', errorCode = 'NOT_FOUND') {
    return new ApiError(404, message, errorCode)
  }

  static conflict(message, errorCode = 'CONFLICT') {
    return new ApiError(409, message, errorCode)
  }

  static badGateway(message = 'Upstream service failed. Please try again.', errorCode = 'UPSTREAM_ERROR') {
    return new ApiError(502, message, errorCode)
  }

  static internal(message = 'Something went wrong on our end.', errorCode = 'INTERNAL_ERROR') {
    return new ApiError(500, message, errorCode)
  }
}
