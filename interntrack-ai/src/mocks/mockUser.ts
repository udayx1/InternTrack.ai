import { AccountSettings, Profile, User } from '@/types'

export const mockUser: User = {
  id: 'usr_1001',
  name: 'Aditi Sharma',
  email: 'aditi.sharma@ghristu.edu.in',
  createdAt: '2024-08-12T09:00:00.000Z',
}

export const mockProfile: Profile = {
  userId: 'usr_1001',
  fullName: 'Aditi Sharma',
  headline: 'Pre-final year Computer Engineering student · Backend & Cloud',
  phone: '+91 90000 00000',
  location: 'Pune, Maharashtra',
  education: {
    university: 'G.H. Raisoni International Skill Tech University',
    degree: 'B.Tech',
    branch: 'Computer Engineering',
    graduationYear: 2028,
    cgpa: '8.4',
  },
  skills: [
    'C++',
    'React',
    'JavaScript',
    'Node.js',
    'MongoDB',
    'Express',
    'Java',
    'Spring Boot',
    'Git',
    'REST APIs',
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'InternTrack',
      description: 'A MERN stack internship and job application tracker with a Kanban pipeline.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://github.com/udayx-dev/InternTrack',
    },
    {
      id: 'proj_2',
      title: 'NexaBank ATM',
      description: 'A Java + Spring Boot simulated banking application with transaction handling.',
      techStack: ['Java', 'Spring Boot', 'MySQL'],
    },
    {
      id: 'proj_3',
      title: 'Smart Attendance System',
      description: 'Face-recognition based attendance system for classrooms.',
      techStack: ['Python', 'OpenCV', 'Flask'],
    },
  ],
  experience: [
    {
      id: 'exp_1',
      organization: "College Developers Club",
      role: 'Student Coordinator',
      startDate: '2025-01-01',
      description: 'Coordinate 700+ member developer community, organize workshops and hackathons.',
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Cloud Practitioner (in progress)',
      issuer: 'Amazon Web Services',
      issuedDate: '2026-06-01',
    },
  ],
  preferences: {
    preferredRoles: ['Software Engineer', 'Backend Developer', 'Cybersecurity Analyst'],
    preferredLocations: ['Pune', 'Bengaluru', 'Remote'],
    employmentTypes: ['Internship', 'Full-time'],
  },
  updatedAt: '2026-09-10T10:00:00.000Z',
}

export const mockAccountSettings: AccountSettings = {
  user: mockUser,
  notifications: {
    deadlineReminders: true,
    weeklyDigest: true,
    aiInsightAlerts: false,
  },
  careerPreferences: mockProfile.preferences,
}
