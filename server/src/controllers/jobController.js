import { Profile } from '../models/Profile.js'
import { JobAnalysis } from '../models/JobAnalysis.js'
import { extractJobDetails } from '../services/job/jobExtractor.js'
import { computeMatch } from '../services/job/matchEngine.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { assertValid, isNonEmptyString, isValidId } from '../validators/validate.js'

// POST /api/jobs/analyze  { company, role, jobUrl?, jobDescription }
export const analyzeJob = asyncHandler(async (req, res) => {
  const { company, role, jobDescription } = req.body ?? {}
  assertValid([[isNonEmptyString(jobDescription), 'Job description is required.']])

  // Candidate data comes from the authenticated user's stored profile, never
  // from client-supplied profile fields, so the score can't be gamed.
  const profile = await Profile.findById(req.userId).lean()

  const jobDetails = await extractJobDetails({ company, role, jobDescription })
  const match = computeMatch(jobDetails, profile)

  const analysis = await JobAnalysis.create({
    userId: req.userId,
    jobDetails: {
      company: jobDetails.company,
      role: jobDetails.role,
      location: jobDetails.location,
      experience: jobDetails.experience,
      jobType: jobDetails.jobType,
      deadline: jobDetails.deadline,
    },
    jobDescription,
    match,
  })

  res.status(200).json(analysis.toJSON())
})

// POST /api/jobs/match  { jobAnalysisId }
// Re-runs the (non-AI) scoring engine against the user's latest profile for
// an already-analyzed job. Kept for contract completeness — see jobService.ts,
// which defines this method though no current page calls it.
export const matchJob = asyncHandler(async (req, res) => {
  const { jobAnalysisId } = req.body ?? {}
  assertValid([[isValidId(jobAnalysisId), 'A valid jobAnalysisId is required.']])

  const existing = await JobAnalysis.findOne({ _id: jobAnalysisId, userId: req.userId })
  if (!existing) throw ApiError.notFound('Job analysis not found.')

  const profile = await Profile.findById(req.userId).lean()
  const match = computeMatch(
    { ...existing.jobDetails.toObject(), requiredSkills: existing.match.missingSkills.concat(existing.match.matchedSkills) },
    profile,
  )

  existing.match = match
  await existing.save()

  res.status(200).json(existing.toJSON())
})
