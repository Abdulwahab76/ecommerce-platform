import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import React from "react";

interface Props {
    label: string;
    value: number;
    change: number;
}

const MetricCard: React.FC<Props> = ({ label, value, change }) => {
    const isUp = change >= 0;

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold">{label}</h3>
            <p className="text-3xl font-bold">
                {label.toLowerCase().includes("user") || label.toLowerCase().includes("order")
                    ? value.toLocaleString()
                    : `PKR ${value.toLocaleString()}`}
            </p>
            <div className={`flex items-center gap-1 text-sm ${isUp ? "text-green-600" : "text-red-600"}`}>
                {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {Math.abs(change).toFixed(1)}%
            </div>
        </div>
    );
};

export default MetricCard;
