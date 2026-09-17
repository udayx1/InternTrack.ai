import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Requires a valid `Authorization: Bearer <token>` header (this is exactly
 * what the frontend's apiClient sends whenever a token is in localStorage).
 * On success, attaches `req.userId` and `req.user` (password hash excluded).
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Missing or invalid authorization header.')
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Session expired or invalid. Please log in again.')
  }

  const user = await User.findById(payload.sub)
  if (!user) {
    throw ApiError.unauthorized('User no longer exists.')
  }

  req.userId = user.id
  req.user = user
  next()
})
