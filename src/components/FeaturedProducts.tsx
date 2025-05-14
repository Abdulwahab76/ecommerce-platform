// src/components/FeaturedProducts.tsx
import { useEffect, useState } from "react";
// import { fetchFeaturedProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import { mockProducts } from "../data/mockProducts";

const FeaturedProducts = ({ type }: { type: string }) => {
    // const [products, setProducts] = useState<any[]>([]);

    // useEffect(() => {
    //     const loadProducts = async () => {
    //         const data = await fetchFeaturedProducts(type);
    //         setProducts(data);
    //     };
    //     loadProducts();
    // }, [type]);

    return (
        <div className="flex justify-center flex-col items-center py-10 w-full">
            <h2 className="text-2xl font-semibold mb-4 font-integral">{type}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
