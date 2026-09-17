import { Router } from 'express'
import { analyzeJob, matchJob } from '../controllers/jobController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.post('/analyze', analyzeJob)
router.post('/match', matchJob)

export default router
