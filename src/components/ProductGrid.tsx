import { useEffect, useState } from "react";
import { fetchProducts } from "../services/contentful";

type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
    description?: string;
};

const ProductGrid = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);
    console.log(products);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="border rounded p-4 shadow hover:shadow-lg transition">
                    <img src={product.image} alt={product.name} className="w-full h-60 object-cover mb-2" />
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-primary font-bold">${product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
