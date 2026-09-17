// ============================================================================
// Explainable match engine. Deliberately NOT an AI call: given the required
// skills (already extracted by jobExtractor.js) and the candidate's stored
// profile, this produces a transparent, reproducible score broken down by
// dimension. This is presented to the user as "how well your profile lines
// up with this posting" — never as a prediction of hiring probability.
// ============================================================================

function normalize(skill) {
  return skill.trim().toLowerCase().replace(/[.\-_\s]/g, '')
}

/** Two skills are considered the same if they normalize equal, or one contains the other (e.g. "Node" ~ "Node.js"). */
function skillsMatch(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  if (!na || !nb) return false
  return na === nb || (na.length > 2 && nb.includes(na)) || (nb.length > 2 && na.includes(nb))
}

function scoreSkillOverlap(required, candidateSkills) {
  if (required.length === 0) return { score: 100, matched: [], missing: [] }
  const matched = []
  const missing = []
  for (const skill of required) {
    const hit = candidateSkills.some((cs) => skillsMatch(cs, skill))
    if (hit) matched.push(skill)
    else missing.push(skill)
  }
  const score = Math.round((matched.length / required.length) * 100)
  return { score, matched, missing }
}

function scoreEducation(education, jobDetails) {
  if (!education?.degree) return 50 // no profile data — neutral baseline
  const relevantDegrees = ['computer', 'software', 'information technology', 'electronics', 'engineering', 'data']
  const isRelevant = relevantDegrees.some((kw) => (education.degree + ' ' + education.branch).toLowerCase().includes(kw))
  let score = isRelevant ? 85 : 55
  // A stated graduation year in the future relative to "0-1 years" experience roles is a good signal for internships.
  if (jobDetails.jobType?.toLowerCase().includes('intern') && education.graduationYear) {
    score = Math.min(100, score + 10)
  }
  return score
}

function scoreExperience(experienceEntries, requiredExperience) {
  const count = experienceEntries?.length ?? 0
  const wantsEntryLevel = !requiredExperience || /0[-\s]?1|entry|intern|fresher/i.test(requiredExperience)
  if (wantsEntryLevel) {
    // For entry-level/internship roles, any relevant experience is a bonus, not a gate.
    return Math.min(100, 60 + count * 15)
  }
  // For experienced roles, scale by count with diminishing returns.
  return Math.min(100, count * 25)
}

function scoreProjects(projectEntries, requiredSkills) {
  if (!projectEntries || projectEntries.length === 0) return 30
  const allTech = projectEntries.flatMap((p) => p.techStack ?? [])
  if (requiredSkills.length === 0) return Math.min(100, 50 + projectEntries.length * 10)
  const { score } = scoreSkillOverlap(requiredSkills, allTech)
  // Blend raw tech-stack overlap with a small bonus for having multiple shipped projects.
  return Math.round(Math.min(100, score * 0.8 + Math.min(projectEntries.length, 3) * 6.7))
}

/**
 * @param {object} jobDetails - output of jobExtractor.extractJobDetails (needs requiredSkills at minimum)
 * @param {object} profile - the user's stored Profile document (plain object)
 * @returns {{overallScore:number, breakdown:object, matchedSkills:string[], missingSkills:string[]}}
 */
export function computeMatch(jobDetails, profile) {
  const requiredSkills = jobDetails.requiredSkills?.length
    ? jobDetails.requiredSkills
    : jobDetails.preferredSkills ?? []
  const candidateSkills = profile?.skills ?? []

  const { score: technicalSkills, matched, missing } = scoreSkillOverlap(requiredSkills, candidateSkills)
  const education = scoreEducation(profile?.education, jobDetails)
  const experience = scoreExperience(profile?.experience, jobDetails.experience)
  const projects = scoreProjects(profile?.projects, requiredSkills)

  // Weighted toward technical skill fit, which is what students/recruiters care about most for internships.
  const overallScore = Math.round(technicalSkills * 0.45 + projects * 0.25 + experience * 0.15 + education * 0.15)

  return {
    overallScore,
    breakdown: { technicalSkills, education, experience, projects },
    matchedSkills: matched,
    missingSkills: missing,
  }
}
