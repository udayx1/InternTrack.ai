import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import { generateJSON } from '../ai/aiService.js'

/** Extracts raw text from an in-memory PDF buffer (Multer memoryStorage output). */
export async function extractTextFromPdf(buffer) {
  const { text } = await pdfParse(buffer)
  return text.trim()
}

const RESUME_ANALYSIS_SYSTEM = `You are a resume analysis engine for InternTrack.ai, a career platform for
students and early-career job seekers. You read raw resume text and extract structured, factual
information — you never invent details that aren't supported by the text. Output strict JSON only.`

/**
 * Sends extracted resume text to Gemini and returns data shaped exactly like
 * the frontend's ResumeAnalysis interface (minus id/resumeId/analyzedAt,
 * which the controller fills in).
 */
export async function analyzeResumeText(resumeText) {
  const prompt = `Analyze the following resume text and return a JSON object with EXACTLY these keys:
{
  "skillsDetected": string[],   // technical skills, languages, frameworks, tools found
  "education": string[],        // one line per degree, e.g. "B.Tech Computer Science — XYZ University (2026)"
  "projects": string[],         // one line per project, e.g. "ProjectName — one-line description"
  "experience": string[],       // one line per role, e.g. "Role, Organization (dates)"
  "certifications": string[],   // certifications found, empty array if none
  "strengths": string[],        // 2-4 genuine strengths grounded in the resume content
  "gaps": string[],             // 2-4 realistic gaps relevant to software/tech roles (e.g. missing cloud, testing, system design)
  "suggestions": string[]       // 2-4 concrete, actionable resume improvement suggestions
}

Resume text:
"""
${resumeText.slice(0, 12000)}
"""`

  const data = await generateJSON({ system: RESUME_ANALYSIS_SYSTEM, prompt })

  // Defensive normalization — never let a malformed/missing field reach the frontend.
  const asArray = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])
  return {
    skillsDetected: asArray(data.skillsDetected),
    education: asArray(data.education),
    projects: asArray(data.projects),
    experience: asArray(data.experience),
    certifications: asArray(data.certifications),
    strengths: asArray(data.strengths),
    gaps: asArray(data.gaps),
    suggestions: asArray(data.suggestions),
  }
}
