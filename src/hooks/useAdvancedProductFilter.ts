import { useState, useMemo } from "react";
import type { ProductT } from "../services/contentful";

export function useAdvancedProductFilter(products: ProductT[], defaultCategory: string = "all") {
    const [filters, setFilters] = useState<{
        category: string;
        brand: string;
        search: string;
        sizes: string[];
        colors: string[];
        tags: string[];
        priceRange: [number, number];
    }>({
        category: defaultCategory,
        brand: "",
        search: "",
        sizes: [],
        colors: [],
        tags: [],
        priceRange: [0, 10000], 
    });

    const filtered = useMemo(() => {
        const noFilterApplied =
            !filters.brand &&
            !filters.search &&
            filters.sizes.length === 0 &&
            filters.colors.length === 0 &&
            filters.tags.length === 0 &&
            filters.priceRange[0] === 0 &&
            filters.priceRange[1] >= 1000;


        if ((filters.category === "" || filters.category === "all") && noFilterApplied) {
            return products;
        }

        // Otherwise filter
        return products.filter((p) => {
            // Match category: if filter is empty or 'all' => match all
            const matchCategory =
                !filters.category || filters.category === "all" || p.category === filters.category;

            const matchBrand = !filters.brand || p.brand.toLowerCase() === filters.brand.toLowerCase();

            // Normalize sizes, colors, and tags to arrays
            const productSizes = Array.isArray(p.sizes) ? p.sizes : [p.sizes].filter(Boolean);
            const productColors = Array.isArray(p.colors) ? p.colors : [p.colors].filter(Boolean);
            const productTags = Array.isArray(p.tags) ? p.tags : [p.tags].filter(Boolean);

            const matchSize = filters.sizes.length === 0 || filters.sizes.some((s) => productSizes.includes(s));
            const matchColor = filters.colors.length === 0 || filters.colors.some((c) => productColors.includes(c));
            const matchTags = filters.tags.length === 0 || filters.tags.some((t) => productTags.includes(t));

            const matchPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
            const matchSearch = !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase());

            return matchCategory && matchBrand && matchSize && matchColor && matchTags && matchPrice && matchSearch;
        });
    }, [products, filters]);

    return { filtered, filters, setFilters };
}