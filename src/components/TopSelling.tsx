import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type ProductStats = {
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
    price: number;
    image: string;
};

const TopSellingProducts = () => {
    const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSelling = async () => {
            try {
                const snapshot = await getDocs(collection(db, "orders"));
                const orders = snapshot.docs.map(doc => doc.data());

                const stats: Record<string, ProductStats> = {};

                orders.forEach(order => {
                    order.items.forEach((item: any) => {
                        const {
                            id,
                            name,
                            quantity,
                            price,
                            image
                        } = item;

                        if (!stats[id]) {
                            stats[id] = {
                                id,
                                name,
                                quantitySold: 0,
                                revenue: 0,
                                price,
                                image,
                            };
                        }

                        stats[id].quantitySold += quantity;
                        stats[id].revenue += quantity * price;
                    });
                });

                const sorted = Object.values(stats)
                    .sort((a, b) => b.quantitySold - a.quantitySold)
                    .slice(0, 6); // top 4–6

                setTopProducts(sorted);
            } catch (error) {
                console.error("Error calculating top-selling products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSelling();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 animate-pulse">Calculating top-selling products...</p>
            </div>
        );
    }
    console.log(topProducts, 'pro');

    return (
        <div className="flex justify-center flex-col items-center py-10 w-full">
            <h2 className="text-2xl font-semibold mb-4 font-integral">Top Selling</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topProducts.map(product => (
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
                            <p className="text-gray-800 text-lg">Sold: <span className="font-medium">{product.quantitySold}</span></p>
                            <div className="flex justify-between w-full items-center">
                                <p className="text-lg text-gray-800">Price: ${product.price.toFixed(2)}</p>
                                <div className="w-7 h-7 bg-black rounded-full flex justify-center items-center ">
                                    <Link to={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-primary  font-semibold   ">
                                        <ArrowRight className="text-white  " size={14} />
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSellingProducts;
