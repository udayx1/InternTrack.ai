import { ResumeAnalysis } from '@/types'

export const mockResumeAnalysis: ResumeAnalysis = {
  id: 'resan_1',
  resumeId: 'resume_1',
  skillsDetected: ['Java', 'React', 'Node.js', 'MongoDB', 'Spring Boot', 'Git', 'REST APIs'],
  education: ['B.Tech Computer Engineering — GHRISTU, Pune (2028)'],
  projects: ['InternTrack — MERN job tracker', 'NexaBank ATM — Spring Boot banking app'],
  experience: ['Student Coordinator, Developers Club (700+ members)'],
  certifications: ['AWS Cloud Practitioner (in progress)'],
  strengths: [
    'Strong full-stack project portfolio with quantified impact',
    'Consistent Git history showing active, ongoing contribution',
    'Leadership experience relevant to team-based engineering roles',
  ],
  gaps: [
    'No cloud deployment experience listed (AWS/Azure/GCP)',
    'Limited exposure to containerization (Docker/Kubernetes)',
    'No formal DSA or competitive programming credentials shown',
  ],
  suggestions: [
    'Add measurable outcomes to each project bullet (e.g. users served, latency reduced)',
    'List one cloud-hosted project to demonstrate deployment skills',
    'Include a certifications section once AWS Cloud Practitioner is complete',
  ],
  analyzedAt: new Date().toISOString(),
}
