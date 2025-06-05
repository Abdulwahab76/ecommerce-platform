import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductsBySearch, type ProductT } from "../services/contentful";
// import { ProductT, fet } from

const ProductSearchDropdown = ({ toggleSearch }: any) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductT[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced live search
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const products = await fetchProductsBySearch(query);
                setResults(products);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce delay

        return () => clearTimeout(delay);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (toggleSearch) {
            inputRef.current?.focus();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toggleSearch]);

    const handleSelect = (slug: string) => {
        setQuery("");
        setShowDropdown(false);
        navigate(`/product/${slug}`);
    };

    return (
        <div className={`${toggleSearch ? 'flex w-10/12' : 'hidden'} 
        w-6/12 ${!toggleSearch ? 'lg:flex' : ''} 
        ${toggleSearch ? 'absolute top-26 max-w-full px-4' : ''}`} ref={dropdownRef}>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                }}
                ref={inputRef}
                placeholder="Search products..."
                className="w-full px-4 py-3  bg-gray-100 outline-none focus:border-none rounded-full shadow-sm focus:outline-none  "
            />

            {showDropdown && query && (
                <div className={`absolute z-50 w-full bg-white max-w-xs md:max-w-md ${toggleSearch ? 'mt-14' : 'mt-2'} rounded-lg shadow-lg max-h-64 overflow-y-auto border border-gray-200`}>
                    {loading && <div className="p-3 text-gray-500 text-sm">Searching...</div>}

                    {!loading && results.length === 0 && (
                        <div className="p-3 text-gray-500 text-sm">No results found</div>
                    )}

                    {!loading &&
                        results.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 max-w-md px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelect(product.slug)}
                            >
                                <img
                                    src={product.image?.startsWith("http") ? product.image : `https:${product.image}`}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div className="text-sm">
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-gray-500">${product.price.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ProductSearchDropdown;
