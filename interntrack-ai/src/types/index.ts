// ============================================================================
// InternTrack.ai — Shared Data Models
//
// These interfaces are the contract between the Stage 1 frontend and the
// Stage 2 backend (Node.js + Express + MongoDB). Mock data in src/mocks/
// MUST conform to these types, and every service in src/services/ MUST
// return these types — never a shape invented per-page. When Stage 2 wires
// up real endpoints, only the service internals change; components and
// mocks are unaffected as long as these shapes hold.
// ============================================================================

export type ID = string

// ---------------------------------------------------------------------------
// Auth / User
// ---------------------------------------------------------------------------

export interface User {
  id: ID
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

// ---------------------------------------------------------------------------
// Career Profile
// ---------------------------------------------------------------------------

export interface Education {
  university: string
  degree: string
  branch: string
  graduationYear: number
  cgpa?: string
}

export interface ProjectEntry {
  id: ID
  title: string
  description: string
  techStack: string[]
  link?: string
}

export interface ExperienceEntry {
  id: ID
  organization: string
  role: string
  startDate: string
  endDate?: string
  description: string
}

export interface CertificationEntry {
  id: ID
  name: string
  issuer: string
  issuedDate: string
  credentialUrl?: string
}

export interface CareerPreferences {
  preferredRoles: string[]
  preferredLocations: string[]
  employmentTypes: ('Internship' | 'Full-time' | 'Contract')[]
}

export interface Profile {
  userId: ID
  fullName: string
  headline: string
  phone?: string
  location?: string
  education: Education
  skills: string[]
  projects: ProjectEntry[]
  experience: ExperienceEntry[]
  certifications: CertificationEntry[]
  preferences: CareerPreferences
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Applications / Pipeline
// ---------------------------------------------------------------------------

export type ApplicationStatus =
  | 'Applied'
  | 'Online Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'

export interface Application {
  id: ID
  userId: ID
  company: string
  role: string
  jobDescription?: string
  jobUrl?: string
  location?: string
  status: ApplicationStatus
  appliedDate: string
  deadline?: string
  matchScore?: number
  matchedSkills: string[]
  missingSkills: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type CreateApplicationPayload = Omit<
  Application,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'matchedSkills' | 'missingSkills'
> &
  Partial<Pick<Application, 'matchedSkills' | 'missingSkills'>>

// ---------------------------------------------------------------------------
// Job Analysis
// ---------------------------------------------------------------------------

export interface JobDetails {
  company: string
  role: string
  location?: string
  experience?: string
  jobType?: string
  deadline?: string
}

export interface MatchBreakdown {
  technicalSkills: number
  education: number
  experience: number
  projects: number
}

export interface MatchAnalysis {
  overallScore: number
  breakdown: MatchBreakdown
  matchedSkills: string[]
  missingSkills: string[]
}

export interface JobAnalysis {
  id: ID
  jobDetails: JobDetails
  jobDescription: string
  match: MatchAnalysis
  analyzedAt: string
}

export interface AnalyzeJobPayload {
  company: string
  role: string
  jobUrl?: string
  jobDescription: string
}

// ---------------------------------------------------------------------------
// Resume Analysis
// ---------------------------------------------------------------------------

export interface ResumeFileMeta {
  id: ID
  fileName: string
  fileSizeKb: number
  uploadedAt: string
}

export interface ResumeAnalysis {
  id: ID
  resumeId: ID
  skillsDetected: string[]
  education: string[]
  projects: string[]
  experience: string[]
  certifications: string[]
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  analyzedAt: string
}

// ---------------------------------------------------------------------------
// Skill Gap
// ---------------------------------------------------------------------------

export interface SkillProficiency {
  skill: string
  proficiency: number // 0-100
}

export interface RecommendedSkill {
  skill: string
  priority: 'High' | 'Medium' | 'Low'
  reason: string
}

export interface SkillGap {
  targetRole: string
  currentSkills: SkillProficiency[]
  requiredSkills: string[]
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: RecommendedSkill[]
}

// ---------------------------------------------------------------------------
// AI Application Copilot
// ---------------------------------------------------------------------------

export type AIContentType =
  | 'cover-letter'
  | 'application-email'
  | 'hire-me-pitch'
  | 'resume-improvement'
  | 'custom-response'

export interface AIContent {
  id: ID
  applicationId?: ID
  type: AIContentType
  prompt: string
  content: string
  generatedAt: string
}

export interface GenerateContentPayload {
  applicationId?: ID
  type: AIContentType
  context: string
}

// ---------------------------------------------------------------------------
// Dashboard / Career Insights
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalApplications: number
  activeApplications: number
  interviews: number
  offers: number
  averageMatchScore: number
  applicationsThisWeek: number
  upcomingDeadlines: number
}

export interface PipelineSummary {
  status: ApplicationStatus
  count: number
}

export interface CareerInsight {
  id: ID
  title: string
  description: string
  category: 'follow-up' | 'skill' | 'match' | 'trend'
}

export interface ApplicationTrendPoint {
  week: string
  applications: number
  interviews: number
}

export interface CareerInsightsData {
  insights: CareerInsight[]
  trends: ApplicationTrendPoint[]
  commonMissingSkills: { skill: string; count: number }[]
  strongestRoleMatches: { role: string; score: number }[]
  conversionRate: number
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface NotificationPreferences {
  deadlineReminders: boolean
  weeklyDigest: boolean
  aiInsightAlerts: boolean
}

export interface AccountSettings {
  user: User
  notifications: NotificationPreferences
  careerPreferences: CareerPreferences
}

// ---------------------------------------------------------------------------
// Generic API envelope (mirrors what the Stage 2 backend will return)
// ---------------------------------------------------------------------------

export interface ApiError {
  message: string
  status?: number
}
