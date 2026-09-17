import { Router } from 'express'
import { uploadResume, analyzeResume } from '../controllers/resumeController.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadResume as multerUpload } from '../middleware/upload.js'

const router = Router()

router.use(requireAuth)
router.post('/upload', multerUpload, uploadResume)
router.post('/analyze', analyzeResume)

export default router
