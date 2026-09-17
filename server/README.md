# InternTrack.ai — Stage 2 Backend

**Your AI Career Command Center** — Node.js + Express + MongoDB + Gemini backend, built to plug directly
into the existing Stage 1 React frontend with **zero UI changes** and exactly one small, documented
frontend fix (see [Frontend Integration Changes](#frontend-integration-changes)).

```
React Frontend  →  Frontend API Service Layer  →  Express  →  MongoDB  →  AI Service Layer  →  Gemini API
```

---

## 1. Final Backend Folder Structure

```
server/
  src/
    config/
      env.js                 # loads & validates environment variables
      db.js                  # MongoDB connection
    controllers/              # thin — parse request, call service/model, shape response
      authController.js
      profileController.js
      applicationController.js
      dashboardController.js
      resumeController.js
      jobController.js
      skillController.js
      aiController.js
    middleware/
      auth.js                 # JWT verification → req.userId / req.user
      errorHandler.js          # centralized error → { success:false, message, errorCode }
      upload.js                # Multer (memory storage, PDF-only, 5MB limit)
    models/                    # Mongoose schemas
      User.js
      Profile.js
      Application.js
      Resume.js
      ResumeAnalysis.js
      JobAnalysis.js
      SkillGap.js
      AIContent.js
    routes/
      authRoutes.js
      profileRoutes.js
      settingsRoutes.js
      applicationRoutes.js
      dashboardRoutes.js
      resumeRoutes.js
      jobRoutes.js
      skillRoutes.js
      aiRoutes.js
      index.js                 # mounts everything under /api
    services/
      ai/
        geminiService.js        # ONLY file that imports @google/generative-ai
        copilotService.js       # builds candidate context → generateText()
      resume/
        resumeParser.js         # pdf-parse + Gemini structured extraction
      job/
        jobExtractor.js         # Gemini: raw JD → structured job details + skills
        matchEngine.js           # deterministic, explainable scoring (NOT an AI call)
      skills/
        skillGapService.js
      analytics/
        dashboardService.js      # stats + pipeline, from real DB data only
        insightsService.js       # rule-based Career Insights, from real DB data only
    utils/
      ApiError.js
      asyncHandler.js
      id.js                     # prefixed string-id generator (usr_, app_, job_, …)
      jwt.js
      seed.js                   # optional demo-data seeder (`npm run seed`)
    validators/
      validate.js
    app.js                       # Express app assembly (middleware + routes)
    server.js                    # entry point (connects DB, starts listening)
  .env.example
  package.json
```

**Routes → Controllers → Services → Models** throughout; no business logic lives in route files, and no
Gemini calls happen anywhere outside `services/ai/geminiService.js`.

---

## 2. Why These Models (and no more)

| Model | Purpose |
|---|---|
| `User` | Auth identity only (name, email, passwordHash, avatarUrl). Password never leaves this file. |
| `Profile` | Everything the frontend's `Profile` interface needs (education, skills, projects, experience, certifications, preferences). One-to-one with `User`, keyed by the same `_id`. |
| `Application` | One document per tracked job application. Enum-locked to the frontend's exact 5 statuses. |
| `Resume` | Bridges the two-step upload → analyze flow: stores extracted PDF text between `POST /resume/upload` and `POST /resume/analyze`. |
| `ResumeAnalysis` | Structured Gemini output for a resume. |
| `JobAnalysis` | Structured Gemini + match-engine output for an analyzed job posting. |
| `SkillGap` | Latest computed skill-gap snapshot per `(user, targetRole)` — recomputed on every `GET`, persisted for auditability/analytics. |
| `AIContent` | Every piece of AI Copilot content ever generated (cover letters, emails, etc.), linked to an application when applicable. |

`Resume` was added beyond the brief's minimum list because the frontend's actual two-call upload/analyze
flow requires *something* to hold the extracted text in between — without it, `/resume/analyze` would have
nowhere to get its input from. No other collections were added.

---

## 3. Complete API List

All routes are prefixed with `/api`. All routes except `/health`, `/auth/register`, and `/auth/login`
require `Authorization: Bearer <token>`. **Response bodies are the raw resource, not `{success, data}`** —
this matches `apiClient.ts`, which parses the JSON body directly as `T`. Error bodies always include a
`message` field (the only field the frontend reads), plus `errorCode` for anyone consuming the API directly.

### Auth

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{ name, email, password }` | `201 { user, token }` |
| POST | `/auth/login` | — | `{ email, password }` | `200 { user, token }` |
| GET | `/auth/me` | ✅ | — | `200 User` |

### Profile & Settings

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/profile` | — | `200 Profile` |
| PUT | `/profile` | Partial `Profile` fields | `200 Profile` |
| GET | `/settings` | — | `200 AccountSettings` |

### Applications

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/applications?status=&search=` | — | `200 Application[]` |
| POST | `/applications` | `CreateApplicationPayload` | `201 Application` |
| GET | `/applications/:id` | — | `200 Application` |
| PUT | `/applications/:id` | Partial `Application` fields (e.g. `{ status }`) | `200 Application` |
| DELETE | `/applications/:id` | — | `204` |

Ownership is enforced on every single-application route — requesting another user's application returns
`404`, not `403`, so existence isn't leaked.

### Dashboard

| Method | Path | Response |
|---|---|---|
| GET | `/dashboard` | `200 DashboardStats` |
| GET | `/dashboard/pipeline` | `200 PipelineSummary[]` |
| GET | `/dashboard/insights` | `200 CareerInsightsData` |

Every number is computed live from the user's own `Application`/`JobAnalysis` documents — nothing is
hard-coded.

### Resume

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/resume/upload` | `multipart/form-data`, field `resume` (PDF, ≤5MB) | `201 ResumeFileMeta` |
| POST | `/resume/analyze` | `{ resumeId }` | `200 ResumeAnalysis` |

### Job Analyzer

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/jobs/analyze` | `{ company, role, jobUrl?, jobDescription }` | `200 JobAnalysis` |
| POST | `/jobs/match` | `{ jobAnalysisId }` | `200 JobAnalysis` (re-scored against latest profile) |

`jobService.matchJob` exists in the frontend service layer but isn't currently called from any page
(`JobAnalyzer.tsx` gets score + breakdown in one shot from `/jobs/analyze`). The endpoint is implemented
anyway for contract completeness.

### Skill Gap

| Method | Path | Response |
|---|---|---|
| GET | `/skills/gap?role=` | `200 SkillGap` |

### AI Application Copilot

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/ai/cover-letter` | `{ applicationId?, context }` | `200 AIContent` |
| POST | `/ai/application-email` | `{ applicationId?, context }` | `200 AIContent` |
| POST | `/ai/generate-response` | `{ applicationId?, type, context }` | `200 AIContent` |
| POST | `/ai/improve-resume` | `{ applicationId?, context }` | `200 AIContent` |

All four pull the candidate's real `Profile`, the referenced `Application` (if `applicationId` is given),
and their latest `ResumeAnalysis` to personalize the output — they do not fall back to a generic template
when real data is available.

---

## 4. Request/Response Examples

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{ "name": "Aditi Sharma", "email": "aditi@example.com", "password": "hunter22" }
```
```json
201
{
  "user": { "id": "usr_...", "name": "Aditi Sharma", "email": "aditi@example.com", "createdAt": "2026-09-16T..." },
  "token": "eyJhbGciOi..."
}
```

**Create an application**
```http
POST /api/applications
Authorization: Bearer <token>

{ "company": "Razorpay", "role": "SDE Intern", "status": "Applied", "appliedDate": "2026-09-16" }
```
```json
201
{
  "id": "app_...", "userId": "usr_...", "company": "Razorpay", "role": "SDE Intern",
  "status": "Applied", "appliedDate": "2026-09-16", "matchedSkills": [], "missingSkills": [],
  "createdAt": "...", "updatedAt": "..."
}
```

**Analyze a job**
```http
POST /api/jobs/analyze
Authorization: Bearer <token>

{ "company": "Atlassian", "role": "Backend Intern", "jobDescription": "We're looking for..." }
```
```json
200
{
  "id": "job_...",
  "jobDetails": { "company": "Atlassian", "role": "Backend Intern", "jobType": "Internship", "...": "..." },
  "jobDescription": "We're looking for...",
  "match": {
    "overallScore": 78,
    "breakdown": { "technicalSkills": 80, "education": 85, "experience": 65, "projects": 75 },
    "matchedSkills": ["Node.js", "MongoDB"],
    "missingSkills": ["Docker", "AWS"]
  },
  "analyzedAt": "..."
}
```

**Error shape (any endpoint)**
```json
400
{ "success": false, "message": "Company is required. Role is required.", "errorCode": "VALIDATION_ERROR" }
```

---

## 5. AI Architecture

```
Controller → services/ai/geminiService.js → Gemini API → parsed & validated JSON/text → Controller
```

- `geminiService.js` is the **only** module that imports `@google/generative-ai` or reads `GEMINI_API_KEY`.
  It exposes `generateJSON()` (structured output, `responseMimeType: "application/json"`, one automatic
  retry with a stricter instruction if parsing fails) and `generateText()` (free-form copilot content).
- **Job matching is deliberately split in two**: `jobExtractor.js` asks Gemini only to *extract* structured
  facts (skills, location, deadline) from the JD — it never scores anything. `matchEngine.js` is 100%
  deterministic JavaScript that scores the candidate against those extracted requirements. This keeps the
  match score explainable and reproducible, per the requirement that it never be presented as a prediction
  of hiring probability.
- **Resume analysis** (`resumeParser.js`) extracts PDF text locally (`pdf-parse`) and sends only the text
  to Gemini with a strict JSON schema prompt.
- **AI Copilot** (`copilotService.js`) assembles real context (profile + application + resume analysis)
  before calling Gemini — it does not generate generic filler when real data exists.
- **Career Insights and Dashboard stats are NOT AI-generated** — they're computed directly from the
  database (see `analytics/`). This was a deliberate reliability choice for a 48-hour build: dashboard
  numbers must never depend on an external API being up.
- All Gemini failures (bad JSON, timeout, rate limit, missing API key) are normalized into a `502
  AI_*_FAILED` / `500 AI_NOT_CONFIGURED` `ApiError` and surfaced to the frontend as a plain `message`,
  which the UI already renders via each page's existing `ErrorState` component.

---

## 6. Environment Variables

See `.env.example`. Required: `MONGODB_URI`, `JWT_SECRET`. Optional with sensible defaults: `PORT` (5000),
`JWT_EXPIRES_IN` (7d), `GEMINI_MODEL` (gemini-1.5-flash), `CLIENT_URL` (http://localhost:5173). If
`GEMINI_API_KEY` is unset, every AI-backed endpoint (resume analysis, job analysis, AI copilot) returns a
clean `500 AI_NOT_CONFIGURED` error instead of crashing the server — everything else (auth, applications,
dashboard, profile) works without it.

---

## 7. Frontend Integration Changes

Two changes were made to the Stage 1 frontend, both minimal and both required for the app to actually work
against a real backend rather than mocks:

### 7.1 `src/lib/apiClient.ts` — support `FormData` uploads (code change)

**Why necessary:** `resumeService.uploadResume()` builds a `FormData` and passes it to `apiClient.post()`,
but the client unconditionally set `Content-Type: application/json` and ran every body through
`JSON.stringify()`. That silently corrupts a multipart upload — the file never actually reaches the server
correctly. This isn't a hypothetical: the frontend's own code comment on that line flags it as a known gap
("`apiClient is JSON-only by design; Stage 2 should expose a dedicated multipart upload endpoint or a
signed-URL flow here`").

**What changed:** `request()` now detects `options.body instanceof FormData` and, only in that case, skips
setting `Content-Type` (so the browser sets the correct `multipart/form-data; boundary=...` itself) and
passes the `FormData` straight through instead of stringifying it.

**Why it stays compatible:** every other call path in the app passes a plain object or `undefined`, so
`isFormData` is `false` and the exact original behavior (JSON stringify + `Content-Type: application/json`)
is unchanged. No service, component, or type signature was touched.

### 7.2 `.env` — flip mocks off (config change, not code)

`VITE_USE_MOCKS` is set to `false` and `VITE_API_BASE_URL` points at `http://localhost:5000/api`. This is
exactly the switch the frontend's own `.env.example` comment describes: *"Flip to false once the Stage 2
backend is live."* No source file changes.

No other frontend file was modified. Every service, type, page, and component is untouched.

---

## 8. Local Setup Instructions

```bash
# 1. Backend
cd server
cp .env.example .env        # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run seed                 # optional: creates a demo user + sample data
npm run dev                  # http://localhost:5000

# 2. Frontend (separate terminal)
cd interntrack-ai
npm install
npm run dev                  # http://localhost:5173, VITE_USE_MOCKS=false already set
```

Demo login after seeding: `aditi.sharma@ghristu.edu.in` / `password123`.

---

## 9. Deployment Instructions

1. **MongoDB Atlas**: create a free cluster, add a database user, allowlist your deployment host's IP (or
   `0.0.0.0/0` for a hackathon demo), and copy the connection string into `MONGODB_URI`.
2. **Backend hosting** (Render / Railway / Fly.io / a VM): set `MONGODB_URI`, `JWT_SECRET`,
   `GEMINI_API_KEY`, and `CLIENT_URL` (your deployed frontend's origin, for CORS) as environment variables.
   Start command: `npm start`.
3. **Gemini API key**: create one at [Google AI Studio](https://aistudio.google.com/) and set it as
   `GEMINI_API_KEY` on the backend host only — it must never be defined in any `VITE_*` frontend variable.
4. **Frontend hosting** (Vercel / Netlify): set `VITE_API_BASE_URL` to your deployed backend's `/api` URL
   and `VITE_USE_MOCKS=false` as build-time environment variables.
5. Redeploy the backend first, confirm `GET /api/health` returns `200`, then redeploy the frontend.

---

## 10. Testing Checklist

- [ ] Register a new user → 201, receives `{user, token}`; duplicate email → 409
- [ ] Login with correct/incorrect password → 200 / 401
- [ ] `GET /auth/me` with no token → 401; with valid token → 200
- [ ] `GET /profile` right after register → returns an (empty-ish) Profile, not 404
- [ ] `PUT /profile` partial update → only touched fields change, `updatedAt` bumps
- [ ] Create → list → get → update status → delete an application, each as the owning user
- [ ] Attempt to `GET`/`PUT`/`DELETE` another user's application id → 404
- [ ] `GET /dashboard`, `/dashboard/pipeline`, `/dashboard/insights` reflect real applications, not mock numbers
- [ ] Upload a real PDF resume → `ResumeFileMeta`; upload a `.docx` → 400 `INVALID_FILE_TYPE`
- [ ] `POST /resume/analyze` with the returned `resumeId` → structured `ResumeAnalysis`
- [ ] `POST /jobs/analyze` with a real JD → `JobAnalysis` with a breakdown that sums sensibly
- [ ] `GET /skills/gap` before and after adding skills to the profile → `matchedSkills` changes accordingly
- [ ] Each `/ai/*` endpoint with and without an `applicationId` → personalized content in both cases
- [ ] Stop the server without `GEMINI_API_KEY` set → AI endpoints return clean `500`, everything else still works
- [ ] Full frontend flow end-to-end with `VITE_USE_MOCKS=false`: register → login → dashboard → add
      application → move it in Pipeline → upload+analyze resume → analyze a job → view skill gap →
      generate a cover letter → back to dashboard, all showing real data

---

## 11. Known Limitations

- No refresh-token rotation — a single long-lived JWT (`JWT_EXPIRES_IN`, default 7 days) is used for
  simplicity, appropriate for a 48-hour hackathon build.
- `POST /jobs/match` is implemented per the original spec but is not called anywhere in the current
  frontend, so it's exercised only by direct API tests.
- Resume parsing assumes a text-based PDF; scanned/image-only PDFs will fail extraction with a clear 400.
- Career Insights are deterministic/rule-based rather than AI-authored — a conscious reliability trade-off
  documented in [AI Architecture](#5-ai-architecture).
- `SettingsPage.tsx`'s notification preferences are read-only defaults on the backend today because
  `userService.ts` never defines an update call for them — no endpoint was invented for a write path the
  frontend doesn't use.
- No automated test suite is included; the Testing Checklist above is manual. Given hackathon time
  constraints, correctness was validated via direct endpoint testing (see Section 10) rather than a CI
  suite.

## 12. Future Improvements

- Add refresh tokens + short-lived access tokens.
- Rate-limit `/ai/*` and `/resume/analyze` per user to control Gemini cost/abuse.
- Move resume storage to S3/GridFS instead of holding extracted text only (enables re-analysis without
  re-upload, and lets users download their original file back).
- Let Gemini phrase Career Insights on top of the already-computed rule-based numbers, rather than fully
  replacing the deterministic layer.
- Add an automated test suite (Jest + Supertest + `mongodb-memory-server`).
- Real notification delivery (email/push) behind the `NotificationPreferences` already modeled in
  `AccountSettings`.

---

## AI Usage Disclosure

This project was developed with AI-assisted development tools (an AI coding assistant was used to design,
write, and review the Stage 2 backend architecture, models, routes, and documentation in this repository).

At **runtime**, the deployed application calls the **Google Gemini API** (`@google/generative-ai`, model
configurable via `GEMINI_MODEL`, default `gemini-1.5-flash`) from the backend only, for: resume analysis,
job description extraction, and AI Application Copilot content generation (cover letters, application
emails, "why hire me" pitches, resume improvement suggestions, and custom responses). The Gemini API key is
never exposed to the frontend or the browser.
