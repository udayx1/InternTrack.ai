import { getDashboardStats, getPipelineSummary } from '../services/analytics/dashboardService.js'
import { getCareerInsights } from '../services/analytics/insightsService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/dashboard
export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.userId)
  res.status(200).json(stats)
})

// GET /api/dashboard/pipeline
export const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await getPipelineSummary(req.userId)
  res.status(200).json(pipeline)
})

// GET /api/dashboard/insights
export const getInsights = asyncHandler(async (req, res) => {
  const insights = await getCareerInsights(req.userId)
  res.status(200).json(insights)
})
