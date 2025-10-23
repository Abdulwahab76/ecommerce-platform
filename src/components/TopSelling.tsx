import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type ProductStats = {
    id: string;
    name: string;
    quantitySold: number;
    image: string;
    price: number;
    orderCount: number;
};

const TopSellingProducts = () => {
    const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSelling = async () => {
            setLoading(true);

            try {
                const snapshot = await getDocs(collection(db, "orders"));
                if (snapshot.empty) {
                    setTopProducts([]);
                    return;
                }

                const orders = snapshot.docs.map(doc => doc.data());
                const stats: Record<string, ProductStats> = {};
                const orderMap: Record<string, Set<string>> = {};

                orders.forEach((order, index) => {
                    const orderId = `order_${index}`;
                    const seenInThisOrder = new Set<string>();

                    if (!Array.isArray(order.items)) return;

                    order.items.forEach((item: any) => {
                        const {
                            id,
                            name,
                            quantity,
                            image,
                            discountedPrice,
                            costPrice,
                        } = item;

                        const quantityNum = Number(quantity);
                        const price = discountedPrice || costPrice || 0;

                        if (!id || !name || !quantityNum || !price || !image) return;

                        if (!stats[id]) {
                            stats[id] = {
                                id,
                                name,
                                quantitySold: 0,
                                image: image.startsWith("http") ? image : `http:${image}`,
                                price,
                                orderCount: 0,
                            };
                            orderMap[id] = new Set();
                        }

                        stats[id].quantitySold += quantityNum;
                        seenInThisOrder.add(id);
                    });

                    seenInThisOrder.forEach(pid => {
                        orderMap[pid].add(orderId);
                    });
                });

                Object.keys(orderMap).forEach(pid => {
                    stats[pid].orderCount = orderMap[pid].size;
                });

                const top = Object.values(stats)
                    .filter(p => p.orderCount >= 2) // appeared in at least 2 orders
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 6);

                setTopProducts(top);
            } catch (error) {
                console.error("Failed to fetch top-selling products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSelling();
    }, []);

    if (loading) {
        return (
            <div className="h-40 flex items-center justify-center">
                <p className="text-gray-500 animate-pulse">Loading top-selling products...</p>
            </div>
        );
    }

    if (topProducts.length === 0) {
        return (
            <div className="h-40 flex items-center justify-center">
                <p className="text-gray-500">No top-selling products found.</p>
            </div>
        );
    }

    return (
        <div className="py-10 w-full flex flex-col items-center" id="top-selling">
            <h2 className="text-2xl font-semibold mb-10 font-integral text-center">Top Selling</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topProducts.map((product) => (
                    <div key={product.id} className="rounded-2xl w-72 p-10 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer shadow-2xl relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-contain object-center rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">Sold: {product.quantitySold}</p>
                        <p className="text-sm text-gray-600 mb-2">Orders: {product.orderCount}</p>
                        <div className="flex justify-between items-center">
                            <p className="text-md font-semibold text-gray-800">PKR {product.price.toFixed(2)}</p>
                            <Link
                                to={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                                className="bg-black w-7 h-7 flex items-center justify-center rounded-full"
                            >
                                <ArrowRight className="text-white" size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSellingProducts;
