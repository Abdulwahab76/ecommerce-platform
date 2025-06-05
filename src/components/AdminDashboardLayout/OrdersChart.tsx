import { Line } from "react-chartjs-2";

const OrdersChart = ({ data }: { data: any[] }) => {
    return (
        <Line
            data={{
                labels: data.map((d) => d.date),
                datasets: [
                    {
                        label: "Orders",
                        data: data.map((d) => d.orders),
                        borderColor: "#3b82f6",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                    },
                ],
            }}
            options={{
                responsive: true,
                plugins: { legend: { display: false } },
            }}
        />
    );
};

export default OrdersChart;
