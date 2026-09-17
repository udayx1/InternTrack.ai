import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

// The exact enum used by the frontend (types/index.ts → ApplicationStatus,
// and the `columns` array in Pipeline.tsx / `statuses` in AddApplication.tsx).
export const APPLICATION_STATUSES = ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected']

const applicationSchema = new Schema(
  {
    _id: { type: String, default: () => genId('app') },
    userId: { type: String, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobDescription: { type: String },
    jobUrl: { type: String },
    location: { type: String },
    status: { type: String, enum: APPLICATION_STATUSES, default: 'Applied' },
    appliedDate: { type: String, required: true },
    deadline: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

applicationSchema.index({ userId: 1, status: 1 })

export const Application = mongoose.model('Application', applicationSchema)
