import { JobAnalysis } from '../../models/JobAnalysis.js'

// Small built-in fallback so the feature works even for a brand-new user
// with no analyzed jobs yet — the required list is enriched with real data
// from the user's own JobAnalysis history whenever it exists.
const ROLE_SKILL_BASELINES = {
  'software engineer': ['Data Structures', 'Algorithms', 'Git', 'System Design', 'SQL', 'REST APIs'],
  'backend developer': ['Node.js', 'REST APIs', 'SQL', 'Docker', 'System Design', 'Git'],
  'full stack developer': ['React', 'Node.js', 'REST APIs', 'SQL', 'Git', 'Docker'],
  'frontend developer': ['React', 'JavaScript', 'CSS', 'TypeScript', 'Git'],
  'cybersecurity analyst': ['Networking', 'Linux', 'SIEM', 'Python', 'Cryptography'],
  'data analyst': ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics'],
}

function normalize(skill) {
  return skill.trim().toLowerCase().replace(/[.\-_\s]/g, '')
}

function skillsMatch(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  return na === nb || (na.length > 2 && nb.includes(na)) || (nb.length > 2 && na.includes(nb))
}

function dedupe(arr) {
  const seen = []
  for (const item of arr) {
    if (!seen.some((s) => skillsMatch(s, item))) seen.push(item)
  }
  return seen
}

function baselineFor(role) {
  const key = Object.keys(ROLE_SKILL_BASELINES).find((k) => role.toLowerCase().includes(k))
  return key ? ROLE_SKILL_BASELINES[key] : ['Git', 'REST APIs', 'System Design', 'SQL']
}

function reasonFor(skill, frequency) {
  if (frequency >= 3) return `Appears as a missing skill across ${frequency} of your recently analyzed job postings.`
  if (frequency > 0) return `Came up as a requirement in a job posting you analyzed for this role.`
  return `Commonly expected for ${skill ? 'this' : 'the target'} role even though it hasn't appeared in your analyses yet.`
}

function priorityFor(frequency) {
  if (frequency >= 3) return 'High'
  if (frequency >= 1) return 'Medium'
  return 'Low'
}

/**
 * Computes SkillGap exactly matching the frontend's SkillGap interface.
 * requiredSkills = baseline-for-role ∪ skills actually seen in the user's
 * analyzed jobs targeting that role (so it improves as the user uses the app).
 */
export async function computeSkillGap(userId, profile, targetRole) {
  const role = targetRole || profile?.preferences?.preferredRoles?.[0] || 'Software Engineer'

  const relatedAnalyses = await JobAnalysis.find({
    userId,
    'jobDetails.role': { $regex: role.split(' ')[0], $options: 'i' },
  })
    .sort({ analyzedAt: -1 })
    .limit(10)
    .lean()

  const missingFromAnalyses = relatedAnalyses.flatMap((a) => a.match?.missingSkills ?? [])
  const frequency = {}
  for (const skill of missingFromAnalyses) {
    const key = normalize(skill)
    frequency[key] = (frequency[key] ?? 0) + 1
  }

  const requiredSkills = dedupe([...baselineFor(role), ...missingFromAnalyses])
  const candidateSkills = profile?.skills ?? []

  const matchedSkills = requiredSkills.filter((s) => candidateSkills.some((cs) => skillsMatch(cs, s)))
  const missingSkills = requiredSkills.filter((s) => !matchedSkills.includes(s))

  const currentSkills = candidateSkills.map((skill) => {
    // Proficiency heuristic: skills that also show up in matchedSkills for this
    // role score higher; everything else gets a reasonable default. This is a
    // transparent heuristic, not a claim of measured expertise.
    const isRoleRelevant = requiredSkills.some((r) => skillsMatch(r, skill))
    return { skill, proficiency: isRoleRelevant ? 75 : 55 }
  })

  const recommendations = missingSkills
    .map((skill) => {
      const freq = frequency[normalize(skill)] ?? 0
      return { skill, priority: priorityFor(freq), reason: reasonFor(skill, freq) }
    })
    .sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]))

  return { targetRole: role, currentSkills, requiredSkills, matchedSkills, missingSkills, recommendations }
}
