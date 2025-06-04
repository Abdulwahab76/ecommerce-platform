import React, { useEffect, useState } from "react";
import { fetchProducts, type ProductT } from "../../services/contentful";
import { db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../services/authService";

const Products: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<ProductT[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error("Error loading products", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const saveToFirestore = async (product: ProductT) => {
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

    const updateStock = async (id: string, newStock: number) => {
        try {
            await setDoc(doc(db, "products", id), { inStock: newStock }, { merge: true });
            setProducts(prev => prev.map(p => (p.id === id ? { ...p, inStock: newStock } : p)));
        } catch (err) {
            console.error("Stock update error:", err);
        }
    };

    const updateDiscount = async (id: string, newDiscount: number) => {
        try {
            await setDoc(doc(db, "products", id), { discountPercent: newDiscount }, { merge: true });
            setProducts(prev => prev.map(p => (p.id === id ? { ...p, discountPercent: newDiscount } : p)));
        } catch (err) {
            console.error("Discount update error:", err);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (!isAdmin(user?.email)) {
        return <div className="text-red-500 p-4">You are not authorized to manage products.</div>;
    }

    return (
        <div className="p-4 bg-white rounded shadow overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Products</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    className="border px-3 py-1 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="mb-4 text-sm text-gray-600">
                Total: {products.length} | In Stock:{" "}
                {products.filter(p => p.inStock > 0).length} | Out of Stock:{" "}
                {products.filter(p => p.inStock === 0).length}
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
                        {filteredProducts.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 border">
                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td className="p-2 border">{p.name}</td>
                                <td className="p-2 border">PKR {p.price}</td>
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        value={p.inStock}
                                        onChange={(e) => updateStock(p.id, Number(e.target.value))}
                                        className="w-20 border p-1 rounded"
                                    />
                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        value={p.discountPercent || 0}
                                        onChange={(e) => updateDiscount(p.id, Number(e.target.value))}
                                        className="w-16 border p-1 rounded"
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
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Products;
