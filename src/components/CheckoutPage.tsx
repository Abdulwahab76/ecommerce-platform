// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChevronLeftIcon } from "lucide-react";
import { updateProductStock } from "../hooks/contentfulManagement";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    CountrySelect,
    StateSelect,
    CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import type { City, Country, State } from "react-country-state-city/dist/esm/types";

// 🟢 Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("YOUR_PUBLISHABLE_KEY");

// ✅ Validation Schema
const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^\+92[0-9]{10}$/, "Use format +92XXXXXXXXXX"),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    address1: yup.string().required("Address is required"),
    zip: yup.string().required("ZIP is required"),
});

type FormData = yup.InferType<typeof schema>;

// 🟢 CheckoutForm Component (Stripe Payment Part)
const StripePayment: React.FC<{
    total: number;
    onSuccess: () => Promise<void>;
}> = ({ total, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const res = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Math.round(total * 100) }),
            });

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement)! },
            });

            if (result.error) {
                alert(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                alert("Payment successful ✅");
                await onSuccess();
            }
        } catch (err) {
            alert("Payment failed!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment}>
            <CardElement className="p-3 border rounded-lg mb-4" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay PKR ${total.toFixed(2)}`}
            </button>
        </form>
    );
};

// 🟢 Main Checkout Page
const CheckoutPage: React.FC = () => {
    const cart = useCartStore((s) => s.cart);
    const clearCart = useCartStore((s) => s.clearCart);
    const total = useCartStore((s) => s.total)();
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [country, setCountry] = useState<any>(null);
    const [state, setState] = useState<any>(null);
    const [city, setCity] = useState<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    // 🟢 Auth Check
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
            } else {
                setUser(currentUser);
                setValue("name", currentUser.displayName || "");
                setValue("email", currentUser.email || "");
            }
        });
        return () => unsubscribe();
    }, [navigate, setValue]);

    // 🟢 Stock Check
    const validateStock = () => {
        for (const item of cart) {
            if (item.inStock === 0) {
                alert(`"${item.name}" is out of stock.`);
                return false;
            }
            if (item.quantity > item.inStock) {
                alert(`"${item.name}" quantity exceeds stock.`);
                return false;
            }
        }
        return true;
    };

    // 🟢 Save Order to Firebase
    const saveOrder = async (data: FormData) => {
        if (!validateStock()) return;

        try {
            const inventoryUpdates = cart.map((item) =>
                updateProductStock(item.id, item.inStock - item.quantity)
            );
            await Promise.all(inventoryUpdates);

            await setDoc(doc(db, "orders", user.uid + "_" + Date.now()), {
                ...data,
                items: cart.map(
                    ({ id, name, quantity, discountedPrice, image, costPrice }) => ({
                        id,
                        name,
                        quantity,
                        discountedPrice,
                        image,
                        costPrice,
                    })
                ),
                total,
                userId: user.uid,
                paymentMethod,
                createdAt: Timestamp.now(),
            });

            clearCart();
            navigate("/success");
        } catch (err) {
            alert("Order failed: " + (err as Error).message);
        }
    };

    // 🟢 Main Submit Handler
    const onSubmit = async (data: FormData) => {
        if (paymentMethod === "cod") {
            await saveOrder(data);
        }
        // If card selected, StripePayment will handle it
    };

    return (
        <div className="px-3 md:px-20">
            <div
                className="w-10 h-10 bg-gray-100 border flex justify-center items-center rounded-full text-gray-400 my-4 hover:bg-white cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <ChevronLeftIcon />
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10 w-full">
                <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left - Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <input {...register("name")} placeholder="Full Name" className="w-full p-3 border rounded-lg" />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

                        <input {...register("email")} disabled placeholder="Email" className="w-full p-3 border rounded-lg bg-gray-100" />

                        <input {...register("phone")} placeholder="Phone Number" className="w-full p-3 border rounded-lg" />
                        {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

                        {/* Country/State/City */}
                        <CountrySelect
                            onChange={(c) => {
                                setCountry(c);
                                setValue("country", (c as Country)?.name || "");
                            }}
                            placeHolder="Select Country"
                        />
                        <StateSelect
                            countryid={country?.id}
                            onChange={(s) => {
                                setState(s);
                                setValue("state", (s as State)?.name || "");
                            }}
                            placeHolder="Select State"
                        />
                        <CitySelect
                            countryid={country?.id}
                            stateid={state?.id}
                            onChange={(c) => {
                                setCity(c);
                                setValue("city", (c as City)?.name || "");
                            }}
                            placeHolder="Select City"
                        />

                        <input {...register("address1")} placeholder="Address" className="w-full p-3 border rounded-lg" />
                        <input {...register("zip")} placeholder="ZIP Code" className="w-full p-3 border rounded-lg" />

                        {/* 🔹 Payment Method */}
                        <div>
                            <p className="font-semibold mb-2">Payment Method</p>
                            <label className="flex items-center gap-2">
                                <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Cash on Delivery
                            </label>
                            <label className="flex items-center gap-2 mt-2">
                                <input type="radio" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Pay with Card
                            </label>
                        </div>

                        {/* 🔹 If COD show button, if Card show Stripe */}
                        {paymentMethod === "cod" ? (
                            <button
                                type="submit"
                                disabled={loading || !isValid}
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {loading ? "Placing Order..." : "Place Order (COD)"}
                            </button>
                        ) : (
                            <Elements stripe={stripePromise}>
                                <StripePayment total={total} onSuccess={() => saveOrder({
                                    name: "",
                                    email: "",
                                    phone: "",
                                    country: "",
                                    state: "",
                                    city: "",
                                    address1: "",
                                    zip: "",
                                })} />
                            </Elements>
                        )}
                    </form>

                    {/* Right - Cart Summary */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Your Items:</h3>
                        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between border-b py-2">
                                    <span>{item.name}</span>
                                    <span>Qty: {item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span>PKR {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
