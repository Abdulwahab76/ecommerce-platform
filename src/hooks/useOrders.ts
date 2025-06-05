// src/hooks/useOrders.ts
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    discountedPrice: number;
    image?: string;
}

export interface Order {
    id: string;
    name: string;
    email: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    total: number;
    userId: string;
    createdAt?: any;
    items: OrderItem[];
}

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const snapshot = await getDocs(collection(db, "orders"));
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Order, "id">),
                }));
                setOrders(list);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const deleteOrder = async (id: string) => {
        try {
            await deleteDoc(doc(db, "orders", id));
            setOrders(prev => prev.filter(order => order.id !== id));
        } catch (err) {
            console.error("Failed to delete order:", err);
            setError("Failed to delete order.");
        }
    };

    return { orders, loading, error, deleteOrder };
};
