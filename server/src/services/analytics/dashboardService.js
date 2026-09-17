import { Application, APPLICATION_STATUSES } from '../../models/Application.js'

const ACTIVE_STATUSES = ['Applied', 'Online Assessment', 'Interview']

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

/** GET /api/dashboard → DashboardStats (exact frontend shape). */
export async function getDashboardStats(userId) {
  const applications = await Application.find({ userId }).lean()

  const totalApplications = applications.length
  const activeApplications = applications.filter((a) => ACTIVE_STATUSES.includes(a.status)).length
  const interviews = applications.filter((a) => a.status === 'Interview').length
  const offers = applications.filter((a) => a.status === 'Offer').length

  const scored = applications.filter((a) => typeof a.matchScore === 'number')
  const averageMatchScore = scored.length
    ? Math.round(scored.reduce((sum, a) => sum + a.matchScore, 0) / scored.length)
    : 0

  const weekStart = startOfWeek()
  const applicationsThisWeek = applications.filter((a) => new Date(a.createdAt) >= weekStart).length

  const now = new Date()
  const upcomingDeadlines = applications.filter(
    (a) => a.deadline && new Date(a.deadline) >= now && a.status !== 'Rejected',
  ).length

  return {
    totalApplications,
    activeApplications,
    interviews,
    offers,
    averageMatchScore,
    applicationsThisWeek,
    upcomingDeadlines,
  }
}

/** GET /api/dashboard/pipeline → PipelineSummary[] (exact frontend shape, fixed column order). */
export async function getPipelineSummary(userId) {
  const applications = await Application.find({ userId }).lean()
  return APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }))
}
