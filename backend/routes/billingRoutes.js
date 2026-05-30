import express from 'express';
import { createCheckoutSession } from '../controllers/billingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;
