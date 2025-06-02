import React, { useEffect, useState } from "react";
import { fetchProductsByFilters, type ProductT } from "../services/contentful";
import { useAdvancedProductFilter } from "../hooks/useAdvancedProductFilter";
import FilterSidebar from "./filters/FilterSidebar";
import ProductCard from "./ProductCard";

const ProductFilterPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<ProductT[]>([]);
    const { filtered, filters, setFilters } = useAdvancedProductFilter(allProducts, "shoes");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchProductsByFilters({});
            setAllProducts(data);
            setLoading(false);
        };
        load();
    }, []);




    return (
        <div className="flex  md:flex-row flex-col mx-auto px-12 py-10 gap-6  flex-1/2 ">
            {/* Sidebar Filters */}

            <FilterSidebar filters={filters} setFilters={setFilters} />

            {/* Product Grid */}
            <main className="w-3/4">
                <h2 className="text-xl font-bold mb-4">
                    Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6">
                        {filtered.map((product) => (
                            <ProductCard {...product} key={product.id} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductFilterPage;
