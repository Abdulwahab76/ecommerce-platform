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

const TRENDING_DAYS = 30;

const TrendingProducts = () => {
    const [trending, setTrending] = useState<ProductStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const now = new Date();
                const pastDate = new Date();
                pastDate.setDate(now.getDate() - TRENDING_DAYS);

                const ordersRef = collection(db, "orders");
                const recentOrdersQuery = query(
                    ordersRef,
                    where("createdAt", ">=", Timestamp.fromDate(pastDate))
                );

                const snapshot = await getDocs(recentOrdersQuery);
                const orders = snapshot.docs.map(doc => doc.data());

                const stats: Record<string, ProductStats> = {};

                orders.forEach(order => {
                    order.items.forEach((item: any) => {
                        const { id, name, quantity, price, image } = item;
                        if (!stats[id]) {
                            stats[id] = {
                                id,
                                name,
                                quantitySold: 0,
                                price,
                                image,
                            };
                        }
                        stats[id].quantitySold += quantity;
                    });
                });

                const sorted = Object.values(stats)
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 6);

                setTrending(sorted);
            } catch (error) {
                console.error("Error fetching trending products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) return <p className="text-gray-500 animate-pulse w-full mx-auto flex justify-center items-center text-center">Loading trending products...</p>;
    if (trending.length === 0) return <p className="text-gray-500  animate-pulse w-full mx-auto flex justify-center items-center text-center">No trending products right now.</p>;

    return (
        <div className="flex justify-center flex-col items-center py-10 w-full">
            <h2 className="text-2xl font-semibold mb-4 font-integral">Top Trending</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trending.map(product => (
                    <div className="rounded-2xl  p-10 hover:shadow-xl transition-shadow duration-300 ease-in-out  cursor-pointer shadow-2xl  ">
                        <div className="  p-5">
                            <img
                                src={`http:${product.image}`}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>

                        <div className="flex justify-between  flex-col items-start ">
                            <div className="flex justify-between w-full items-center">
                                <p className="text-lg text-gray-800">Price: ${product.price.toFixed(2)}</p>


                            </div>
                            <p className="text-sm text-green-600 mt-1 font-semibold">🔥 Trending now</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingProducts;
