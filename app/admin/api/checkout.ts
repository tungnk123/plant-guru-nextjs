import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: '2024-12-18.acacia'
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method === 'POST') {
   try {
     const { priceId } = req.body;
      const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [
         {
           price: priceId,
           quantity: 1,
         },
       ],
       mode: 'subscription',
       success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${req.headers.origin}/cancel`,
     });
      res.status(200).json({ sessionId: session.id });
   } catch (err) {
     res.status(500).json({ error: 'Failed to create session' });
   }
 } else {
   res.setHeader('Allow', 'POST');
   res.status(405).end('Method Not Allowed');
 }
}
