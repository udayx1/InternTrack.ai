import { Router } from 'express'
import { getSkillGap } from '../controllers/skillController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/gap', requireAuth, getSkillGap)

export default router
