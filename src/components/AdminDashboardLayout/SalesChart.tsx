import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type SalesChartProps = {
    data: any[];
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    // Prepare data for the chart
    const chartData = {
        labels: data.map((item) => item.date), // Labels as month names
        datasets: [
            {
                label: 'Sales (PKR)',
                data: data.map((item) => item.sales),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Profit (PKR)',
                data: data.map((item) => item.profit),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return <Line data={chartData} options={{ responsive: true }} />;
};

export default SalesChart;
