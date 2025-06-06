import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";

type ProductStats = {
    id: string;
    name: string;
    quantitySold: number;
    price: number;
    image: string;
};

type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price?: number;
    discountedPrice?: number;
    image: string;
};

type Order = {
    items: OrderItem[];
    createdAt: Timestamp;
};

const TrendingProducts = () => {
    const [trending, setTrending] = useState<ProductStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const now = new Date();
                const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); //24 hours
                // const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
                // const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

                const ordersRef = collection(db, "orders");
                const recentOrdersQuery = query(
                    ordersRef,
                    where("createdAt", ">=", Timestamp.fromDate(pastDate))
                );

                const snapshot = await getDocs(recentOrdersQuery);
                const orders = snapshot.docs.map(doc => doc.data() as Order);

                console.log("Fetched orders from last 24 hours:", orders);

                const stats: Record<string, ProductStats> = {};

                orders.forEach((order, i) => {
                    if (!order.items || !Array.isArray(order.items)) {
                        console.warn(`Order ${i + 1} has no valid items.`);
                        return;
                    }

                    console.log(`Order ${i + 1} createdAt:`, order.createdAt?.toDate());

                    order.items.forEach(item => {
                        const { id, name, quantity, discountedPrice, price: normalPrice, image } = item;

                        const finalPrice = discountedPrice ?? normalPrice ?? 0;

                        if (
                            !id ||
                            !name ||
                            quantity === undefined ||
                            quantity === null ||
                            finalPrice === 0 ||
                            !image
                        ) {
                            console.warn("Skipping incomplete item:", item);
                            return;
                        }

                        if (!stats[id]) {
                            stats[id] = {
                                id,
                                name,
                                quantitySold: 0,
                                price: finalPrice,
                                image,
                            };
                        }
                        stats[id].quantitySold += quantity;
                    });
                });

                console.log("Aggregated product stats:", stats);

                const sorted = Object.values(stats)
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 6);

                console.log("Top trending products:", sorted);

                setTrending(sorted);
            } catch (error) {
                console.error("Error fetching trending products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) {
        return (
            <p className="text-gray-500 animate-pulse w-full text-center py-10">
                Loading trending products...
            </p>
        );
    }

    if (trending.length === 0) {
        return (
            <p className="text-gray-500 w-full text-center py-10">
                No trending products right now.
            </p>
        );
    }

    return (
        <section id="top-trending" className="flex flex-col items-center py-10 w-full">
            <h2 className="text-2xl font-bold mb-10 font-integral">
                Top Trending
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trending.map((product, index) => {
                    const imageUrl = product.image.startsWith("http")
                        ? product.image
                        : `https:${product.image}`;

                    return (
                        <div
                            key={product.id}
                            className="rounded-2xl min-w-[320px] p-10 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer shadow-2xl relative" title={`Sold: ${product.quantitySold}`}
                        >
                            <div className="relative mb-4">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <span className="absolute -top-8 -right-8 bg-black text-white text-xs font-bold px-2 py-2 rounded-tr-xl">
                                    #{index + 1}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-700 mb-1">Sold: {product.quantitySold}</p>
                            <p className="text-green-600 font-medium">${product.price.toFixed(2)}</p>
                            {index === 0 && (
                                <p className="text-red-600 font-bold mt-2 animate-pulse">🔥 Most Loved Product!</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingProducts;
