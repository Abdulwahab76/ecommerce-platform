import React, { type JSX } from "react";
import { TextFilter, PriceRangeFilter, SelectFilter, CheckboxFilter } from "./FilterComponents";

type FiltersT = {
    search: string;
    priceRange: [number, number];
    brand: string;
    sizes: string[];
    colors: string[];
    tags: string[];
    category: string;
};

type FilterSidebarProps = {
    filters: FiltersT;
    setFilters: React.Dispatch<React.SetStateAction<FiltersT>>;
};

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    const filterConfig: Record<string, (keyof FiltersT)[]> = {
        all: ["category", "search", "priceRange", "brand", "sizes", "colors", "tags"],
        clothes: ["category", "search", "priceRange", "brand", "sizes", "colors", "tags"],
        shoes: ["category", "search", "priceRange", "brand", "sizes", "tags"],
        watches: ["category", "search", "priceRange", "brand", "colors"],
    };


    const brandOptions = ["Nike", "Apple", "Zara"];
    const shoeSizeOptions = ["6", "7", "8", "9", "10"];
    const watchSizeOptions = ["38mm", "40mm", "42mm"];
    const clothingSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
    const colorOptions = ["red", "blue", "black", "green"];
    const tagOptions = ["bestseller", "new", "trending"];

    const category = filters.category || "all";
    const activeFilters = filterConfig[category] || filterConfig.all;


    const components: Record<keyof FiltersT, () => JSX.Element> = {
        search: () => (
            <TextFilter
                label="Search"
                value={filters.search}
                onChange={(v: string) => setFilters((f) => ({ ...f, search: v }))}
            />
        ),
        priceRange: () => (
            <PriceRangeFilter
                value={filters.priceRange}
                onChange={(min: number, max: number) =>
                    setFilters((f) => ({ ...f, priceRange: [min, max] }))
                }
            />
        ),
        brand: () => (
            <SelectFilter
                label="Brand"
                value={filters.brand}
                onChange={(v: string) => setFilters((f) => ({ ...f, brand: v }))}
                options={brandOptions}
            />
        ),
        sizes: () => {
            let sizeOptionsForCategory: string[] = [];

            switch (filters.category || 'shoes') {
                case "clothes":
                    sizeOptionsForCategory = clothingSizeOptions;
                    break;
                case "shoes":
                    sizeOptionsForCategory = shoeSizeOptions;
                    break;
                case "watches":
                    sizeOptionsForCategory = watchSizeOptions;
                    break;
                default:
                    sizeOptionsForCategory = [
                        ...clothingSizeOptions,
                        ...shoeSizeOptions,
                        ...watchSizeOptions,
                    ];
            }

            return (
                <CheckboxFilter
                    label="Sizes"
                    options={sizeOptionsForCategory}
                    selected={filters.sizes}
                    onChange={(selected: string[]) =>
                        setFilters((f) => ({ ...f, sizes: selected }))
                    }
                />
            );
        },

        colors: () => (
            <CheckboxFilter
                label="Colors"
                options={colorOptions}
                selected={filters.colors}
                onChange={(selected: string[]) => setFilters((f) => ({ ...f, colors: selected }))}
            />
        ),
        tags: () => (
            <CheckboxFilter
                label="Tags"
                options={tagOptions}
                selected={filters.tags}
                onChange={(selected: string[]) => setFilters((f) => ({ ...f, tags: selected }))}
            />
        ),
        category: () => <></>, // Category is not rendered as a filter
    };

    return (
        <div className="filter-sidebar">
            {activeFilters.map((filterKey) => (
                <div key={filterKey} className="mb-4">
                    {components[filterKey]()}
                </div>
            ))}
        </div>
    );
}