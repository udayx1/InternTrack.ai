import { Profile } from '../models/Profile.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// In-memory default notification preferences. There is no dedicated
// "settings" write endpoint in the frontend today (SettingsPage.tsx only
// calls userService.getSettings — no update call exists in userService.ts),
// so this stays a read-only, sensible-default projection over User + Profile
// rather than inventing a persistence model the frontend never writes to.
const DEFAULT_NOTIFICATIONS = { deadlineReminders: true, weeklyDigest: true, aiInsightAlerts: false }

const EDITABLE_FIELDS = [
  'fullName',
  'headline',
  'phone',
  'location',
  'education',
  'skills',
  'projects',
  'experience',
  'certifications',
  'preferences',
]

// GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findById(req.userId)
  if (!profile) {
    // Defensive fallback — should only happen for users created before this
    // seeding existed (e.g. via a script). Never 404 here; the frontend
    // expects a Profile object as soon as the user is authenticated.
    profile = await Profile.create({ _id: req.userId, fullName: req.user.name })
  }
  res.status(200).json(profile.toJSON())
})

// PUT /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {}
  for (const key of EDITABLE_FIELDS) {
    if (req.body?.[key] !== undefined) updates[key] = req.body[key]
  }

  const profile = await Profile.findByIdAndUpdate(
    req.userId,
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )
  res.status(200).json(profile.toJSON())
})

// GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.userId).lean()
  res.status(200).json({
    user: req.user.toJSON(),
    notifications: DEFAULT_NOTIFICATIONS,
    careerPreferences: profile?.preferences ?? { preferredRoles: [], preferredLocations: [], employmentTypes: [] },
  })
})
