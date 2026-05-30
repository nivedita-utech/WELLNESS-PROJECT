import express from 'express';
import {
  createBodyAnalysis,
  createMedicalReport,
  getBodyAnalysis,
  getMedicalReports,
  uploadDocument,
  getUploadedDocuments,
  getAIInsights,
} from '../controllers/healthController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Body Analysis
router.post('/body-analysis', protect, authorize('admin', 'staff'), createBodyAnalysis);
router.get('/body-analysis/:userId', protect, getBodyAnalysis);

// Medical Reports
router.post('/medical-report', protect, authorize('admin', 'staff'), createMedicalReport);
router.get('/medical-report/:userId', protect, getMedicalReports);

// AI Insights Comparisons
router.get('/ai-insights/:userId', protect, getAIInsights);

// Document Locker uploads
router.post('/upload-document', protect, upload.single('file'), uploadDocument);
router.get('/documents/:userId', protect, getUploadedDocuments);

export default router;
