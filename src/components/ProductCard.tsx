import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import type { ProductT } from "../services/contentful";


const ProductCard: React.FC<ProductT> = ({ name, price, image, slug }) => {
    return (
        <>
            <div className="rounded-lg p-10 hover:shadow-xl transition-shadow duration-300 ease-in-out  cursor-pointer shadow-lg  ">
                <div className="  p-5">
                    <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />
                </div>
                <h2 className="mt-2 text-2xl capitalize font-semibold">{name}</h2>
                <div className="flex justify-between items-center">
                    <p className="text-gray-800 text-lg">${price}</p>
                    <div className="w-7 h-7 bg-black rounded-full flex justify-center items-center ">
                        <Link to={`/product/${slug}`} className="text-primary  font-semibold   ">
                            <ArrowRight className="text-white  " size={14} />
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ProductCard;
