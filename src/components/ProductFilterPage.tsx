import React, { useEffect, useState } from "react";
import { fetchProducts, type ProductT } from "../services/contentful";
import { useAdvancedProductFilter } from "../hooks/useAdvancedProductFilter";
import FilterSidebar from "./filters/FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ProductFilterPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<ProductT[]>([]);
    const { filtered, filters, setFilters } = useAdvancedProductFilter(allProducts, "all");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts(); // Fetch all products
            setAllProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex md:flex-row flex-col mx-auto px-12 py-10 gap-6">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
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