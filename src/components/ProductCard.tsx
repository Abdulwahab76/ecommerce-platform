// src/components/ProductCard.tsx
import React from "react";

type ProductCardProps = {
    id: string;
    name: string;
    price: number;
    image: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image }) => {
    return (
        <div className="  rounded-lg p-10 hover:shadow-lg  ">
            <div className="bg-gray-100 p-5">
                <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />

            </div>
            <h2 className="mt-2 text-lg font-semibold">{name}</h2>
            <p className="text-gray-500">${price}</p>
            <button className="bg-primary text-white px-4 py-2 mt-3 rounded-lg w-full">
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
