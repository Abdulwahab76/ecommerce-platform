import { useState, useMemo } from "react";
import type { ProductT } from "../services/contentful";

export function useAdvancedProductFilter(products: ProductT[], defaultCategory: string = "") {
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
        priceRange: [0, 1000],
    });


    const filtered = useMemo(() => {
        if (
            filters.category &&
            !filters.brand &&
            !filters.search &&
            filters.sizes.length === 0 &&
            filters.colors.length === 0 &&
            filters.tags.length === 0 &&
            filters.priceRange[0] === 0 &&
            filters.priceRange[1] === 1000 || defaultCategory == 'all'
        ) {
            return products;

        } else
            return products.filter((p) => {
                const matchCategory = !filters.category || p.category === filters.category;
                const matchBrand = !filters.brand || p.brand === filters.brand;
                const matchSize = filters.sizes.length === 0 || filters.sizes.some((s) => p.sizes.includes(s));
                const matchColor = filters.colors.length === 0 || filters.colors.some((c) => p.colors.includes(c));
                const matchTags = filters.tags.length === 0 || filters.tags.some((t) => p.tags.includes(t));
                const matchPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
                const matchSearch = !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase());

                return matchCategory && matchBrand && matchSize && matchColor && matchTags && matchPrice && matchSearch;
            });
    }, [products, filters]);

    return { filtered, filters, setFilters };
}

