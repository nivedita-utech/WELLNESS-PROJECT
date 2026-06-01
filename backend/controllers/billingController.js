import Stripe from 'stripe';
import dotenv from 'dotenv';
import Invoice from '../models/Invoice.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

// Initialize Stripe with the secret key from environment or a placeholder
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
  apiVersion: '2023-10-16',
});

// @desc    Create Stripe Checkout Session
// @route   POST /api/billing/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId, planName, amount } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Create a mock session if no valid stripe key is provided
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({
        id: 'mock_session_id',
        url: 'https://stripe.com/docs/testing#cards',
        mock: true,
        message: 'Stripe Secret Key missing. Simulating checkout URL.'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: 'Aura Wellness Subscription',
            },
            unit_amount: amount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // using payment mode for simple one-time charge in this demo
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get billing dashboard statistics
// @route   GET /api/billing/dashboard
// @access  Private/Admin
export const getBillingDashboardStats = async (req, res) => {
  try {
    const totalRevenueResult = await Invoice.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayRevenueResult = await Invoice.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;

    const pendingPaymentsResult = await Invoice.aggregate([
      { $match: { status: "Pending" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const pendingPayments = pendingPaymentsResult.length > 0 ? pendingPaymentsResult[0].total : 0;

    const paidInvoicesCount = await Invoice.countDocuments({ status: "Paid" });
    const overdueInvoicesCount = await Invoice.countDocuments({ status: "Overdue" });

    // Monthly revenue chart data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Invoice.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5).populate("customer", "name email");

    res.json({
      totalRevenue,
      todayRevenue,
      pendingPayments,
      paidInvoicesCount,
      overdueInvoicesCount,
      monthlyRevenue,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
