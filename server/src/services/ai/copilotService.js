import { generateText } from './aiService.js'

const SYSTEM_BY_TYPE = {
  'cover-letter': `You write concise, specific, non-generic cover letters for internship/early-career job
applications. Ground every claim in the candidate context provided — never invent employers, degrees, or
skills not given to you. Address it professionally, keep it under 300 words, and end with the candidate's name.`,
  'application-email': `You write short, professional application emails (with a Subject line) for
internship/early-career job applications, referencing the specific role and one or two genuinely relevant
qualifications from the candidate's context. Keep it under 150 words.`,
  'hire-me-pitch': `You write a confident, specific 3-5 sentence "why you should hire me" pitch grounded
entirely in the candidate's real projects, skills and experience — no generic filler.`,
  'resume-improvement': `You give a short, numbered list (3-5 items) of concrete, actionable resume
improvement suggestions specific to the candidate's actual resume content and target role.`,
  'custom-response': `You write a tailored, professional written response to whatever the user's context
asks for, grounded in their real profile and application details. Keep it focused and free of filler.`,
}

function buildCandidateContext({ profile, application, resumeAnalysis, extraContext }) {
  const lines = []
  if (profile) {
    lines.push(`Candidate: ${profile.fullName || 'the candidate'} — ${profile.headline || ''}`.trim())
    if (profile.education?.university) {
      lines.push(
        `Education: ${profile.education.degree} in ${profile.education.branch}, ${profile.education.university} (${profile.education.graduationYear ?? 'N/A'})`,
      )
    }
    if (profile.skills?.length) lines.push(`Skills: ${profile.skills.join(', ')}`)
    if (profile.projects?.length) {
      lines.push(
        `Projects: ${profile.projects.map((p) => `${p.title} (${(p.techStack ?? []).join('/')}) — ${p.description}`).join(' | ')}`,
      )
    }
    if (profile.experience?.length) {
      lines.push(`Experience: ${profile.experience.map((e) => `${e.role} at ${e.organization}`).join(' | ')}`)
    }
  }
  if (application) {
    lines.push(`Target role: ${application.role} at ${application.company}${application.location ? ` (${application.location})` : ''}`)
    if (application.jobDescription) lines.push(`Job description excerpt: ${application.jobDescription.slice(0, 800)}`)
    if (application.matchedSkills?.length) lines.push(`Matched skills for this role: ${application.matchedSkills.join(', ')}`)
  }
  if (resumeAnalysis) {
    if (resumeAnalysis.strengths?.length) lines.push(`Resume strengths: ${resumeAnalysis.strengths.join('; ')}`)
    if (resumeAnalysis.gaps?.length) lines.push(`Resume gaps: ${resumeAnalysis.gaps.join('; ')}`)
  }
  if (extraContext) lines.push(`Additional context from the user: ${extraContext}`)
  return lines.join('\n')
}

/**
 * Generates personalized AI copilot content. `type` selects both the system
 * prompt and tone; the candidate context is assembled from real stored data
 * (profile/application/resume) wherever available, per the "don't generate
 * generic templates if enough information is available" requirement.
 */
export async function generateCopilotContent({ type, profile, application, resumeAnalysis, extraContext }) {
  const system = SYSTEM_BY_TYPE[type] ?? SYSTEM_BY_TYPE['custom-response']
  const context = buildCandidateContext({ profile, application, resumeAnalysis, extraContext })

  const prompt = `Candidate & application context:\n${context || 'No additional context was provided.'}\n\nGenerate the requested content now.`

  return generateText({ system, prompt })
}
