import { Router } from 'express'
import { getSettings } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getSettings)

export default router
