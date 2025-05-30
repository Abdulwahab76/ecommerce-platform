// src/lib/contentful.ts
import { createClient } from "contentful";

export const client = createClient({
    space: import.meta.env.VITE_CONTENTFULL_SPACEID,
    accessToken: import.meta.env.VITE_CONTENTFULL_ACCESS_TOKKEN,
});

export interface ProductT {
    id: string,
    name: string,
    slug: string,
    price: number,
    image: string,
    category: string,
    isFeatured?: string,
    productimgs: string[]
}


export const fetchProducts = async (): Promise<ProductT[]> => {
    const res = await client.getEntries({ content_type: "ecommerce" });
    return res.items.map((item) => ({
        id: item.sys.id,
        name: item.fields.name as string || "",
        slug: item.fields.slug as string || "",
        price: item.fields.price as number || 0,
        image: ((item.fields.image as any)?.fields?.file?.url as string) || "",
        category: item.fields.category as string || "",
        description: item.fields.description as string || "",
        isFeatured: item.fields.isFeatured as string || "",
        productimgs: (item.fields.productImgs as string[]) || []
    }));
};

export const fetchProductBySlug = async (slug: string) => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.slug": slug,
    });
    if (res.items.length === 0) {
        throw new Error(`Product with slug "${slug}" not found`);
    }
    const item = res.items[0];
    return {
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        price: item.fields.price,
        image: (item.fields.image as any)?.fields?.file?.url,
        category: item.fields.category,
        description: item.fields.description,
        isFeatured: item.fields.isFeatured,
        productimgs: item.fields.productImgs
    };
};

export const fetchProductsByCategory = async (category: string): Promise<ProductT[]> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.category": category,
    });
    return res.items.map((item) => ({
        id: item.sys.id,
        name: (item.fields.name as string) || "",
        slug: (item.fields.slug as string) || "",
        price: (item.fields.price as number) || 0,
        image: ((item.fields.image as any)?.fields?.file?.url as string) || "",
        category: (item.fields.category as string) || "",
        description: (item.fields.description as string) || "",
        isFeatured: (item.fields.isFeatured as string) || "",
        productimgs: (item.fields.productImgs as string[]) || []
    }));
};

// Fetch featured products
export const fetchFeaturedProducts = async () => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.isFeatured": true,
    });
    return res.items.map((item) => ({
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        price: item.fields.price,
        image: (item.fields.image as any)?.fields?.file?.url,
        category: item.fields.category,
        description: item.fields.description,
        isFeatured: item.fields.isFeatured,
        productimgs: item.fields.productImgs,
    }));
};

// Fetch products by price range
export const fetchProductsByPriceRange = async (minPrice: number, maxPrice: number) => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.price[gte]": minPrice,
        "fields.price[lte]": maxPrice,
    });
    return res.items.map((item) => ({
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        price: item.fields.price,
        image: (item.fields.image as any)?.fields?.file?.url,
        category: item.fields.category,
        description: item.fields.description,
        isFeatured: item.fields.isFeatured,
        productimgs: item.fields.productImgs,
    }));
};

// Fetch products by search query
export const fetchProductsBySearch = async (query: string) => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        query,
    });
    return res.items.map((item) => ({
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        price: item.fields.price,
        image: (item.fields.image as any)?.fields?.file?.url,
        category: item.fields.category,
        description: item.fields.description,
        isFeatured: item.fields.isFeatured,
        productimgs: item.fields.productImgs,
    }));
};