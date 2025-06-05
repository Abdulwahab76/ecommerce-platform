// components/DateRangeSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { Calendar } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Props = {
    dateRange: { startDate: Date; endDate: Date };
    setDateRange: (range: { startDate: Date; endDate: Date }) => void;
};

const DateRangeSelector: React.FC<Props> = ({ dateRange, setDateRange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setShowPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (ranges: any) => {
        setDateRange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        });
    };

    return (
        <div className="relative inline-block text-left" ref={pickerRef}>
            {/* Toggle button with Calendar icon */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 transition"
                onClick={() => setShowPicker(!showPicker)}
            >
                <Calendar className="w-5 h-5" />
                <span>
                    {dateRange.startDate.toLocaleDateString()} -{" "}
                    {dateRange.endDate.toLocaleDateString()}
                </span>
            </button>

            {/* Floating Date Range Picker */}
            {showPicker && (
                <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded shadow-lg">
                    <DateRange
                        ranges={[{ ...dateRange, key: "selection" }]}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}

                        months={1}
                        direction="vertical"
                    />
                </div>
            )}
        </div>
    );
};

export default DateRangeSelector;
