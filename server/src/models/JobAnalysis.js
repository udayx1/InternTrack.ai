import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

const jobDetailsSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String },
    experience: { type: String },
    jobType: { type: String },
    deadline: { type: String },
  },
  { _id: false },
)

const matchBreakdownSchema = new Schema(
  {
    technicalSkills: { type: Number, min: 0, max: 100, required: true },
    education: { type: Number, min: 0, max: 100, required: true },
    experience: { type: Number, min: 0, max: 100, required: true },
    projects: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false },
)

const matchSchema = new Schema(
  {
    overallScore: { type: Number, min: 0, max: 100, required: true },
    breakdown: { type: matchBreakdownSchema, required: true },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
  },
  { _id: false },
)

const jobAnalysisSchema = new Schema(
  {
    _id: { type: String, default: () => genId('job') },
    userId: { type: String, ref: 'User', required: true, index: true },
    jobDetails: { type: jobDetailsSchema, required: true },
    jobDescription: { type: String, required: true },
    match: { type: matchSchema, required: true },
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

export const JobAnalysis = mongoose.model('JobAnalysis', jobAnalysisSchema)
