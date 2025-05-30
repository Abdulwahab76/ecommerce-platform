import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts, type ProductT } from "../services/contentful";

const FeaturedProducts = ({ type }: { type: string }) => {

    const [products, setProducts] = useState<ProductT[]>([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return (
        <div className="flex justify-center flex-col items-center py-10 w-full">
            <h2 className="text-2xl font-semibold mb-4 font-integral">{type}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: ProductT) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
