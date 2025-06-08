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
                // 1️⃣ Fetch all products from Contentful (always all)
                const allProducts = await fetchProducts();

                // 2️⃣ Fetch all orders from Firestore if you want to update stock
                const ordersRef = collection(db, "orders");
                const snapshot = await getDocs(ordersRef);
                const allOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as any)
                }));

                // 3️⃣ Filter orders by dateRange, so we only consider recent orders to update stock
                const filteredOrders = allOrders.filter(order => {
                    const rawDate = order.createdAt;
                    let orderDate: Date;

                    if (!rawDate) return false;
                    if (typeof rawDate.toDate === "function") {
                        orderDate = rawDate.toDate();
                    } else if (rawDate instanceof Date) {
                        orderDate = rawDate;
                    } else if (rawDate?.seconds) {
                        orderDate = new Date(rawDate.seconds * 1000);
                    } else {
                        return false;
                    }

                    const start = new Date(dateRange.startDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(dateRange.endDate);
                    end.setHours(23, 59, 59, 999);

                    return orderDate >= start && orderDate <= end;
                });

                setOrders(filteredOrders);

                // 4️⃣ Do NOT filter products by sold items — show all products from Contentful
                setProducts(allProducts);

            } catch (error) {
                console.error("Error loading products or orders:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dateRange]);

    // getUpdatedStock subtracts sold quantity from initial stock if orders exist
    const getUpdatedStock = (productId: string, initialStock: number) => {
        if (!orders || orders.length === 0) {
            return initialStock;
        }

        let totalSold = 0;
        orders.forEach(order => {
            order.items?.forEach((item: any) => {
                if (item.id === productId) {
                    totalSold += item.quantity;
                }
            });
        });

        const updatedStock = initialStock - totalSold;
        return updatedStock >= 0 ? updatedStock : 0;
    };

    return { products, loading, getUpdatedStock, setProducts };
};
