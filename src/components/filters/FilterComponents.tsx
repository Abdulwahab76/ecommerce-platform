import React from "react";

type TextFilterProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export const TextFilter: React.FC<TextFilterProps> = ({ label, value, onChange }) => (
    <div>
        <label className="block mb-2 font-semibold">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Search products..."
        />
    </div>
);

type SelectFilterProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
};

export const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block mb-2 font-semibold">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="border p-2 rounded w-full">
            <option value="">All</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
);

type CheckboxFilterProps = {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
};

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ label, options, selected, onChange }) => {
    const toggle = (val: string) => {
        const updated = selected.includes(val)
            ? selected.filter((v) => v !== val)
            : [...selected, val];
        onChange(updated);
    };

    return (
        <div>
            <label className="block mb-2 font-semibold">{label}</label>
            {options.map((opt) => (
                <label key={opt} className="block text-sm">
                    <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={() => toggle(opt)}
                        className="mr-2"
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
};

type PriceRangeFilterProps = {
    value: [number, number];
    onChange: (min: number, max: number) => void;
};

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ value, onChange }) => (
    <div>
        <label className="block mb-2 font-semibold">Price Range</label>
        <div className="flex gap-2">
            <input
                type="number"
                value={value[0]}
                onChange={(e) => onChange(+e.target.value, value[1])}
                className="w-1/2 border p-1 rounded"
                placeholder="Min"
            />
            <input
                type="number"
                value={value[1]}
                onChange={(e) => onChange(value[0], +e.target.value)}
                className="w-1/2 border p-1 rounded"
                placeholder="Max"
            />
        </div>
    </div>
);