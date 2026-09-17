import { AnalyzeJobPayload, JobAnalysis } from '@/types'

export function buildMockJobAnalysis(payload: AnalyzeJobPayload): JobAnalysis {
  return {
    id: `job_${Date.now()}`,
    jobDetails: {
      company: payload.company || 'UBS Technology India',
      role: payload.role || 'Software Engineer',
      location: 'Pune, IN',
      experience: '0-1 years',
      jobType: 'Internship',
      deadline: '2026-10-15',
    },
    jobDescription: payload.jobDescription,
    match: {
      overallScore: 82,
      breakdown: {
        technicalSkills: 85,
        education: 90,
        experience: 65,
        projects: 88,
      },
      matchedSkills: ['C++', 'React', 'JavaScript', 'MongoDB', 'Git'],
      missingSkills: ['AWS', 'Docker', 'Kubernetes'],
    },
    analyzedAt: new Date().toISOString(),
  }
}
