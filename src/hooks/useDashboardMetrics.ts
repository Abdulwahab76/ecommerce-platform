import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    Timestamp,
} from "firebase/firestore";
import { format } from "date-fns";

export const useDashboardMetrics = (dateRange: {
    startDate: Date;
    endDate: Date;
}) => {
    const [metrics, setMetrics] = useState({
        orders: 0,
        users: 0,
        revenue: 0,
        profit: 0,
    });
    const [trend, setTrend] = useState({
        orders: 0,
        users: 0,
        revenue: 0,
        profit: 0,
    });
    const [salesData, setSalesData] = useState<any[]>([]);
    const [ordersData, setOrdersData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const ordersRef = collection(db, "orders");
            const usersRef = collection(db, "users");

            const ordersQuery = query(
                ordersRef,
                where("createdAt", ">=", Timestamp.fromDate(dateRange.startDate)),
                where("createdAt", "<=", Timestamp.fromDate(dateRange.endDate))
            );

            const [ordersSnapshot, usersSnapshot] = await Promise.all([
                getDocs(ordersQuery),
                getDocs(usersRef),
            ]);

            const currentOrders = ordersSnapshot.docs.map((doc) => doc.data());
            const users = usersSnapshot.size;

            let revenue = 0;
            let profit = 0;

            const monthlySales: Record<string, { sales: number; profit: number; orders: number }> = {};

            currentOrders.forEach((order: any) => {
                revenue += order.total;

                let orderProfit = 0;
                order.items.forEach((item: any) => {
                    const sale = (item.discountedPrice || 0) * item.quantity;
                    const cost = (item.costPrice || 0) * item.quantity;
                    orderProfit += sale - cost;
                });

                profit += orderProfit;

                const date = new Date(order.createdAt.seconds * 1000);
                const month = format(date, "MMM yyyy");

                if (!monthlySales[month]) {
                    monthlySales[month] = { sales: 0, profit: 0, orders: 0 };
                }

                monthlySales[month].sales += order.total;
                monthlySales[month].profit += orderProfit;
                monthlySales[month].orders += 1;
            });

            setSalesData(
                Object.entries(monthlySales).map(([date, data]) => ({
                    date,
                    sales: data.sales,
                    profit: data.profit,
                }))
            );

            setOrdersData(
                Object.entries(monthlySales).map(([date, data]) => ({
                    date,
                    orders: data.orders,
                }))
            );

            setMetrics({
                orders: currentOrders.length,
                users,
                revenue,
                profit,
            });

            // Calculate Previous Period
            const prevStart = new Date(
                dateRange.startDate.getFullYear(),
                dateRange.startDate.getMonth() - 1,
                1
            );
            const prevEnd = new Date(dateRange.startDate);
            prevEnd.setDate(0); // end of previous month

            const prevQuery = query(
                ordersRef,
                where("createdAt", ">=", Timestamp.fromDate(prevStart)),
                where("createdAt", "<=", Timestamp.fromDate(prevEnd))
            );
            const prevOrdersSnapshot = await getDocs(prevQuery);
            const prevOrders = prevOrdersSnapshot.docs.map((doc) => doc.data());

            let prevRevenue = 0,
                prevProfit = 0;

            prevOrders.forEach((order: any) => {
                prevRevenue += order.total;
                order.items.forEach((item: any) => {
                    const sale = (item.discountedPrice || 0) * item.quantity;
                    const cost = (item.costPrice || 0) * item.quantity;
                    prevProfit += sale - cost;
                });
            });

            const calculateTrend = (current: number, previous: number) => {
                if (previous === 0) return current === 0 ? 0 : 100;
                return ((current - previous) / previous) * 100;
            };

            setTrend({
                orders: calculateTrend(currentOrders.length, prevOrders.length),
                users: 0, // optionally implement user growth tracking
                revenue: calculateTrend(revenue, prevRevenue),
                profit: calculateTrend(profit, prevProfit),
            });
        };

        fetchData();
    }, [dateRange]);

    return { metrics, trend, salesData, ordersData };
};
