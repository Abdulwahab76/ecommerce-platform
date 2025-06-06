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

const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^\+92[0-9]{10}$/, "Phone number must be in format +92XXXXXXXXXX"),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    address1: yup.string().required("Address is required"),
    zip: yup.string().required("ZIP Code is required"),
});

type FormData = yup.InferType<typeof schema>;

const CheckoutPage: React.FC = () => {
    const cart = useCartStore((s) => s.cart);
    const clearCart = useCartStore((s) => s.clearCart);
    const increaseQty = useCartStore((s) => s.increaseQty);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const total = useCartStore((s) => s.total)();
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // States for selects
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

    const onSubmit = async (data: FormData) => {
        if (!validateStock()) return;

        setLoading(true);
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
                createdAt: Timestamp.now(),
            });

            clearCart();
            navigate("/success");
        } catch (err) {
            console.error("Order Error:", err);
            alert("Failed to place order. " + (err as Error).message);
        } finally {
            setLoading(false);
        }
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
                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <input
                            {...register("name")}
                            placeholder="Full Name"
                            className={`w-full p-3 border rounded-lg ${errors.name ? "border-red-500" : ""
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm">{errors.name.message}</p>
                        )}

                        <input
                            {...register("email")}
                            disabled
                            placeholder="Email"
                            className="w-full p-3 border rounded-lg bg-gray-100"
                        />


                        <input
                            {...register("phone")}
                            placeholder="phone number"
                            className={`w-full p-3 border rounded-lg ${errors.phone ? "border-red-500" : ""
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm">{errors.phone.message}</p>
                        )}

                        <div>

                            <CountrySelect
                                onChange={(c) => {
                                    setCountry(c);
                                    setValue("country", (c as Country)?.name || "");
                                    setState(null);
                                    setCity(null);
                                    setValue("state", "");
                                    setValue("city", "");

                                }}
                                placeHolder="Select Country"
                                defaultValue={country}
                                containerClassName="mb-2"
                                inputClassName={`w-full p-3 border rounded-lg ${errors.country ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.country && (
                                <p className="text-red-600 text-sm">{errors.country.message}</p>
                            )}
                        </div>

                        <div>

                            <StateSelect
                                countryid={country?.id}
                                onChange={(s) => {
                                    setState(s);
                                    setValue("state", (s as State)?.name || "");
                                    setCity(null);
                                    setValue("city", "");
                                }}
                                placeHolder="Select State"
                                defaultValue={state}
                                containerClassName="mb-2"
                                inputClassName={`w-full p-3 border rounded-lg ${errors.state ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.state && (
                                <p className="text-red-600 text-sm">{errors.state.message}</p>
                            )}
                        </div>

                        <div>

                            <CitySelect
                                countryid={country?.id}
                                stateid={state?.id}
                                onChange={(c) => {
                                    setCity(c);
                                    setValue("city", (c as City)?.name || "");
                                }}
                                placeHolder="Select City"
                                defaultValue={city}
                                containerClassName="mb-2"
                                inputClassName={`w-full p-3 border rounded-lg ${errors.city ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.city && (
                                <p className="text-red-600 text-sm">{errors.city.message}</p>
                            )}
                        </div>

                        <input
                            {...register("address1")}
                            placeholder="Address"
                            className={`w-full p-3 border rounded-lg ${errors.address1 ? "border-red-500" : ""
                                }`}
                        />
                        {errors.address1 && (
                            <p className="text-red-600 text-sm">{errors.address1.message}</p>
                        )}

                        <input
                            {...register("zip")}
                            placeholder="ZIP Code"
                            className={`w-full p-3 border rounded-lg ${errors.zip ? "border-red-500" : ""
                                }`}
                        />
                        {errors.zip && (
                            <p className="text-red-600 text-sm">{errors.zip.message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </form>

                    {/* Cart Summary */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Your Items:</h3>
                        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                            {cart.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between border-b py-2"
                                >
                                    <div>
                                        <p>{item.name}</p>
                                        <p className="text-sm text-gray-500">In stock: {item.inStock}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => decreaseQty(item.id)}
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                item.quantity < item.inStock && increaseQty(item.id)
                                            }
                                            className="px-2 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-2 text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
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
