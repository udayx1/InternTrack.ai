// Optional convenience script: `npm run seed`
// Creates one demo user (matching the Stage 1 mock user/profile so the demo
// looks identical to the old mocked UI) plus a few sample applications.
// Safe to run multiple times — it upserts by email.
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Profile } from '../models/Profile.js'
import { Application } from '../models/Application.js'
import mongoose from 'mongoose'

const DEMO_EMAIL = 'aditi.sharma@ghristu.edu.in'
const DEMO_PASSWORD = 'password123'

async function seed() {
  await connectDB()

  let user = await User.findOne({ email: DEMO_EMAIL })
  if (!user) {
    const passwordHash = await User.hashPassword(DEMO_PASSWORD)
    user = await User.create({ name: 'Aditi Sharma', email: DEMO_EMAIL, passwordHash })
    console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  } else {
    console.log(`Demo user already exists: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  }

  await Profile.findByIdAndUpdate(
    user.id,
    {
      $set: {
        fullName: 'Aditi Sharma',
        headline: 'Pre-final year Computer Engineering student · Backend & Cloud',
        location: 'Pune, Maharashtra',
        education: {
          university: 'G.H. Raisoni International Skill Tech University',
          degree: 'B.Tech',
          branch: 'Computer Engineering',
          graduationYear: 2028,
          cgpa: '8.4',
        },
        skills: ['C++', 'React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'Java', 'Spring Boot', 'Git', 'REST APIs'],
        projects: [
          {
            title: 'InternTrack',
            description: 'A MERN stack internship and job application tracker with a Kanban pipeline.',
            techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
            link: 'https://github.com/udayx-dev/InternTrack',
          },
          {
            title: 'NexaBank ATM',
            description: 'A Java + Spring Boot simulated banking application with transaction handling.',
            techStack: ['Java', 'Spring Boot', 'MySQL'],
          },
        ],
        experience: [
          {
            organization: 'College Developers Club',
            role: 'Student Coordinator',
            startDate: '2025-01-01',
            description: 'Coordinate 700+ member developer community, organize workshops and hackathons.',
          },
        ],
        preferences: {
          preferredRoles: ['Software Engineer', 'Backend Developer', 'Cybersecurity Analyst'],
          preferredLocations: ['Pune', 'Bengaluru', 'Remote'],
          employmentTypes: ['Internship', 'Full-time'],
        },
      },
    },
    { upsert: true },
  )
  console.log('Seeded profile.')

  const existingApps = await Application.countDocuments({ userId: user.id })
  if (existingApps === 0) {
    await Application.insertMany([
      {
        userId: user.id,
        company: 'UBS Technology India',
        role: 'Software Engineer Intern',
        location: 'Pune, IN',
        status: 'Interview',
        appliedDate: '2026-08-20',
        deadline: '2026-09-25',
        matchScore: 84,
        matchedSkills: ['Java', 'Spring Boot', 'REST APIs', 'Git'],
        missingSkills: ['Kubernetes', 'Kafka'],
        notes: 'Technical round scheduled for next week.',
      },
      {
        userId: user.id,
        company: 'Razorpay',
        role: 'SDE Intern',
        location: 'Remote',
        status: 'Offer',
        appliedDate: '2026-07-15',
        deadline: '2026-08-01',
        matchScore: 91,
        matchedSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
        missingSkills: [],
        notes: 'Offer received.',
      },
      {
        userId: user.id,
        company: 'Capgemini',
        role: 'Software Engineering Trainee',
        location: 'Pune, IN',
        status: 'Applied',
        appliedDate: '2026-09-08',
        deadline: '2026-09-30',
        matchScore: 88,
        matchedSkills: ['Java', 'React', 'MongoDB', 'Git'],
        missingSkills: ['Docker'],
      },
    ])
    console.log('Seeded 3 sample applications.')
  } else {
    console.log('Applications already exist for this user, skipping.')
  }

  await mongoose.disconnect()
  console.log('Done.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
