import Stripe from 'stripe';
import dotenv from 'dotenv';

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
