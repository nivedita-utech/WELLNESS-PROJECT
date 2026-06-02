import express from 'express';
import {
  getBusinessControl,
  updateBusinessControl,
  getAuditLogs,
  processSale,
  getSales,
  getFranchises,
  getFranchiseDashboardData,
  getProducts,
  createProduct,
} from '../controllers/businessController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/control')
  .get(protect, authorize('admin'), getBusinessControl)
  .post(protect, authorize('admin'), updateBusinessControl);

router.get('/audit-logs', protect, authorize('admin'), getAuditLogs);
router.get('/franchises', protect, authorize('admin'), getFranchises);
router.get('/franchise-dashboard/:franchiseId', protect, authorize('admin', 'franchise'), getFranchiseDashboardData);

router.route('/sale')
  .post(protect, processSale);

router.route('/sales')
  .get(protect, getSales);

router.route('/products')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'franchise'), createProduct);

export default router;
