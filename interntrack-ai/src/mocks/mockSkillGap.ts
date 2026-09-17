import { SkillGap } from '@/types'

export const mockSkillGap: SkillGap = {
  targetRole: 'Software Engineer — UBS Technology India',
  currentSkills: [
    { skill: 'C++', proficiency: 90 },
    { skill: 'Java', proficiency: 82 },
    { skill: 'React', proficiency: 75 },
    { skill: 'Node.js', proficiency: 70 },
    { skill: 'AWS', proficiency: 40 },
    { skill: 'Docker', proficiency: 35 },
    { skill: 'System Design', proficiency: 25 },
  ],
  requiredSkills: ['C++', 'Java', 'React', 'AWS', 'Docker', 'System Design', 'Kubernetes'],
  matchedSkills: ['C++', 'Java', 'React', 'Node.js'],
  missingSkills: ['AWS', 'Docker', 'System Design', 'Kubernetes'],
  recommendations: [
    {
      skill: 'System Design',
      priority: 'High',
      reason: 'Appears in 70% of your target role postings and is tested in final rounds.',
    },
    {
      skill: 'Docker',
      priority: 'High',
      reason: 'Frequently listed as a required skill alongside your matched backend stack.',
    },
    {
      skill: 'AWS',
      priority: 'Medium',
      reason: 'Cloud fundamentals strengthen your profile for infra-adjacent SWE roles.',
    },
    {
      skill: 'Kubernetes',
      priority: 'Low',
      reason: 'Less common at internship level, but valuable for full-time conversion.',
    },
  ],
}
