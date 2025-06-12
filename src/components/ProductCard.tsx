import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import type { ProductT } from "../services/contentful";

const ProductCard: React.FC<ProductT> = ({ name, price, image, slug, discountPercent, discountedPrice }) => {
    // Calculate discounted price
    const hasDiscount = discountPercent && discountPercent > 0;

    return (
        <div className="rounded-2xl   min-w-[311px] p-10 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer shadow-2xl relative">
            <div className="relative p-5">
                {hasDiscount && (
                    <div className="absolute -top-4 -right-4 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        {discountPercent}% OFF
                    </div>
                )}
                <img src={image} alt={name} className="w-full h-48 object-contain object-center   rounded-lg" />
            </div>

            <h2 className="mt-2 text-2xl capitalize font-semibold">{name}</h2>

            <div className="flex justify-between items-center mt-2">
                <div className="text-lg text-gray-800">
                    {hasDiscount ? (
                        <>
                            <span className="text-gray-800 font-bold">PKR {discountedPrice}</span>
                            <span className="line-through text-sm text-gray-500 ml-2">PKR {price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span>PKR {price.toFixed(2)}</span>
                    )}
                </div>

                <div className="w-7 h-7 bg-black rounded-full flex justify-center items-center">
                    <Link to={`/product/${slug}`} className="text-primary font-semibold">
                        <ArrowRight className="text-white" size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
