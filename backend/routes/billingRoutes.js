import express from 'express';
import { createCheckoutSession, getBillingDashboardStats } from '../controllers/billingController.js';
import { getInvoices, createInvoice, generateInvoicePDF } from '../controllers/invoiceController.js';
import { getPayments, recordPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/dashboard', protect, getBillingDashboardStats);

router.get('/invoices', protect, getInvoices);
router.post('/invoices', protect, createInvoice);
router.get('/invoices/:id/pdf', protect, generateInvoicePDF);

router.get('/payments', protect, getPayments);
router.post('/payments', protect, recordPayment);

export default router;
