# InternTrack.ai — Stage 1 (Frontend)

**Your AI Career Command Center** — a student-centric career platform built for the
Hack2Ignite national hackathon (Open Innovation track).

This is the **Stage 1 frontend-only** build. It runs entirely on typed mock data behind
a service layer, and is architected so Stage 2 (Node.js + Express + MongoDB + AI) can be
wired in by editing internals of `src/services/*` only — no component, page, or type
changes required.

---

## 1. Running the project

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Any email/password works on Login/Register —
authentication is fully mocked in Stage 1 (see `src/services/authService.ts`).

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
```

### Environment variables

Copy `.env.example` to `.env` (already done for you) and adjust as needed:

```bash
VITE_API_BASE_URL=http://localhost:5000/api   # Stage 2 backend base URL
VITE_USE_MOCKS=true                            # false once Stage 2 endpoints are live
```

Never hard-code the backend URL anywhere else — every service reads it through
`src/lib/apiClient.ts`.

---

## 2. Project structure

```
src/
  components/     Shared UI: Button, Card, Badge, StatCard, ProgressBar, ScoreRing,
                  loading/error/empty states, ProtectedRoute
  pages/          One file per route (14 pages, see below)
  layouts/        PublicLayout (marketing/auth), DashboardLayout (sidebar app shell)
  context/        AuthContext — centralized auth state
  services/       The ONLY files that talk to the network (or mocks). Components never
                  call fetch/axios directly.
  types/          Shared TypeScript interfaces — the frontend/backend contract
  mocks/          Mock data, typed against src/types — swap-compatible with real API
                  responses
  lib/            apiClient.ts (centralized HTTP client, reads VITE_API_BASE_URL)
  utils/          (reserved for shared helpers as the app grows)
```

## 3. Pages

Public: Landing, Login, Register.

Authenticated (under `/app/*`, gated by `ProtectedRoute` + `AuthContext`): Dashboard,
Application Pipeline (Kanban), Applications (list/search/filter), Add Application,
Job Analyzer, Resume Analyzer, Career Profile, Skill Gap, AI Application Copilot,
AI Career Insights, Settings.

## 4. Service layer / API contract

Every service in `src/services/` has a mock branch (`USE_MOCKS`) and a real branch that
calls `apiClient`, matching this endpoint contract:

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/profile
PUT    /api/profile
GET    /api/settings

GET    /api/dashboard
GET    /api/dashboard/pipeline
GET    /api/dashboard/insights

GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id

POST   /api/resume/upload      (multipart — see note below)
POST   /api/resume/analyze

POST   /api/jobs/analyze
POST   /api/jobs/match

GET    /api/skills/gap

POST   /api/ai/cover-letter
POST   /api/ai/application-email
POST   /api/ai/improve-resume
POST   /api/ai/generate-response
```

Response shapes must match the interfaces in `src/types/index.ts` (`User`, `Profile`,
`Application`, `JobAnalysis`, `ResumeAnalysis`, `SkillGap`, `AIContent`,
`DashboardStats`, `CareerInsightsData`, etc.). Mock data in `src/mocks/` already
conforms to these — use it as sample fixtures for backend tests.

**Note on resume upload:** `apiClient` is JSON-only by design (see
`src/lib/apiClient.ts`). `resumeService.uploadResume()` currently builds a `FormData`
directly — Stage 2 should either expose a dedicated multipart endpoint that accepts this,
or a signed-URL flow; either way only `resumeService.ts` needs to change.

## 5. Exact files Stage 2 backend developers touch

To go live, flip `VITE_USE_MOCKS=false` and implement each endpoint above. Per-service,
the `if (USE_MOCKS) { ... }` branch is what gets removed/ignored; the `apiClient.*` calls
below it are already correctly wired to the contract:

- `src/services/authService.ts`
- `src/services/userService.ts`
- `src/services/applicationService.ts`
- `src/services/jobService.ts`
- `src/services/resumeService.ts`
- `src/services/skillService.ts`
- `src/services/aiService.ts`
- `src/services/dashboardService.ts`
- `src/lib/apiClient.ts` — auth token storage/header injection; adjust only if the
  Stage 2 auth scheme differs from a Bearer JWT

No changes should be needed in `src/pages/`, `src/components/`, `src/layouts/`, or
`src/types/` — if a backend response doesn't fit an existing type, extend the type
rather than reshaping data inside a component.

## 6. Design language

Purple/indigo primary accent (`brand-*` in `tailwind.config.js`), light backgrounds,
rounded cards with a soft shadow, spacious layout, clean top nav / sidebar — matching
the original InternTrack dashboard, extended into a fuller SaaS product for
InternTrack.ai.

## 7. Security

No AI provider keys exist anywhere in this codebase. The frontend only ever calls
`VITE_API_BASE_URL` (your Stage 2 backend); the backend is solely responsible for
holding and using any AI provider keys.
