import { Profile } from '../models/Profile.js'
import { Application } from '../models/Application.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { AIContent } from '../models/AIContent.js'
import { generateCopilotContent } from '../services/ai/copilotService.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { assertValid, isNonEmptyString } from '../validators/validate.js'

/**
 * Shared implementation behind all four /api/ai/* endpoints. `type` is fixed
 * per-route (matching the frontend's aiService.ts, which hard-codes `type`
 * for cover-letter/application-email/improve-resume and only lets the user
 * choose freely for generate-response).
 */
async function handleGenerate(req, res, type) {
  const { applicationId, context } = req.body ?? {}
  assertValid([[isNonEmptyString(context) || isNonEmptyString(applicationId), 'Provide context or an applicationId.']])

  const [profile, application, resumeAnalysis] = await Promise.all([
    Profile.findById(req.userId).lean(),
    applicationId ? Application.findOne({ _id: applicationId, userId: req.userId }).lean() : null,
    ResumeAnalysis.findOne({ userId: req.userId }).sort({ analyzedAt: -1 }).lean(),
  ])

  if (applicationId && !application) {
    throw ApiError.notFound('Application not found.')
  }

  const content = await generateCopilotContent({
    type,
    profile,
    application,
    resumeAnalysis,
    extraContext: context,
  })

  const saved = await AIContent.create({
    userId: req.userId,
    applicationId: application?.id,
    type,
    prompt: context || `Generate ${type} for ${application?.role ?? 'this application'} at ${application?.company ?? ''}`.trim(),
    content,
  })

  res.status(200).json(saved.toJSON())
}

// POST /api/ai/cover-letter
export const generateCoverLetter = asyncHandler((req, res) => handleGenerate(req, res, 'cover-letter'))

// POST /api/ai/application-email
export const generateApplicationEmail = asyncHandler((req, res) => handleGenerate(req, res, 'application-email'))

// POST /api/ai/improve-resume
export const improveResume = asyncHandler((req, res) => handleGenerate(req, res, 'resume-improvement'))

// POST /api/ai/generate-response  — `type` is chosen by the user on the frontend (AICopilot.tsx dropdown)
export const generateResponse = asyncHandler((req, res) => {
  const { type } = req.body ?? {}
  const validType = ['hire-me-pitch', 'custom-response', 'cover-letter', 'application-email', 'resume-improvement'].includes(
    type,
  )
    ? type
    : 'custom-response'
  return handleGenerate(req, res, validType)
})
