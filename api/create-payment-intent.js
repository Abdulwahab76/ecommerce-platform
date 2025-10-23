import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { items } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: item.amount,
                },
                quantity: item.quantity,
            })),
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
