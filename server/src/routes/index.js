import { Router } from 'express'
import authRoutes from './authRoutes.js'
import profileRoutes from './profileRoutes.js'
import settingsRoutes from './settingsRoutes.js'
import applicationRoutes from './applicationRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import resumeRoutes from './resumeRoutes.js'
import jobRoutes from './jobRoutes.js'
import skillRoutes from './skillRoutes.js'
import aiRoutes from './aiRoutes.js'

const router = Router()

router.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'interntrack-ai-backend' }))

router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
router.use('/settings', settingsRoutes)
router.use('/applications', applicationRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/resume', resumeRoutes)
router.use('/jobs', jobRoutes)
router.use('/skills', skillRoutes)
router.use('/ai', aiRoutes)

export default router
