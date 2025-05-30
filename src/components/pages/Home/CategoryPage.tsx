import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsByCategory, type ProductT } from '../../../services/contentful';
import { ArrowRight } from 'lucide-react';

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState<ProductT[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            fetchProductsByCategory(slug as string).then(setProducts)
            setLoading(false);
        };
        loadProducts();
    }, [slug]);

    return (
        <div className="px-10 py-10">
            <h1 className="text-3xl font-bold mb-6 capitalize">Products in "{slug}"</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="flex basis-4/12">
                    {products.map((product: ProductT) => (
                        <div key={product.id} className="h-full  p-4 rounded shadow-sm">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-52 h-full   object-contain mb-2 rounded"
                            />
                            <h3 className="text-xl font-semibold capitalize">{product.name}</h3>
                            <p className="text-sm text-gray-600 font-medium">{product.category}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 text-lg font-medium">${product.price}</p>
                                <div className="w-7 h-7 bg-black rounded-full flex justify-center items-center ">
                                    <Link to={`/product/${product.slug}`} className="text-primary  font-semibold   ">
                                        <ArrowRight className="text-white  " size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {products.length == 0 && <div>

                <h3 className="text-lg font-semibold">No items available yet.</h3>
            </div>}
        </div>
    );
};

export default CategoryPage;
