import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../services/contentful";
import ZoomImage from "../components/zoomImage";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    productimgs?: string[];
    description: string;
};

const ProductPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<any>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="max-w-7xl mx-auto px-4 py-10  ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Image Gallery */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnail Column */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
                        {[product.image, ...(product.productimgs || [])].map((img, index) => (
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
                <div>
                    <h1 className="text-4xl font-bold capitalize mb-4">{product.name}</h1>
                    <p className="text-gray-700 text-lg mb-6">{product.description}</p>
                    <div className="text-3xl font-semibold text-black mb-6">${product.price}</div>
                    <button className="px-6 py-3  cursor-pointer text-white rounded-lg !bg-gray-800  ">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
