import { Profile } from '../models/Profile.js'
import { SkillGap } from '../models/SkillGap.js'
import { computeSkillGap } from '../services/skills/skillGapService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/skills/gap?role=
export const getSkillGap = asyncHandler(async (req, res) => {
  const targetRole = req.query.role?.toString().trim() || undefined

  const profile = await Profile.findById(req.userId).lean()
  const result = await computeSkillGap(req.userId, profile, targetRole)

  // Persist the latest snapshot per (user, role) — see SkillGap.js for why.
  await SkillGap.findOneAndUpdate(
    { userId: req.userId, targetRole: result.targetRole },
    { $set: result },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  res.status(200).json(result)
})
