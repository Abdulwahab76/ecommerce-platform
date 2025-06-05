import React, { useState } from "react";
import DateRangeSelector from "../DateRangeSelector";
import SalesChart from "./SalesChart";
import OrdersChart from "./OrdersChart";
import MetricCard from "./MetricCard";
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../services/authService";

const Dashboard: React.FC = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date(),
    });
    const { user } = useAuth();

    const { metrics, trend, salesData, ordersData } = useDashboardMetrics(dateRange);

    if (!isAdmin(user?.email)) {
        return <div className="text-red-500 p-4">You are not authorized to manage products.</div>;
    }
    return (
        <div className="space-y-4  ">
            {/* Date Picker */}
            <div className="flex justify-end">
                <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            {/* Metrics Summary Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 *:h-40">
                <MetricCard label="Total Orders" value={metrics.orders} change={trend.orders} />
                <MetricCard label="Total Users" value={metrics.users} change={trend.users} />
                <MetricCard label="Total Revenue" value={metrics.revenue} change={trend.revenue} />
                <MetricCard label="Total Profit" value={metrics.profit} change={trend.profit} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
                    <SalesChart data={salesData} />
                </div>

                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Orders Over Time</h3>
                    <OrdersChart data={ordersData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
