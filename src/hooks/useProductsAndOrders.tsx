import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { getDocs, collection } from "firebase/firestore";
import { fetchProducts, type ProductT } from "../services/contentful";

export const useProducts = (dateRange: { startDate: Date; endDate: Date }) => {
    const [products, setProducts] = useState<ProductT[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch products from Contentful
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);

                // Fetch orders filtered by date range
                const ordersRef = collection(db, "orders");
                const snapshot = await getDocs(ordersRef);
                const filteredOrders = snapshot.docs
                    .map(doc => ({ id: doc.id, ...(doc.data() as any) }))
                    .filter(order => {
                        const orderDate = order.createdAt?.toDate
                            ? order.createdAt.toDate()
                            : order.createdAt instanceof Date
                                ? order.createdAt
                                : new Date(order.createdAt?.seconds * 1000);

                        return (
                            orderDate >= dateRange.startDate &&
                            orderDate <= dateRange.endDate
                        );
                    });

                setOrders(filteredOrders);
            } catch (error) {
                console.error("Error loading products or orders:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dateRange]);

    // Calculate updated stock for each product
    const getUpdatedStock = (productId: string, initialStock: number) => {
        let totalQuantitySold = 0;
        orders.forEach(order => {
            order.items?.forEach((item: any) => {
                if (item.id === productId) {
                    totalQuantitySold += item.quantity;
                }
            });
        });
        return initialStock - totalQuantitySold;
    };

    return { products, loading, getUpdatedStock, setProducts };
};
