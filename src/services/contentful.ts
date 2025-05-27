// src/lib/contentful.ts
import { createClient } from "contentful";

export const client = createClient({
    space: import.meta.env.VITE_CONTENTFULL_SPACEID,
    accessToken: import.meta.env.VITE_CONTENTFULL_ACCESS_TOKKEN,
});

export const fetchProducts = async () => {
    const res = await client.getEntries({ content_type: "ecommerce" });

    return res.items.map((item) => ({
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        price: item.fields.price,
        image: (item.fields.image as any)?.fields?.file?.url,
        category: item.fields.category,
        description: item.fields.description,
        isFeatured: item.fields.isFeatured,
    }));
};
