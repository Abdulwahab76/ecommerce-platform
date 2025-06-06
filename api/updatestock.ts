import { createClient } from "contentful-management";

const contentfulAccessToken = import.meta.env.CONTENTFUL_MANAGEMENT_API_KEY;
const spaceId = import.meta.env.CONTENTFUL_SPACE_ID;
const environmentId = import.meta.env.CONTENTFUL_ENVIRONMENT_ID;

const client = createClient({
    accessToken: contentfulAccessToken!,
});

const handler = async (req: any, res: any) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    try {
        const space = await client.getSpace(spaceId!);
        const environment = await space.getEnvironment(environmentId!);

        const updatePromises = items.map(async (item: { id: string; quantity: number }) => {
            const entry = await environment.getEntry(item.id);

            if (!entry.fields.inStock) {
                throw new Error(`Entry ${item.id} does not have an inStock field.`);
            }

            const currentStock = entry.fields.inStock["en-US"] || 0;
            const updatedStock = Math.max(currentStock - item.quantity, 0);

            entry.fields.inStock["en-US"] = updatedStock;

            await entry.update();
            await entry.publish();
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: "Stock updated successfully" });
    } catch (error: any) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ error: "Failed to update stock" });
    }
};

export default handler;