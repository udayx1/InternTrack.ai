import { CareerInsightsData } from '@/types'

export const mockCareerInsights: CareerInsightsData = {
  insights: [
    {
      id: 'ins_1',
      title: '3 applications need a follow-up',
      description: 'Atlassian, UBS and Zeta Suite have had no update in over a week.',
      category: 'follow-up',
    },
    {
      id: 'ins_2',
      title: 'Docker appears frequently in your target roles',
      description: 'It shows up in 5 of your last 6 job analyses as a missing skill.',
      category: 'skill',
    },
    {
      id: 'ins_3',
      title: 'Strong match with backend engineering roles',
      description: 'Your average match score for backend-tagged roles is 86%, above your overall average.',
      category: 'match',
    },
    {
      id: 'ins_4',
      title: 'Applications are trending up this month',
      description: "You've submitted 40% more applications this month than last.",
      category: 'trend',
    },
  ],
  trends: [
    { week: 'Wk 1', applications: 2, interviews: 0 },
    { week: 'Wk 2', applications: 3, interviews: 1 },
    { week: 'Wk 3', applications: 1, interviews: 1 },
    { week: 'Wk 4', applications: 4, interviews: 1 },
    { week: 'Wk 5', applications: 2, interviews: 2 },
  ],
  commonMissingSkills: [
    { skill: 'Docker', count: 5 },
    { skill: 'AWS', count: 4 },
    { skill: 'Kubernetes', count: 3 },
    { skill: 'System Design', count: 3 },
    { skill: 'GraphQL', count: 2 },
  ],
  strongestRoleMatches: [
    { role: 'Backend Engineer', score: 86 },
    { role: 'Full Stack Developer', score: 81 },
    { role: 'Software Engineer', score: 79 },
    { role: 'Cybersecurity Analyst', score: 68 },
  ],
  conversionRate: 33,
}
