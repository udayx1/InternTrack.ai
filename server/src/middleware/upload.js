import multer from 'multer'
import { ApiError } from '../utils/ApiError.js'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB, matches the "PDF, up to 5MB" copy in ResumeAnalyzer.tsx

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')
  if (!isPdf) {
    return cb(ApiError.badRequest('Only PDF files are accepted.', 'INVALID_FILE_TYPE'))
  }
  cb(null, true)
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single('resume')
