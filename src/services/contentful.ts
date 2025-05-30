// src/lib/contentful.ts
import { createClient, type Entry } from "contentful";

// Contentful client setup
export const client = createClient({
    space: import.meta.env.VITE_CONTENTFULL_SPACEID,
    accessToken: import.meta.env.VITE_CONTENTFULL_ACCESS_TOKKEN,
});

// Product Type
export interface ProductT {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    discountPercent: number | null;
    sku: string;
    image: string;
    category: string;
    brand: string;
    colors: string[];
    sizes: string[];
    inStock: number;
    description: string;
    features: string[];
    tags: string[];
    isFeatured: boolean;
    rating: number;
    productGallery: string[];
}

// 🔁 Reusable mapping function
const mapProductEntry = (item: Entry<any>): ProductT => ({
    id: item.sys.id,
    name: (item.fields.name as string) || "",
    slug: (item.fields.slug as string) || "",
    price: (item.fields.price as number) || 0,
    salePrice: (item.fields.salePrice as number) || null,
    discountPercent: (item.fields.discountPercent as number) || null,
    sku: (item.fields.sku as string) || "",
    image: ((item.fields.image as any)?.fields?.file?.url as string) || "",
    category: (item.fields.category as string) || "",
    brand: (item.fields.brand as string) || "",
    colors: (item.fields.colors as string[]) || [],
    sizes: (item.fields.sizes as string[]) || [],
    inStock: (item.fields.inStock as number) || 0,
    description: (item.fields.description as string) || "",
    features: (item.fields.features as string[]) || [],
    tags: (item.fields.tags as string[]) || [],
    isFeatured: (item.fields.isFeatured as boolean) || false,
    rating: (item.fields.rating as number) || 0,
    productGallery: (item.fields.productGallery as string[]) || []
});


// 🚀 Fetch all products
export const fetchProducts = async (): Promise<ProductT[]> => {
    const res = await client.getEntries({ content_type: "ecommerce" });
    return res.items.map(mapProductEntry);
};

// 🔍 Fetch a single product by slug
export const fetchProductBySlug = async (slug: string): Promise<ProductT> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.slug": slug,
    });

    if (res.items.length === 0) {
        throw new Error(`Product with slug "${slug}" not found`);
    }

    return mapProductEntry(res.items[0]);
};

// 📦 Fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<ProductT[]> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.category": category,
    });

    return res.items.map(mapProductEntry);
};

// 🌟 Fetch featured products
export const fetchFeaturedProducts = async (): Promise<ProductT[]> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.isFeatured": true,
    });

    return res.items.map(mapProductEntry);
};

// 💰 Fetch products by price range
export const fetchProductsByPriceRange = async (minPrice: number, maxPrice: number): Promise<ProductT[]> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        "fields.price[gte]": minPrice,
        "fields.price[lte]": maxPrice,
    });

    return res.items.map(mapProductEntry);
};

// 🔎 Fetch products by search
export const fetchProductsBySearch = async (query: string): Promise<ProductT[]> => {
    const res = await client.getEntries({
        content_type: "ecommerce",
        query,
    });

    return res.items.map(mapProductEntry);
};
