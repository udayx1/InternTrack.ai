import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

// The frontend's two-step flow (resumeService.uploadResume → then
// resumeService.analyzeResume(resumeId)) means the backend must remember
// the extracted PDF text between those two calls. This collection is that
// bridge; ResumeFileMeta (fileName/fileSizeKb/uploadedAt) is exactly what
// upload returns, and `extractedText` is read internally by /resume/analyze.
const resumeSchema = new Schema(
  {
    _id: { type: String, default: () => genId('resume') },
    userId: { type: String, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true },
    fileSizeKb: { type: Number, required: true },
    extractedText: { type: String, required: true, select: false },
  },
  {
    timestamps: { createdAt: 'uploadedAt', updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.extractedText
        delete ret.userId
        return ret
      },
    },
  },
)

export const Resume = mongoose.model('Resume', resumeSchema)
