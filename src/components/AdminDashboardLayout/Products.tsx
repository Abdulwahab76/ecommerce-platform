import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../services/authService";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import DateRangeSelector from "../DateRangeSelector";
import { useProducts } from "../../hooks/useProductsAndOrders";

const LOW_STOCK_THRESHOLD = 5;

const Products: React.FC = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });


    const { products, loading, getUpdatedStock, setProducts } = useProducts(dateRange);

    if (!isAdmin(user?.email)) {
        return <div className="text-red-500 p-4">You are not authorized to manage products.</div>;
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const saveToFirestore = async (product: any) => {
        try {
            await setDoc(doc(db, "products", product.id), {
                ...product,
                syncedFromContentfulAt: new Date().toISOString(),
                syncedBy: user?.email || "unknown",
            });
            alert("Product saved to Firestore.");
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product.");
        }
    };

    const updateDiscount = async (id: string, newDiscount: number) => {
        try {
            await setDoc(doc(db, "products", id), { discountPercent: newDiscount }, { merge: true });
            setProducts(prev =>
                prev.map(p => (p.id === id ? { ...p, discountPercent: newDiscount } : p))
            );
        } catch (err) {
            console.error("Discount update error:", err);
        }
    };
    console.log(products, 'prod');

    return (
        <div>
            <div className="flex justify-end items-end mb-3">
                <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

            </div>

            <div className="p-4 bg-white rounded shadow overflow-x-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold">Manage Products</h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="border px-3 py-1 rounded-md flex-grow"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    Total: {products.length} | In Stock:{" "}
                    {products.filter(p => getUpdatedStock(p.id, p.inStock) > 0).length} | Out of Stock:{" "}
                    {products.filter(p => getUpdatedStock(p.id, p.inStock) <= 0).length}
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Image</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Stock</th>
                                <th className="p-2 border">Discount %</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => {
                                const updatedStock = getUpdatedStock(p.id, p.inStock);
                                console.log(`Product ${p.name} stock: initial=${p.inStock}, updated=${updatedStock}`);

                                return (
                                    <tr key={p.id} className="border-t hover:bg-gray-50 text-center">
                                        <td className="p-2 border">
                                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded mx-auto" />
                                        </td>
                                        <td className="p-2 border">{p.name}</td>
                                        <td className="p-2 border">PKR {p.price.toLocaleString()}</td>
                                        <td className="p-2 border">
                                            <div>
                                                <span>{updatedStock}</span>
                                                {updatedStock <= LOW_STOCK_THRESHOLD && updatedStock > 0 && (
                                                    <div className="text-yellow-500 text-xs mt-1">Low in Stock!</div>
                                                )}
                                                {updatedStock <= 0 && (
                                                    <div className="text-red-500 text-xs mt-1">Out of Stock!</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                type="number"
                                                value={p.discountPercent || 0}
                                                onChange={e => updateDiscount(p.id, Number(e.target.value))}
                                                className="w-16 border p-1 rounded"
                                                min={0}
                                                max={100}
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-2 border space-x-2">
                                            <a
                                                href={`https://app.contentful.com/spaces/${import.meta.env.VITE_CONTENTFULL_SPACEID}/entries/${p.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </a>
                                            <button
                                                onClick={() => saveToFirestore(p)}
                                                className="text-green-600 hover:underline"
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

    );
};

export default Products;
