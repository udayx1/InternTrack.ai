import mongoose from 'mongoose'
import { genId } from '../utils/id.js'

const { Schema } = mongoose

// Subdocuments use our own prefixed string `id` instead of Mongoose's default
// ObjectId `_id`, because ProjectEntry/ExperienceEntry/CertificationEntry in
// the frontend's types/index.ts all declare `id: ID` (a string) and the UI
// uses it directly as a React key / edit target.
const projectSchema = new Schema(
  {
    id: { type: String, default: () => genId('proj') },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    link: { type: String },
  },
  { _id: false },
)

const experienceSchema = new Schema(
  {
    id: { type: String, default: () => genId('exp') },
    organization: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, default: '' },
  },
  { _id: false },
)

const certificationSchema = new Schema(
  {
    id: { type: String, default: () => genId('cert') },
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issuedDate: { type: String, required: true },
    credentialUrl: { type: String },
  },
  { _id: false },
)

const educationSchema = new Schema(
  {
    university: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    graduationYear: { type: Number },
    cgpa: { type: String },
  },
  { _id: false },
)

const preferencesSchema = new Schema(
  {
    preferredRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    employmentTypes: {
      type: [String],
      enum: ['Internship', 'Full-time', 'Contract'],
      default: [],
    },
  },
  { _id: false },
)

const profileSchema = new Schema(
  {
    // Profile.userId IS the User's _id — one profile per user, so we reuse
    // it as the primary key instead of a separate generated id.
    _id: { type: String, ref: 'User' },
    fullName: { type: String, default: '' },
    headline: { type: String, default: '' },
    phone: { type: String },
    location: { type: String },
    education: { type: educationSchema, default: () => ({}) },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updatedAt' },
    toJSON: {
      transform(_doc, ret) {
        ret.userId = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

export const Profile = mongoose.model('Profile', profileSchema)
