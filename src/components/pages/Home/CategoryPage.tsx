import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsByCategory, type ProductT } from '../../../services/contentful';
import ProductCard from '../../ProductCard';
import ShopCoLoader from '../../ShopCoLoader';

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
                <ShopCoLoader />
            ) : (
                <div className="flex basis-4/12">
                    {products.map((product: ProductT) => (
                        <ProductCard key={product.id} {...product} />
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
