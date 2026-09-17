import { generateJSON } from '../ai/aiService.js'

const JOB_EXTRACTION_SYSTEM = `You are a job-description parsing engine for InternTrack.ai. You extract
factual structured details from a job posting. Never guess a field you cannot support from the text —
use null for unknown string fields and [] for unknown arrays. Output strict JSON only.`

/**
 * Extracts structured job details + required/preferred skills from a raw
 * job description using Gemini. The rule-based matchEngine.js then scores
 * the candidate against these — extraction and scoring are deliberately
 * separate so the score stays explainable rather than an AI black box.
 */
export async function extractJobDetails({ company, role, jobDescription }) {
  const prompt = `Given this job posting, return a JSON object with EXACTLY these keys:
{
  "company": string,           // use "${company || ''}" if the text doesn't clearly state it, else the best value from the text
  "role": string,               // use "${role || ''}" if the text doesn't clearly state it, else the best value from the text
  "location": string | null,
  "experience": string | null,  // e.g. "0-1 years", "2+ years"
  "jobType": string | null,     // e.g. "Internship", "Full-time", "Contract"
  "deadline": string | null,    // ISO date (YYYY-MM-DD) if a deadline is explicitly mentioned, else null
  "requiredSkills": string[],   // must-have technical skills/tools/languages
  "preferredSkills": string[]   // nice-to-have skills, empty array if none mentioned
}

Job description:
"""
${jobDescription.slice(0, 12000)}
"""`

  const data = await generateJSON({ system: JOB_EXTRACTION_SYSTEM, prompt })

  return {
    company: data.company || company || 'Unknown Company',
    role: data.role || role || 'Unknown Role',
    location: data.location || undefined,
    experience: data.experience || undefined,
    jobType: data.jobType || undefined,
    deadline: data.deadline || undefined,
    requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
    preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : [],
  }
}
