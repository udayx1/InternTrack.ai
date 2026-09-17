/**
 * Wraps an async route/controller function so any rejected promise is
 * forwarded to next(err) and handled by the centralized error handler,
 * instead of every controller needing its own try/catch.
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
