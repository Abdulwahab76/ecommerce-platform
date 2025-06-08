import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { items, successUrl, cancelUrl } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.discountedPrice * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return res.status(200).json({ url: session.url });
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
    }
}
