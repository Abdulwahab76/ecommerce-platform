import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { items, success_url, cancel_url, orderData } = req.body;

    try {
        // Validate items
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items data' });
        }

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(item.discountedPrice * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancel_url,
            metadata: {
                orderId: orderData.orderId,
                userId: orderData.userId,
            },
        });

        return res.status(200).json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return res.status(500).json({ error: err.message });
    }
}