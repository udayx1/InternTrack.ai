import { Router } from 'express'
import {
  generateCoverLetter,
  generateApplicationEmail,
  generateResponse,
  improveResume,
} from '../controllers/aiController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.post('/cover-letter', generateCoverLetter)
router.post('/application-email', generateApplicationEmail)
router.post('/generate-response', generateResponse)
router.post('/improve-resume', improveResume)

export default router
