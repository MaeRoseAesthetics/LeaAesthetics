import { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest, withErrorHandling } from './_middleware';
import { storage } from '../lib/storage';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency = "gbp", clientId, studentId, bookingId, enrollmentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency,
      metadata: {
        clientId: clientId || '',
        studentId: studentId || '',
        bookingId: bookingId || '',
        enrollmentId: enrollmentId || ''
      }
    });

    // Create payment record
    const payment = await storage.createPayment({
      clientId,
      studentId,
      bookingId,
      enrollmentId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount.toString(),
      status: "pending"
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: "Error creating payment intent: " + error.message });
  }
};

export default withErrorHandling(withAuth(handler));
