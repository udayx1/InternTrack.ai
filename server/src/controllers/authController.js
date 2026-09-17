import { User } from '../models/User.js'
import { Profile } from '../models/Profile.js'
import { signToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { assertValid, isEmail, isNonEmptyString } from '../validators/validate.js'

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body ?? {}

  assertValid([
    [isNonEmptyString(name), 'Name is required.'],
    [isEmail(email), 'A valid email is required.'],
    [isNonEmptyString(password) && password.length >= 6, 'Password must be at least 6 characters.'],
  ])

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) throw ApiError.conflict('An account with this email already exists.', 'EMAIL_TAKEN')

  const passwordHash = await User.hashPassword(password)
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash })

  // Seed an empty profile so GET /api/profile always has something to return
  // for a freshly registered user, matching the frontend's Profile shape.
  await Profile.create({ _id: user.id, fullName: name.trim() })

  const token = signToken(user.id)
  res.status(201).json({ user: user.toJSON(), token })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}

  assertValid([
    [isEmail(email), 'A valid email is required.'],
    [isNonEmptyString(password), 'Password is required.'],
  ])

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  if (!user) throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS')

  const valid = await user.comparePassword(password)
  if (!valid) throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS')

  const token = signToken(user.id)
  res.status(200).json({ user: user.toJSON(), token })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.status(200).json(req.user.toJSON())
})
