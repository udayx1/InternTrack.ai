import { Application, APPLICATION_STATUSES } from '../models/Application.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { assertValid, isNonEmptyString, isValidId } from '../validators/validate.js'

async function findOwnedOrThrow(id, userId) {
  if (!isValidId(id)) throw ApiError.badRequest('Invalid application id.', 'INVALID_ID')
  const application = await Application.findById(id)
  if (!application) throw ApiError.notFound('Application not found.')
  if (application.userId !== userId) {
    // Users must never be able to access another user's applications — treat
    // it as not-found rather than forbidden so we don't leak existence.
    throw ApiError.notFound('Application not found.')
  }
  return application
}

// GET /api/applications?status=&search=
export const listApplications = asyncHandler(async (req, res) => {
  const { status, search } = req.query
  const filter = { userId: req.userId }
  if (status && APPLICATION_STATUSES.includes(status)) filter.status = status
  if (search) {
    const regex = new RegExp(search.toString().trim(), 'i')
    filter.$or = [{ company: regex }, { role: regex }]
  }

  const applications = await Application.find(filter).sort({ createdAt: -1 })
  res.status(200).json(applications.map((a) => a.toJSON()))
})

// GET /api/applications/:id
export const getApplication = asyncHandler(async (req, res) => {
  const application = await findOwnedOrThrow(req.params.id, req.userId)
  res.status(200).json(application.toJSON())
})

// POST /api/applications
export const createApplication = asyncHandler(async (req, res) => {
  const { company, role, jobDescription, jobUrl, location, status, appliedDate, deadline, matchScore, notes } =
    req.body ?? {}

  assertValid([
    [isNonEmptyString(company), 'Company is required.'],
    [isNonEmptyString(role), 'Role is required.'],
    [isNonEmptyString(appliedDate), 'Applied date is required.'],
    [!status || APPLICATION_STATUSES.includes(status), `Status must be one of: ${APPLICATION_STATUSES.join(', ')}.`],
  ])

  const application = await Application.create({
    userId: req.userId,
    company: company.trim(),
    role: role.trim(),
    jobDescription,
    jobUrl,
    location,
    status: status || 'Applied',
    appliedDate,
    deadline,
    matchScore,
    matchedSkills: req.body?.matchedSkills ?? [],
    missingSkills: req.body?.missingSkills ?? [],
    notes,
  })

  res.status(201).json(application.toJSON())
})

// PUT /api/applications/:id
export const updateApplication = asyncHandler(async (req, res) => {
  const application = await findOwnedOrThrow(req.params.id, req.userId)

  const editable = [
    'company',
    'role',
    'jobDescription',
    'jobUrl',
    'location',
    'status',
    'appliedDate',
    'deadline',
    'matchScore',
    'matchedSkills',
    'missingSkills',
    'notes',
  ]
  for (const key of editable) {
    if (req.body?.[key] !== undefined) application[key] = req.body[key]
  }

  if (application.status && !APPLICATION_STATUSES.includes(application.status)) {
    throw ApiError.badRequest(`Status must be one of: ${APPLICATION_STATUSES.join(', ')}.`, 'INVALID_STATUS')
  }

  await application.save()
  res.status(200).json(application.toJSON())
})

// DELETE /api/applications/:id
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await findOwnedOrThrow(req.params.id, req.userId)
  await application.deleteOne()
  res.status(204).send()
})
