import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

const skillProficiencySchema = new Schema(
  { skill: { type: String, required: true }, proficiency: { type: Number, min: 0, max: 100, required: true } },
  { _id: false },
)

const recommendedSkillSchema = new Schema(
  {
    skill: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    reason: { type: String, required: true },
  },
  { _id: false },
)

// GET /api/skills/gap recomputes on every request (it must reflect the
// user's current profile + applications), but we persist the latest result
// per (userId, targetRole) so Career Insights ("commonMissingSkills") and
// future analytics don't need to recompute from scratch, and so the
// computation is auditable rather than a black box.
const skillGapSchema = new Schema(
  {
    _id: { type: String, default: () => genId('skg') },
    userId: { type: String, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    currentSkills: { type: [skillProficiencySchema], default: [] },
    requiredSkills: { type: [String], default: [] },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    recommendations: { type: [recommendedSkillSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id
        delete ret.id
        delete ret.__v
        delete ret.userId
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
  },
)

skillGapSchema.index({ userId: 1, targetRole: 1 }, { unique: true })

export const SkillGap = mongoose.model('SkillGap', skillGapSchema)
