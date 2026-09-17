import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

export const AI_CONTENT_TYPES = [
  'cover-letter',
  'application-email',
  'hire-me-pitch',
  'resume-improvement',
  'custom-response',
]

const aiContentSchema = new Schema(
  {
    _id: { type: String, default: () => genId('ai') },
    userId: { type: String, ref: 'User', required: true, index: true },
    applicationId: { type: String, ref: 'Application' },
    type: { type: String, enum: AI_CONTENT_TYPES, required: true },
    prompt: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'generatedAt', updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.userId
        if (!ret.applicationId) delete ret.applicationId
        return ret
      },
    },
  },
)

export const AIContent = mongoose.model('AIContent', aiContentSchema)
