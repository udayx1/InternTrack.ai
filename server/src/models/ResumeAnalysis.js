import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

const resumeAnalysisSchema = new Schema(
  {
    _id: { type: String, default: () => genId('resan') },
    userId: { type: String, ref: 'User', required: true, index: true },
    resumeId: { type: String, ref: 'Resume', required: true },
    skillsDetected: { type: [String], default: [] },
    education: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: 'analyzedAt', updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.userId
        return ret
      },
    },
  },
)

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema)
