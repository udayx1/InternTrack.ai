import { Router } from 'express'
import { getStats, getPipeline, getInsights } from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', getStats)
router.get('/pipeline', getPipeline)
router.get('/insights', getInsights)

export default router
