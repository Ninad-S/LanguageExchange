import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import 'dotenv/config'

const app = express();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16' // Specify API version
});

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await stripe.paymentMethods.list({ limit: 1 });
    console.log('✅ Stripe connection verified');
  } catch (err) {
    console.error('❌ Stripe connection failed:', err.message);
  }
})();

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { price_id, email, uid } = req.body;

    if (!price_id || !email || !uid) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: price_id, quantity: 1 }],
      return_url: `http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { uid }
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create Checkout Session' });
  }
});

// ADD THIS BELOW your create-checkout-session endpoint:
app.post('/get-subscription-status', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });

    if (!session.subscription) {
      return res.status(400).json({ error: 'No subscription found for this session' });
    }

    const subscription = session.subscription;
    const priceId = subscription.items.data[0].price.id;

    // Map Stripe price IDs back to your tiers
    const priceIdToTier = {
      'price_1RHpkQBO4YYv1HibThecfkw3': 'free',
      'price_1RHUa1BO4YYv1HibuAiMdNym': 'basic',
      'price_1RHoneBO4YYv1HibuiT3xavV': 'premium'
    };

    const tier = priceIdToTier[priceId] || 'free';

    res.json({ tier });
  } catch (error) {
    console.error('Failed to fetch subscription status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(4242, () => console.log('Server running on port 4242'));
