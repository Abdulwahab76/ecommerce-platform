import React, { useEffect, useState } from "react";
import { fetchProducts, type ProductT } from "../../services/contentful";
import { db } from "../../services/firebase";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../services/authService";

const LOW_STOCK_THRESHOLD = 5;

const Products: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<ProductT[]>([]);
    const [orders, setOrders] = useState<any[]>([]); // Store order data here
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error("Error loading products", err);
            } finally {
                setLoading(false);
            }
        };

        const loadOrders = async () => {
            try {
                const snapshot = await getDocs(collection(db, "orders"));
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<string, "id">),
                }));
                setOrders(list);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        loadProducts();
        loadOrders();
    }, []);

    // Helper function to calculate stock based on orders
    const getUpdatedStock = (productId: string, initialStock: number) => {
        let totalQuantitySold = 0;

        orders.forEach(order => {
            order.items.forEach((item: any) => {
                if (item.id === productId) {
                    totalQuantitySold += item.quantity;
                }
            });
        });

        return initialStock - totalQuantitySold;
    };

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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Check if the user is an admin
    if (!isAdmin(user?.email)) {
        return <div className="text-red-500 p-4">You are not authorized to manage products.</div>;
    }

    const updateDiscount = async (id: string, newDiscount: number) => {
        try {
            await setDoc(doc(db, "products", id), { discountPercent: newDiscount }, { merge: true });
            setProducts(prev => prev.map(p => (p.id === id ? { ...p, discountPercent: newDiscount } : p)));
        } catch (err) {
            console.error("Discount update error:", err);
        }
    };

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
                        {filteredProducts.map(p => {
                            const updatedStock = getUpdatedStock(p.id, p.inStock);
                            return (
                                <tr key={p.id} className="border-t hover:bg-gray-50 *:text-center">
                                    <td className="p-2 border">
                                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded mx-auto" />
                                    </td>
                                    <td className="p-2 border">{p.name}</td>
                                    <td className="p-2 border">PKR {p.price}</td>
                                    <td className="p-2 border">
                                        <div className="text-center">
                                            {/* Display updated stock as a readonly field */}
                                            <span>{updatedStock}</span>

                                            {updatedStock <= LOW_STOCK_THRESHOLD && updatedStock > 0 && (
                                                <div className="text-yellow-500 text-xs mt-1">Low in Stock!</div>
                                            )}
                                            {updatedStock === 0 && (
                                                <div className="text-red-500 text-xs mt-1">Out of Stock!</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-2 border">
                                        <input
                                            type="number"
                                            value={p.discountPercent || 0}
                                            onChange={(e) => updateDiscount(p.id, Number(e.target.value))}
                                            className="w-16 border p-1 rounded"
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
    );
};

export default Products;
