import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase"; // Firestore
import { getDocs, collection } from "firebase/firestore";
import SalesChart from "./SalesChart";
import { format } from 'date-fns';
import { Timestamp, query, where } from "firebase/firestore";
import DateRangeSelector from "../DateRangeSelector";

const Dashboard: React.FC = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [totalProfit, setTotalProfit] = useState<number>(0);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // default 1 month ago
        endDate: new Date(),
    });
    // Function to calculate sales data and profit
    const calculateSalesData = (orders: any[]) => {
        const monthlySales: any = {};
        let totalProfit = 0;

        orders.forEach((order) => {
            const timestamp = order.createdAt; // Firestore timestamp
            const date = new Date(timestamp.seconds * 1000); // Convert seconds to JS Date object
            const month = format(date, 'MMM yyyy'); // Format to "Jun 2025"

            if (!monthlySales[month]) {
                monthlySales[month] = { totalSales: 0, totalProfit: 0 };
            }

            // Calculate total sales and profit
            monthlySales[month].totalSales += order.total;

            let totalCost = 0;

            // Calculate Total Cost and Total Profit for each order
            const orderProfit = order.items.reduce((sum: number, item: any) => {
                const salePrice = item.discountedPrice || 0;  // Sale price from Firestore
                const quantityOrdered = item.quantity;  // Quantity ordered by the customer
                const costPrice = item.costPrice || 0;  // Cost price from Firestore

                // Calculate Total Cost for the order
                totalCost += costPrice * quantityOrdered;

                // Profit calculation (Revenue - Total Cost)
                return sum + (salePrice * quantityOrdered) - (costPrice * quantityOrdered);
            }, 0);

            // Add profit to the monthly profit
            monthlySales[month].totalProfit += orderProfit;

            // Update overall profit
            totalProfit += order.total - totalCost; // Profit = Total Revenue - Total Cost
        });

        // Prepare sales chart data
        const salesChartData = Object.keys(monthlySales).map((month) => ({
            date: month,
            sales: monthlySales[month].totalSales,
            profit: monthlySales[month].totalProfit,
        }));

        setSalesData(salesChartData);
        return totalProfit; // Return total profit for later use
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch orders and users simultaneously
                const ordersRef = collection(db, "orders");

                // Filter orders by selected date range using Firestore's "where"
                const ordersQuery = query(
                    ordersRef,
                    where("createdAt", ">=", Timestamp.fromDate(dateRange.startDate)),
                    where("createdAt", "<=", Timestamp.fromDate(dateRange.endDate))
                );

                const [ordersSnapshot, usersSnapshot] = await Promise.all([
                    getDocs(ordersQuery),
                    getDocs(collection(db, "users")),
                ]);

                setTotalOrders(ordersSnapshot.size);
                setTotalUsers(usersSnapshot.size);

                let totalRevenue = 0;
                let totalProfit = 0; // Initialize total profit here

                // Fetch and process orders data
                const orderList = ordersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as { total: number; items: any[]; createdAt: any }),
                }));

                // Calculate revenue and profit based on orders
                orderList.forEach((order) => {
                    totalRevenue += order.total; // Revenue is directly from the order total

                    let totalCost = 0;
                    order.items.forEach((item: any) => {
                        const salePrice = item.discountedPrice || 0;  // Sale price from Firestore
                        const quantityOrdered = item.quantity;  // Quantity ordered by the customer
                        const costPrice = item.costPrice || 0;  // Cost price from Firestore

                        // Calculate Total Cost for the order
                        totalCost += costPrice * quantityOrdered;

                        // Profit calculation
                        totalProfit += (salePrice * quantityOrdered) - (costPrice * quantityOrdered); // Profit for each item
                    });
                });

                setRevenue(totalRevenue); // Set the revenue from orders
                setTotalProfit(totalProfit); // Update total profit

                // Now calculate order-related profits (for monthly sales chart)
                const calculatedOrderProfit = calculateSalesData(orderList); // Calculate profit from orders
                setTotalProfit(totalProfit + calculatedOrderProfit); // Update total profit

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchDashboardData();
    }, [dateRange]);
    useEffect(() => {
        console.log("Updated Total Profit:", totalProfit);
    }, [totalProfit]);

    return (
        <div className="  space-y-8">
            <div className="flex justify-end  cursor-pointer">
                <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-4  gap-4 *:h-40">
                {/* Total Orders Card */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold">Total Orders</h3>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                </div>

                {/* Total Users Card */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold">Total Users</h3>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                </div>

                {/* Revenue Card */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold">Total Revenue</h3>
                    <p className="text-3xl font-bold">PKR {revenue.toLocaleString()}</p>
                </div>

                {/* Profit Card */}
                <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold">Total Profit</h3>
                    <p className="text-3xl font-bold">PKR {totalProfit.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sales chart */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
                    <SalesChart data={salesData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
