<div align="center">

# 🚀 InternTrack.ai
### *Your AI Career Command Center*

**Stop juggling spreadsheets and browser tabs. Track every application, close every skill gap, and let AI write your next cover letter — all in one place.**

Built for **Hack2Ignite** — a national-level hackathon.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Gemini](https://img.shields.io/badge/AI-Gemini_API-8E75B2?logo=googlegemini&logoColor=white)](#)

[Live Demo](https://interntrackai.vercel.app/) · [Demo Video](https://youtu.be/NixWe7PzwPw) · [Features](#-features) · [Architecture](#-architecture) · [Setup](#-getting-started) · [Team](#-team)

</div>

---

## 📌 The Problem

Every job-hunting student ends up running the same broken workflow: a messy spreadsheet of applications,
a dozen browser tabs of job descriptions, a resume that hasn't been updated since the last rejection, and
zero visibility into *why* they aren't hearing back. Nobody tells them which skills are actually missing,
whether their resume matches the role, or how to write a cover letter that isn't generic.

## 💡 Our Solution

**InternTrack.ai** is a single command center that replaces all of that:

- One **pipeline board** for every application, from "Applied" to "Offer."
- An **AI resume analyzer** that reads your actual resume and tells you your real strengths and gaps.
- A **job match engine** that gives you an explainable score — not a black-box guess — for how well you
  fit a specific posting, and exactly which skills are missing.
- A **skill gap tracker** that turns "missing skills" into a prioritized, personalized learning plan.
- An **AI application copilot** that drafts cover letters, application emails, and "why hire me" pitches —
  grounded in your real profile and the real job description, not generic templates.

Everything is backed by a real account, a real database, and real AI — not mock data.

---

## 🎥 Demo Video

> 📹 *[Demo Video]*(https://youtu.be/NixWe7PzwPw)

## 🌐 Live Demo

> 🔗 *[Live Demo]*(https://interntrackai.vercel.app/)
> **Demo login:** `aditi.sharma@ghristu.edu.in` / `password123` *(seeded via `npm run seed`)*

---

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 🔐 | **Auth** | JWT-based register/login, persistent sessions, protected routes |
| 📊 | **Dashboard** | Live stats — total/active applications, interviews, offers, average match score, upcoming deadlines — computed from real data, never hard-coded |
| 🗂️ | **Application Pipeline** | Kanban-style board across all 5 stages (Applied → Online Assessment → Interview → Offer → Rejected), drag to update status |
| 📄 | **Resume Analyzer** | Upload a PDF, get AI-extracted skills, education, projects, experience, strengths, gaps, and improvement suggestions |
| 🎯 | **Job Analyzer & Match Engine** | Paste any job description → structured extraction (role, required skills, experience) + an **explainable** match score broken down by Technical Skills / Education / Experience / Projects |
| 📈 | **Skill Gap Tracker** | Compares your profile against your target role's real requirements (pulled from your own analyzed jobs), with prioritized recommendations |
| ✍️ | **AI Application Copilot** | Generates personalized cover letters, application emails, and pitches — using your actual profile, resume, and the specific job, not a generic mad-lib |
| 🧠 | **Career Insights** | Follow-up reminders, common missing skills, strongest-matching roles, and application trends — all derived from your own history |
| 👤 | **Career Profile** | Editable profile: education, skills, projects, experience, certifications, preferences |

---

## 🏗️ Architecture

```
┌──────────────────┐      ┌─────────────────────┐      ┌────────────────┐      ┌──────────┐      ┌─────────────────┐      ┌────────────┐
│  React Frontend   │ ───▶ │ Frontend API Client   │ ───▶ │ Express Backend │ ───▶ │ MongoDB   │      │  AI Service Layer │ ───▶ │ Gemini API │
│  (Stage 1 — as-is)│      │ (apiClient.ts)        │      │ (Stage 2 — new) │      │  Atlas    │ ◀─── │ (geminiService.js) │      │            │
└──────────────────┘      └─────────────────────┘      └────────────────┘      └──────────┘      └─────────────────┘      └────────────┘
```

**Clean layering on the backend:** `Routes → Controllers → Services → Models`. Controllers never talk to
Gemini directly — every AI call funnels through one centralized service, and the Gemini API key never
leaves the backend.

**Why this matters for judges:** Stage 1 (frontend) and Stage 2 (backend) were built independently and
integrated by contract — the backend was built by reverse-engineering the frontend's actual TypeScript
types and API service layer, not by guessing. The result is one product, not two bolted-together halves.

<details>
<summary><b>📁 Full folder structure</b></summary>

```
interntrack-ai-fullstack/
├── interntrack-ai/          # React + TypeScript + Vite frontend
│   └── src/
│       ├── pages/            # Dashboard, Pipeline, ResumeAnalyzer, JobAnalyzer,
│       │                     # SkillGapPage, AICopilot, CareerProfile, CareerInsights, Settings...
│       ├── services/         # authService, applicationService, dashboardService,
│       │                     # resumeService, jobService, skillService, aiService, userService
│       ├── context/           # AuthContext
│       └── types/              # single source of truth for every data shape
└── server/                    # Node.js + Express + MongoDB + Gemini backend
    └── src/
        ├── controllers/  → routes/  → services/{ai,resume,job,skills,analytics}/  → models/
```

</details>

---

## 🧩 Tech Stack

<table>
<tr><td><b>Frontend</b></td><td>React 18, TypeScript, Vite, React Router, Tailwind CSS, Recharts, Lucide Icons</td></tr>
<tr><td><b>Backend</b></td><td>Node.js, Express.js, JWT, bcryptjs, Multer, pdf-parse</td></tr>
<tr><td><b>Database</b></td><td>MongoDB Atlas + Mongoose ODM</td></tr>
<tr><td><b>AI</b></td><td>Google Gemini API (structured JSON extraction + personalized generation), called server-side only</td></tr>
</table>

---

## 🤖 What Makes Our AI Different

- **Explainable, not a black box.** The job match score isn't a single AI-guessed number — Gemini only
  *extracts* facts (required skills, experience level) from the posting; a transparent, deterministic
  scoring engine computes the breakdown by Technical Skills, Education, Experience, and Projects. We never
  present it as a prediction of whether you'll get hired.
- **Grounded, not generic.** Every AI-generated cover letter, email, or pitch is built from your *actual*
  stored profile, resume analysis, and the specific job — the same request with an empty profile produces
  visibly different, more generic output, proving the personalization is real.
- **Resilient by design.** Dashboard stats and Career Insights are computed directly from your real
  application data rather than depending on an external AI call, so the core product works even if the AI
  provider has a hiccup mid-demo.

---

## 🎬 Demo Flow (What We'll Show Judges)

1. **Register** a new account → land on an empty, real Dashboard (not a mock one).
2. **Add an application** → watch it appear instantly on the **Pipeline** board.
3. **Drag it to "Interview"** → status updates persist to MongoDB.
4. **Upload a real resume (PDF)** → AI extracts skills, strengths, and gaps live.
5. **Paste a real job description** → get an explainable match score with a skill breakdown.
6. **Open Skill Gap** → see exactly which skills to learn next, prioritized.
7. **Generate a cover letter** with one click → personalized using everything above.
8. **Return to Dashboard** → every number has changed to reflect the real data just created.

---

## 🚀 Getting Started

```bash
# Backend
cd server
cp .env.example .env        # add your MongoDB Atlas URI + Gemini API key
npm install
npm run seed                  # optional demo data
npm run dev                    # → http://localhost:5000

# Frontend
cd interntrack-ai
npm install
npm run dev                     # → http://localhost:5173
```

📖 Full API reference, request/response examples, deployment steps, and the testing checklist live in
[`server/README.md`](./server/README.md).

---

## 🔮 What's Next

- Refresh-token auth + per-user AI rate limiting
- Resume storage in S3/GridFS for re-analysis without re-upload
- Browser extension to auto-log applications from job boards
- AI-phrased Career Insights layered on top of the existing rule-based numbers

---

## 👥 Team

| Name | Role |
|---|---|---|
| `Uday Shinde` | `[Backend and AI Integration]` |
| `Shivani Mourya` | `[Frontend]` |
| `Pratiksha Bendhbar` | `[Database & Documentations]` |

## 🏆 Built For

**Hack2Ignite** — a national-level hackathon.

## 🤝 AI Usage Disclosure

This project was built with the help of AI-assisted development tools during the hackathon (design,
scaffolding, and code review). At runtime, the deployed app calls the **Google Gemini API** server-side
for resume analysis, job description extraction, and AI-generated application content. Full disclosure in
[`server/README.md`](./server/README.md#ai-usage-disclosure).

---

<div align="center">

**InternTrack.ai** — because your job search deserves better than a spreadsheet.

</div>
