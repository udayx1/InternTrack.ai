import { Resume } from '../models/Resume.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { extractTextFromPdf, analyzeResumeText } from '../services/resume/resumeParser.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { assertValid, isValidId } from '../validators/validate.js'

// POST /api/resume/upload  (multipart/form-data, field name "resume")
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No resume file was uploaded. Attach a PDF under the "resume" field.', 'NO_FILE')
  }

  const extractedText = await extractTextFromPdf(req.file.buffer)
  if (!extractedText || extractedText.length < 20) {
    throw ApiError.badRequest(
      'Could not read any text from this PDF. If it is a scanned image, try a text-based export instead.',
      'EMPTY_PDF_TEXT',
    )
  }

  const resume = await Resume.create({
    userId: req.userId,
    fileName: req.file.originalname,
    fileSizeKb: Math.round(req.file.size / 1024),
    extractedText,
  })

  res.status(201).json(resume.toJSON())
})

// POST /api/resume/analyze  { resumeId }
export const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.body ?? {}
  assertValid([[isValidId(resumeId), 'A valid resumeId is required.']])

  const resume = await Resume.findOne({ _id: resumeId, userId: req.userId }).select('+extractedText')
  if (!resume) throw ApiError.notFound('Resume not found.')

  const analyzed = await analyzeResumeText(resume.extractedText)

  const analysis = await ResumeAnalysis.create({
    userId: req.userId,
    resumeId: resume.id,
    ...analyzed,
  })

  res.status(200).json(analysis.toJSON())
})
