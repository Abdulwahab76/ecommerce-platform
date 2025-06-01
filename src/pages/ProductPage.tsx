import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductBySlug, type ProductT } from "../services/contentful";
import ZoomImage from "../components/zoomImage";
import { useCartStore } from "../store/useCartStore";
import { ChevronLeftIcon } from "lucide-react";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    productGallery?: string[];
    description: string;
    discountPercent: number;
    discountedPrice?: number;
};

const ProductPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<any>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const addToCart = useCartStore((s) => s.addToCart);
    const navigate = useNavigate();
    const hasDiscount = product.price && product.discountPercent > 0;

    useEffect(() => {
        if (!slug) {
            setError("Product not found");
            setLoading(false);
            return;
        }
        fetchProductBySlug(slug as string)
            .then((data) => {
                setProduct(data as Product);
                setSelectedImage(data.image);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);
    const buyNow = (product: ProductT) => {
        addToCart({ ...product, discountedPrice: product.discountedPrice ?? product.price });
        navigate('/checkout');
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="px-3 md:px-20">
            <div
                className="w-10 h-10 bg-gray-100 border-gray-100 border flex justify-center items-center rounded-full text-gray-400 my-4 hover:bg-white transition-colors cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <ChevronLeftIcon />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10  ">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Thumbnail Column */}
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
                            {[product.image, ...(product.productGallery || [])].map((img, index) => (
                                <img
                                    key={index}
                                    src={typeof img === "string" ? img : img.fields.file.url}
                                    onClick={() => setSelectedImage(typeof img === "string" ? img : img.fields.file.url)}
                                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${selectedImage === (typeof img === "string" ? img : img.fields.file.url) ? "border-black" : "border-transparent"
                                        }`}
                                    alt={`Thumbnail ${index}`}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="flex-1">
                            <ZoomImage
                                src={selectedImage || product.image}
                                alt={product.name}
                                className="w-full max-h-[500px] object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex gap-y-4 flex-col  ">
                        <h1 className="text-4xl font-bold capitalize  ">{product.name}</h1>
                        <p className="text-gray-700 text-lg  ">Instock: {product.inStock}</p>
                        <p className="text-gray-700 text-lg  ">Size: {product.sizes}</p>
                        <p className="text-gray-700 text-lg  ">Features: {product.features}</p>
                        <p className="text-gray-700   text-sm bg-gray-200 shadow-md cursor-pointer py-2  w-16 text-center rounded-lg ">{product.tags}</p>

                        {hasDiscount ? (
                            <>
                                <span className="text-gray-800 font-bold text-2xl">${product.discountedPrice}</span>
                                <span className="line-through text-lg text-gray-500">${product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-gray-800 font-bold text-2xl">${product.price.toFixed(2)}</span>
                        )}
                        <button onClick={() => addToCart(product)} className="px-6 py-2 hover:bg-white hover:border-gray-800 border hover:text-black transition-colors cursor-pointer text-white rounded-lg bg-gray-800  ">
                            Add to Cart
                        </button>
                        <button
                            onClick={() => buyNow(product)}
                            className="px-6 py-2 hover:bg-white hover:border-gray-800 border hover:text-black transition-colors cursor-pointer text-white rounded-lg bg-gray-800  "
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
