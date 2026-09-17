import { Application } from '../../models/Application.js'
import { JobAnalysis } from '../../models/JobAnalysis.js'
import { genId } from '../../utils/id.js'

const ACTIVE_STATUSES = ['Applied', 'Online Assessment', 'Interview']
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

function weeksAgoLabel(n) {
  return n === 0 ? 'This wk' : `Wk -${n}`
}

/**
 * GET /api/dashboard/insights → CareerInsightsData (exact frontend shape).
 * Every field is computed from the user's real Application/JobAnalysis
 * documents — nothing here is hard-coded or AI-generated, which keeps it
 * fast, free, and reliable for a 48-hour demo.
 */
export async function getCareerInsights(userId) {
  const [applications, jobAnalyses] = await Promise.all([
    Application.find({ userId }).lean(),
    JobAnalysis.find({ userId }).sort({ analyzedAt: -1 }).limit(30).lean(),
  ])

  const insights = []

  // 1. Follow-up: active applications untouched for 7+ days.
  const now = Date.now()
  const staleActive = applications.filter(
    (a) => ACTIVE_STATUSES.includes(a.status) && now - new Date(a.updatedAt).getTime() > MS_PER_WEEK,
  )
  if (staleActive.length > 0) {
    const names = staleActive.slice(0, 3).map((a) => a.company)
    insights.push({
      id: genId('ins'),
      title: `${staleActive.length} application${staleActive.length > 1 ? 's' : ''} need${staleActive.length === 1 ? 's' : ''} a follow-up`,
      description: `${names.join(', ')}${staleActive.length > names.length ? ' and others' : ''} have had no update in over a week.`,
      category: 'follow-up',
    })
  }

  // 2. Skill: most common missing skill across recent job analyses.
  const missingCounts = {}
  for (const ja of jobAnalyses) {
    for (const skill of ja.match?.missingSkills ?? []) missingCounts[skill] = (missingCounts[skill] ?? 0) + 1
  }
  const commonMissingSkills = Object.entries(missingCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  if (commonMissingSkills[0] && jobAnalyses.length > 0) {
    const top = commonMissingSkills[0]
    insights.push({
      id: genId('ins'),
      title: `${top.skill} appears frequently in your target roles`,
      description: `It shows up in ${top.count} of your last ${jobAnalyses.length} job analyses as a missing skill.`,
      category: 'skill',
    })
  }

  // 3. Match: role with the strongest average match score.
  const scoresByRole = {}
  for (const a of applications) {
    if (typeof a.matchScore !== 'number') continue
    scoresByRole[a.role] = scoresByRole[a.role] ?? []
    scoresByRole[a.role].push(a.matchScore)
  }
  const strongestRoleMatches = Object.entries(scoresByRole)
    .map(([role, scores]) => ({ role, score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
  if (strongestRoleMatches[0]) {
    const overallAvg = applications.length
      ? Math.round(
          applications.filter((a) => a.matchScore != null).reduce((s, a) => s + a.matchScore, 0) /
            Math.max(applications.filter((a) => a.matchScore != null).length, 1),
        )
      : 0
    insights.push({
      id: genId('ins'),
      title: `Strong match with ${strongestRoleMatches[0].role} roles`,
      description: `Your average match score for "${strongestRoleMatches[0].role}" roles is ${strongestRoleMatches[0].score}%, ${
        strongestRoleMatches[0].score >= overallAvg ? 'above' : 'near'
      } your overall average.`,
      category: 'match',
    })
  }

  // 4. Trend: applications this month vs last month.
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
  const twoMonthsAgo = new Date(now - 60 * 24 * 60 * 60 * 1000)
  const thisMonth = applications.filter((a) => new Date(a.createdAt) >= oneMonthAgo).length
  const lastMonth = applications.filter(
    (a) => new Date(a.createdAt) >= twoMonthsAgo && new Date(a.createdAt) < oneMonthAgo,
  ).length
  if (lastMonth > 0 && thisMonth !== lastMonth) {
    const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    insights.push({
      id: genId('ins'),
      title: `Applications are trending ${pct >= 0 ? 'up' : 'down'} this month`,
      description: `You've submitted ${Math.abs(pct)}% ${pct >= 0 ? 'more' : 'fewer'} applications this month than last.`,
      category: 'trend',
    })
  }

  // Weekly trend line for the last 5 weeks.
  const trends = []
  for (let i = 4; i >= 0; i--) {
    const weekStart = now - (i + 1) * MS_PER_WEEK
    const weekEnd = now - i * MS_PER_WEEK
    const weekApps = applications.filter((a) => {
      const t = new Date(a.createdAt).getTime()
      return t >= weekStart && t < weekEnd
    })
    trends.push({
      week: weeksAgoLabel(i),
      applications: weekApps.length,
      interviews: weekApps.filter((a) => ['Interview', 'Offer'].includes(a.status)).length,
    })
  }

  const conversionRate = applications.length
    ? Math.round((applications.filter((a) => a.status === 'Offer').length / applications.length) * 100)
    : 0

  return { insights, trends, commonMissingSkills, strongestRoleMatches, conversionRate }
}
