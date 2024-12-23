import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, payerName, payerEmail } = req.body;

    // Process the payment details and update your database
    try {
      // Example: Update user subscription status in the database
      // await updateUserSubscription(orderId, payerName, payerEmail);

      res.status(200).json({ message: 'Payment processed successfully' });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Failed to process payment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
} 