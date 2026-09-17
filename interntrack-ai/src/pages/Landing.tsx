import React from 'react'
import { Link } from 'react-router-dom'
import {
  FileSearch,
  Target,
  Sparkles,
  Kanban,
  LineChart,
  ScanSearch,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: ScanSearch,
    title: 'AI Resume Analysis',
    description:
      'Upload your resume and get a structured breakdown of your skills, projects and gaps — with concrete suggestions to strengthen it.',
  },
  {
    icon: FileSearch,
    title: 'Job Match Intelligence',
    description:
      'Paste any job description to get an explainable match score, broken down by skills, education, experience and projects.',
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    description:
      'See exactly which skills separate you from your target role, ranked by priority and why they matter.',
  },
  {
    icon: Sparkles,
    title: 'Application Copilot',
    description:
      'Generate tailored cover letters, application emails and "why hire me" pitches from your profile and a job description.',
  },
  {
    icon: Kanban,
    title: 'Smart Application Tracking',
    description:
      'Track every application through a clean Kanban pipeline — from Applied to Offer — with deadlines and follow-ups in view.',
  },
  {
    icon: LineChart,
    title: 'Career Insights',
    description:
      'Spot trends across your applications: which skills keep coming up, which roles fit best, and what needs a follow-up.',
  },
]

const journey = [
  'Student Profile',
  'Resume Analysis',
  'Job Analysis',
  'Match Analysis',
  'Skill Gap',
  'Application Copilot',
  'Application Tracking',
  'Career Insights',
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
            Built for the Hack2Ignite national hackathon
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            InternTrack<span className="text-brand-600">.ai</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-ink-700">Your AI Career Command Center</p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-500">
            InternTrack.ai helps students discover suitable opportunities, understand their skill
            gaps, personalize applications and manage their entire career journey — in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-ink-300/40 bg-white px-6 py-3 text-sm font-medium text-ink-700 hover:bg-surface-muted"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-ink-300/25 bg-white p-3 shadow-popover">
          <div className="rounded-xl bg-surface-page p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-ink-700">This week's snapshot</p>
              <span className="text-xs text-ink-400">Mock preview</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Applications', value: '12' },
                { label: 'Interviews', value: '3' },
                { label: 'Avg. Match', value: '81%' },
                { label: 'Offers', value: '1' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-ink-300/20 bg-white p-4">
                  <p className="text-xs text-ink-400">{s.label}</p>
                  <p className="mt-1 text-xl font-semibold text-ink-900">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="border-y border-ink-300/20 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold text-ink-900">Your journey, end to end</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {journey.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full border border-ink-300/30 bg-surface-page px-4 py-2 text-sm text-ink-700">
                  {step}
                </span>
                {i < journey.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-ink-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-ink-900">Everything you need to land the role</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-500">
          Six focused tools that work together, built around a single student career profile.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-ink-300/25 bg-white p-6 shadow-card">
              <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-2.5 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl bg-brand-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-semibold">Ready to take control of your career journey?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-100">
            Set up your profile in minutes and get your first job match score today.
          </p>
          <Link
            to="/register"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
