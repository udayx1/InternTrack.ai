import { ApiError } from '../utils/ApiError.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OBJECT_ID_LIKE_RE = /^[a-zA-Z0-9_-]{3,64}$/ // our ids are prefixed strings, not raw ObjectIds

export function isEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value)
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function isValidId(value) {
  return typeof value === 'string' && OBJECT_ID_LIKE_RE.test(value)
}

/**
 * Runs `checks` (each a [conditionBool, message] pair) and throws a single
 * 400 ApiError listing every failed field, so the frontend gets one clear
 * message instead of trusting client-side validation alone.
 */
export function assertValid(checks) {
  const failures = checks.filter(([ok]) => !ok).map(([, message]) => message)
  if (failures.length > 0) {
    throw ApiError.badRequest(failures.join(' '), 'VALIDATION_ERROR')
  }
}
