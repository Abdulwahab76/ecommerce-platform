import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;

const client = createClient({ accessToken: ACCESS_TOKEN });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { items } = req.body;

    try {
        const space = await client.getSpace(SPACE_ID);
        const env = await space.getEnvironment('master');

        for (const item of items) {
            const entry = await env.getEntry(item.id);
            const stock = entry.fields.inStock['en-US'] || 0;

            if (stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${entry.fields.name['en-US']}` });
            }

            entry.fields.inStock['en-US'] = stock - item.quantity;
            await entry.update();
            await entry.publish();
        }

        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Stock update failed' });
    }
}
