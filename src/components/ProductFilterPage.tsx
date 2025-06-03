import React, { useEffect, useState } from "react";
import { fetchProductsByFilters, type ProductT } from "../services/contentful";
import { useAdvancedProductFilter } from "../hooks/useAdvancedProductFilter";
import FilterSidebar from "./filters/FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ProductFilterPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<ProductT[]>([]);
    const { filtered, filters, setFilters } = useAdvancedProductFilter(allProducts, "shoes");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedItems = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
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
            <main className="w-3/4 h-full">
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


                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </main>
        </div>
    );
};

export default ProductFilterPage;
