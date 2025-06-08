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
    rating: number;
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
    const cartItems = useCartStore((s) => s.cart);

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
    console.log(product, 'pro');


    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    const quantityInCart = cartItems.find(item => item.id === product.id)?.quantity || 0;
    const isOutOfStock = product.inStock !== undefined && quantityInCart >= product.inStock;
    const buyNow = (product: ProductT) => {
        if (isOutOfStock) {
            navigate('/checkout');
        } else {
            addToCart({ ...product, discountedPrice: product.discountedPrice ?? product.price });
            navigate('/checkout');
        }


    };
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
                        {product.features == ' ' && <p className="text-gray-700 text-lg  ">Features: {product.features}</p>}

                        <div className="flex items-center">
                            {Array.from({ length: Math.floor(product.rating) }, (_, index) => (
                                <span key={index} className="text-yellow-500">★</span>
                            ))}
                            {product.rating % 1 !== 0 && <span className="text-yellow-500">☆</span>}
                            <span className="ml-2 text-gray-600">({product.rating.toFixed(1)})</span>
                        </div>
                        {hasDiscount ? (
                            <>
                                <span className="text-gray-800 font-bold text-2xl">PKR {product.discountedPrice}</span>
                                <span className="line-through text-lg text-gray-500">PKR {product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-gray-800 font-bold text-2xl">PKR {product.price.toFixed(2)}</span>
                        )}
                        <button
                            onClick={() => addToCart(product)}
                            disabled={isOutOfStock}
                            className={`px-6 py-2 hover:bg-white hover:border-gray-800 border hover:text-black transition-colors cursor-pointer text-white rounded-lg bg-gray-800 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
