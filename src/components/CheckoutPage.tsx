import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChevronLeftIcon } from "lucide-react";

const CheckoutPage: React.FC = () => {
    const cart = useCartStore((s) => s.cart);
    const clearCart = useCartStore((s) => s.clearCart);
    const total = useCartStore((s) => s.total)();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address1: "",
        city: "",
        state: "",
        country: "",
        zip: "",
    });

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
            } else {
                setUser(currentUser);
                setForm((f) => ({
                    ...f,
                    name: currentUser.displayName || "",
                    email: currentUser.email || "",
                }));
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.address1 || !form.city || !form.state || !form.zip || !form.country) {
            alert("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            await setDoc(doc(db, "orders", user.uid + "_" + Date.now()), {
                ...form,
                items: cart.map(({ id, name, quantity, discountedPrice, image, costPrice }) => ({ id, name, quantity, discountedPrice, image, costPrice })),
                total,
                userId: user.uid,
                createdAt: Timestamp.now(),
            });
            clearCart();
            navigate("/success");
        } catch (err) {
            console.error("Order Error:", err);
            alert("Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-3 md:px-20">
            <div
                className="w-10 h-10 bg-gray-100 border-gray-100 border flex justify-center items-center rounded-full text-gray-400 my-4 hover:bg-white transition-colors cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <ChevronLeftIcon />
            </div>
            <div className="max-w-6xl mx-auto px-4 py-10 w-full">

                <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="space-y-6">
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                            disabled
                        />
                        <input
                            name="address1"
                            placeholder="Address Line 1"
                            value={form.address1}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />

                        <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <input
                            name="state"
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <input
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <input
                            name="zip"
                            placeholder="ZIP Code"
                            value={form.zip}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>

                    {/* Cart Summary */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Your Items:</h3>
                        <ul className="space-y-2">
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between border-b py-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${item.discountedPrice * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CheckoutPage;
