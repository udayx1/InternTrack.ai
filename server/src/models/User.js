import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { genId } from '../utils/id.js'

// Maps 1:1 to the frontend `User` interface (types/index.ts). Career/education
// fields conceptually mentioned in the project brief live on the separate
// `Profile` model instead — that's the shape the frontend's Profile pages
// and userService already expect, so the backend follows that contract
// rather than bolting extra fields onto User.
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => genId('usr') },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.passwordHash // NEVER returned to the frontend
        return ret
      },
    },
  },
)

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash)
}

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export const User = mongoose.model('User', userSchema)
