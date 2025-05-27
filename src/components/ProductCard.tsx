// src/components/ProductCard.tsx
import React from "react";

type ProductCardProps = {
    id: string;
    name: string;
    price: number;
    image: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
    return (
        <>
            <div className="rounded-lg p-10 hover:shadow-lg transition-shadow duration-300 ease-in-out  cursor-pointer  ">
                <div className="bg-gray-100 p-5">
                    <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />
                </div>
                <h2 className="mt-2 text-lg font-semibold">{name}</h2>
                <p className="text-gray-500">${price}</p>
            </div>
            {/* <ProductGrid /> */}
        </>
    );
};

export default ProductCard;
